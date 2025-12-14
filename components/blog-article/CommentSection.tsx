"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/types/comment";
import CommentForm from "./CommentForm";
import { FaComment, FaUser, FaClock } from "react-icons/fa";

interface CommentSectionProps {
  articleSlug: string;
}

export default function CommentSection({ articleSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

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
  }, [articleSlug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
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
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-colors">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-primary rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div>
              <h4 className="font-semibold text-text">{comment.author_name}</h4>
              <div className="flex items-center gap-2 text-xs text-text/50">
                <FaClock className="text-primary" />
                <span>{formatDate(comment.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-text/80 leading-relaxed mb-4">{comment.content}</p>

        {/* Reply Button */}
        {!isReply && (
          <button
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            {replyingTo === comment.id ? 'Cancel Reply' : 'Reply'}
          </button>
        )}

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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-primary rounded-xl flex items-center justify-center">
            <FaComment className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              Comments
            </h2>
            <p className="text-text/60 text-sm">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-12 p-6 md:p-8 bg-bg border border-gradient rounded-2xl">
        <h3 className="text-xl font-bold mb-6 text-text">Leave a Comment</h3>
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
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          threadedComments.map(comment => renderComment(comment))
        )}
      </div>
    </section>
  );
}
