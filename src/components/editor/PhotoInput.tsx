/* eslint-disable @next/next/no-img-element -- local data URL preview */
"use client";

import { useRef, useState } from "react";
import { Button, Icon } from "../ui";

const W = 300;
const H = 360;

/** Crop to a 5:6 portrait and compress so the photo stays small in localStorage. */
function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      const scale = Math.max(W / img.width, H / img.height);
      const sw = W / scale;
      const sh = H / scale;
      ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, W, H);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    img.src = url;
  });
}

export function PhotoInput({
  value,
  onChange,
  note,
}: {
  value: string;
  onChange: (v: string) => void;
  note?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-container-highest text-on-surface-variant">
        {value ? <img src={value} alt="Your photo" className="h-full w-full object-cover" /> : <Icon name="photo_camera" size={28} />}
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button variant="tonal" icon="photo_camera" onClick={() => inputRef.current?.click()}>{value ? "Change photo" : "Upload photo"}</Button>
          {value ? (
            <Button variant="danger" onClick={() => onChange("")}>
              Remove
            </Button>
          ) : null}
        </div>
        {note ? <p className="text-xs text-on-surface-variant">{note}</p> : null}
        {error ? <p className="text-xs text-error">{error}</p> : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              setError("");
              onChange(await resizePhoto(file));
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            }
          }}
        />
      </div>
    </div>
  );
}
