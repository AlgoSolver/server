const Topic = require("./topic.model");
const Track = require("../track/track.model");

exports.createTopic = async (req, res) => {
  const { trackName, name } = req.body;
  let track;
  try {
    track = await Track.findOne({
      name: trackName,
    });
  } catch (err) {
    console.log("1", err);
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  if (!track) {
    return res.status(400).send({ message: "no track with this id ..." });
  }
  const topic = new Topic({ name });
  try {
    await topic.save();
    track.topics.push(topic._id);
    await track.save();
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }

  return res.status(200).json(topic);
};
exports.topics = async (req, res) => {
  let track;
  try {
    track = await Track.findOne({
      name: req.params.track.toLowerCase(),
    })
      .select("topics")
      .populate("topics");
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  if (!track) {
    return res.status(400).send({ message: "no track with this id ..." });
  }

  return res.status(200).json(track.topics);
};
