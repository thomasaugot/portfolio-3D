"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export type ContactFormState = "idle" | "sending" | "success";

export function useContactForm(stage: string, showPrompt: boolean) {
  const [formState, setFormState] = useState<ContactFormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !email || !message) return;

      setFormState("sending");

      const mailtoLink = `mailto:thomas.augot@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoLink;

      setTimeout(() => {
        setFormState("success");
      }, 500);
    },
    [name, email, message]
  );

  const reset = useCallback(() => {
    setName("");
    setEmail("");
    setMessage("");
    setFormState("idle");
    setTimeout(() => nameInputRef.current?.focus(), 100);
  }, []);

  // Focus name input when contact form appears
  useEffect(() => {
    if (stage === "contact" && showPrompt && formState === "idle") {
      setTimeout(() => nameInputRef.current?.focus(), 300);
    }
  }, [stage, showPrompt, formState]);

  return {
    formState,
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    nameInputRef,
    handleSubmit,
    reset,
  };
}
