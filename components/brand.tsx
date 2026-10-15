import Image from "next/image";
import Link from "@/components/navigation-link";

export function Brand({
  inverse = false,
  label,
  href = "#top",
  className = "",
}: {
  inverse?: boolean;
  label: string;
  href?: string;
  className?: string;
}) {
  return (
    <Link className={`brand${inverse ? " brand-inverse" : ""}${className ? ` ${className}` : ""}`} href={href} aria-label={label}>
      <Image
        className="brand-mark"
        src="/brand/a-frame-logo.png"
        alt=""
        aria-hidden="true"
        width={56}
        height={56}
        sizes="(max-width: 767px) 44px, 56px"
        loading="eager"
      />
      <span className="brand-wordmark">a-frame</span>
    </Link>
  );
}
