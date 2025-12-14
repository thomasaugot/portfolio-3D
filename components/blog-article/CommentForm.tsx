"use client";

import { useState, FormEvent } from "react";
import { CommentFormData } from "@/types/comment";
import { FaPaperPlane } from "react-icons/fa";

interface CommentFormProps {
  articleSlug: string;
  parentId?: number;
  onCommentSubmitted?: () => void;
}

export default function CommentForm({ articleSlug, parentId, onCommentSubmitted }: CommentFormProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    author_name: "",
    author_email: "",
    content: "",
    parent_id: parentId
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/comments/${articleSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Comment submitted successfully! It will appear after approval.' });
        setFormData({
          author_name: "",
          author_email: "",
          content: "",
          parent_id: parentId
        });
        if (onCommentSubmitted) onCommentSubmitted();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit comment' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="author_name" className="block text-sm font-semibold mb-2 text-text/80">
            Name *
          </label>
          <input
            type="text"
            id="author_name"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            required
            maxLength={100}
            className="w-full px-4 py-3 bg-bg border-2 border-primary/20 rounded-lg focus:border-primary outline-none transition-colors text-text"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="author_email" className="block text-sm font-semibold mb-2 text-text/80">
            Email *
          </label>
          <input
            type="email"
            id="author_email"
            value={formData.author_email}
            onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
            required
            maxLength={255}
            className="w-full px-4 py-3 bg-bg border-2 border-primary/20 rounded-lg focus:border-primary outline-none transition-colors text-text"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold mb-2 text-text/80">
          Comment *
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-3 bg-bg border-2 border-primary/20 rounded-lg focus:border-primary outline-none transition-colors text-text resize-none"
          placeholder="Share your thoughts..."
        />
        <div className="text-xs text-text/50 mt-1 text-right">
          {formData.content.length} / 2000 characters
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-primary text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <FaPaperPlane />
            <span>Post Comment</span>
          </>
        )}
      </button>
    </form>
  );
}
