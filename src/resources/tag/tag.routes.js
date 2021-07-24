const router = require('express').Router();
const codeControllers = require('./tag.controllers');

router.get('/problems/:tag',codeControllers.problems);
router.get('/articles/:tag',codeControllers.articles);

module.exports = router;