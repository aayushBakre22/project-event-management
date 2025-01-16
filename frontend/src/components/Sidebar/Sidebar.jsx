import { useEffect, useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ categories, setCategories, date, setDate }) => {
  // const [categories, setCategories] = useState([]);
  // const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showCategories, setShowCategories] = useState(false);
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    console.log(new Date(date));
  }, [date]);

  const handleChange = (e) => {
    if (e.target.checked) {
      if (!categories.includes(e.target.value)) {
        setCategories((prev) => {
          return [...prev, e.target.value];
        });
      }
    } else {
      setCategories((prev) => {
        return prev.filter((item) => item !== e.target.value);
      });
    }
  };

  return (
    <div className="sidebar container">
      <h2>Filter by</h2>
      <div className="sidebar-content">
        <div className="sidebar-section container">
          <div
            className="sidebar-section-title"
            onClick={() => {
              setShowCategories((prev) => !prev);
            }}
          >
            <h3>Categories</h3>
            <button>+</button>
          </div>
          <div className="categories">
            <div className={`hidden ${showCategories ? "show" : ""}`}>
              <div>
                <input
                  type="checkbox"
                  name="sports"
                  value="sports"
                  id="sports"
                  onChange={handleChange}
                />
                <label htmlFor="sports">Sports</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="music"
                  value="music"
                  id="music"
                  onChange={handleChange}
                />
                <label htmlFor="music">Music</label>
              </div>
              <div>
                {" "}
                <input
                  type="checkbox"
                  name="technology"
                  value="technology"
                  id="technology"
                  onChange={handleChange}
                />
                <label htmlFor="technology">Technology</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="social"
                  value="social"
                  id="social"
                  onChange={handleChange}
                />
                <label htmlFor="social">Social</label>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-section container">
          <div
            className="sidebar-section-title"
            onClick={() => {
              setShowDate((prev) => !prev);
            }}
          >
            <h3>Date</h3>
            <button>+</button>
          </div>

          <div className="categories">
            <div className={`hidden ${showDate ? "show" : ""}`}>
              <input
                type="date"
                name="date"
                id="sidebar-date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
