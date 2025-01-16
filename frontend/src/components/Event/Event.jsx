/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./Event.css";
import { io } from "socket.io-client";
import moment from "moment";

const socket = io("http://localhost:8000");

const Event = ({ event, currentUser }) => {
  const [attendees, setAttendees] = useState(event.attendees);
  useEffect(() => {
    socket.on("attendeesUpdated", (updatedEvent) => {
      if (updatedEvent._id == event._id) {
        console.log("INCOMING!");
        setAttendees(updatedEvent.attendees);
      }
    });

    return () => {
      socket.off("attendeesUpdated");
    };
  }, [event._id]);

  const handleAttend = () => {
    const newAttendee = currentUser._id;
    console.log(newAttendee);
    if (newAttendee) {
      socket.emit("updateAttendees", event._id, newAttendee);
    }
  };

  return (
    <>
      {event && (
        <>
          <div className="event">
            <div className="attendees-count">
              <p>
                <i
                  className="fa-solid fa-user"
                  style={{ color: "black", marginRight: "10px" }}
                ></i>
                {attendees.length}
              </p>
              <img src={event.image} alt="" className="event-img" />
            </div>
            <div className="details">
              <div className="name-type">
                <h2>{event.name}</h2>
              </div>
              <div className="event-date-container">
                <h3>{event.category}</h3>
                <h3>{moment(event.date).format("DD/MM/YYYY HH:mm")}</h3>
              </div>
              <p>{event.description}</p>
            </div>
            <button onClick={handleAttend}>ATTEND</button>
          </div>
        </>
      )}
    </>
  );
};

export default Event;
