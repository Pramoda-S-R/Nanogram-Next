"use client";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "light";
    setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme); // manually apply it
  };

  return (
    <button
      data-toggle-theme="dark,light"
      data-act-class="ACTIVECLASS"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
};

export default ThemeSwitch;
