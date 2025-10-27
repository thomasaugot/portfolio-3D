import { gsap } from "@/lib/animations";

export function initContactHeroTitleAnimation() {
  const badge = document.querySelector('[data-hero-badge]');
  const lines = document.querySelectorAll('[data-hero-line]');
  const subtitle = document.querySelector('[data-hero-subtitle]');
  const contactInfo = document.querySelector('[data-hero-contact-info]');
  const formWrapper = document.querySelector('[data-contact-form-wrapper]');

  if (!badge || lines.length < 2 || !subtitle) return null;

  const dot = badge.querySelector('.animate-pulse') as HTMLElement;

  gsap.set([badge, subtitle], { opacity: 0 });
  if (contactInfo) gsap.set(contactInfo, { opacity: 0, y: 20 });
  if (formWrapper) gsap.set(formWrapper, { opacity: 0, x: 50 });
  if (dot) {
    gsap.set(dot, { opacity: 0, y: -50, scale: 0, borderRadius: '0%' });
  }

  const tl = gsap.timeline({ delay: 0.8 });

  // Fade in badge
  tl.to(badge, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  });

  const line1 = lines[0] as HTMLElement;
  const line2 = lines[1] as HTMLElement;

  // Split line2 (the gradient text) for tetris-style animation
  const text = line2.textContent?.trim() || '';
  const chars = text.split('');
  const midPoint = Math.ceil(chars.length / 2);
  const firstHalf = chars.slice(0, midPoint).join('');
  const secondHalf = chars.slice(midPoint).join('');

  line2.style.position = 'relative';
  line2.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'flex-start';
  wrapper.style.gap = '0';

  const leftPiece = document.createElement('span');
  leftPiece.textContent = firstHalf;
  leftPiece.className = 'tetris-left gradient-primary bg-clip-text text-transparent font-fun font-light tracking-tighter';
  leftPiece.style.display = 'inline-block';
  leftPiece.style.whiteSpace = 'nowrap';
  leftPiece.style.transformOrigin = 'center center';
  wrapper.appendChild(leftPiece);

  const rightPiece = document.createElement('span');
  rightPiece.textContent = secondHalf;
  rightPiece.className = 'tetris-right gradient-primary bg-clip-text text-transparent font-fun font-light tracking-tighter';
  rightPiece.style.display = 'inline-block';
  rightPiece.style.whiteSpace = 'nowrap';
  rightPiece.style.transformOrigin = 'center center';
  wrapper.appendChild(rightPiece);

  line2.appendChild(wrapper);

  // Set initial states
  gsap.set(line1, { opacity: 0, y: -150 });
  gsap.set(line2, { opacity: 1 });
  gsap.set(leftPiece, { opacity: 0, x: -300, rotationZ: 90 });
  gsap.set(rightPiece, { opacity: 0, x: 300 });

  // Animate left piece sliding in
  tl.to(leftPiece, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: "power2.out",
  }, 0.2);

  // Rotate left piece into place
  tl.to(leftPiece, {
    rotationZ: 0,
    duration: 0.5,
    ease: "back.out(2)",
  }, 0.7);

  // Animate first line sliding down
  tl.to(line1, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
  }, 0.9);

  // Animate right piece sliding in
  tl.to(rightPiece, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: "power2.out",
  }, 0.6);

  // Animate subtitle
  tl.to(subtitle, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  }, 1.5);

  // Animate contact info
  if (contactInfo) {
    tl.to(contactInfo, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
    }, 1.7);
  }

  // Animate form wrapper
  if (formWrapper) {
    tl.to(formWrapper, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power2.out",
    }, 1.9);
  }

  // Animate dot with bounce
  if (dot) {
    tl.to(dot, {
      opacity: 1,
      y: 0,
      scale: 1,
      borderRadius: '50%',
      duration: 0.6,
      ease: "back.out(1.7)",
    }, 2.1);
  }

  return tl;
}
