"use client";

import { useEffect, useState } from "react";
import LandingPageUI from "@/components/LandingPageUI";
import type { HomepageContent } from "@/components/landing/types";

type HomepagePreviewPageProps = {
  initialContent: HomepageContent;
};

type PreviewMessage = {
  content: HomepageContent;
  type: "homepage-preview:update";
};

function isPreviewMessage(value: unknown): value is PreviewMessage {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as PreviewMessage).type === "homepage-preview:update" &&
      typeof (value as PreviewMessage).content === "object",
  );
}

export function HomepagePreviewPage({ initialContent }: HomepagePreviewPageProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !isPreviewMessage(event.data)) {
        return;
      }

      setContent(event.data.content);
    };

    window.addEventListener("message", handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage({ type: "homepage-preview:ready" }, window.location.origin);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <LandingPageUI
      blogPosts={[]}
      content={content}
      ctaExternal={false}
      ctaHref="/login"
      previewMode
    />
  );
}
