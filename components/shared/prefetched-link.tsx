"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PrefetchedLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  prefetchOnMount?: boolean;
};

export function PrefetchedLink({
  children,
  className,
  href,
  prefetchOnMount = true,
}: PrefetchedLinkProps) {
  const router = useRouter();
  const isInternalHref = href.startsWith("/");

  useEffect(() => {
    if (!prefetchOnMount || !isInternalHref) {
      return;
    }

    router.prefetch(href);
  }, [href, isInternalHref, prefetchOnMount, router]);

  if (!isInternalHref) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link
      className={className}
      href={href}
      onMouseEnter={() => router.prefetch(href)}
      onTouchStart={() => router.prefetch(href)}
      prefetch
    >
      {children}
    </Link>
  );
}
