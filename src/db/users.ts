import prisma from "./db";
import { cache } from "react";
import { revalidatePath, unstable_cache } from "next/cache";
import { wait } from "@/app/_helpers/helpers";
import type { UserRole } from "@/types/users";
import type { User } from "@prisma/client";

export const fetchUser = unstable_cache(
  cache(async ({ id }: { id: string }) => {
    // await wait(1000);
    return prisma.user.findUnique({ where: { id } });
  }),
  ["user"]
);

export const fetchAllAuthors = unstable_cache(
  // await wait(1000);
  cache(async () => {
    const authors = await prisma.user.findMany({
      where: {
        role: "moderator" || "admin",
      },
    });

    return authors.map((author) => ({
      ...author,
      role: author.role as UserRole,
    }));
  }),
  ["authors"]
);

export async function createNewUser(user: any) {
  // await wait(1000);
  revalidatePath("/signup");
  return prisma.user.create({ data: user });
}

export async function isNewUserEmailUnique(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user === null;
}

export async function isNewUserUsernameUnique(username: string) {
  const user = await prisma.user.findUnique({ where: { name: username } });
  return user === null;
}
