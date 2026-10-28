import eventsServices from "../Services/eventsServices";
import { useEffect } from "react";

const EventsPage = () => {

  const fetchEvents = async () => {
    try {
      const events = await eventsServices.getAll();
      console.log(events);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchEvents();
}, [])

  return <>
    <h1>Page des événements</h1>
  </>;
}

export default EventsPage;