

const LANG_INSTRUCTIONS = {
  hi: 'IMPORTANT: Respond with ALL text fields (why, note, steps, insights, risk.reason, marketplace use, rotation soilBenefit) written in simple conversational Hindi (Devanagari script). Only the JSON keys must remain in English.',
  en: 'Respond with all text fields in clear English.',
};

const PROFIT_FORMAT = {
  hi: '₹X,XXX–₹X,XXX प्रति एकड़',
  en: '₹X,XXX–₹X,XXX per acre',
};

const COST_FORMAT = {
  hi: '₹X,XXX प्रति एकड़',
  en: '₹X,XXX per acre',
};

const SEASON_FORMAT = {
  hi: 'बोने का सही समय और अवधि',
  en: 'Best sowing time and crop duration',
};

/**
 * @param {object} input - Sanitised field data
 * @param {'en'|'hi'} lang
 * @returns {string} Full prompt string
 */
function buildPrompt(input, lang = 'en') {
  const isHi = lang === 'hi';
  const { soil, climate, region, fertility, water, temp, humidity, rainfall, fieldSize, prevCrop, notes } = input;

  return `You are an expert agricultural advisor for Indian farmers with deep knowledge of all crop categories.
${LANG_INSTRUCTIONS[lang]}

Field Details:
- Soil Type: ${soil}
- Climate/Season: ${climate}
- Region/State: ${region}
- Soil Fertility: ${fertility}
- Water Availability: ${water}
- Temperature: ${temp}°C
- Humidity: ${humidity}%
- Annual Rainfall: ${rainfall} mm
${fieldSize ? `- Field Size: ${fieldSize} acres` : ''}
${prevCrop ? `- Previous Crop (last season): ${prevCrop}` : ''}
${notes ? `- Special Conditions: ${notes}` : ''}

CRITICAL INSTRUCTIONS:
1. Recommend the BEST crop specifically suited to these conditions — do NOT default to rice unless conditions genuinely suit it.
2. Consider ALL crop categories: cereals (wheat, maize, sorghum, bajra, barley), pulses (chickpea, lentil, moong, arhar), oilseeds (mustard, sunflower, groundnut, sesame), cash crops (sugarcane, cotton, jute), vegetables (onion, potato, tomato, chilli), fruits (mango, banana, papaya), spices (turmeric, ginger, coriander), fodder crops.
3. Soil matching: Black → cotton/soybean/wheat; Sandy → groundnut/bajra/sesame; Clay → rice/sugarcane; Loamy → wheat/maize/vegetables; Red → groundnut/maize/finger millet; Hill → apple/potato/vegetables; Alluvial → wheat/sugarcane/vegetables.
4. Season matching: Kharif → rice/maize/cotton/soybean/groundnut/bajra; Rabi → wheat/mustard/chickpea/lentil/potato; Zaid → cucumber/watermelon/maize/moong.
5. Rainfall matching: <400mm → bajra/sorghum/groundnut/mustard; 400–800mm → wheat/maize/soybean; 800–1500mm → rice/sugarcane/cotton; >1500mm → rice/jute/banana.
6. Temperature matching: <15°C → wheat/barley/mustard/potato; 15–25°C → wheat/maize/vegetables; 25–35°C → rice/cotton/groundnut; >35°C → bajra/sorghum/sesame.
7. Provide EXACTLY 6 alternative crops in the alternatives array.
8. Confidence score should reflect genuine suitability (range 55–96%).

Respond ONLY with a valid JSON object (no markdown, no backticks, no extra text). Structure:
{
  "topCrop": {
    "name": "crop name",
    "confidence": 87,
    "emoji": "🌾",
    "why": "${isHi ? '2 sentences in simple Hindi explaining why this specific crop fits these exact conditions' : '2 sentences explaining why this crop specifically fits the given soil, temperature, rainfall and season'}",
    "profit": "${PROFIT_FORMAT[lang]}",
    "cost": "${COST_FORMAT[lang]}",
    "season": "${SEASON_FORMAT[lang]}"
  },
  "alternatives": [
    { "name": "crop 2", "emoji": "🌿", "score": 76, "note": "${isHi ? 'one sentence in Hindi on suitability' : 'one sentence on suitability'}" },
    { "name": "crop 3", "emoji": "🌱", "score": 70, "note": "..." },
    { "name": "crop 4", "emoji": "🌻", "score": 64, "note": "..." },
    { "name": "crop 5", "emoji": "🥜", "score": 58, "note": "..." },
    { "name": "crop 6", "emoji": "🫘", "score": 53, "note": "..." },
    { "name": "crop 7", "emoji": "🍅", "score": 48, "note": "..." }
  ],
  "steps": [
    "${isHi ? 'Step 1 in Hindi — specific to recommended crop' : 'Step 1 — specific to recommended crop'}",
    "Step 2", "Step 3", "Step 4", "Step 5", "Step 6"
  ],
  "insights": [
    { "type": "green", "icon": "✅", "title": "${isHi ? 'अनुकूल परिस्थिति' : 'Favourable Condition'}", "text": "..." },
    { "type": "yellow", "icon": "⚠️", "title": "${isHi ? 'ध्यान रखें' : 'Caution'}", "text": "..." },
    { "type": "blue", "icon": "💧", "title": "${isHi ? 'पानी प्रबंधन' : 'Water Management'}", "text": "..." },
    { "type": "red", "icon": "🌱", "title": "${isHi ? 'मिट्टी सुधार' : 'Soil Amendment'}", "text": "..." }
  ],
  "risk": { "level": "Low", "reason": "${isHi ? 'reason in simple Hindi' : 'reason in English'}" },
  "marketplace": [
    { "item": "item name", "use": "${isHi ? 'use in Hindi' : 'use'}", "approx_price": "₹XXX" },
    { "item": "...", "use": "...", "approx_price": "₹XXX" },
    { "item": "...", "use": "...", "approx_price": "₹XXX" },
    { "item": "...", "use": "...", "approx_price": "₹XXX" }
  ]${prevCrop ? `,
  "rotation": {
    "suggestions": [
      { "name": "suggested crop 1", "emoji": "🌿", "reason": "${isHi ? 'why this crop should follow in Hindi' : 'why this crop should follow'}" },
      { "name": "suggested crop 2", "emoji": "🌾", "reason": "..." }
    ],
    "soilBenefit": "${isHi ? '2 sentences in Hindi on soil benefits of this rotation' : '2 sentences on how this rotation improves soil health'}"
  }` : ''}
}`;
}

module.exports = { buildPrompt };
