const express = require('express');
const router = express.Router();
const { getTrend, getPrediction, getAnomalies } = require('../controllers/analytics.controller');

router.get('/trend', getTrend);
router.get('/prediction', getPrediction);
router.get('/anomalies', getAnomalies);

module.exports = router;