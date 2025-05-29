"use client";

import React from "react";
import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const ShiftingCountdown = ({
  title,
  countdownFrom,
}: {
  title: string;
  countdownFrom: Date;
}) => {
  return (
    <section className="max-w-7xl mx-auto bg-gradient-to-br from-primary to-secondary p-4">
      <div className="w-full flex justify-center items-center">
        <h1 className="text-primary-content text-5xl mb-5 font-bold">{title}</h1>
      </div>
      <div className="mx-auto flex w-full items-center bg-white">
        <CountdownItem unit="Day" text="days" countdownFrom={countdownFrom} />
        <CountdownItem unit="Hour" text="hours" countdownFrom={countdownFrom} />
        <CountdownItem
          unit="Minute"
          text="minutes"
          countdownFrom={countdownFrom}
        />
        <CountdownItem
          unit="Second"
          text="seconds"
          countdownFrom={countdownFrom}
        />
      </div>
    </section>
  );
};

const CountdownItem = ({
  unit,
  text,
  countdownFrom,
}: {
  unit: string;
  text: string;
  countdownFrom: Date;
}) => {
  const { ref, time } = useTimer(unit, countdownFrom);

  return (
    <div className="flex h-24 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-base-100 font-mono md:h-36 md:gap-2">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-2xl font-medium text-neutral md:text-4xl lg:text-6xl xl:text-7xl"
        >
          {time}
        </span>
      </div>
      <span className="text-xs font-light text-neutral/70 md:text-sm lg:text-base">
        {text}
      </span>
    </div>
  );
};

export default ShiftingCountdown;

// NOTE: Framer motion exit animations can be a bit buggy when repeating
// keys and tabbing between windows. Instead of using them, we've opted here
// to build our own custom hook for handling the entrance and exit animations
const useTimer = (unit: string, countdownFrom: Date) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef(0);

  const [time, setTime] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleCountdown = async () => {
    const end = new Date(countdownFrom); // Use the passed countdownFrom
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;

    if (unit === "Day") {
      newTime = Math.floor(distance / DAY);
    } else if (unit === "Hour") {
      newTime = Math.floor((distance % DAY) / HOUR);
    } else if (unit === "Minute") {
      newTime = Math.floor((distance % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((distance % MINUTE) / SECOND);
    }

    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
};
