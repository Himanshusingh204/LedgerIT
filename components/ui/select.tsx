"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Context
───────────────────────────────────────────────────────────── */
interface SelectCtx {
  value: string;
  onValueChange: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  triggerId: string;
  listboxId: string;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  registerOption: (value: string) => () => void;
  options: string[];
  disabled: boolean;
}

const SelectContext = createContext<SelectCtx | null>(null);

function useSelect() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("<SelectItem> must be inside <Select>");
  return ctx;
}

/* ─────────────────────────────────────────────────────────────
   <Select> — root, manages open state + value
───────────────────────────────────────────────────────────── */
interface SelectProps {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({ value, onValueChange, children, disabled = false }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [options, setOptions] = useState<string[]>([]);
  const uid = useId();
  const triggerId = `select-trigger-${uid}`;
  const listboxId = `select-listbox-${uid}`;

  const registerOption = useCallback((optValue: string) => {
    setOptions((prev) => {
      if (prev.includes(optValue)) return prev;
      return [...prev, optValue];
    });
    return () => {
      setOptions((prev) => prev.filter((v) => v !== optValue));
    };
  }, []);

  // Close on outside click
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape anywhere
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        triggerId,
        listboxId,
        activeIndex,
        setActiveIndex,
        registerOption,
        options,
        disabled,
      }}
    >
      <div ref={rootRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────
   <SelectTrigger> — the visible button that opens the dropdown
───────────────────────────────────────────────────────────── */
interface SelectTriggerProps {
  id?: string;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}

export function SelectTrigger({
  id,
  className,
  "aria-label": ariaLabel,
  children,
}: SelectTriggerProps) {
  const { open, setOpen, setActiveIndex, triggerId, listboxId, options, value, disabled } =
    useSelect();
  const internalId = id ?? triggerId;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        setOpen(true);
        setActiveIndex(value ? options.indexOf(value) : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        setOpen(true);
        setActiveIndex(options.length - 1);
        break;
    }
  }

  return (
    <button
      type="button"
      id={internalId}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        setOpen(!open);
        if (!open) setActiveIndex(value ? options.indexOf(value) : 0);
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-[var(--radius-control)]",
        "border border-border bg-surface px-3 py-2 text-sm text-foreground",
        "transition-colors hover:border-primary/50 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 flex-none text-foreground-muted transition-transform duration-200",
          open && "rotate-180"
        )}
        aria-hidden="true"
      />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   <SelectValue> — renders selected label or placeholder
───────────────────────────────────────────────────────────── */
interface SelectValueProps {
  placeholder?: string;
}

// We need the option label — items register themselves with the context
// via a separate items-labels map. For simplicity, children of SelectItem
// are text; we derive the displayed label from the matched item's rendered text
// by letting SelectItem expose its label through a registry.
const LabelsContext = createContext<Map<string, string>>(new Map());

export function SelectValue({ placeholder = "Select…" }: SelectValueProps) {
  const { value } = useSelect();
  const labels = useContext(LabelsContext);
  const label = value ? (labels.get(value) ?? value) : null;

  return (
    <span className={cn("flex-1 truncate text-left", !label && "text-foreground-muted")}>
      {label ?? placeholder}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   <SelectContent> — the dropdown listbox
───────────────────────────────────────────────────────────── */
interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
}

export function SelectContent({ className, children }: SelectContentProps) {
  const {
    open,
    setOpen,
    listboxId,
    triggerId,
    activeIndex,
    setActiveIndex,
    options,
    onValueChange,
  } = useSelect();

  const listRef = useRef<HTMLUListElement>(null);
  const [labels, setLabels] = useState<Map<string, string>>(new Map());

  // Register label helper — passed down via context
  const registerLabel = useCallback((value: string, label: string) => {
    setLabels((prev) => {
      if (prev.get(value) === label) return prev;
      const next = new Map(prev);
      next.set(value, label);
      return next;
    });
  }, []);

  // Focus active item when open or activeIndex changes
  useEffect(() => {
    if (!open || !listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLLIElement>("[role='option']");
    const target = items[activeIndex];
    target?.scrollIntoView({ block: "nearest" });
    target?.focus();
  }, [open, activeIndex]);

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(Math.min(activeIndex + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(Math.max(activeIndex - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const val = options[activeIndex];
        if (val !== undefined) {
          onValueChange(val);
          setOpen(false);
          // Return focus to trigger
          document.getElementById(triggerId)?.focus();
        }
        break;
      }
      case "Tab":
        setOpen(false);
        break;
    }
  }

  if (!open) return null;

  return (
    <LabelsContext.Provider value={labels}>
      <LabelRegistryContext.Provider value={registerLabel}>
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          onKeyDown={handleKeyDown}
          className={cn(
            "absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto",
            "rounded-[var(--radius-surface)] border border-border bg-surface",
            "py-1 shadow-lg ring-1 ring-black/5 focus:outline-none",
            className
          )}
        >
          {children}
        </ul>
      </LabelRegistryContext.Provider>
    </LabelsContext.Provider>
  );
}

const LabelRegistryContext = createContext<((value: string, label: string) => void) | null>(null);

/* ─────────────────────────────────────────────────────────────
   <SelectItem> — a single option in the listbox
───────────────────────────────────────────────────────────── */
interface SelectItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function SelectItem({ value, disabled = false, className, children }: SelectItemProps) {
  const {
    value: selected,
    onValueChange,
    setOpen,
    triggerId,
    activeIndex,
    setActiveIndex,
    options,
    registerOption,
  } = useSelect();
  const registerLabel = useContext(LabelRegistryContext);

  const isSelected = selected === value;
  const index = options.indexOf(value);
  const isActive = index === activeIndex;

  // Register this option's value and text label
  useEffect(() => {
    const unregister = registerOption(value);
    return unregister;
  }, [value, registerOption]);

  useEffect(() => {
    if (registerLabel && typeof children === "string") {
      registerLabel(value, children);
    }
  }, [value, children, registerLabel]);

  function handleClick() {
    if (disabled) return;
    onValueChange(value);
    setOpen(false);
    document.getElementById(triggerId)?.focus();
  }

  return (
    <li
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onMouseEnter={() => setActiveIndex(index)}
      className={cn(
        "flex cursor-pointer items-center justify-between px-3 py-2 text-sm outline-none",
        "transition-colors select-none",
        isActive && !disabled && "bg-surface-muted text-foreground",
        isSelected && "font-medium text-primary",
        disabled && "cursor-not-allowed opacity-40",
        !isActive && !isSelected && "text-foreground",
        className
      )}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <Check className="ml-2 h-4 w-4 flex-none text-primary" aria-hidden="true" />
      )}
    </li>
  );
}

/* ─────────────────────────────────────────────────────────────
   <SelectSeparator> — optional visual divider between items
───────────────────────────────────────────────────────────── */
export function SelectSeparator({ className }: { className?: string }) {
  return <li role="separator" className={cn("my-1 h-px bg-border", className)} />;
}
