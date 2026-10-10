import { useState, type Ref } from "react";
import ArchPlaceholder from "./ArchPlaceholder";

interface AtmosphericImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
  onFail?: () => void;
  imageRef?: Ref<HTMLImageElement>;
}

export default function AtmosphericImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  fetchPriority,
  className,
  onFail,
  imageRef,
}: AtmosphericImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <ArchPlaceholder label={alt} />;
  }

  return (
    <img
      ref={imageRef}
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => {
        setFailed(true);
        onFail?.();
      }}
    />
  );
}
