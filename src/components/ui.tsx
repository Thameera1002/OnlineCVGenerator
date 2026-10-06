"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { IconName } from "@/lib/icons";

/* ------------------------------------------------------------------ */
/* Icon                                                                */
/* ------------------------------------------------------------------ */

export function Icon({
  name,
  filled,
  className = "",
  size = 24,
}: {
  name: IconName;
  filled?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    // translate="no": Google Translate must not rewrite the ligature names
    <span
      aria-hidden
      translate="no"
      className={`material-symbols-rounded notranslate shrink-0 ${filled ? "icon-filled" : ""} ${className}`}
      style={{ fontSize: size, width: size, height: size }}
    >
      {name}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

export const POLICY_BADGE: Record<string, { text: string; cls: string }> = {
  required: { text: "Required", cls: "bg-error-container text-on-error-container" },
  recommended: { text: "Recommended", cls: "bg-success-container text-on-success-container" },
};

export function PolicyBadge({ policy }: { policy?: string }) {
  const b = policy ? POLICY_BADGE[policy] : undefined;
  if (!b) return null;
  return (
    <span className={`rounded-full px-2 py-px text-[10px] leading-4 font-medium tracking-wide ${b.cls}`}>
      {b.text}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Text field (Material 3 "filled" style)                              */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full bg-transparent px-4 pt-0.5 pb-2 text-base text-on-surface outline-none placeholder:text-on-surface-variant/55 disabled:cursor-not-allowed sm:text-sm";

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
  return (
    <div className={className}>
      <div
        className="group relative overflow-hidden rounded-t-md border-b border-on-surface-variant bg-surface-container-highest transition-colors hover:border-on-surface has-disabled:border-on-surface/30 has-disabled:opacity-70"
      >
        <label
          htmlFor={id}
          className="flex items-center gap-2 px-4 pt-2 text-xs text-on-surface-variant group-focus-within:text-primary group-has-disabled:text-on-surface/40"
        >
          {label}
          <PolicyBadge policy={badge} />
        </label>
        {type === "textarea" ? (
          <textarea
            id={id}
            className={`${inputCls} block resize-y leading-relaxed`}
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
              className={`${inputCls} disabled:text-on-surface/40`}
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
        {/* Active indicator */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-primary transition-transform duration-200 group-focus-within:scale-x-100"
        />
      </div>
      {hint ? <p className="px-4 pt-1 text-xs leading-snug text-on-surface-variant">{hint}</p> : null}
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
    <label className="-ml-2 inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-3 pl-2 text-sm text-on-surface transition-colors hover:bg-on-surface/[0.08]">
      <input
        type="checkbox"
        className="size-[18px] cursor-pointer accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

export type ButtonVariant = "filled" | "tonal" | "outlined" | "text" | "danger";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  filled: "bg-primary text-on-primary hover:shadow-elevation-1 hover:brightness-110",
  tonal: "bg-secondary-container text-on-secondary-container hover:shadow-elevation-1 hover:brightness-95",
  outlined: "text-primary ring-1 ring-outline ring-inset hover:bg-primary/[0.08]",
  text: "text-primary hover:bg-primary/[0.08]",
  danger: "text-error hover:bg-error/[0.08]",
};

export function Button({
  variant = "outlined",
  icon,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; icon?: IconName }) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium tracking-[0.01em] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${
        icon ? "pr-6 pl-4" : "px-6"
      } ${BUTTON_STYLES[variant]} ${className}`}
      {...props}
    >
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface-variant/[0.08] focus-visible:outline-2 focus-visible:outline-primary active:bg-on-surface-variant/[0.12] disabled:pointer-events-none disabled:opacity-30 ${className}`}
      {...props}
    >
      <Icon name={icon} size={22} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs (Material 3 primary tabs, scrollable)                          */
/* ------------------------------------------------------------------ */

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: IconName;
  /** Small count shown next to the label. */
  badge?: number | string;
  badgeTone?: "neutral" | "error";
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  className = "",
  idPrefix,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
  /** Tabs get `${idPrefix}-tab-${id}`, panels should use `${idPrefix}-panel-${id}`. */
  idPrefix: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the active tab visible in a scrolled tab row.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-tab="${value}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [value]);

  const onKeyDown = (e: KeyboardEvent) => {
    const i = items.findIndex((t) => t.id === value);
    const next =
      e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : null;
    if (next == null) return;
    e.preventDefault();
    const target = items[(next + items.length) % items.length];
    onChange(target.id);
    listRef.current?.querySelector<HTMLElement>(`[data-tab="${target.id}"]`)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`no-scrollbar flex overflow-x-auto border-b border-outline-variant ${className}`}
    >
      {items.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${t.id}`}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            data-tab={t.id}
            onClick={() => onChange(t.id)}
            className={`group relative flex h-12 shrink-0 items-center justify-center gap-2 px-4 text-sm font-medium whitespace-nowrap transition-colors hover:bg-on-surface/[0.06] focus-visible:bg-on-surface/[0.10] focus-visible:outline-none ${
              active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.icon ? <Icon name={t.icon} filled={active} size={20} /> : null}
            {t.label}
            {t.badge != null && t.badge !== 0 && t.badge !== "" ? (
              <span
                className={`min-w-5 rounded-full px-1.5 text-center text-[11px] leading-5 font-semibold ${
                  t.badgeTone === "error"
                    ? "bg-error text-on-error"
                    : active
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {t.badge}
              </span>
            ) : null}
            <span
              aria-hidden
              className={`absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-primary transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented buttons                                                   */
/* ------------------------------------------------------------------ */

export function SegmentedButtons<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: { id: T; label: string; title?: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex h-10 overflow-hidden rounded-full ring-1 ring-outline ring-inset">
      {items.map((t, i) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={t.title}
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-1.5 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
              i > 0 ? "border-l border-outline" : ""
            } ${
              active
                ? "bg-secondary-container text-on-secondary-container"
                : "text-on-surface hover:bg-on-surface/[0.08]"
            }`}
          >
            {active ? <Icon name="check" size={18} /> : null}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overflow menu                                                       */
/* ------------------------------------------------------------------ */

export interface MenuItem {
  label: string;
  icon: IconName;
  onSelect: () => void;
  danger?: boolean;
  hint?: string;
}

export function OverflowMenu({ items, label }: { items: MenuItem[]; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <IconButton
        icon="more_vert"
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      />
      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-40 mt-1 min-w-56 rounded-xl bg-surface-container py-2 shadow-elevation-2"
        >
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              title={it.hint}
              onClick={() => {
                setOpen(false);
                it.onSelect();
              }}
              className={`flex h-12 w-full items-center gap-3 px-4 text-left text-sm transition-colors hover:bg-on-surface/[0.08] focus-visible:bg-on-surface/[0.12] focus-visible:outline-none ${
                it.danger ? "text-error" : "text-on-surface"
              }`}
            >
              <Icon name={it.icon} size={20} className={it.danger ? "" : "text-on-surface-variant"} />
              {it.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className = "",
  variant = "filled",
}: {
  children: ReactNode;
  className?: string;
  variant?: "filled" | "outlined" | "elevated";
}) {
  const styles = {
    filled: "bg-surface-container-low",
    outlined: "bg-surface ring-1 ring-outline-variant",
    elevated: "bg-surface-container-low shadow-elevation-1",
  }[variant];
  return <div className={`rounded-2xl ${styles} ${className}`}>{children}</div>;
}
