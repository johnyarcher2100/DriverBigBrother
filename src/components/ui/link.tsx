import * as React from "react";
import { cn } from "@/lib/utils";

const Link = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => {
  return (
    <a
      className={cn(
        "font-medium text-gray-900 underline-offset-4 hover:underline",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </a>
  );
});
Link.displayName = "Link";

export { Link };
