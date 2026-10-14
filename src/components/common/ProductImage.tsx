"use client";
import React, { useState, useEffect } from "react";

const CF_PRODUCTS_BASE = "https://d1dh0rr5xj2p49.cloudfront.net/products/";
const FALLBACK_WEBP = "https://d1dh0rr5xj2p49.cloudfront.net/products/0_NON_IMAGE_PRODUCTS.webp";

/**
 * Optimized ProductImage component for medingen-app.
 * Supports _thumb.webp variants for thumbnail cards, exact width/height attributes,
 * decoding="async", loading optimizations, and graceful fallback handling.
 */
export interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: any;
  alt?: string;
  isThumb?: boolean;
  width?: number | string;
  height?: number | string;
  loading?: "lazy" | "eager";
  fetchPriority?: "auto" | "high" | "low";
  decoding?: "async" | "auto" | "sync";
  style?: React.CSSProperties;
  className?: string;
  fallbackSrc?: string;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  [key: string]: any;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt = "",
  isThumb = false,
  width,
  height,
  loading = "lazy",
  fetchPriority = "auto",
  decoding = "async",
  style = {},
  className = "",
  fallbackSrc = FALLBACK_WEBP,
  onClick,
  onLoad,
  onError,
  ...rest
}) => {
  const getInitialUrl = () => {
    if (!src) return fallbackSrc;
    let fullUrl = src.startsWith("http") || src.startsWith("/")
      ? src
      : `${CF_PRODUCTS_BASE}${src}`;

    if (isThumb && fullUrl.includes("d1dh0rr5xj2p49.cloudfront.net/products/") && /\.webp$/i.test(fullUrl) && !/_thumb\.webp$/i.test(fullUrl) && !fullUrl.includes("0_NON_IMAGE_PRODUCTS")) {
      return fullUrl.replace(/\.webp$/i, "_thumb.webp");
    }
    return fullUrl;
  };

  const [imgSrc, setImgSrc] = useState(getInitialUrl);
  const [hasThumbFailed, setHasThumbFailed] = useState(false);

  useEffect(() => {
    setImgSrc(getInitialUrl());
    setHasThumbFailed(false);
  }, [src, isThumb]);

  const handleError = (e) => {
    // If thumbnail variant failed, fallback to main .webp image
    if (isThumb && imgSrc.endsWith("_thumb.webp") && !hasThumbFailed) {
      setHasThumbFailed(true);
      const mainUrl = imgSrc.replace(/_thumb\.webp$/, ".webp");
      setImgSrc(mainUrl);
      return;
    }
    // If main image failed, set fallback source
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    if (onError) onError(e);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      className={className}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        ...style,
      }}
      onClick={onClick}
      onLoad={onLoad}
      onError={handleError}
      {...rest}
    />
  );
};

export default ProductImage;

