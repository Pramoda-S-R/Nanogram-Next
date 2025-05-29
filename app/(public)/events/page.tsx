import { EventGallery, Faq, NextEvent, RecentEvent, Upcoming } from '@/components/routes/events'
import React from 'react'

const Events = () => {
  return (
    <>
    <NextEvent />
    <RecentEvent />
    <Upcoming />
    <EventGallery />
    <Faq />
    </>
  )
}

export default Events
