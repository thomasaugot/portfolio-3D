"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";

export default function ContactFormSection() {
  const { t } = useTranslation();
  
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
      data-contact-form-section
      className="relative min-h-screen flex items-center justify-center py-32 bg-gradient-to-b from-bg via-bg to-transparent"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <div data-contact-info className="space-y-8 lg:sticky lg:top-32">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight">
              {t("contact.form.section_title_1")}
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">
                {t("contact.form.section_title_2")}
              </span>
            </h2>

            <p className="text-lg text-text-muted leading-relaxed">
              {t("contact.form.section_description")}
            </p>

            <div className="space-y-6 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-text mb-1">{t("contact.info.email_label")}</h3>
                  <a href="mailto:contact@example.com" className="text-text-muted hover:text-primary transition-colors font-mono">
                    contact@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-text mb-1">{t("contact.info.location_label")}</h3>
                  <p className="text-text-muted font-mono">
                    {t("contact.info.location_value")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-text mb-1">{t("contact.info.response_label")}</h3>
                  <p className="text-text-muted">
                    {t("contact.info.response_value")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            data-contact-form
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              data-form-glow
              className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-3xl opacity-0"
            />

            <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl opacity-50" />

            <div className="relative bg-bg/95 backdrop-blur-xl rounded-3xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div data-form-field>
                  <label htmlFor="name" className="block text-sm font-mono text-text-muted mb-2">
                    {t("contact.form.name_label")} *
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
                    placeholder={t("contact.form.name_placeholder")}
                    required
                  />
                </div>

                <div data-form-field>
                  <label htmlFor="email" className="block text-sm font-mono text-text-muted mb-2">
                    {t("contact.form.email_label")} *
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
                    placeholder={t("contact.form.email_placeholder")}
                    required
                  />
                </div>

                <div data-form-field>
                  <label htmlFor="subject" className="block text-sm font-mono text-text-muted mb-2">
                    {t("contact.form.subject_label")} *
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
                  <label htmlFor="message" className="block text-sm font-mono text-text-muted mb-2">
                    {t("contact.form.message_label")} *
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
                  className="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary text-bg font-bold rounded-xl hover:shadow-[0_0_30px_rgba(2,188,204,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t("contact.form.submit_button")}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}