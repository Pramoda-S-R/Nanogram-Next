import React from "react";

import GridTeamList from "@/components/server/shared/GridTeamList";
import { getCoreMembers } from "@/api";

const Team = async () => {
  const teamMembers = await getCoreMembers();
  return (
    <section className="w-full pt-20" id="team">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h1 className="text-4xl font-extrabold text-neutral">
            Meet Our Team
          </h1>
          <p className="mt-6 text-base font-normal text-neutral/70">
            Our team consists of passionate professionals dedicated to advancing
            technology.
          </p>
        </div>

        <GridTeamList teamMembers={teamMembers} />
      </div>
    </section>
  );
};

export default Team;
