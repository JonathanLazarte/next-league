"use client";

import {
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type ReactElement,
} from "react";
import "./MediaSlot.css";

type ImageChild = ReactElement<
  ImgHTMLAttributes<HTMLImageElement> & { src?: string }
>;

interface MediaSlotProps {
  children: ImageChild;
  variant?: "portrait" | "icon" | "tile" | "hero";
  className?: string;
}

export default function MediaSlot({
  children,
  variant = "portrait",
  className = "",
}: MediaSlotProps) {
  const src = children.props.src;
  const slotRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const img = slotRef.current?.querySelector("img");
    if (img?.complete && img.naturalWidth > 0) {
      setReady(true);
      return;
    }
    setReady(false);
  }, [src]);

  if (!isValidElement(children)) return null;

  const child = cloneElement(children, {
    onLoad: (event) => {
      setReady(true);
      children.props.onLoad?.(event);
    },
  });

  return (
    <div
      ref={slotRef}
      className={`media-slot ${ready ? "is-ready" : ""} ${className}`.trim()}
      data-variant={variant}
    >
      {child}
    </div>
  );
}
