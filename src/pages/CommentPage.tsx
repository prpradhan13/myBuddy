import Loader from "@/components/loaders/Loader";
import { BuildCommentTreeType } from "@/types/workoutPlans";
import { buildCommentTree, getInitialLetter } from "@/utils/helpingFunctions";
import { useCreateComment, useGetComment } from "@/utils/queries/reviewQuery";
import { getUserDetails } from "@/utils/queries/userProfileQuery";
import { useParams } from "react-router-dom";
import { Loader2, Reply } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CommentPage = () => {
    const [replyText, setReplyText] = useState("");
  const { planId } = useParams();
  const { data, isFetching } = useGetComment(Number(planId));

  const commentTree = data ? buildCommentTree(data) : [];

  const { mutate, isPending } = useCreateComment();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      cmtText: replyText,
    });
  };

  if (isFetching) return <Loader />;

  return (
    <div className="bg-MainBackgroundColor p-4 min-h-screen w-full text-PrimaryTextColor">
      <h1 className="text-xl font-bold mb-4">Comments</h1>

      {commentTree.map((cmt) => (
        <Comment key={cmt.id} comment={cmt} planId={planId} />
      ))}

      <form onSubmit={handleSubmit} className="mt-10">
        <Input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />

        <Button variant={"secondary"} type="submit" className="h-6">
          {isPending ? <Loader2 /> : "Send"}
        </Button>
      </form>
    </div>
  );
};

const Comment = ({
  comment,
  level = 0,
}: {
  comment: BuildCommentTreeType;
  planId?: string;
  level?: number;
}) => {
  const [replyInputOpen, setReplyInputOpen] = useState<number | null>(null);
  const [parentCmtState, setParentCmtState] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: user } = getUserDetails(comment.user_id);

  const handleReplyInputClick = (
    commentId: number,
    parentCmt: number | null
  ) => {
    setReplyInputOpen(commentId);
    setParentCmtState(parentCmt);
  };

  const { mutate, isPending } = useCreateComment();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      cmtText: replyText,
      parentCmtId: parentCmtState,
    });
  };

  return (
    <div className={`ml-${level * 4} p-2 border-l-2 border-gray-500`}>
      {/* User Avatar */}
      <div className="flex gap-2 items-center">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex justify-center items-center font-medium bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] text-sm">
            {getInitialLetter(user?.full_name)}
          </div>
        )}
        <p className="font-semibold">{user?.username || "Anonymous"}</p>
        <Reply
          color="#fff"
          onClick={() =>
            handleReplyInputClick(comment.id, comment.parent_comment_id)
          }
        />
      </div>

      <p className="font-semibold mt-1">{comment.text}</p>
      {replyInputOpen && (
        <form onSubmit={handleSubmit}>
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />

          <Button variant={"secondary"} type="submit" className="h-6">
            {isPending ? <Loader2 /> : "Send"}
          </Button>
        </form>
      )}

      {comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentPage;
