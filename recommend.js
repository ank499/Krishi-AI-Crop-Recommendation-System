/**
 * and returns structured JSON advice for the farmer.
 */

const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { validateRecommendRequest } = require('../middleware/validate');
const { buildPrompt } = require('../services/promptBuilder');
const { getFallbackRecommendation } = require('../services/fallback');
const { sanitizeInput } = require('../utils/sanitize');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * POST /api/recommend
 * Body: { soil, climate, region, fertility, water, temp, humidity, rainfall, fieldSize?, prevCrop?, notes?, lang? }
 * Returns: { topCrop, alternatives, steps, insights, risk, marketplace, rotation? }
 */
router.post('/', validateRecommendRequest, async (req, res, next) => {
  try {
    const input = sanitizeInput(req.body);
    const lang = input.lang === 'hi' ? 'hi' : 'en';

    const prompt = buildPrompt(input, lang);

    let result;
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }],
      });

      const raw = response.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');

      // Robust JSON extraction
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error('No JSON in Claude response');

      result = JSON.parse(raw.slice(start, end + 1));
      result._source = 'ai';
    } catch (aiErr) {
      console.warn('[Krishi] Claude API error, using fallback:', aiErr.message);
      result = getFallbackRecommendation(input, lang);
      result._source = 'fallback';
    }

    res.json({
      success: true,
      lang,
      input: {
        soil: input.soil,
        climate: input.climate,
        region: input.region,
        temp: input.temp,
        humidity: input.humidity,
        rainfall: input.rainfall,
      },
      result,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
