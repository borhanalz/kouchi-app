"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function useURLSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => {
    return searchParams.get(key) || "";
  };

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return { getParam, setParam, removeParam };
}
