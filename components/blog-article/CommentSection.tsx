"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/types/comment";
import CommentForm from "./CommentForm";
import { FaComment, FaUser, FaClock, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface CommentSectionProps {
  articleSlug: string;
}

export default function CommentSection({ articleSlug }: CommentSectionProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${articleSlug}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // Check if admin is logged in
    const adminStatus = localStorage.getItem('adminAuthenticated');
    setIsAdmin(adminStatus === 'true');
  }, [articleSlug]);

  const handleDelete = async (commentId: number) => {
    if (!confirm(t('blog.comments.confirm_delete'))) return;

    const password = localStorage.getItem('adminPassword');
    if (!password) return;

    try {
      const response = await fetch(`/api/comments/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        fetchComments();
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} ${t('blog.comments.hours_ago')}`;
    } else if (diffInHours < 48) {
      return t('blog.comments.yesterday');
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      data-comment-item
      className={`${isReply ? 'ml-8 md:ml-12' : ''} mb-6`}
    >
      <div className="glass bg-bg/60 backdrop-blur-md border border-border/50 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
              <FaUser className="text-white text-sm" />
            </div>
            <div>
              <h4 className="font-semibold gradient-primary bg-clip-text text-transparent">{comment.author_name}</h4>
              <div className="flex items-center gap-2 text-xs text-text/50">
                <FaClock className="w-3 h-3" />
                <span>{formatDate(comment.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-text/80 leading-relaxed mb-4">{comment.content}</p>

        {/* Reply Button & Admin Controls */}
        <div className="flex items-center gap-4">
          {!isReply && (
            <Button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              variant="ghost"
              size="sm"
              className="!px-0"
            >
              {replyingTo === comment.id ? t('blog.comments.cancel_reply') : t('blog.comments.reply')}
            </Button>
          )}

          {isAdmin && (
            <Button
              onClick={() => handleDelete(comment.id)}
              variant="ghost"
              size="sm"
              className="!px-0 text-red-500 hover:text-red-600"
            >
              <FaTrash className="mr-1" />
              {t('blog.comments.delete')}
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-4 pt-4 border-t border-primary/20">
            <CommentForm
              articleSlug={articleSlug}
              parentId={comment.id}
              onCommentSubmitted={() => {
                setReplyingTo(null);
                fetchComments();
              }}
            />
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  // Organize comments into thread structure
  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create comment map
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into threads
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const threadedComments = organizeComments(comments);

  return (
    <section
      data-comment-section
      className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24"
    >
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <FaComment className="text-bg text-xl" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              {t('blog.comments.title')}
            </h2>
            <p className="text-text/60 text-sm font-medium">
              {comments.length} {comments.length === 1 ? t('blog.comments.count_one') : t('blog.comments.count_other')}
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-12 p-6 md:p-8 glass bg-bg/60 backdrop-blur-md border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-300">
        <h3 className="text-xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">{t('blog.comments.leave_comment')}</h3>
        <CommentForm
          articleSlug={articleSlug}
          onCommentSubmitted={fetchComments}
        />
      </div>

      {/* Comments List */}
      <div data-comment-list>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : threadedComments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text/60 text-lg">
              {t('blog.comments.no_comments')}
            </p>
          </div>
        ) : (
          threadedComments.map(comment => renderComment(comment))
        )}
      </div>
    </section>
  );
}
