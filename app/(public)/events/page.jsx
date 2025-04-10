import { EventGallery, Faq, NextEvent, RecentEvent, Upcoming } from "@/components/routes/Events";
import React from "react";

const Events = () => {
  return (
    <div className="h-screen">
      <NextEvent />
      <RecentEvent />
      <Upcoming />
      <EventGallery />
      <Faq />
    </div>
  );
};

export default Events;
