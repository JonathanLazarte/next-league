import {
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
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
  const slotRef = useRef<HTMLDivElement>(null);
  const src = children.props.src;

  // 1. Si la imagen ya está en caché al montar, la marcamos como lista de inmediato
  useLayoutEffect(() => {
    const img = slotRef.current?.querySelector("img");
    if (img && img.complete && img.naturalWidth > 0) {
      slotRef.current?.classList.add("is-ready");
    } else {
      slotRef.current?.classList.remove("is-ready");
    }
  }, [src]);

  if (!isValidElement(children)) return null;

  // 2. Cuando cargue de forma asíncrona, añadimos la clase directamente al DOM sin usar useState
  const child = cloneElement(children, {
    onLoad: (event) => {
      slotRef.current?.classList.add("is-ready");
      children.props.onLoad?.(event);
    },
  });

  return (
    <div
      ref={slotRef}
      className={`media-slot ${className}`.trim()}
      data-variant={variant}
    >
      {child}
    </div>
  );
}
