import ParticleRing from "@/components/client/ParticleRing";
import Button from "@/components/client/shared/ui/Button";
import { ArrowRight, Plus } from "lucide-react";
import { getHeroNanograms } from "@/app/actions/api";

const Hero = async () => {
  const teamMembers = await getHeroNanograms();
  return (
    <section className="max-w-7xl mx-auto w-full h-screen flex flex-col">
      <div className="w-full h-5/6 relative">
        <ParticleRing />
        <div className="absolute top-0 left-0 max-w-full w-full h-full flex flex-col justify-end pointer-events-none md:p-20 p-4">
          <div className="pointer-events-auto">
            <h1 className="font-extrabold md:text-7xl text-4xl text-primary-content mb-4">
              NANOGRAM | THE TECH HUB
            </h1>
            <p className="text-primary-content font-bold text-xl max-w-2xl mb-10">
              Join us in exploring the fascinating world of electronics and
              technology. Discover our activities, events, and resources
              designed for tech enthusiasts.
            </p>
            <div className="w-full flex md:flex-row flex-col gap-5 pointer-events-auto">
              <Button
                className={"btn btn-secondary text-base-content w-fit"}
                navigateTo="/community"
              >
                Join the Community for Free!
              </Button>
              <Button
                className={
                  "w-fit btn btn-link no-underline backdrop-blur-lg group flex items-center gap-1 font-semibold leading-6"
                }
                navigateTo="/about-us#team"
              >
                <p className="text-primary-content group-hover:text-secondary">
                  Meet the Team
                </p>
                <span className="ml-2 pt-1 flex items-center h-4 w-4 transition-transform duration-200 transform group-hover:translate-x-1">
                  <ArrowRight className="text-primary-content group-hover:text-secondary" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex md:flex-row flex-col gap-5 md:justify-start justify-center items-center overflow-hidden py-6 md:px-20 px-0">
        <div className="flex -space-x-6">
          {teamMembers.map((member, index: number) => (
            <div
              key={index}
              className={`size-16 shadow-lg rounded-full bg-accent-gray z-{${
                10 - index
              }}`}
            >
              <img
                src={member.avatarUrl || "/assets/images/placeholder.png"}
                alt="img"
                className="size-16 rounded-full border border-neutral-black/10 object-cover mx-auto"
              />
            </div>
          ))}
          <div className="flex justify-center items-center size-16 shadow-lg rounded-full bg-base-300 z-[2]">
            <Plus />
          </div>
        </div>
        <div className="flex px-10">
          <p className="text-medium font-semibold text-neutral-black/70 text-justify">
            Meet passionate tech enthusiasts like you. Join us in exploring the
            fascinating world of electronics and technology.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
