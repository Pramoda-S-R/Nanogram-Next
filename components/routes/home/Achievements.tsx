import React from "react";
import { Users, Cake, Cog, GraduationCap } from "lucide-react";

const Achievements = () => {
  const stats = [
    {
      icon: <Cake size={24} />,
      title: "Founded",
      value: 2024,
      color: "bg-primary",
      textcolor: "text-primary-content",
    },
    {
      icon: <Users size={24} />,
      title: "Active Members",
      value: "50+",
      color: "bg-base-100",
      textcolor: "text-base-content",
    },
    {
      icon: <Cog size={24} />,
      title: "Workshops and Events",
      value: "10+",
      color: "bg-primary",
      textcolor: "text-primary-content",
    },
    {
      icon: <GraduationCap size={24} />,
      title: "Students Reached",
      value: "350+",
      color: "bg-base-100",
      textcolor: "text-base-content",
    },
  ];

  return (
    <div className="w-full pt-14">
      <div className="w-full flex flex-col gap-5 text-center">
        <h2 className="text-5xl font-medium mb-4">Achievements</h2>
        <p className="text-lg font-normal text-base-content/70 px-4 mb-10">
          Nanogram - The Tech Hub has been at the forefront of technological
          innovation and education.
          <br />
          We are proud of our accomplishments and the growth of our community.
        </p>
      </div>

      {/* Wrapper for proper spacing */}
      <div className="mb-16">
        <div className="relative">
          <img
            src="/assets/images/gallery_16.jpg"
            alt="Team collaboration"
            className="w-full h-[400px] object-cover grayscale"
          />

          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-4 p-4 transform translate-y-1/2">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className={`${stat.color} ${stat.textcolor} p-6 rounded-lg shadow-lg w-[40%] md:w-48 text-center`}
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
