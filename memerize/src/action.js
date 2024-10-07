"use server";

import { revalidateTag } from "next/cache";

export async function refreshCacheByTag(tag) {
  revalidateTag(tag);
}

export async function fetchUser(username) {
  const response = await fetch(`/api/users/${username}`, {
    next: { tags: ["user"] },
  });
  console.log(response);
  return response;
}

export async function createSlug(title) {
  const result = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return result;
}
