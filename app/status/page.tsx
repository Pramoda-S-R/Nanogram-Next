"use client";
import { formatDate } from "@/utils";
import { useEffect, useState } from "react";

export default function StatusPage() {
  const [statuses, setStatuses] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch("/api/status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: {
            revalidate: 60, // Revalidate every minute
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch status data");
        }
        const data = await response.json();
        setStatuses(data.statuses);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };
    fetchStatuses();
  }, []);

  return (
    <div>
      <h1>Service Status Dashboard</h1>
      <ul>
        {statuses &&
          statuses.map((s) => (
            <li key={s.service}>
              <strong>{s.service.toUpperCase()}</strong>:{" "}
              <a href={s.link} target="_blank">
                {s.title}
              </a>{" "}
              <em>({formatDate(s.date, "DD/MM/YYYY HH:mm:ss")})</em>
              <em>{s.status}</em>
            </li>
          ))}
      </ul>
    </div>
  );
}
