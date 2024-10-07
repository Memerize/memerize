"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

export default function Toast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const error = searchParams.get("error");
  const success = searchParams.get("success");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
    if (error || success) {
      router.replace(pathname);
    }
    router.replace(pathname);
  }, [error, pathname, router, success]);

  return <Toaster position="top-right" richColors />;
}
