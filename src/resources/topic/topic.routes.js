const router = require("express").Router();
const topicControllers = require("./topic.controllers");
const topicValidator = require("./topic.validator");

router.route("").post(topicValidator.createTopic,topicControllers.createTopic);

router.route("/:track").get(topicControllers.topics);

module.exports = router;
