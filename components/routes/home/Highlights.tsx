import Button from "@/components/client/shared/Button";
import React from "react";

const Highlights = () => {
  return (
    <div className="w-full flex md:flex-row flex-col gap-10 md:px-14 px-10 pb-20">
      <div className="w-full flex -space-x-[12%] justify-center">
        <div className="size-1/3 bg-base-300 rounded-xl shadow-lg -rotate-[30deg]">
          <img
            src="/assets/images/home_1.jpg"
            alt="event-img"
            className="rounded-xl aspect-square object-cover"
          />
        </div>
        <div className="size-1/3 bg-base-300 rounded-xl shadow-lg -rotate-[20deg]">
          <img
            src="/assets/images/home_2.jpg"
            alt="event-img"
            className="rounded-xl aspect-square object-cover"
          />
        </div>
        <div className="size-1/3 bg-base-300 rounded-xl shadow-lg -rotate-[10deg]">
          <img
            src="/assets/images/home_3.jpg"
            alt="event-img"
            className="rounded-xl aspect-square object-cover"
          />
        </div>
        <div className="size-1/3 bg-base-300 rounded-xl shadow-lg -rotate-[0deg]">
          <img
            src="/assets/images/home_4.jpg"
            alt="event-img"
            className="rounded-xl aspect-square object-cover"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-5">
        <h2 className="text-5xl font-medium mb-4">Highlights</h2>
        <p className="text-lg font-normal text-base-content/70 px-4">
          At Nanogram we actively engage in various activities to keep our
          members updated with the latest trends in technology.
        </p>
        <Button className="btn btn-link w-fit no-underline" navigateTo="/events">
          Events at Nanogram
        </Button>
      </div>
    </div>
  );
};

export default Highlights;
