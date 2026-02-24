"use client";

import { useMemo, useState } from "react";

type Props = {
  images: { id: string; url: string }[];
  name: string;
};

export default function ProductGallery({ images, name }: Props) {
  const first = useMemo(() => images?.[0]?.url ?? "", [images]);
  const [active, setActive] = useState(first);

  return (
    <div className="space-y-3">
      <div className="aspect-16/10 w-full overflow-hidden rounded-md bg-muted flex items-center justify-center">
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-muted-foreground">No image</span>
        )}
      </div>

      {images?.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 10).map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(img.url)}
              className={`aspect-square overflow-hidden rounded-md border bg-muted ${
                active === img.url ? "ring-2 ring-black" : ""
              }`}
              title="Preview"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={name} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}