const express = require('express');
const router = express.Router();

const CorrectingService = require("../services/correcting.service");

router.get('/:word', (req, res) => {
    res.json({
        corrected: CorrectingService.correct(req.params.word)
    });
});

module.exports = router;