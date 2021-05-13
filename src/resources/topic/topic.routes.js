const router = require("express").Router();
const topicControllers = require("./topic.controllers");

router.route("").post(topicControllers.createTopic);

router.route("/:track").get(topicControllers.topics);

module.exports = router;
