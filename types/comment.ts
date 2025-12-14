export interface Comment {
  id: number;
  article_slug: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  approved: boolean;
  parent_id: number | null;
  replies?: Comment[];
}

export interface CommentFormData {
  author_name: string;
  author_email: string;
  content: string;
  parent_id?: number;
}
