import Button from "@/components/client/shared/Button";
import ShiftingCountdown from "@/components/client/ShiftingCountdown";
import Banner from "@/components/server/Banner";
import { CalendarDays, Pin } from "lucide-react";
import React from "react";

const NextEvent = () => {
    const event = {
        title: "Next Big Event",
        content: "Join us for an exciting event filled with fun and learning!",
        date: new Date("2025-12-01T10:00:00Z"),
        location: "123 Event Street, City, Country",
        imageUrl: "/assets/images/placeholder.png",
        registration: "https://example.com/register",
    };

  return (
    <>
      {event ? (
        <>
          {event?.date && (
            <ShiftingCountdown
              title={event?.registration ? "Register Now!" : "Event Update!"}
              countdownFrom={event?.date}
            />
          )}
          <section className="w-full flex lg:flex-row flex-col justify-center gap-5 md:px-10 px-0 ">
            <div className="flex justify-center items-center w-full md:p-0 p-8">
              <img
                src={event?.imageUrl || "/assets/images/placeholder.png"}
                alt="Event Teaser"
                className="rounded-xl "
                loading="lazy"
              />
            </div>
            <div className="w-full flex justify-between flex-col p-10 gap-10">
              <div className="flex flex-col w-full gap-5">
                <h1 className="text-3xl font-bold text-neutral">
                  {event?.title}
                </h1>
                <p className="text-lg text-neutral/70 p-2">
                  {event?.content}
                </p>
                <div className="text-lg text-neutral/70 font-semibold p-4">
                  <div className="flex justify-start items-center gap-2">
                    <CalendarDays />{" "}
                    {event?.date &&
                      `${event?.date.toLocaleDateString()} ${event?.date.toLocaleTimeString()}`}
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    {event?.location && (
                      <>
                        <Pin /> {event?.location}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {event?.registration && (
                <Button
                  navigateTo={event?.registration}
                  className={"w-fit btn btn-primary"}
                >
                  Register now
                </Button>
              )}
            </div>
          </section>
        </>
      ) : (
        <Banner />
      )}
    </>
  );
};

export default NextEvent;
