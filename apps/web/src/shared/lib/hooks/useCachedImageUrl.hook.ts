import { useState } from "react";

/**
 * Custom hook to cache remote image URLs.
 * This prevents images from flickering and reloading when signed URL tokens change
 * on every data refetch (e.g., SWR refetchOnWindowFocus).
 */
export function useCachedImageUrl(url: string | null | undefined) {
  const [cache, setCache] = useState<{
    currentUrl: string | null | undefined;
    cachedUrl: string | null | undefined;
  }>({
    currentUrl: url,
    cachedUrl: url,
  });

  if (url !== cache.currentUrl) {
    let nextCachedUrl = url;

    if (url && typeof url === "string" && typeof cache.cachedUrl === "string") {
      try {
        const prevUrlObj = new URL(cache.cachedUrl, "http://localhost");
        const newUrlObj = new URL(url, "http://localhost");

        // If the base path is the same, we ignore the new token and keep using the old URL.
        if (prevUrlObj.pathname === newUrlObj.pathname) {
          nextCachedUrl = cache.cachedUrl;
        }
      } catch (e) {
        // fallback if URL parsing fails
        console.debug("useCachedImageUrl: Failed to parse URL", e);
      }
    }

    // Update state during render. React will immediately re-render this component
    // before committing to the DOM, ensuring no flicker occurs.
    setCache({
      currentUrl: url,
      cachedUrl: nextCachedUrl,
    });

    return nextCachedUrl;
  }

  return cache.cachedUrl;
}
