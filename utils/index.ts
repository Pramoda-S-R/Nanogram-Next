import type { Point } from "../types";

const MIN_RADIUS = 7.5;
const MAX_RADIUS = 15;
const DEPTH = 2;
const LEFT_COLOR = "8DE3FF";
const RIGHT_COLOR = "FFFFFF";
const NUM_POINTS = 2500;

const getGradientStop = (ratio: number): string => {
  ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

  const c0 = LEFT_COLOR.match(/.{1,2}/g)!.map(
    (oct) => parseInt(oct, 16) * (1 - ratio)
  );
  const c1 = RIGHT_COLOR.match(/.{1,2}/g)!.map(
    (oct) => parseInt(oct, 16) * ratio
  );
  const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
  const color = ci
    .reduce((a, v) => (a << 8) + v, 0)
    .toString(16)
    .padStart(6, "0");

  return `#${color}`;
};

const calculateColor = (x: number): string => {
  const maxDiff = MAX_RADIUS * 2;
  const distance = x + MAX_RADIUS;
  const ratio = distance / maxDiff;
  return getGradientStop(ratio);
};

const randomFromInterval = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const pointsInner: Point[] = Array.from(
  { length: NUM_POINTS },
  (_, k) => k + 1
).map((num) => {
  const randomRadius = randomFromInterval(MIN_RADIUS, MAX_RADIUS);
  const randomAngle = Math.random() * Math.PI * 2;

  const x = Math.cos(randomAngle) * randomRadius;
  const y = Math.sin(randomAngle) * randomRadius;
  const z = randomFromInterval(-DEPTH, DEPTH);

  const color = calculateColor(x);

  return {
    idx: num,
    position: [x, y, z],
    color,
  };
});

export const pointsOuter: Point[] = Array.from(
  { length: NUM_POINTS / 4 },
  (_, k) => k + 1
).map((num) => {
  const randomRadius = randomFromInterval(MIN_RADIUS / 2, MAX_RADIUS * 2);
  const angle = Math.random() * Math.PI * 2;

  const x = Math.cos(angle) * randomRadius;
  const y = Math.sin(angle) * randomRadius;
  const z = randomFromInterval(-DEPTH * 10, DEPTH * 10);

  const color = calculateColor(x);

  return {
    idx: num,
    position: [x, y, z],
    color,
  };
});

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const dateStr = date.toDateString();
  const nowStr = now.toDateString();

  // Time part
  const timeString = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Check Today
  if (dateStr === nowStr) {
    return `Today at ${timeString}`;
  }

  // Check Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (dateStr === yesterday.toDateString()) {
    return `Yesterday at ${timeString}`;
  }

  // Check if same week
  const getStartOfWeek = (d: Date) => {
    const day = d.getDay(); // Sunday = 0, Monday = 1, ...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date(now));
  if (date > startOfWeek) {
    const weekday = date.toLocaleDateString(undefined, { weekday: 'short' }); // "Mon"
    return `Last ${weekday} at ${timeString}`;
  }

  // Else: use Month Day format
  const dateString = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return `${dateString} at ${timeString}`;
}

export function getCurrentSessionIdFromCookie() {
  const match = document.cookie.match(/clerk_active_context=([^;]+)/);
  if (match) {
    const value = decodeURIComponent(match[1]);
    return value.split(':')[0]; // Remove trailing colon if present
  }
  return null;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .replace(/\s+/g, "-");     // Replace spaces with dashes
}
