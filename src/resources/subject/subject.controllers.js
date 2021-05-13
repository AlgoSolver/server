const Subject = require("./subject.model");
const Topic = require("../topic/topic.model");

exports.createSubject = async (req, res) => {
  const { topicName, name, description } = req.body;
  let topic;
  try {
    topic = await Topic.findOne({
      name: topicName,
    });
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  if (!topic) {
    return res.status(400).send({ message: "no topic with this id ..." });
  }
  const subject = new Subject({ name, description });
  try {
    await subject.save();
    topic.subjects.push(subject._id);
    await topic.save();
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }

  return res.status(200).json(subject);
};

exports.subjects = async (req, res) => {
  let topic;
  try {
    topic = await Topic.findOne({
      name: req.params.topic,
    })
      .select("subjects")
      .populate("subjects");
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  if (!topic) {
    return res.status(400).send({ message: "no topic with this id ..." });
  }

  return res.status(200).json(topic.subjects);
};
