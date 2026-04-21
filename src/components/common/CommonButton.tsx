import { cn } from "../../lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface CommonButtonProps {
  onClick?: () => void;
  label: string;
  variant?: "primary" | "outline" | "blue" | "slate" | "secondary";
  align?: "center" | "left" | "between";
  icon?: LucideIcon;
  showChevron?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const CommonButton = ({
  onClick,
  label,
  variant = "primary",
  align = "center",
  icon: Icon,
  showChevron = false,
  disabled = false,
  fullWidth = true,
  className,
  type = "button",
}: CommonButtonProps) => {
  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200",
    blue: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    slate:
      "bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300",
    outline:
      "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-sm",
  };

  const alignments = {
    center: "justify-center",
    left: "justify-start",
    between: "justify-between",
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "flex items-center px-4 py-4 font-bold text-[17px] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 select-none",
        "rounded-none", // Sharp edges
        fullWidth && "w-full",
        alignments[align],
        variants[variant],
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center space-x-2",
          align === "between" && "flex-1",
        )}
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        <span className="whitespace-nowrap">{label}</span>
      </div>
      {showChevron && (
        <ChevronRight
          className={cn("w-5 h-5 opacity-50", align !== "between" && "ml-auto")}
        />
      )}
    </button>
  );
};

export default CommonButton;
