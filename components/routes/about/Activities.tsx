import React from "react";

const Activities = () => {
  return (
    <section className="w-full mx-auto max-w-7xl py-10 px-4 grid grid-cols-1 items-center md:grid-cols-2">
      <div className="w-full h-auto object-cover aspect-[16/9] md:aspect-[1/1]">
        <img
          alt="Img"
          className="w-full h-auto object-cover aspect-[16/9] md:aspect-[1/1]"
          src="/assets/images/gallery_7.jpg"
        />
      </div>
      <div className="mx-auto max-w-2xl lg:mr-0 lg:max-w-lg p-5">
        <h2 className="text-base font-semibold leading-8  text-info">
          Activities at Nanogram
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
          What We Do
        </p>
        <p className="mt-6 text-lg leading-8 text-base-content/70">
          Nanogram aim to develop tehnical skills and foster innovation
          Workshops & training, Competitions, Project develpoment, Networking,
          Community outreach & Social impact
        </p>
        <dl className="mt-16 grid max-w-xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:mt-16">
          <div className="flex flex-col gap-y-3 border-l border-neutral pl-6">
            <dt className="text-sm leading-6 text-base-content/70">
              <div>Founded</div>
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-base-content">
              <div>2024</div>
            </dd>
          </div>
          <div className="flex flex-col gap-y-3 border-l border-neutral pl-6">
            <dt className="text-sm leading-6 text-base-content/70">
              <div>Active Members</div>
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-base-content">
              <div>50+</div>
            </dd>
          </div>
          <div className="flex flex-col gap-y-3 border-l border-neutral pl-6">
            <dt className="text-sm leading-6 text-base-content/70">
              <div>Workshops and Events</div>
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-base-content">
              <div>10+</div>
            </dd>
          </div>
          <div className="flex flex-col gap-y-3 border-l border-neutral pl-6">
            <dt className="text-sm leading-6 text-base-content/70">
              <div>Students Reached</div>
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-base-content">
              <div>350+</div>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Activities;
