import { useState } from "react";
import "./CreateEvent.css";
import { useNavigate, useOutletContext } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { addDays } from "date-fns";
import axios from "axios";

const defaultText =
  "Event Description is added here. Edit this to change the description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute iruredolor in reprehenderit in voluptate velit esse cillum dolore eufugiat nulla pariatur. Excepteur sint occaecat.";

const CreateEvent = () => {
  const currentUser = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Event Title",
    description: defaultText,
    date: new Date(),
    category: "",
    image: "",
    host: `${currentUser?._id}`,
  });

  const [bg, setBg] = useState("/assets/auth-bg.png");

  const handleBgChange = (e) => {
    setFormData((prev) => {
      return { ...prev, category: e.target.value };
    });
    switch (e.target.value) {
      case "sports":
        setBg("/assets/event-bg/sports.jpg");
        break;
      case "music":
        setBg("/assets/event-bg/music.jpg");
        break;
      case "technology":
        setBg("/assets/event-bg/technology.jpg");
        break;
      case "social":
        setBg("/assets/event-bg/social.jpg");
        break;
      default:
        setBg("/assets/auth-bg.png");
        break;
    }
  };

  const excludeDates = [
    addDays(new Date("2025-01-21"), 0),
    addDays(new Date("2025-01-22"), 0),
  ];

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!currentUser) {
      navigate("/");
    } else {
      try {
        const response = await axios.post(
          "https://project-event-management.onrender.com/api/v1/users/createEvent",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          }
        );
        console.log(response.data);
        setLoading(false);
        navigate("/");
      } catch (error) {
        console.log(error.response);
      }
    }
  };

  return (
    <div className="outlet">
      <div className="create-event-page">
        <h1>Create a new Event</h1>
        <form className="event-preview" onSubmit={handleSubmit}>
          <img src={bg} alt="" className="event-preview-img" />
          <div className="event-details">
            <div className="name-type">
              <input
                required
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => {
                    return { ...prev, name: e.target.value };
                  });
                }}
              />
              <select
                required
                name="category"
                id="category"
                defaultValue={"category"}
                onChange={handleBgChange}
              >
                <option value="category" disabled>
                  Category
                </option>
                <option value="sports">Sports</option>
                <option value="music">Music</option>
                <option value="technology">Technology</option>
                <option value="social">Social</option>
              </select>
            </div>
            <div className="event-date-container">
              <label htmlFor="event-date">Event Date</label>
              <DatePicker
                required
                dateFormat={moment(formData.date).format("DD/MM/YYYY HH:mm")}
                selected={formData.date}
                showTimeInput
                minDate={new Date()}
                onChange={(date) => {
                  setFormData((prev) => {
                    return { ...prev, date: new Date(date) };
                  });
                }}
                excludeDates={excludeDates}
              />
            </div>
            <div className="event-bg-container form-div">
              <label htmlFor="custom-bg">
                (optional) choose a custom image for Event
              </label>
              <input
                accept="image/*"
                type="file"
                id="custom-bg"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    setBg(URL.createObjectURL(files[0]));
                    setFormData((prev) => {
                      return { ...prev, image: files[0] };
                    });
                  }
                }}
              />
            </div>
            <textarea
              required
              name="description"
              id="description"
              rows={6}
              cols={32}
              defaultValue={defaultText}
              onChange={(e) => {
                setFormData((prev) => {
                  return { ...prev, description: e.target.value };
                });
              }}
            ></textarea>
            {!currentUser && (
              <p>
                You must{" "}
                <a href="/auth/login" className="btn-login">
                  Login
                </a>{" "}
                to create an event
              </p>
            )}
            {currentUser && (
              <button type="submit" disabled={loading}>
                CREATE
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
