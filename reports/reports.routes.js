const express = require('express');
const reportsController = require('./reports.controller');
const router = express.Router();

router.route('/').post(reportsController);
