"use client";

import React, { forwardRef } from "react";
import { Menu } from "lucide-react";

const Hamburger = forwardRef<SVGSVGElement, React.ComponentProps<typeof Menu>>(
  (props, ref) => {

    return (
      <Menu {...props} ref={ref} />
    );
  }
);

Hamburger.displayName = "Hamburger";

export { Hamburger };
