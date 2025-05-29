import EventCard from "@/components/server/EventCard";
import React from "react";

// Upcoming Component
const Upcoming = () => {
  const events = {
    documents: [
      {
        date: "2023-11-01T10:00:00Z",
        title: "Tech Conference 2023",
        description: "Join us for the annual tech conference.",
      },
      {
        date: "2023-12-05T12:00:00Z",
        title: "Holiday Meetup",
        description: "Celebrate the holidays with our community.",
      },
    ],
  };

  return (
    <>
      {events?.documents.length !== 0 ? (
        <section
          className="w-full text-neutral-black py-16 sm:py-10"
          id="new-events"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {events?.documents.map((event, index) => {
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
