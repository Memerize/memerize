"use server";

import { revalidateTag } from "next/cache";

export async function refreshCacheByTag(tag: string) {
  revalidateTag(tag);
}

export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};