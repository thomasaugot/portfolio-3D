"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/animations";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    if (!overlayRef.current || !contentRef.current) return;

    // Set initial state
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(contentRef.current, { scale: 0.8, opacity: 0 });

    // Animate in
    const tl = gsap.timeline();
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }).to(
      contentRef.current,
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      },
      "-=0.1"
    );

    return () => {
      document.body.style.overflow = "unset";
      tl.kill();
    };
  }, [isOpen]);

  const handleClose = () => {
    if (!overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.1"
    );
  };

  const handleConfirm = () => {
    if (!overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onConfirm();
        onClose();
      },
    });
    tl.to(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.1"
    );
  };

  if (!isOpen) return null;
  if (typeof window === "undefined") return null;

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />

      <div
        ref={contentRef}
        className="relative w-full max-w-md overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient glow effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary opacity-50 rounded-3xl -z-10" />

        {/* Main background */}
        <div className="absolute inset-0 bg-bg backdrop-blur-xl rounded-3xl -z-5" />

        {/* Content */}
        <div className="relative rounded-3xl p-8">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:bg-primary/20"
          >
            <X className="w-5 h-5 text-primary" />
          </button>

          <div className="space-y-6">
            <h2 className="title-item gradient-text pr-10">{title}</h2>
            <p className="text-body leading-relaxed">{message}</p>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleClose}
                variant="ghost"
                size="lg"
                className="flex-1"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                variant="filled"
                size="lg"
                className="flex-1"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
