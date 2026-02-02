"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import emailjs from "@emailjs/browser";

export type ContactFormState = "idle" | "sending" | "success";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export function useContactForm(stage: string, showPrompt: boolean) {
  const [formState, setFormState] = useState<ContactFormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !email || !message) return;

      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.error("EmailJS environment variables are missing.");
        return;
      }

      setFormState("sending");

      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: name,
            reply_to: email,
            message,
          },
          EMAILJS_PUBLIC_KEY
        );

        setFormState("success");
      } catch (error) {
        console.error("EmailJS send failed:", error);
        setFormState("idle");
      }
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
