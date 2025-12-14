"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initContact3DScene } from "@/utils/animations/contact-3d-scene";

export default function ContactForm() {
  const { t } = useTranslation();
  const containerRef = useThreeScene(initContact3DScene, "contact");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section
      data-contact-page
      className="relative min-h-screen flex items-center justify-center py-32 overflow-visible"
      style={{ perspective: "2000px" }}
    >
      <div
        ref={containerRef}
        data-3d-container="contact"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div data-contact-header className="space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-border bg-bg/80 backdrop-blur-md">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-label">{t("contact.badge")}</span>
            </div>

            <h1 className="title-hero leading-[0.95]">
              {t("contact.title_1")}
              <br />
              <span className="gradient-primary bg-clip-text text-transparent font-fun">
                {t("contact.title_2")}
              </span>
            </h1>

            <p className="subtitle max-w-xl">{t("contact.subtitle")}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-text-muted">
                <svg
                  className="w-6 h-6 text-primary"
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
                <span className="font-mono">contact@example.com</span>
              </div>

              <div className="flex items-center gap-4 text-text-muted">
                <svg
                  className="w-6 h-6 text-primary"
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
                <span className="font-mono">{t("contact.location")}</span>
              </div>
            </div>
          </div>

          <div
            data-contact-form
            className="relative group"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              data-form-glow
              className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-3xl opacity-0"
            />

            <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl opacity-50" />

            <div className="relative bg-bg backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border/30">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div data-form-field>
                  <label htmlFor="name" className="block text-label mb-2">
                    {t("contact.form.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-bg/50 border rounded-xl text-text placeholder-text-muted/50 focus:outline-none transition-all duration-300 ${
                      focusedField === "name"
                        ? "border-primary shadow-[0_0_20px_rgba(2,188,204,0.3)]"
                        : "border-border"
                    }`}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div data-form-field>
                  <label htmlFor="email" className="block text-label mb-2">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-bg/50 border rounded-xl text-text placeholder-text-muted/50 focus:outline-none transition-all duration-300 ${
                      focusedField === "email"
                        ? "border-primary shadow-[0_0_20px_rgba(2,188,204,0.3)]"
                        : "border-border"
                    }`}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div data-form-field>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-mono text-text-muted mb-2"
                  >
                    {t("contact.form.subject")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-bg/50 border rounded-xl text-text placeholder-text-muted/50 focus:outline-none transition-all duration-300 ${
                      focusedField === "subject"
                        ? "border-primary shadow-[0_0_20px_rgba(2,188,204,0.3)]"
                        : "border-border"
                    }`}
                    placeholder={t("contact.form.subject_placeholder")}
                    required
                  />
                </div>

                <div data-form-field>
                  <label
                    htmlFor="message"
                    className="block text-sm font-mono text-text-muted mb-2"
                  >
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    rows={6}
                    className={`w-full px-4 py-3 bg-bg/50 border rounded-xl text-text placeholder-text-muted/50 focus:outline-none transition-all duration-300 resize-none ${
                      focusedField === "message"
                        ? "border-primary shadow-[0_0_20px_rgba(2,188,204,0.3)]"
                        : "border-border"
                    }`}
                    placeholder={t("contact.form.message_placeholder")}
                    required
                  />
                </div>

                <button
                  type="submit"
                  data-form-button
                  className="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary text-bg font-bold rounded-xl hover:shadow-[0_0_30px_rgba(2,188,204,0.5)] transition-all duration-300 hover:scale-105"
                >
                  {t("contact.form.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
