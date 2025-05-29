"use client";

import { ButtonHTMLAttributes, forwardRef, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  navigateTo?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, onClick, navigateTo, ...props }, ref) => {
    const router = useRouter();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e); // Call any custom onClick handler first
      }
      if (!e.defaultPrevented && navigateTo) {
        router.push(navigateTo);
      }
    };

    const classes = clsx(className);

    return (
      <button ref={ref} className={classes} onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
