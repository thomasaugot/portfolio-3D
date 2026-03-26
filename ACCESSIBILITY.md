# Accessibility Documentation

This document explains how accessibility was implemented in this portfolio, why each decision matters, and how to maintain the same standard as the app evolves.

It is intentionally detailed.

The goal is not only to say "this app is accessible", but to document:

- what was changed
- where it lives in the codebase
- what user problem it solves
- what WCAG-related principle it supports
- how to extend it without breaking the experience

## Table of Contents

1. [Accessibility Philosophy](#accessibility-philosophy)
2. [Standards and Target](#standards-and-target)
3. [Main Accessibility Problems This App Originally Had](#main-accessibility-problems-this-app-originally-had)
4. [Single Main Landmark and Skip Link](#single-main-landmark-and-skip-link)
5. [Stage Focus Management](#stage-focus-management)
6. [Semantic Sections and Headings](#semantic-sections-and-headings)
7. [Decorative Content Hidden from Assistive Tech](#decorative-content-hidden-from-assistive-tech)
8. [Accessible Forms](#accessible-forms)
9. [Keyboard-Only Focus Styling](#keyboard-only-focus-styling)
10. [Navigation, Current State, and Menu Semantics](#navigation-current-state-and-menu-semantics)
11. [Icon-Only Controls and Toggle States](#icon-only-controls-and-toggle-states)
12. [Mobile Navigation Controls](#mobile-navigation-controls)
13. [Portfolio Keyboard and Focus Behavior](#portfolio-keyboard-and-focus-behavior)
14. [Reduced Motion System](#reduced-motion-system)
15. [Theme and Visual Accessibility](#theme-and-visual-accessibility)
16. [Touch Target Sizes and Mobile Accessibility](#touch-target-sizes-and-mobile-accessibility)
17. [Localized and Accessible URLs](#localized-and-accessible-urls)
18. [Reusable Accessibility Components and Hooks](#reusable-accessibility-components-and-hooks)
19. [How to Build New UI Without Breaking Accessibility](#how-to-build-new-ui-without-breaking-accessibility)
20. [Testing Checklist](#testing-checklist)
21. [Known Limitations / Things to Watch](#known-limitations--things-to-watch)

---

## Accessibility Philosophy

This app is visually expressive, animated, and highly custom.

That means accessibility cannot rely on default browser behavior alone.

For a normal static website, the browser gives you a lot for free.
For this app:

- sections change without full page reloads
- content morphs between states
- 3D scenes and overlays exist outside normal document flow
- keyboard focus can easily become disconnected from what the user sees
- decorative DOM can pollute the accessibility tree

So accessibility here has to be explicit and intentional.

The core philosophy used in this app is:

1. Meaning first
   - landmarks, headings, labels, states
2. Navigation second
   - keyboard flow, skip links, focus targets, menu behavior
3. Comfort third
   - reduced motion, contrast, readability
4. Design intact
   - accessibility should improve usability without flattening the brand

---

## Standards and Target

The practical target for this codebase is:

- WCAG 2.1 AA / WCAG 2.2 AA principles where relevant
- semantic HTML wherever possible
- ARIA only where native semantics are not enough

Important rule:

ARIA is not a replacement for semantic HTML.

Bad pattern:

```tsx
<div role="button">Click me</div>
```

Better pattern:

```tsx
<button type="button">Click me</button>
```

We only add ARIA when:

- the UI is custom and needs extra semantics
- state must be exposed programmatically
- native HTML alone is not sufficient

---

## Main Accessibility Problems This App Originally Had

The app originally had several common issues for custom animated interfaces:

1. Duplicate or unclear landmarks
   - more than one `main`

2. Focus drift
   - visual stage changed, but keyboard focus did not move with it

3. Weak structure
   - custom terminal UI looked good visually but did not clearly describe sections to assistive technologies

4. Decorative content exposed as meaningful content
   - 3D scenes, glows, rings, and visuals were discoverable by assistive tech even when they were not content

5. Form semantics too thin
   - placeholders instead of proper labels
   - missing ids, names, validation semantics, live feedback

6. Focus indicators not controlled correctly
   - visible too often
   - design conflicts
   - browser default rings leaking through

7. Motion-heavy experience without a real reduced-motion system

8. Light-mode contrast and hierarchy issues
   - pale surfaces
   - weak visual separation

9. Overlay and mobile menu interaction bugs
   - stacking / pointer-events / focus behavior

10. Portfolio slide behavior not fully keyboard-safe

This documentation explains how those were addressed.

---

## Single Main Landmark and Skip Link

### Why it matters

Screen reader users often navigate by landmarks.

If the page has multiple `main` regions, navigation becomes ambiguous.

If the page has repeated global UI at the top, keyboard users need a fast way to jump directly to primary content.

### What was implemented

There is now a single page-level `main`.

A skip link was added at the top of the app and extracted into a dedicated component:

- `components/ui/SkipLink.tsx`
- used by `app/[locale]/layout.tsx`

### What the skip link does

When a keyboard user presses `Tab` on first page load:

1. the skip link appears
2. pressing `Enter` jumps focus into the current stage content
3. the user bypasses repeated nav/chrome

### Important implementation detail

The skip link no longer writes `#stage-content` into the URL.

Instead, it:

- prevents default anchor navigation
- focuses the target programmatically

That avoids ugly hash URLs while keeping the same accessibility behavior.

### Example

Conceptually:

```tsx
<SkipLink targetId="stage-content" label="./skip_to_content" />
```

### Related files

- `components/ui/SkipLink.tsx`
- `app/[locale]/layout.tsx`

---

## Stage Focus Management

### The problem

This app behaves like a single-page interface.

When the visible stage changes from:

- hero
- about
- projects
- contact

the browser does not automatically know where focus should go.

Without intervention:

- the screen changes
- focus stays on the old control
- keyboard and screen reader users become disconnected from the new view

### What was implemented

A dedicated focus-management hook was created:

- `hooks/useStageFocus.ts`

This hook ensures that when a stage becomes active, focus moves to the correct stage container.

### Example behavior

Without this:

1. user activates "projects"
2. projects becomes visible
3. focus may remain on hero button or previous nav control

With this:

1. user activates "projects"
2. transition completes
3. focus lands on the projects terminal shell
4. next `Tab` goes into the interactive controls inside that stage

### Why this matters

This is one of the most important accessibility requirements in SPA-like interfaces:

when meaningful content changes, focus should follow the new context.

### Related files

- `hooks/useStageFocus.ts`
- `components/ui/Terminal.tsx`
- `components/sections/ProjectsSection.tsx`

---

## Semantic Sections and Headings

### The problem

A lot of the app is custom terminal UI.

Visually it communicates sections well, but screen readers need explicit structure:

- heading hierarchy
- section labels
- region naming

### What was implemented

The terminal surface now acts as the semantic source of truth for each active stage.

In `components/ui/Terminal.tsx`:

- each active stage has a heading id
- the content is wrapped in a semantic section
- `aria-labelledby` ties the section to its heading

### Example pattern

Conceptually:

```tsx
const stageContentHeadingId = `stage-content-heading-${stage}`;

<section aria-labelledby={stageContentHeadingId}>
  {stage !== "hero" && (
    <h2 id={stageContentHeadingId} className="sr-only">
      {stageContentLabel}
    </h2>
  )}
</section>
```

For hero:

- the visible `h1` acts as the section heading

For about/projects/contact:

- a hidden semantic heading is inserted when needed

This preserves the visual design while giving assistive technology a real structure.

### Why this matters

Screen reader users should be able to understand:

- "I am in the Projects section"
- "I am in the Contact section"

not just encounter an anonymous block of styled content.

### Related files

- `components/ui/Terminal.tsx`
- `components/sections/ProjectsSection.tsx`
- `components/sections/ContactSection.tsx`

---

## Decorative Content Hidden from Assistive Tech

### The problem

The app contains many non-content visuals:

- Three.js scenes
- glows
- orbit rings
- decorative dots
- ambient backgrounds
- purely visual branding layers

These are useful visually, but they should not clutter the accessibility tree.

### What was implemented

Decorative wrappers are marked with:

- `aria-hidden="true"`

Decorative images use:

- `alt=""`

### Example

Decorative wrapper:

```tsx
<div aria-hidden="true" data-hero-section>
  ...
</div>
```

Decorative image:

```tsx
<Image src="/..." alt="" />
```

### Where this was applied

- `components/sections/HeroSection.tsx`
- `components/sections/AboutSection.tsx`
- `components/sections/ContactSection.tsx`
- `components/ui/Background.tsx`
- decorative layers in `components/layout/Navbar.tsx`
- icon-only SVGs in `components/ui/SocialLinks.tsx`

### Why this matters

Assistive technologies should encounter meaningful content, not set decoration.

---

## Accessible Forms

### The problem

Styled terminal forms often fall into the same trap:

- placeholder-only fields
- visual labels that are not real labels
- no validation semantics
- no assistive feedback for success/error

### What was implemented

The contact form was upgraded in:

- `components/ui/ContactForm.tsx`
- `hooks/useContactForm.ts`

### Improvements

Each field now has:

- a real `<label>` with `htmlFor`
- `id` and `name`
- `required`
- relevant `autoComplete`
- `inputMode` where it helps mobile keyboards
- validation state
- error association

Feedback now uses:

- `aria-invalid`
- `aria-describedby`
- `role="alert"` on inline error messages
- `role="status"` and `aria-live="polite"` on the form-level submit feedback

The name field also auto-focuses on mount and on successful reset, so keyboard and screen reader users land directly in the form without needing an extra Tab press.

### Real code — email field

From `components/ui/ContactForm.tsx`:

```tsx
<label htmlFor="contact-email" className="flex items-center gap-2 mb-2">
  <span className="text-primary text-xs">❯</span>
  <span className="text-primary text-xs">{t("footer.form.email_command")}</span>
</label>
<Input
  id="contact-email"
  name="email"
  type="email"
  autoComplete="email"
  inputMode="email"
  required
  aria-invalid={fieldErrors.email ? "true" : "false"}
  aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
/>
{getFieldErrorMessage("email") && (
  <p id="contact-email-error" className="mt-2 text-xs text-red-200" role="alert">
    {getFieldErrorMessage("email")}
  </p>
)}
```

Note the `inputMode="email"` attribute on the email field.

This is separate from `type="email"`.

`type="email"` triggers browser validation.

`inputMode="email"` tells mobile operating systems which soft keyboard to show (the one with `@` and `.com` prominently placed).

That is a small but real usability improvement for mobile users filling in the form.

### Why this matters

Accessible forms must communicate:

- what the field is
- whether it is required
- whether it is invalid
- what the error is

all programmatically, not only visually.

---

## Keyboard-Only Focus Styling

### The problem

You wanted:

- visible focus when navigating by keyboard
- no visible focus ring when using mouse/touch

That is correct.

### What was implemented

A global input-modality system now tracks whether the user is interacting by:

- keyboard
- pointer

This is set on the root HTML element using:

- `data-input-modality="keyboard"`
- `data-input-modality="pointer"`

### Shared classes

Two reusable classes were introduced in `app/globals.css`:

- `.keyboard-focus-ring`
- `.keyboard-field-focus`

These only render visible focus treatment when keyboard modality is active.

### Example pattern

```tsx
<button className="keyboard-focus-ring">Action</button>
<input className="keyboard-field-focus" />
```

### Why this matters

This solves both problems:

1. keyboard users get a visible focus location
2. pointer users do not see persistent design-breaking outlines

### Related files

- `app/globals.css`
- `components/layout/ClientLoadingWrapper.tsx`

---

## Navigation, Current State, and Menu Semantics

### Desktop navigation

Desktop nav items expose current state with:

- `aria-current="page"` when active

This is present without forcing permanent heavy visual focus styles.

### Language toggle

The language switcher preserves the active stage and maps it to the localized route.

Example:

- `/fr/projets` -> switch to English -> `/en/projects`

### Mobile menu

The mobile menu required several structural fixes.

#### Final behavior

When open, it behaves as an overlay/dialog-like surface:

- `role="dialog"`
- `aria-modal="true"`
- `aria-expanded` on the toggle
- `aria-controls` pointing to the menu
- focus moves inside for keyboard users
- focus returns to toggle when closed
- body scroll is locked

#### Important bug that was fixed

At one point, the menu became non-interactive because:

- `main#main-content` was set `inert`
- the menu lived inside that same subtree

So visually the menu was open, but interaction was dead.

That logic was removed.

Another bug was that the fixed top nav intercepted taps over the close icon area.

Final fix:

- when mobile menu is open, the top nav becomes `pointer-events-none`
- the persistent animated toggle remains interactive

### Related files

- `components/layout/Navbar.tsx`
- `components/ui/LanguageToggle.tsx`

---

## Icon-Only Controls and Toggle States

### The problem

Many controls in this app use icons only — no visible text label.

Without an accessible name, a screen reader will announce these as "button" with no description.

Additionally, toggle controls (like theme and motion toggles) need to expose their current state programmatically, not just visually.

### What was implemented

All icon-only interactive elements were given:

- a descriptive `aria-label`
- `aria-hidden="true"` on the icon inside (so the icon is not read twice)
- `aria-pressed` for toggle buttons (exposed state to assistive tech)

### Theme toggle

The theme toggle is used in three visual variants (`floating`, `menu`, `tile`) but every variant applies the same accessibility attributes.

From `components/ui/ThemeToggle.tsx`:

```tsx
<button
  type="button"
  onClick={toggleTheme}
  aria-pressed={isDark}
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
  className="keyboard-focus-ring ..."
>
  <Sun aria-hidden="true" size={15} />
</button>
```

Key points:

- `aria-pressed` reflects the current toggle state — screen readers announce "pressed" or "not pressed"
- `aria-label` is dynamic — it always describes the _action_, not the _current state_, so the user knows what will happen when they activate it
- The icon is hidden from the accessibility tree with `aria-hidden="true"` — the label alone carries the meaning

### Back to top button

The back-to-top button appears outside any labeled section and contains only a chevron icon.

From `components/ui/BackToTop.tsx`:

```tsx
<button
  aria-label="Back to top"
  disabled={isMorphing}
  className="keyboard-focus-ring ..."
>
  <ChevronUp size={20} />
</button>
```

The `disabled` attribute is also important here — it prevents activation during a stage transition and is announced by screen readers as unavailable.

### Why this matters

Without `aria-label` on an icon-only button:

- a screen reader announces "button" — the user has no idea what it does
- toggle state is invisible — the user cannot tell whether dark mode is on or off

`aria-pressed` specifically communicates that this is a stateful toggle, not a one-shot action.

### Related files

- `components/ui/ThemeToggle.tsx`
- `components/ui/BackToTop.tsx`
- `components/ui/MotionToggle.tsx`

---

## Mobile Navigation Controls

### The problem

On mobile, this app exposes two arrow buttons (previous / next section) as the primary in-page navigation.

These are entirely icon-driven — no labels are visible.

The position indicator dots between them are decorative.

### What was implemented

From `components/ui/MobileNav.tsx`:

```tsx
<button
  onClick={goToPrev}
  disabled={!canGoUp || isMorphing}
  aria-label="Previous section"
  className="keyboard-focus-ring ..."
>
  <svg ...>...</svg>
</button>

<div className="flex flex-col items-center gap-1" aria-hidden="true">
  {/* decorative position indicator dots */}
</div>

<button
  onClick={goToNext}
  disabled={!canGoDown || isMorphing}
  aria-label="Next section"
  className="keyboard-focus-ring ..."
>
  <svg ...>...</svg>
</button>
```

Key points:

- `aria-label` on each button gives a clear intent description
- `disabled` prevents activation at the first and last stage, and during transitions
- The position indicator is `aria-hidden="true"` — it is purely visual chrome

### Why this matters

On mobile, if a keyboard or switch-access user encounters these navigation buttons, they need to know what they do. "button" alone is useless. "Previous section" and "Next section" are immediately clear.

### Related files

- `components/ui/MobileNav.tsx`

---

## Portfolio Keyboard and Focus Behavior

### The problem

The portfolio section is not a normal document section.

It contains:

- animated slide-like project panels
- a separate 3D scene
- staged intro / project / final CTA states

### What was implemented

Keyboard navigation and focus management were added to the portfolio flow.

Users can navigate with:

- `ArrowRight`, `ArrowDown`, `PageDown` -> next
- `ArrowLeft`, `ArrowUp`, `PageUp` -> previous

The intro shell can be started with:

- `Enter`
- `Space`

### Active panel accessibility

Only the visible active panel should be accessible.

So inactive panels are:

- `aria-hidden="true"`
- `inert`

and the active panel is removed from that hidden/inert state.

### Why this matters

If hidden panels remain focusable:

- keyboard focus can jump into invisible UI
- screen readers can encounter content that is not actually shown

### Bottom-pinned CTA rule

The project terminal CTAs now follow an explicit structural rule:

- CTA area is absolutely pinned to the bottom
- content reserves bottom padding above it

This was applied because terminal-style interfaces in this app should consistently keep the action zone at the bottom.

### Related files

- `utils/animations/portfolio-scroll-animation.ts`
- `components/sections/ProjectsSection.tsx`
- `components/sections/ProjectPanel.tsx`

---

## Touch Target Sizes and Mobile Accessibility

### The problem

WCAG 2.5.5 (AAA) and common sense both say that interactive targets should be large enough to activate reliably on touch screens.

Small tap targets cause:

- missed taps
- accidental activations of adjacent elements
- poor experience for users with motor disabilities

### What was implemented

A media query in `app/globals.css` enforces a minimum touch target height of 44px for all primary navigation controls on mobile:

```css
@media (max-width: 767px) {
  nav button,
  nav a,
  form button {
    min-height: 44px;
  }
}
```

This rule covers:

- all nav links and buttons
- form submit buttons

It intentionally excludes decorative and non-interactive elements.

### Additional mobile considerations

Also in `app/globals.css`:

- `overscroll-behavior: none` on `body` prevents iOS rubber-band scroll from interfering with swipe-based stage navigation
- Text selection is disabled during swipe gestures inside the terminal surface (`user-select: none`) to prevent accidental selection while navigating
- Selection is explicitly re-enabled inside `input` and `textarea` elements so form fields still work correctly

### Why this matters

44px is the established minimum for accessible touch targets (aligned with Apple's HIG and WCAG 2.5.5).

Relying on visual size alone is not enough — a button can look large on screen but its actual interactive area may be smaller. The CSS rule enforces the floor.

### Related files

- `app/globals.css` (lines ~1003–1029)

---

## Reduced Motion System

### The problem

This app is motion-heavy:

- typing animations
- cursor blinking
- terminal morphs
- panel transitions
- floating 3D
- glow/ring motion

Without a motion preference system, users who prefer reduced motion have a poor experience.

### What was implemented

A full motion preference system exists now:

- system preference first
- app override second
- persistent user choice

### Main files

- `contexts/MotionPreferenceProvider.tsx`
- `components/ui/MotionToggle.tsx`
- `utils/motion.ts`

### Behavior

By default:

- app follows `prefers-reduced-motion`

Users can override via a small motion toggle.

Desktop:

- floating on hero

Mobile:

- appears inside mobile menu

### Reduced mode strategy

Reduced mode is not "kill everything".

It is a calmer motion language:

- shorter or removed travel
- more fades, fewer spatial shifts
- instant or near-instant typing
- reduced 3D motion
- removed decorative rotational/pulsing effects where needed

### Why this matters

Motion accessibility is not only about vestibular sensitivity.

It also helps:

- cognitive comfort
- fatigue reduction
- clarity

---

## Theme and Visual Accessibility

### The problem

Light mode was initially too white and visually flat.

That created secondary accessibility problems:

- weak hierarchy
- poor object separation
- dark 3D devices reading as harsh black cutouts

### What was implemented

Light mode was tuned at the source:

- warmer off-white background tokens
- stronger border contrast
- richer panel/surface separation
- more deliberate use of existing green/orange brand accents

### Important principle

Accessibility improvements should not destroy art direction.

The goal was not:

- "make everything plain"

The goal was:

- keep the visual language
- improve readability and contrast
- use color with intention

### Three.js lighting improvements

The portfolio and hero scenes were adjusted through lighting, not only material repainting.

This is important because visual realism in 3D often depends more on light than raw material color.

### Related files

- `app/globals.css`
- `components/ui/Background.tsx`
- `utils/animations/hero-3d-scene.ts`
- `utils/animations/portfolio-3d-scene.ts`

---

## Localized and Accessible URLs

### What was implemented

Stage URLs now use clean localized paths.

Examples:

- English: `/en/about`, `/en/projects`
- French: `/fr/a-propos`, `/fr/projets`
- Spanish: `/es/sobre-mi`, `/es/proyectos`

### Hard refresh behavior

This app is hero-first by design.

So while internal stage navigation updates the path, a hard refresh on a stage route redirects back to the locale root.

Example:

- hard-refresh `/fr/projets`
- redirects to `/fr`

This was done because the user explicitly wanted refresh to return to hero.

### Language declaration on the HTML element

The `lang` attribute on the `<html>` element is a fundamental accessibility requirement (WCAG 3.1.1, Level A).

Screen readers use it to determine which language engine and pronunciation rules to apply.

In `app/[locale]/layout.tsx`, the locale is set on the root element:

```tsx
<html lang={locale}>
```

Since the app supports English, French, and Spanish, the `lang` value changes with each locale — `/en` renders `lang="en"`, `/fr` renders `lang="fr"`, `/es` renders `lang="es"`.

Without this, a French screen reader user navigating `/fr` would hear their content read with English pronunciation.

### Why this matters

This is not directly a WCAG requirement, but it improves:

- consistency
- comprehensibility
- localized navigation clarity

The `lang` attribute itself is WCAG Level A — the most basic and widely required standard.

### Related files

- `utils/stage-paths.ts`
- `hooks/useStageNavigation.ts`
- `app/[locale]/[...slug]/page.tsx`
- `app/[locale]/layout.tsx`

---

## Reusable Accessibility Components and Hooks

Accessibility logic was not left as random inline hacks.

A few patterns were extracted cleanly.

### Components

- `components/ui/SkipLink.tsx`
  - skip-to-content behavior and styling

- `components/ui/MotionToggle.tsx`
  - motion preference UI

### Hooks

- `hooks/useStageFocus.ts`
  - keeps focus aligned with visible stage changes

### Why this matters

Accessibility gets harder to maintain when it is scattered as:

- random one-off class strings
- copied ARIA snippets
- behavior hidden inside unrelated components

Reusable patterns keep the standard coherent.

---

## How to Build New UI Without Breaking Accessibility

This section is the most important for future work.

### 1. Prefer semantic HTML first

Use:

- `button`
- `a`
- `form`
- `label`
- `section`
- `main`
- `nav`
- `h1` to `h6`

Do not reach for `div + role` first.

### 2. Every custom surface should answer these questions

- What is it?
- Can it be focused?
- Should it be focused?
- Is it decorative?
- If state changes, who is notified?

### 3. If content changes without reload, manage focus

If a new stage/panel/screen becomes active:

- move focus to the new context

### 4. If something is decorative, hide it

Use:

- `aria-hidden="true"`
- `alt=""` for decorative images

### 5. If something is visually hidden but still meaningful, use `sr-only`

Example:

```tsx
<h2 className="sr-only">Projects</h2>
```

### 6. Form fields need real semantics

At minimum:

- label
- id
- name
- validation semantics
- error text connection

### 7. Focus styling must support keyboard users

Use:

- `.keyboard-focus-ring`
- `.keyboard-field-focus`

Do not invent one-off focus behavior per component.

### 8. Motion must be optional

If you add a new animation:

- make sure it respects the motion preference system

### 9. Bottom actions in terminal-style panels should be structural

If a terminal panel has a CTA or prompt area:

- pin the action zone to the bottom
- reserve content padding above it

Do not rely on accidental spacing behavior.

### 10. Test with the browser, not only your eyes

Ask:

- Can I tab through it?
- Does focus make sense?
- Does it still work with reduced motion?
- Does it still make sense without visuals?

---

## Testing Checklist

Use this checklist before merging significant UI changes.

### Keyboard

- Can the whole flow be completed with keyboard only?
- Does `Tab` order make sense?
- Does focus remain visible in keyboard mode?
- Does focus avoid appearing during pointer interaction?
- After stage changes, does focus land in the new section?

### Screen reader / semantics

- Is there exactly one `main`?
- Are major sections labeled with headings?
- Are region labels meaningful?
- Are decorative layers hidden?
- Do icon-only controls have accessible names (`aria-label`)?
- Do toggle controls expose state (`aria-pressed`)?
- Is the `lang` attribute on `<html>` set to the correct locale?

### Forms

- Does every field have a label?
- Are required states clear?
- Are validation errors announced and associated?
- Is submit feedback exposed to assistive tech?

### Motion

- Does reduced motion actually reduce motion?
- Are transitions still understandable in reduced mode?
- Are looping decorative animations reduced or removed?

### Contrast / visual clarity

- Is important text readable?
- Do buttons stand out clearly?
- Are muted labels still readable?
- Does light mode preserve hierarchy?

### Mobile menu

- Can it open and close reliably?
- Does the close control remain tappable?
- Does background interaction stop appropriately?

### Mobile navigation

- Do the previous/next section buttons have accessible labels?
- Are the position indicator dots hidden from assistive tech?
- Are the buttons correctly disabled at the first and last stage?
- Are touch targets at least 44px tall on mobile?

### Portfolio

- Can hidden panels receive focus? They should not.
- Does active panel focus make sense?
- Are bottom CTA zones actually pinned?

---

## Known Limitations / Things to Watch

### 1. Large animation files still contain older typing/lint debt

Files like:

- `utils/animations/hero-3d-scene.ts`
- `utils/animations/portfolio-3d-scene.ts`
- `utils/animations/portfolio-scroll-animation.ts`

still contain pre-existing `any` usage and other technical debt.

That does not automatically mean accessibility is broken, but it means these files require care.

### 2. New visual changes can accidentally undo accessibility

Typical regressions:

- removing bottom padding above fixed CTA zones
- reintroducing pointer-interception layers
- adding decorative content without `aria-hidden`
- changing layout without revisiting focus flow

### 3. Accessibility is not "done forever"

It is now much stronger and more deliberate.

But every new feature can weaken it if patterns are not followed.

That is why this file exists.

---

## Final Summary

This app now uses a custom accessibility system tailored to a highly animated, terminal-driven, Three.js-heavy interface.

The most important improvements are:

- one clear main landmark
- skip link without ugly hash navigation
- explicit focus management across stages
- semantic sections and headings
- decorative visuals removed from the accessibility tree
- accessible contact form with real labels, `inputMode`, validation semantics, and live feedback
- keyboard-only focus styling
- improved mobile menu semantics and interaction
- portfolio keyboard/focus behavior
- icon-only controls have accessible names and toggle state via `aria-label` and `aria-pressed`
- mobile navigation controls are fully labeled
- 44px minimum touch targets on mobile
- motion preference system with reduced-motion support
- stronger light-mode and contrast hierarchy
- `lang` attribute on `<html>` for correct screen reader pronunciation
- localized stage URLs

If you keep following the patterns documented here, you can continue evolving the design without repeatedly breaking accessibility.
