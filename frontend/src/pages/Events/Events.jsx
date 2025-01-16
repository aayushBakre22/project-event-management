import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Events.css";
import axios from "axios";
import Event from "../../components/Event/Event";
import { useOutletContext } from "react-router";

const Events = () => {
  const currentUser = useOutletContext();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const getEvents = async () => {
    const response = await axios.post(
      "/api/v1/users/getEvents",
      { categories, date },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.data);
    setEvents(response.data.data);
  };

  useEffect(() => {
    getEvents();
  }, [categories, date]);

  return (
    <>
      <Sidebar
        categories={categories}
        setCategories={setCategories}
        date={date}
        setDate={setDate}
      />
      <div className="outlet">
        <h2>
          {events.length} Event{events.length !== 1 && "s"}
        </h2>
        <div className="events-container">
          {events.map((item) => (
            <Event event={item} key={item._id} currentUser={currentUser} />
          ))}
          {events.map((item) => (
            <Event event={item} key={item._id} currentUser={currentUser} />
          ))}
          {events.map((item) => (
            <Event event={item} key={item._id} currentUser={currentUser} />
          ))}
          {events.map((item) => (
            <Event event={item} key={item._id} currentUser={currentUser} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Events;
