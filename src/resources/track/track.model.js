const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    img_url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    topics: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Topic",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Track", trackSchema);
