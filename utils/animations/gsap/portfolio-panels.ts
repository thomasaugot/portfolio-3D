import { gsap } from "@/lib/gsap";

const getPanelElements = (panel: Element) => {
  return {
    badge: panel.querySelector("[data-project-badge]"),
    title: panel.querySelector("[data-project-title]"),
    description: panel.querySelector("[data-project-description]"),
    techs: panel.querySelector("[data-project-techs]"),
    button: panel.querySelector("[data-project-button]"),
  };
};

export const animateProjectPanelIn = (panel: Element) => {
  const elements = getPanelElements(panel);
  const tl = gsap.timeline();

  tl.set(panel, { opacity: 1 });
  tl.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" }, 0);

  const reveal = (el: Element | null, at: number) => {
    if (!el) return;
    tl.fromTo(
      el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" },
      at
    );
  };

  reveal(elements.badge, 0.05);
  reveal(elements.title, 0.1);
  reveal(elements.description, 0.15);
  reveal(elements.techs, 0.2);
  reveal(elements.button, 0.25);

  return tl;
};

export const animateProjectPanelOut = (panel: Element) => {
  const elements = getPanelElements(panel);
  const tl = gsap.timeline();

  const hide = (el: Element | null, at: number) => {
    if (!el) return;
    tl.to(el, { opacity: 0, y: -20, duration: 0.2, ease: "power2.in" }, at);
  };

  hide(elements.button, 0);
  hide(elements.techs, 0.05);
  hide(elements.description, 0.1);
  hide(elements.title, 0.15);
  hide(elements.badge, 0.2);

  tl.to(panel, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.2);

  return tl;
};

export const animateProjectModelIn = (scene: any, index: number) => {
  if (!scene?.projectModels?.[index]) return;
  const model = scene.projectModels[index];
  model.wrapper.visible = true;
  gsap.fromTo(
    model.wrapper.scale,
    { x: 0.01, y: 0.01, z: 0.01 },
    { x: 1, y: 1, z: 1, duration: 0.45, ease: "back.out(1.5)" }
  );
  gsap.fromTo(
    model.wrapper.position,
    { y: model.wrapper.position.y + 20 },
    { y: model.wrapper.position.y, duration: 0.5, ease: "power2.out" }
  );
};

export const animateProjectModelOut = (scene: any, index: number) => {
  if (!scene?.projectModels?.[index]) return;
  const model = scene.projectModels[index];
  gsap.to(model.wrapper.scale, {
    x: 0.01,
    y: 0.01,
    z: 0.01,
    duration: 0.35,
    ease: "back.in(1.4)",
    onComplete: () => {
      model.wrapper.visible = false;
    },
  });
};

export const animateProjectSceneIn = (scene: any, index: number) => {
  if (!scene?.camera) return;
  const camera = scene.camera;
  if (!scene._baseCamera) {
    scene._baseCamera = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
  }

  const base = scene._baseCamera;
  const offsetX = index % 2 === 0 ? -30 : 30;
  const offsetY = (index % 3 - 1) * 15;
  const offsetZ = index % 2 === 0 ? -40 : -20;

  gsap.to(camera.position, {
    x: base.x + offsetX,
    y: base.y + offsetY,
    z: base.z + offsetZ,
    duration: 0.6,
    ease: "power2.out",
  });
};
