import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Image from "next/image";
import Time from "../../../../components/Time/Time";
import ReplyBtn from "@/app/post/[postId]/components/ReplyBtn";
import DeleteCommentBtn from "../DeleteCommentBtn/DeleteCommentBtn";
import EditCommentBtn from "../EditCommentBtn/EditCommentBtn";
import EditPostCommentForm from "../EditPostCommentForm/EditPostCommentForm";
import ReplyPostCommentForm from "../ReplyPostCommentForm/ReplyPostCommentForm";
import type { Comment } from "@/types/comments";

export default function PostComment({ comment }: { comment: Comment }) {
  return (
    <Comment comment={comment}>
      {comment.replies && comment.replies.length > 0 && (
        <ul style={{ border: "3px solid #666", margin: "1em" }}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
            />
          ))}
        </ul>
      )}
    </Comment>
  );
}

async function Comment({ comment, children }: { comment: Comment; children?: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const user = comment.author.name === session?.user?.name ? "You" : comment.author.name;
  const userAvatar = comment.author.image;
  const imageAlt =
    comment.author.name === session?.user?.name ? "Your avatar." : `${user}'s avatar.`;

  return (
    <li
      key={comment.id}
      style={{ backgroundColor: "#99999980", marginBlock: "2em" }}
    >
      <div>
        <div>
          <Image
            src={userAvatar}
            alt={imageAlt}
            width={50}
            height={50}
          />
          <strong title="Comment's author name">{user}</strong>
          <span className="visually-hidden">&apos;s comment</span>
        </div>

        <Time
          time={
            JSON.stringify(comment.createdAt) === JSON.stringify(comment.updatedAt)
              ? comment.createdAt
              : comment.updatedAt
          }
          timeFormat="HH:mm, d MMM yyyy"
        />
      </div>

      {session && comment.author.name !== session.user.name && comment.replyToId == null && (
        <ReplyBtn comment={comment} />
      )}

      {session && comment.author.name === session.user.name && (
        <>
          <DeleteCommentBtn
            postId={comment.postId}
            commentId={comment.id}
          />

          <EditCommentBtn comment={comment} />
        </>
      )}

      <p>{comment.content}</p>

      {children}

      {session?.user && (
        <ReplyPostCommentForm
          commentId={comment.id}
          authorId={session.user.id}
        />
      )}

      {session && comment.author.name === session.user.name && (
        <EditPostCommentForm commentId={comment.id} />
      )}
    </li>
  );
}
