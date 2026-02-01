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
    nameInputRef,
    handleSubmit,
    reset,
  } = useContactForm(stage, showPrompt);

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      {formState === "success" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Check className="w-5 h-5" />
            <span className="font-bold">{t("footer.form.success_title")}</span>
          </div>
          <p className="text-secondary/80 pl-7">{t("footer.form.success_text")}</p>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs">❯</span>
              <span className="text-white/60 text-xs">{t("footer.form.name_command")}</span>
            </div>
            <Input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("footer.form.name_placeholder")}
              disabled={formState === "sending"}
            />
          </div>

          {/* Email field */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs">❯</span>
              <span className="text-white/60 text-xs">{t("footer.form.email_command")}</span>
            </div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.form.email_placeholder")}
              disabled={formState === "sending"}
            />
          </div>

          {/* Message field */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs">❯</span>
              <span className="text-white/60 text-xs">{t("footer.form.message_command")}</span>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("footer.form.message_placeholder")}
              rows={4}
              disabled={formState === "sending"}
            />
          </div>

          {/* Submit button */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="orange"
              size="md"
              disabled={!name || !email || !message || formState === "sending"}
            >
              {formState === "sending" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary text-xs">❯</span>
            <span className="text-white/60 text-xs">cat ./socials.txt</span>
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
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-primary hover:border-primary/50 transition-colors"
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
