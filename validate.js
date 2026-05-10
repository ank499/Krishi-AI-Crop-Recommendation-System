

const SOIL_TYPES = [
  'Loamy', 'Sandy', 'Clay', 'Black (Regur)', 'Red', 'Alluvial', 'Hill',
  'दोमट', 'रेतीली', 'चिकनी', 'काली', 'लाल', 'जलोढ़', 'पहाड़ी',
];

const CLIMATE_SEASONS = [
  'Kharif', 'Rabi', 'Zaid', 'खरीफ', 'रबी', 'जायद',
  'Kharif (June–October)', 'Rabi (October–March)', 'Zaid (March–June)',
];

const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Uttarakhand', 'Uttar Pradesh',
  'West Bengal', 'Other',
];

const FERTILITY_LEVELS = ['Low', 'Medium', 'High', 'कम', 'मध्यम', 'अधिक'];
const WATER_LEVELS     = ['Low', 'Medium', 'High', 'कम', 'मध्यम', 'पर्याप्त'];
const LANGS            = ['en', 'hi'];

/**
 * Validate /api/recommend request body.
 */
function validateRecommendRequest(req, res, next) {
  const errors = [];
  const { soil, climate, region, temp, humidity, rainfall, fertility, water, fieldSize, lang } = req.body;

  if (!soil || typeof soil !== 'string' || soil.trim().length < 2) {
    errors.push('soil is required (e.g. "Loamy", "Sandy")');
  }
  if (!climate || typeof climate !== 'string' || climate.trim().length < 2) {
    errors.push('climate is required (e.g. "Kharif", "Rabi")');
  }
  if (!region || typeof region !== 'string' || region.trim().length < 2) {
    errors.push('region (state) is required');
  }

  const tempNum = parseFloat(temp);
  if (isNaN(tempNum) || tempNum < -10 || tempNum > 55) {
    errors.push('temp must be a number between -10 and 55 (°C)');
  }

  const humNum = parseFloat(humidity);
  if (isNaN(humNum) || humNum < 0 || humNum > 100) {
    errors.push('humidity must be a number between 0 and 100 (%)');
  }

  const rainNum = parseFloat(rainfall);
  if (isNaN(rainNum) || rainNum < 0 || rainNum > 5000) {
    errors.push('rainfall must be a number between 0 and 5000 (mm)');
  }

  if (fieldSize !== undefined && fieldSize !== '') {
    const fsNum = parseFloat(fieldSize);
    if (isNaN(fsNum) || fsNum <= 0 || fsNum > 10000) {
      errors.push('fieldSize must be a positive number (acres)');
    }
  }

  if (lang && !LANGS.includes(lang)) {
    errors.push(`lang must be one of: ${LANGS.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

/**
 * Validate /api/report/generate request body.
 */
function validateReportRequest(req, res, next) {
  const { formData, result, lang } = req.body;
  const errors = [];

  if (!formData || typeof formData !== 'object') {
    errors.push('formData object is required');
  }
  if (!result || typeof result !== 'object' || !result.topCrop) {
    errors.push('result object with topCrop is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = { validateRecommendRequest, validateReportRequest };
