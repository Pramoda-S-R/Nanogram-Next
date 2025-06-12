import React from "react";
import {
  ContactRound,
  Folder,
  Users,
  Cpu,
  Lightbulb,
  SquareTerminal,
  LucideProps,
} from "lucide-react";

const initiatives = [
  { Icon: ContactRound, label: "Networking" },
  { Icon: Cpu, label: "Workshops" },
  { Icon: SquareTerminal, label: "Hackathons" },
  { Icon: Lightbulb, label: "Innovative Projects" },
  { Icon: Users, label: "Peer Learning" },
  { Icon: Folder, label: "Project-Based Learning" },
  // Add more initiatives here
];

const KeyInitiativeItem = ({
  Icon,
  label,
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-full bg-secondary hover:bg-primary/70 p-4 flex justify-center items-center transition-transform duration-300 hover:scale-110">
        <Icon className="w-8 h-8 text-primary-content" />
      </div>
      <p className="text-lg font-normal mt-4 text-center">{label}</p>
    </div>
  );
};

const Initiatives = () => {
  return (
    <section className="max-w-7xl mx-auto flex-grow p-8 border-none outline-none pb-20">
      <div className="w-full text-center">
        <h1 className="text-5xl font-medium mb-4">Our Key Initiatives</h1>
        <p className="text-lg font-normal text-base-content-black/70">
          Explore the main activities and projects our club is engaged in.
        </p>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-y-12 gap-x-2 px-6 pt-16 justify-items-center">
        {initiatives.map((initiative, index) => (
          <KeyInitiativeItem key={index} {...initiative} />
        ))}
      </div>
    </section>
  );
};

export default Initiatives;
