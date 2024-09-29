"use server";

import { revalidateTag } from "next/cache";

export async function refreshCacheByTag(tag: string) {
  revalidateTag(tag);
}
