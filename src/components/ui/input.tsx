import * as React from "react";
import { cn } from "../../lib/utils/utils";
import "../../styles/ui/input.css";

type InputProps = React.ComponentProps<"input">;

function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("base-input", className)}
      {...props}
    />
  );
}

export { Input };
