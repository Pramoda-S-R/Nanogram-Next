import React from "react";
import { getAllNewsletters } from "@/app/actions/api";

const Newsletter = async () => {
  const newsletters = await getAllNewsletters();
  return (
    <div>
      Newsletter
      <div className="flex flex-col gap-4">
        {newsletters.map((newsletter) => (
          <div
            key={newsletter._id.toString()}
            className="p-4 border rounded-lg"
          >
            <h2 className="text-xl font-bold">{newsletter.title}</h2>
            <a
              href={newsletter.fileUrl}
              className="text-blue-500 hover:underline"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newsletter;
