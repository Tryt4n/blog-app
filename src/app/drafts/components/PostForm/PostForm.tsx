"use client";

import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { deletePostAction, editPostAction, publishPostAction } from "@/app/actions/posts";
import { ContentTextArea } from "./components/ContentTextArea";
import PostTags from "./components/PostTags";
import SelectedCategoryInput from "./components/SelectedCategoryInput";
import MarkdownPreview from "../MarkdownPreview/MarkdownPreview";
import TitleInput from "./components/TitleInput";
import SavePostBtn from "./components/SavePostBtn";
import PublishDraftBtn from "./components/PublishDraftBtn";
import DeletePostBtn from "./components/DeletePostBtn";
import type { Post } from "@/types/posts";

export type PostFormProps = {
  post: Post;
  postTags: {
    id: string;
    name: string;
  }[];
};

export default function PostForm({ post, postTags }: PostFormProps) {
  const [errors, mainAction] = useFormState(editPostAction, {
    title: undefined,
    content: undefined,
    tags: undefined,
  });
  const [textAreaValue, setTextAreaValue] = useState(post.content);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <>
      <form action={mainAction}>
        <input
          type="hidden"
          name="post-id"
          value={post.id}
        />

        <input
          type="hidden"
          name="existing-post-tags"
          value={`[${postTags.map((tag) => {
            return JSON.stringify(tag);
          })}]`}
        />

        <TitleInput
          title={post.title}
          error={errors.title}
        />

        <PostTags
          tags={postTags}
          error={errors.tags}
        />

        <ContentTextArea
          ref={textAreaRef}
          value={textAreaValue}
          setValue={setTextAreaValue}
          error={errors.content}
        />

        <SelectedCategoryInput post={post} />

        <div>
          <SavePostBtn formAction={mainAction} />
          {!post.published && <PublishDraftBtn formAction={publishPostAction} />}
          <DeletePostBtn formAction={deletePostAction} />
        </div>
      </form>

      <MarkdownPreview markdownText={textAreaValue} />
    </>
  );
}
