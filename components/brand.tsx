import Image from "@/components/image";

export function Brand({
  inverse = false,
  className = "",
}: {
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`brand${inverse ? " brand-inverse" : ""}${className ? ` ${className}` : ""}`} role="img" aria-label="a-frame">
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
    </div>
  );
}
