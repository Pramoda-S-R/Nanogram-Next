import React from "react";

const Unique = () => {
  return (
    <section className="w-full flex justify-center items-center">
      <div className="mx-auto max-w-2xl px-6 lg:px-8 grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-7xl lg:grid-cols-2">
        <div>
          <div className="text-base leading-7 lg:mx-w-lg">
            <div className="text-base font-semibold leading-7 text-primary/70">
              Formation of Nanogram
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Who We Are
            </h1>
            <div className="max-w-xl">
              <p className=" mt-6">
                We are a team of researchers, creators, and problem solvers
                focused on bridging the gap between theoretical knowledge and
                practical innovation. Our mission is to transform ideas into
                impactful solutions through collaboration and curiosity.
              </p>
              <p className="mt-6">
                Through projects, workshops, and industry partnerships, we
                create opportunities for skill development and hands-on
                engagement. These initiatives empower individuals to approach
                real-world challenges with creativity and resilience.
              </p>
              <p className="mt-6">
                We are committed to sparking curiosity and inspiring
                groundbreaking solutions to global issues. By combining
                expertise and collaboration, we aim to turn knowledge into
                meaningful change.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:pl-4 flex-center w-full md:mx-4 mx-0">
          <div className="w-full flex overflow-hidden rounded-3xl shadow-2xl lg:max-w-lg z-10">
            <img
              src="/assets/images/gallery_5.jpg"
              alt="img"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Unique;
