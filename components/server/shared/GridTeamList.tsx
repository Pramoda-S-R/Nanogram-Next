import { Nanogram } from "@/types";
import { Github, Instagram, Linkedin } from "lucide-react";
import React from "react";

const GridTeamList = ({ teamMembers }: { teamMembers: Nanogram[] }) => {
  return (
    <ul className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-10">
      {teamMembers.map((member, index) => (
        <li key={index} className="flex flex-col gap-6 xl:flex-row">
          <div className="w-40 h-50 aspect-[4/5] flex-none rounded-2xl object-cover">
            <img
              alt={member.name}
              loading="lazy"
              className="w-40 h-50 aspect-[4/5] flex-none rounded-2xl object-cover"
              src={member.avatarUrl}
            />
          </div>
          <div className="flex-auto">
            <h3 className="text-lg font-semibold leading-8 tracking-tight text-base-content">
              {member.name}
            </h3>
            <p className="text-base leading-7 text-base-content/70">
              {member.role}
            </p>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content hover:text-primary"
                >
                  <Linkedin />
                </a>
              )}
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content hover:text-primary"
                >
                  <Instagram />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content hover:text-primary"
                >
                  <Github />
                </a>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridTeamList;
