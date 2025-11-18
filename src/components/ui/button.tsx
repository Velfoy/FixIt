import * as React from "react";
import { cn } from "../../lib/utils/utils";
import "../../styles/ui/button.css";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn("btn", `btn--${variant}`, `btn--${size}`, className)}
      {...props}
    />
  );
}

export { Button };
