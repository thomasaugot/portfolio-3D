"use client";

import { useState, FormEvent, useEffect } from "react";
import { CommentFormData } from "@/types/comment";
import { FaPaperPlane } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface CommentFormProps {
  articleSlug: string;
  parentId?: number;
  onCommentSubmitted?: () => void;
}

export default function CommentForm({ articleSlug, parentId, onCommentSubmitted }: CommentFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CommentFormData>({
    author_name: "",
    author_email: "",
    content: "",
    parent_id: parentId
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Auto-populate admin info if logged in
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth) {
      setIsAdmin(true);
      setFormData(prev => ({
        ...prev,
        author_name: "Thomas A. (Admin)",
        author_email: "admin@thomasaugot.com"
      }));
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const adminPassword = isAdmin ? sessionStorage.getItem('admin_auth') : null;

      const response = await fetch(`/api/comments/${articleSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          admin_password: adminPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        const successMessage = isAdmin
          ? t('blog.comments.form.success_admin') || t('blog.comments.form.success')
          : t('blog.comments.form.success');
        setMessage({ type: 'success', text: successMessage });

        // Reset form but keep admin info if admin
        if (isAdmin) {
          setFormData({
            author_name: "Thomas A. (Admin)",
            author_email: "admin@thomasaugot.com",
            content: "",
            parent_id: parentId
          });
        } else {
          setFormData({
            author_name: "",
            author_email: "",
            content: "",
            parent_id: parentId
          });
        }
        if (onCommentSubmitted) onCommentSubmitted();
      } else {
        setMessage({ type: 'error', text: data.error || t('blog.comments.form.error') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('blog.comments.form.error_generic') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="author_name" className="block text-sm font-semibold mb-2 text-text/80">
            {t('blog.comments.form.name')} {t('blog.comments.form.required')}
          </label>
          <input
            type="text"
            id="author_name"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            required
            maxLength={100}
            className="w-full px-4 py-3 bg-bg/80 border border-border/50 rounded-xl focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 outline-none transition-all duration-300 text-text"
            placeholder={t('blog.comments.form.name_placeholder')}
          />
        </div>

        <div>
          <label htmlFor="author_email" className="block text-sm font-semibold mb-2 text-text/80">
            {t('blog.comments.form.email')} {t('blog.comments.form.required')}
          </label>
          <input
            type="email"
            id="author_email"
            value={formData.author_email}
            onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
            required
            maxLength={255}
            className="w-full px-4 py-3 bg-bg/80 border border-border/50 rounded-xl focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 outline-none transition-all duration-300 text-text"
            placeholder={t('blog.comments.form.email_placeholder')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold mb-2 text-text/80">
          {t('blog.comments.form.comment')} {t('blog.comments.form.required')}
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-3 bg-bg/80 border border-border/50 rounded-xl focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 outline-none transition-all duration-300 text-text resize-none"
          placeholder={t('blog.comments.form.comment_placeholder')}
        />
        <div className="text-xs text-text/50 mt-1 text-right">
          {formData.content.length} / 2000 {t('blog.comments.form.characters')}
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-600'
              : 'bg-red-500/10 border border-red-500/30 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button
        type="submit"
        variant="filled"
        size="lg"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="w-full md:w-auto"
      >
        {!isSubmitting && <FaPaperPlane className="mr-2" />}
        {isSubmitting ? t('blog.comments.form.submitting') : t('blog.comments.form.submit')}
      </Button>
    </form>
  );
}
