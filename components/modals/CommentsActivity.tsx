"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { addComment } from "@/actions/comment";

interface Comment {
    id: string;
    text: string;
    createdAt: Date | string;
}

interface CommentsActivityProps {
    cardId: string;
    boardId: string;
    comments: Comment[];
    activities: any[];
}

export const CommentsActivity = ({ cardId, boardId, comments, activities }: CommentsActivityProps) => {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        await addComment(cardId, boardId, newComment);
        setNewComment("");
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6">
            {/* Add Comment */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Comments</h3>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-lg transition flex items-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>

            {/* Comments List */}
            {comments.length > 0 && (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-white/10"
                        >
                            <p className="text-sm text-neutral-900 dark:text-white mb-1">{comment.text}</p>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Activity Log */}
            {activities && activities.length > 0 && (
                <div>
                    <h4 className="font-semibold text-sm text-neutral-600 dark:text-neutral-400 mb-2">Activity</h4>
                    <div className="space-y-2">
                        {activities.map((activity) => (
                            <div key={activity.id} className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                <span className="capitalize">{activity.action}</span>
                                <span>·</span>
                                <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
