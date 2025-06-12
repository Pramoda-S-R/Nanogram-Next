import { getNextEvent } from "@/app/actions/api";
import Button from "@/components/client/shared/ui/Button";
import ShiftingCountdown from "@/components/client/ShiftingCountdown";
import Banner from "@/components/server/Banner";
import { CalendarDays, Pin } from "lucide-react";
import React from "react";

const NextEvent = async () => {
  const event = await getNextEvent();

  if (!event) {
    return <Banner />;
  }

  return (
    <>
      {event.date && (
        <ShiftingCountdown
          title={event.registration ? "Register Now!" : "Event Update!"}
          countdownFrom={event.date}
        />
      )}
      <section className="max-w-7xl mx-auto w-full flex lg:flex-row flex-col justify-center gap-5 md:px-10 px-0 ">
        <div className="flex justify-center items-center w-full md:p-0 p-8">
          <img
            src={event.imageUrl || "/assets/images/placeholder.png"}
            alt="Event Teaser"
            className="rounded-xl "
            loading="lazy"
          />
        </div>
        <div className="w-full flex justify-between flex-col p-10 gap-10">
          <div className="flex flex-col w-full gap-5">
            <h1 className="text-3xl font-bold text-base-content">{event?.title}</h1>
            <p className="text-lg text-base-content/70 p-2">{event?.content}</p>
            <div className="text-lg text-base-content/70 font-semibold p-4">
              <div className="flex justify-start items-center gap-2">
                <CalendarDays />{" "}
                {event.date &&
                  `${event.date.toLocaleDateString()} ${event.date.toLocaleTimeString()}`}
              </div>
              <div className="flex justify-start items-center gap-2">
                {event.location && (
                  <>
                    <Pin /> {event.location}
                  </>
                )}
              </div>
            </div>
          </div>
          {event.registration && (
            <Button
              navigateTo={event.registration}
              className={"w-fit btn btn-primary"}
            >
              Register now
            </Button>
          )}
        </div>
      </section>
    </>
  );
};

export default NextEvent;
