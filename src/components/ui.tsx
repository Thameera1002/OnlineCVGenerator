"use client";

import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400";

export const POLICY_BADGE: Record<string, { text: string; cls: string }> = {
  required: { text: "Required", cls: "bg-red-50 text-red-700 ring-red-200" },
  recommended: { text: "Recommended", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "url" | "month" | "date" | "textarea";
  placeholder?: string;
  hint?: string;
  badge?: string;
  rows?: number;
  disabled?: boolean;
  options?: readonly string[];
  className?: string;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  badge,
  rows = 4,
  disabled,
  options,
  className,
}: FieldProps) {
  const id = useId();
  const b = badge ? POLICY_BADGE[badge] : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-600">
        {label}
        {b ? (
          <span className={`rounded px-1.5 py-px text-[10px] font-semibold ring-1 ${b.cls}`}>{b.text}</span>
        ) : null}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          className={`${inputCls} resize-y`}
          rows={rows}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <>
          <input
            id={id}
            className={inputCls}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            list={options ? `${id}-list` : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
          {options ? (
            <datalist id={`${id}-list`}>
              {options.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          ) : null}
        </>
      )}
      {hint ? <p className="mt-1 text-[11px] leading-snug text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        className="size-4 rounded border-slate-300 accent-blue-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "text-red-600 hover:bg-red-50",
  }[variant];
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 ${styles} ${className}`}
      {...props}
    />
  );
}

export function Card({
  title,
  subtitle,
  defaultOpen,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-slate-200 bg-white shadow-sm open:shadow-md"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 select-none">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        <span className="text-slate-400 transition group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="space-y-4 border-t border-slate-100 px-4 py-4">{children}</div>
    </details>
  );
}
