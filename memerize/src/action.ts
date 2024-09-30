"use server";

import { revalidateTag } from "next/cache";

export async function refreshCacheByTag(tag: string) {
  revalidateTag(tag);
}

export async function createSlug(title: string): Promise<string> {
  const result = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  return result;
}