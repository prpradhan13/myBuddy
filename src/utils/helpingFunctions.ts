import { BuildCommentTreeType, CommentType } from "@/types/workoutPlans";
import { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import type { Event } from "stream-chat";

export const getInitialLetter = (fullName?: string) => {
  if (!fullName) return "";
  const nameParts = fullName.split(" ");
  return nameParts.length === 1
    ? fullName.slice(0, 2).toUpperCase()
    : nameParts
        .map((name: string) => name[0])
        .join("")
        .toUpperCase();
};

export const truncateText = (text: string, maxLength: number) => {
  if(!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const useDebounce = (value: string, delay = 300) => {
  const [debounceText, setDebounceText] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceText(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceText;
};

export const calculateAverageRating = (reviews: { rating: number }[] = []) => {
  if (!reviews.length) return 0;

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};

export const buildCommentTree = (comments: CommentType[]) => {
  if (!comments || !Array.isArray(comments)) {
    return [];
  }
  
  const commentMap: Record<number, BuildCommentTreeType> = {};
  const rootComments: BuildCommentTreeType[] = [];

  // Create a map of comments by ID
  comments.forEach(comment => {
    if (!comment || !comment.id) {
      console.error("Invalid comment detected:", comment);
      return; // Skip processing undefined/null comments
    }
  
      commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Organize comments into a nested structure
  comments.forEach(comment => {
      if (comment.parent_comment_id) {
        const parentComment = commentMap[comment.parent_comment_id];
        if (parentComment) {
          parentComment.replies.push(commentMap[comment.id]);
        }
      } else {
          rootComments.push(commentMap[comment.id]);
      }
  });

  return rootComments;
}

export const useCountUnreadMessage = () => {
  const { client } = useChatContext();
  const [unReadCount, setUnReadCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Handler for both new messages and read messages
    const updateUnreadCount = (event: Event) => {
      setUnReadCount(event.total_unread_count ?? 0);
    };

    // Attach event listeners
    client.on("notification.message_new", updateUnreadCount);
    client.on("message.read", updateUnreadCount);

    // Cleanup function to remove event listeners
    return () => {
      client.off("notification.message_new", updateUnreadCount);
      client.off("message.read", updateUnreadCount);
    };
  }, [client]);

  return unReadCount;
};
