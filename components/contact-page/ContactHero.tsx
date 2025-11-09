"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initContactHero3DScene } from "@/utils/animations/contact-3d-scenes";

export default function ContactHero() {
  const { t } = useTranslation();
  const containerRef = useThreeScene(initContactHero3DScene, "contact-hero");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Trigger network animation
    const event = new CustomEvent("contactFormSubmit");
    window.dispatchEvent(event);

    // Simulate submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName);
    const event = new CustomEvent("contactFieldFocus", {
      detail: { field: fieldName },
    });
    window.dispatchEvent(event);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
    const event = new CustomEvent("contactFieldBlur");
    window.dispatchEvent(event);
  };

  return (
    <section className="relative" data-contact-hero>
      <div className="sticky top-0 min-h-screen flex items-center justify-center py-20 lg:py-32 bg-bg overflow-visible z-0">
        <div
          ref={containerRef}
          data-3d-container="contact-hero"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30 md:opacity-60 lg:opacity-100"
        />

        <div className="relative z-10 w-full px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Side - Title & Info */}
              <div className="lg:col-span-5 space-y-8 relative">
                <div className="relative" data-contact-hero-content>
                  <div
                    data-hero-badge
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-border bg-bg/80 backdrop-blur-md"
                    style={{ willChange: "opacity, transform" }}
                  >
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-label">
                      {t("contact.hero.badge")}
                    </span>
                  </div>

                  <h1 className="title-hero space-y-0 md:-space-y-2 lg:-space-y-4 relative pb-2 mt-8">
                    <span
                      data-hero-line
                      className="block pb-1 text-shadow-soft"
                      style={{ willChange: "opacity, transform" }}
                    >
                      {t("contact.hero.title_1")}
                    </span>
                    <span
                      data-hero-line
                      className="block title-hero"
                      style={{
                        transform: "translateX(0)",
                        width: "max-content",
                        maxWidth: "none",
                        willChange: "opacity, transform",
                      }}
                    >
                      {t("contact.hero.title_2")}
                    </span>
                  </h1>

                  <p
                    data-hero-subtitle
                    className="subtitle max-w-md mt-8"
                    style={{ willChange: "opacity, transform" }}
                  >
                    {t("contact.hero.subtitle")}
                  </p>
                </div>

                {/* Thank you message - TETRIS ANIMATED after scroll */}
                <div
                  data-thank-you-message
                  className="absolute top-0 left-0 w-full max-w-md z-20"
                >
                  <h2
                    data-thank-you-title
                    className="title-hero mb-4 leading-tight"
                  >
                    {t("contact.thank_you.title")}
                  </h2>
                  <p data-thank-you-subtitle className="subtitle max-w-xl">
                    {t("contact.thank_you.subtitle")}
                  </p>
                </div>

                <div
                  data-hero-contact-info
                  className="space-y-4 pt-4"
                  style={{ willChange: "opacity, transform" }}
                >
                  <div className="flex items-center gap-3 text-body">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <a
                      href="mailto:thomas.augot@gmail.com"
                      className="font-mono text-text-muted hover:text-primary transition-colors"
                    >
                      thomas.augot@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-body">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-mono text-text-muted">
                      {t("contact.info.location_value")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-body">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-text-muted">
                      {t("contact.info.response_value")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="lg:col-span-7" data-contact-form-wrapper>
                <div
                  className="relative group"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Animated glow */}
                  <div
                    data-form-glow
                    className={`absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl transition-opacity duration-500 ${
                      focusedField ? "opacity-70" : "opacity-0"
                    }`}
                  />

                  {/* Border gradient */}
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/40 via-secondary/40 to-primary/40 rounded-2xl opacity-50" />

                  {/* Form container */}
                  <div className="relative bg-bg/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div data-form-field>
                          <label
                            htmlFor="name"
                            className="block text-label mb-2"
                          >
                            {t("contact.form.name_label")}
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus("name")}
                            onBlur={handleFieldBlur}
                            className={`w-full px-4 py-3 bg-bg/60 border rounded-xl text-text placeholder-text-muted/50 focus:outline-none transition-all duration-300 ${
                              focusedField === "name"
                                ? "border-primary shadow-[0_0_20px_rgba(2,188,204,0.3)]"
                                : "border-border/50"
                            }`}
                            placeholder={t("contact.form.name_placeholder")}
                            required
                          />
                        </div>

                        <div data-form-field>
                          <label
                            htmlFor="email"
                            className="block text-label mb-2"
                          >
                            {t("contact.form.email_label")}
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus("email")}
                            onBlur={handleFieldBlur}
                            className={`w-full px-4 py-3 bg-bg/60 border rounded-xl text-text placeholder-text-muted/50 focus:outline-none transition-all duration-300 ${
                              focusedField === "email"
                                ? "border-primary shadow-[0_0_20px_rgba(2,188,204,0.3)]"
                                : "border-border/50"
                            }`}
                            placeholder={t("contact.form.email_placeholder")}
                            required
                          />
                        </div>
                      </div>

                      <div data-form-field>
                        <label
                          htmlFor="subject"
                          className="block text-label mb-2"
                        >
                          {t("contact.form.subject_label")}
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus("subject")}
                          onBlur={handleFieldBlur}
                          className={`w-full px-4 py-3 bg-bg/60 border rounded-xl text-text placeholder-text-muted/50 focus:outline-none transition-all duration-300 ${
                            focusedField === "subject"
                              ? "border-primary shadow-[0_0_20px_rgba(2,188,204,0.3)]"
                              : "border-border/50"
                          }`}
                          placeholder={t("contact.form.subject_placeholder")}
                          required
                        />
                      </div>

                      <div data-form-field>
                        <label
                          htmlFor="message"
                          className="block text-label mb-2"
                        >
                          {t("contact.form.message_label")}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => handleFieldFocus("message")}
                          onBlur={handleFieldBlur}
                          rows={6}
                          className={`w-full px-4 py-3 bg-bg/60 border rounded-xl text-text placeholder-text-muted/50 focus:outline-none transition-all duration-300 resize-none ${
                            focusedField === "message"
                              ? "border-primary shadow-[0_0_20px_rgba(2,188,204,0.3)]"
                              : "border-border/50"
                          }`}
                          placeholder={t("contact.form.message_placeholder")}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        data-form-button
                        className="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary text-bg font-bold rounded-xl hover:shadow-[0_0_30px_rgba(2,188,204,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                      >
                        <span className="relative z-10">
                          {isSubmitting
                            ? "Sending..."
                            : t("contact.form.submit_button")}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
