"use client";

import React, { type ComponentPropsWithoutRef } from "react";
import { startViewTransition } from "@/app/helpers/helpers";
import useComments from "@/app/post/hooks/useComments";
import { editCommentAction, postCommentAction } from "@/app/actions/comments";
import CommentTextarea from "../CommentTextarea/CommentTextarea";
import CommentBtn from "../CommentBtn/CommentBtn";
import type { Comment } from "@/types/comments";
import type { FormStatus } from "../../types/formTypes";

type CommentFormProps = {
  status: FormStatus;
  commentId?: Comment["id"];
} & ComponentPropsWithoutRef<"form">;

export default function CommentForm({ status, commentId, children, ...props }: CommentFormProps) {
  const { formCommentStatus, setFormCommentStatus, currentComment, setCurrentComment, contentRef } =
    useComments();

  function cancelEditing() {
    startViewTransition(() => {
      setFormCommentStatus("new");
      setCurrentComment(null);

      if (contentRef.current) {
        contentRef.current.value = "";
      }
    });
  }

  return (
    <>
      {((formCommentStatus !== "new" &&
        formCommentStatus === status &&
        currentComment?.id === commentId) ||
        (formCommentStatus === "new" && formCommentStatus === status)) && (
        <form
          action={
            status === "edit" && currentComment
              ? editCommentAction.bind(null, currentComment.content)
              : postCommentAction
          }
          onSubmit={cancelEditing}
          {...props}
        >
          {commentId && (
            <input
              type="hidden"
              name="comment-id"
              value={commentId}
            />
          )}

          {children}

          <label>
            <CommentTextarea
              name="new-comment"
              id="new-comment"
              cols={30}
              rows={10}
              minLength={1}
              maxLength={1000}
              required
              placeholder="Write your comment..."
              aria-label="Write your comment here."
            />
          </label>

          <div>
            <CommentBtn
              text={
                (status === "new" ? "Comment" : status).charAt(0).toUpperCase() +
                (status === "new" ? "Comment" : status).slice(1)
              }
              className="btn btn--accent"
            />

            <button
              type="reset"
              className="btn"
              onClick={cancelEditing}
            >
              {status === "new" ? "Clear" : "Cancel"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}