import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createEvent = async (req, res, next) => {
  try {
    const { name, description, category, date, host } = req.body;
    if (host != req.user._id) {
      throw new ApiError(401, `Unauthorized user ${host} : ${req.user._id}`);
    }
    if (!name || !description || !category || !date) {
      throw new ApiError(401, "Missing Details...");
    }
    let image;
    const imageLocalPath = req.files?.image?.[0]?.path;
    if (imageLocalPath) {
      image = await uploadOnCloudinary(imageLocalPath);
      if (!image) {
        throw new ApiError(400, "Could not upload avatar on cloudinary");
      }
    } else {
      switch (category) {
        case "music":
          image = {
            url: "https://res.cloudinary.com/dlsnwre9a/image/upload/v1737017276/music_vwrpug.jpg",
          };
          break;
        case "sports":
          image = {
            url: "https://res.cloudinary.com/dlsnwre9a/image/upload/v1737017277/sports_xfxeeh.jpg",
          };
          break;
        case "technology":
          image = {
            url: "https://res.cloudinary.com/dlsnwre9a/image/upload/v1737017278/technology_h36hik.jpg",
          };
          break;
        case "social":
          image = {
            url: "https://res.cloudinary.com/dlsnwre9a/image/upload/v1737017277/social_fv14gc.jpg",
          };
          break;
        default:
          image = {
            url: "https://res.cloudinary.com/dlsnwre9a/image/upload/v1737017228/auth-bg_tfwh1x.png",
          };
          break;
      }
    }
    const event = await Event.create({
      name,
      description,
      image: image.url,
      date,
      category,
      host,
      attendees: [],
    });
    if (!event) {
      throw new ApiError(500, "Something went wrong while creating the event");
    }
    const user = User.findById(host);
    user.events.push(event._id);
    return res
      .status(201)
      .json(new ApiResponse(200, event, "Event created successfully!"));
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  let { categories, date } = req.body;
  try {
    let events;
    if (
      categories.length === 0 &&
      new Date(date).toISOString().split("T")[0] ==
        new Date().toISOString().split("T")[0]
    ) {
      events = await Event.find({});
    } else {
      // events = await Event.find({
      //   category: { $in: categories },
      //   date: date,
      // });
      events = await Event.find({
        category: { $in: categories },
        $expr: {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Convert the document's date to 'YYYY-MM-DD'
            new Date(date).toISOString().split("T")[0], // Convert the provided date to 'YYYY-MM-DD'
          ],
        },
      });
    }
    if (!events) {
      throw new ApiError(500, "Events cant be fetched");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, events, "Events fetched successfully!"));
  } catch (error) {
    next(error);
  }
};

const updateAttendees = async (eventId, attendee, next) => {
  try {
    const event = await Event.findById(eventId);
    const user = await User.findById(attendee);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }
    if (
      event.attendees.includes(attendee) ||
      user.eventsToAttend.includes(eventId)
    ) {
      event.attendees = event.attendees.filter((item) => item != attendee);
      user.eventsToAttend = user.eventsToAttend.filter(
        (item) => item != eventId
      );
    } else {
      event.attendees = [...event.attendees, attendee];
      user.eventsToAttend.push(eventId);
    }
    await event.save();
    await user.save();
    return event;
  } catch (error) {
    next(error);
  }
};

export { createEvent, getEvents, updateAttendees };
