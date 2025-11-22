import { gsap } from "@/lib/animations";

export function initHeroTitleAnimation() {
  const badge = document.querySelector('[data-hero-badge]');
  const lines = document.querySelectorAll('[data-hero-line]');
  const subtitle = document.querySelector('[data-hero-subtitle]');
  const buttons = document.querySelector('[data-hero-buttons]');

  if (!badge || lines.length < 3 || !subtitle || !buttons) return null;

  const dot = badge.querySelector('.animate-pulse') as HTMLElement;

  gsap.set([badge, subtitle, buttons], { opacity: 0 });
  if (dot) {
    gsap.set(dot, { opacity: 0, y: -50, scale: 0, borderRadius: '0%' });
  }

  const tl = gsap.timeline({ delay: 0.3 });

  tl.to(badge, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  });

  const line1 = lines[0] as HTMLElement;
  const line2 = lines[1] as HTMLElement;
  const line3 = lines[2] as HTMLElement;

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
  wrapper.style.justifyContent = 'center';
  wrapper.style.gap = '0';
  
  const leftPiece = document.createElement('span');
  leftPiece.textContent = firstHalf;
  leftPiece.className = 'tetris-left gradient-primary bg-clip-text text-transparent font-fun font-extralight tracking-tighter';
  leftPiece.style.display = 'inline-block';
  leftPiece.style.whiteSpace = 'nowrap';
  leftPiece.style.transformOrigin = 'center center';
  wrapper.appendChild(leftPiece);
  
  const rightPiece = document.createElement('span');
  rightPiece.textContent = secondHalf;
  rightPiece.className = 'tetris-right gradient-primary bg-clip-text text-transparent font-fun font-extralight tracking-tighter';
  rightPiece.style.display = 'inline-block';
  rightPiece.style.whiteSpace = 'nowrap';
  rightPiece.style.transformOrigin = 'center center';
  wrapper.appendChild(rightPiece);
  
  line2.appendChild(wrapper);

  gsap.set(line1, { opacity: 0, y: -150 });
  gsap.set(line2, { opacity: 1 });
  gsap.set(line3, { opacity: 0, y: 150 });
  gsap.set(leftPiece, { opacity: 0, x: -300, rotationZ: 90 });
  gsap.set(rightPiece, { opacity: 0, x: 300 });

  tl.to(leftPiece, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: "power2.out",
  }, 0.2);

  tl.to(leftPiece, {
    rotationZ: 0,
    duration: 0.5,
    ease: "back.out(2)",
  }, 0.7);

  tl.to(line1, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
  }, 0.9);

  tl.to(rightPiece, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: "power2.out",
  }, 0.6);

  tl.to(line3, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
  }, 0.8);

  tl.to(subtitle, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  }, 1.6);

  tl.to(buttons, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  }, 1.8);

  if (dot) {
    tl.to(dot, {
      opacity: 1,
      y: 0,
      scale: 1,
      borderRadius: '50%',
      duration: 0.6,
      ease: "back.out(1.7)",
    }, 2.0);
  }

  return tl;
}