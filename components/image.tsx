import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string; width?: number | `${number}`; height?: number | `${number}`; fill?: boolean; priority?: boolean; preload?: boolean; quality?: number; unoptimized?: boolean;
};
export default function Image({ fill, priority, preload, quality = 75, unoptimized, style, src, sizes, ...props }: ImageProps) {
  const small = props.width !== undefined && Number(props.width) <= 128;
  const optimized = !unoptimized && !small && /^\/(images|brand)\//.test(src) && !src.endsWith(".svg");
  const widths = [360, 480, 640, 750, 1080, 1440, 1920];
  const imageUrl = (width: number) => `/api/image?${new URLSearchParams({ src, w: String(width), q: String(quality) })}`;
  return <img {...props} src={optimized ? imageUrl(Number(props.width) || 1080) : src}
    srcSet={optimized ? widths.map(width => `${imageUrl(width)} ${width}w`).join(", ") : undefined}
    sizes={sizes || (fill ? "100vw" : props.width ? `${props.width}px` : undefined)}
    loading={priority || preload || small ? "eager" : props.loading || "lazy"} fetchPriority={priority || preload ? "high" : props.fetchPriority}
    decoding="async" style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style} />;
}
