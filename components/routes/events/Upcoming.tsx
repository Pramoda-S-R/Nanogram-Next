import { getUpcomingEvents } from "@/app/actions/api";
import EventCard from "@/components/server/EventCard";
import React from "react";

// Upcoming Component
const Upcoming = async () => {
  const events = await getUpcomingEvents();

  return (
    <>
      {events.length !== 0 ? (
        <section
          className="max-w-7xl mx-auto w-full text-base-content-black py-16 sm:py-10"
          id="new-events"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {events.map((event, index) => {
                const date = new Date(event?.date);
                return (
                  <EventCard
                    key={index}
                    date={date.toDateString()}
                    title={event?.title}
                    description={event?.description}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default Upcoming;
