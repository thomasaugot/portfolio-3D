"use client";

import { Check, Send, RotateCcw } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationProvider";
import { SOCIAL_LINKS } from "@/data/contact";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useContactForm } from "@/hooks/useContactForm";

interface ContactFormProps {
  stage: string;
  showPrompt: boolean;
  isDesktop: boolean;
}

export default function ContactForm({
  stage,
  showPrompt,
  isDesktop,
}: ContactFormProps) {
  const { t } = useTranslation();
  const {
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
  } = useContactForm(stage, showPrompt);

  const getFieldErrorMessage = (field: "name" | "email" | "message") => {
    const error = fieldErrors[field];
    if (!error) return null;
    if (error === "required") return t(`footer.form.errors.${field}_required`);
    if (error === "invalid") return t(`footer.form.errors.${field}_invalid`);
    return null;
  };

  const submitErrorMessage =
    submitError === "config"
      ? t("footer.form.errors.config")
      : submitError === "send"
        ? t("footer.form.errors.send")
        : null;

  return (
    <div className="mt-3 pt-3 border-t border-border">
      {formState === "success" ? (
        <div className="space-y-3" role="status" aria-live="polite">
          <div className="flex items-center gap-2 text-primary">
            <Check className="w-5 h-5" />
            <span className="font-bold">{t("footer.form.success_title")}</span>
          </div>
          <p className="text-text/82 pl-7">{t("footer.form.success_text")}</p>
          <Button
            type="button"
            onClick={reset}
            variant="outlined"
            size="md"
            className="mt-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t("footer.form.send_another")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-describedby="contact-form-status">
          <p id="contact-form-status" className="sr-only" aria-live="polite">
            {submitErrorMessage || ""}
          </p>
          {submitErrorMessage && (
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
              {submitErrorMessage}
            </div>
          )}
          {/* Name field */}
          <div>
            <label htmlFor="contact-name" className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs">❯</span>
              <span className="text-primary text-xs">{t("footer.form.name_command")}</span>
            </label>
            <Input
              ref={nameInputRef}
              id="contact-name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              placeholder={t("footer.form.name_placeholder")}
              autoComplete="name"
              required
              aria-invalid={fieldErrors.name ? "true" : "false"}
              aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
              disabled={formState === "sending"}
            />
            {getFieldErrorMessage("name") && (
              <p id="contact-name-error" className="mt-2 text-xs text-red-200" role="alert">
                {getFieldErrorMessage("name")}
              </p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="contact-email" className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs">❯</span>
              <span className="text-primary text-xs">{t("footer.form.email_command")}</span>
            </label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              placeholder={t("footer.form.email_placeholder")}
              autoComplete="email"
              inputMode="email"
              required
              aria-invalid={fieldErrors.email ? "true" : "false"}
              aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
              disabled={formState === "sending"}
            />
            {getFieldErrorMessage("email") && (
              <p id="contact-email-error" className="mt-2 text-xs text-red-200" role="alert">
                {getFieldErrorMessage("email")}
              </p>
            )}
          </div>

          {/* Message field */}
          <div>
            <label htmlFor="contact-message" className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs">❯</span>
              <span className="text-primary text-xs">{t("footer.form.message_command")}</span>
            </label>
            <Textarea
              id="contact-message"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                clearFieldError("message");
              }}
              placeholder={t("footer.form.message_placeholder")}
              rows={4}
              required
              aria-invalid={fieldErrors.message ? "true" : "false"}
              aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
              disabled={formState === "sending"}
            />
            {getFieldErrorMessage("message") && (
              <p id="contact-message-error" className="mt-2 text-xs text-red-200" role="alert">
                {getFieldErrorMessage("message")}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="orange"
              size="md"
              disabled={formState === "sending"}
            >
              {formState === "sending" ? (
                <>
                  <div className="w-4 h-4 border-2 border-text/30 border-t-text rounded-full animate-spin" />
                  {t("footer.form.sending")}...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("footer.form.submit")}
                </>
              )}
            </Button>
          </div>
        </form>
      )}
      {/* Mobile-only: social links inside terminal */}
      {!isDesktop && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary text-xs">❯</span>
            <span className="text-primary text-xs">cat ./socials.txt</span>
          </div>
          <div className="flex items-center gap-4 pl-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.label !== "Email" ? "_blank" : undefined}
                  rel={social.label !== "Email" ? "noreferrer" : undefined}
                  className="keyboard-focus-ring flex items-center justify-center w-10 h-10 rounded-lg bg-text/7 border border-border text-text/88 hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
