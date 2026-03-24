"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import emailjs from "@emailjs/browser";

export type ContactFormState = "idle" | "sending" | "success";
type FieldName = "name" | "email" | "message";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export function useContactForm(stage: string, showPrompt: boolean) {
  const [formState, setFormState] = useState<ContactFormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) {
      nextErrors.name = "required";
    }

    if (!email.trim()) {
      nextErrors.email = "required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "invalid";
    }

    if (!message.trim()) {
      nextErrors.message = "required";
    }

    return nextErrors;
  }, [name, email, message]);

  const clearFieldError = useCallback((field: FieldName) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const nextErrors = validate();
      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors);
        setSubmitError(null);
        return;
      }

      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.error("EmailJS environment variables are missing.");
        setSubmitError("config");
        return;
      }

      setFormState("sending");
      setSubmitError(null);

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
        setSubmitError("send");
      }
    },
    [validate, name, email, message]
  );

  const reset = useCallback(() => {
    setName("");
    setEmail("");
    setMessage("");
    setFormState("idle");
    setFieldErrors({});
    setSubmitError(null);
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
    fieldErrors,
    submitError,
    nameInputRef,
    handleSubmit,
    reset,
    clearFieldError,
  };
}
