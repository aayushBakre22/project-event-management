import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
      default: new Date().setHours(new Date().getHours() + 24),
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      // enum: ["music", "sports", "technology", "social"]
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attendees: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("EVENT", eventSchema);
