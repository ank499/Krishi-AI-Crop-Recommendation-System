/**
 * POST /api/report/generate
 * Accepts the recommendation result + form data, returns
 * a server-rendered HTML string suitable for PDF/print.
 */

const express = require('express');
const router = express.Router();
const { validateReportRequest } = require('../middleware/validate');
const { renderReportHtml } = require('../services/reportRenderer');

router.post('/generate', validateReportRequest, (req, res, next) => {
  try {
    const { formData, result, lang } = req.body;
    const html = renderReportHtml(formData, result, lang || 'en');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
