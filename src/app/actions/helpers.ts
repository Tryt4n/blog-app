import { PostSchema } from "@/zod/postSchema";
import { checkIsTitleUnique } from "@/db/posts";
import type { Post } from "@/types/posts";

type EdiPostState = Record<"title" | "content" | "tags" | "image", string | undefined>;

type RequiredPostProperties = {
  title: Post["title"];
  content: Post["content"];
  tags: string;
  image: Post["image"];
};

type PartialWithRequiredFields = RequiredPostProperties & Partial<Post>;

export function createUniqueTagsArray(tags: string) {
  return [
    ...new Set(
      tags
        .split(" ")
        .map((tag) => "#" + tag.replace(/#/g, "")) // Ensure all tags start with a '#' character and its only occurrence is at the beginning of the tag
        .filter((tag) => tag.trim().length > 1) // All tags must be at least 2 characters long because of the '#' character
    ),
  ];
}

export async function validatePostForm(post: PartialWithRequiredFields, originalTitle?: string) {
  let errorMessages: EdiPostState = {
    title: undefined,
    content: undefined,
    tags: undefined,
    image: undefined,
  };

  if (post.title !== originalTitle) {
    const isTitleUnique = await checkIsTitleUnique(post.title);

    if (!isTitleUnique) {
      errorMessages.title = "The title is already exists. Please choose another title.";
      return errorMessages;
    }
  }

  const results = PostSchema.safeParse(post);

  if (!results.success) {
    results.error.issues.forEach((issue) => {
      const path = issue.path[0] as keyof EdiPostState;
      errorMessages[path] = issue.message;
    });

    return errorMessages;
  }

  return null;
}
