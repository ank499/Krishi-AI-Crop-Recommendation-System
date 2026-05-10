/**
 * Offline / fallback crop recommendation engine.
 * Mirrors the decision logic from the original frontend.
 */

function getFallbackRecommendation(input, lang = 'en') {
  const isHi = lang === 'hi';
  const {
    soil = '', climate = '', fertility = 'Medium', water = 'Medium',
    temp = 28, humidity = 60, rainfall = 800, prevCrop = '',
  } = input;

  const t = parseFloat(temp);
  const r = parseFloat(rainfall);
  const s = soil.toLowerCase();
  const c = climate.toLowerCase();

  let topName, topEmoji, topConf, topWhy, topProfit, topCost, topSeason, alts = [];

  // ─── Rabi / Cold ─────────────────────────────────────────────────────────────
  if (c.includes('rabi') || t < 20) {
    if (s.includes('sandy') || r < 400) {
      topName = isHi ? 'सरसों (Mustard)' : 'Mustard';
      topEmoji = '🌻'; topConf = 84;
      topWhy = isHi
        ? 'रबी मौसम और रेतीली मिट्टी में सरसों सबसे अच्छी फसल है। कम पानी में भी अच्छी पैदावार होती है।'
        : 'Mustard thrives in Rabi season with sandy soil and low rainfall. Excellent oil yield with minimal water needs.';
      topProfit = isHi ? '₹20,000–₹28,000 प्रति एकड़' : '₹20,000–₹28,000 per acre';
      topCost   = isHi ? '₹6,000–₹8,000 प्रति एकड़'  : '₹6,000–₹8,000 per acre';
      topSeason = isHi ? 'अक्टूबर–नवंबर में बुवाई, फरवरी–मार्च में कटाई' : 'Sow Oct–Nov, harvest Feb–Mar (110–120 days)';
      alts = [
        { name: isHi?'गेहूं':'Wheat',   emoji:'🌾', score:79, note: isHi?'रबी की मुख्य फसल, सरकारी समर्थन मूल्य।':'Primary Rabi crop with strong MSP support.' },
        { name: isHi?'चना':'Chickpea',  emoji:'🫘', score:72, note: isHi?'मिट्टी में नाइट्रोजन बढ़ाता है।':'Nitrogen-fixer, drought-tolerant.' },
        { name: isHi?'मसूर':'Lentil',   emoji:'🟤', score:65, note: isHi?'ठंड में अच्छा उगता है।':'Grows well in cold, high daal demand.' },
        { name: isHi?'जौ':'Barley',     emoji:'🌾', score:60, note: isHi?'कम लागत, कम पानी।':'Low input, drought hardy.' },
        { name: isHi?'आलू':'Potato',    emoji:'🥔', score:55, note: isHi?'नकदी फसल के रूप में अच्छा।':'Strong cash value in local markets.' },
        { name: isHi?'मटर':'Pea',       emoji:'🫛', score:50, note: isHi?'जल्दी तैयार होती है।':'Fast-maturing, good vegetable returns.' },
      ];
    } else {
      topName = isHi ? 'गेहूं (Wheat)' : 'Wheat';
      topEmoji = '🌾'; topConf = 90;
      topWhy = isHi
        ? 'रबी मौसम, दोमट मिट्टी और पर्याप्त बारिश गेहूं के लिए आदर्श हैं। यह भारत की सबसे महत्वपूर्ण रबी फसल है।'
        : 'Rabi season, loamy soil and adequate rainfall make these conditions ideal for wheat — India\'s most important Rabi staple.';
      topProfit = isHi ? '₹22,000–₹32,000 प्रति एकड़' : '₹22,000–₹32,000 per acre';
      topCost   = isHi ? '₹8,000–₹11,000 प्रति एकड़'  : '₹8,000–₹11,000 per acre';
      topSeason = isHi ? 'नवंबर में बुवाई, मार्च–अप्रैल में कटाई' : 'Sow Nov, harvest Mar–Apr (120–150 days)';
      alts = [
        { name: isHi?'सरसों':'Mustard',    emoji:'🌻', score:80, note: isHi?'कम पानी में अच्छी तेलहन फसल।':'Good oilseed with low water needs.' },
        { name: isHi?'चना':'Chickpea',     emoji:'🫘', score:72, note: isHi?'नाइट्रोजन स्थिरीकरण।':'Nitrogen-fixer and good market price.' },
        { name: isHi?'मसूर':'Lentil',      emoji:'🟤', score:65, note: isHi?'दाल बाज़ार में अच्छी मांग।':'High demand in pulse markets.' },
        { name: isHi?'आलू':'Potato',       emoji:'🥔', score:60, note: isHi?'ठंड में अच्छा उगता है।':'Cool season, strong cash value.' },
        { name: isHi?'मटर':'Pea',          emoji:'🫛', score:54, note: isHi?'जल्दी तैयार, अच्छा भाव।':'Fast-maturing vegetable market crop.' },
        { name: isHi?'जौ':'Barley',        emoji:'🌾', score:49, note: isHi?'कम लागत वाली अनाज फसल।':'Low-cost cereal, brewing and feed use.' },
      ];
    }
  // ─── Black Soil (Kharif) ──────────────────────────────────────────────────────
  } else if (s.includes('black') || s.includes('काली') || s.includes('regur')) {
    topName = isHi ? 'कपास (Cotton)' : 'Cotton';
    topEmoji = '🌿'; topConf = 88;
    topWhy = isHi
      ? 'काली मिट्टी में कपास की खेती सबसे अधिक उपयुक्त है क्योंकि यह मिट्टी नमी को लंबे समय तक बनाए रखती है। खरीफ मौसम में अच्छी पैदावार होती है।'
      : 'Black (regur) soil is the benchmark medium for cotton — its water retention and nutrient density perfectly match cotton\'s needs during the Kharif season.';
    topProfit = isHi ? '₹25,000–₹40,000 प्रति एकड़' : '₹25,000–₹40,000 per acre';
    topCost   = isHi ? '₹10,000–₹15,000 प्रति एकड़'  : '₹10,000–₹15,000 per acre';
    topSeason = isHi ? 'मई–जून में बुवाई, अक्टूबर–दिसंबर में कटाई' : 'Sow May–Jun, harvest Oct–Dec (150–180 days)';
    alts = [
      { name: isHi?'सोयाबीन':'Soybean',        emoji:'🌿', score:83, note: isHi?'नाइट्रोजन बढ़ाती है।':'Nitrogen-fixer, premium export prices.' },
      { name: isHi?'ज्वार':'Sorghum',           emoji:'🌾', score:74, note: isHi?'सूखे में भी टिकती है।':'Drought-resilient dual-purpose crop.' },
      { name: isHi?'अरहर':'Pigeon Pea',         emoji:'🫘', score:68, note: isHi?'अच्छी पैदावार।':'Good yield, strong daal market.' },
      { name: isHi?'मक्का':'Maize',             emoji:'🌽', score:62, note: isHi?'बहुउद्देशीय फसल।':'Versatile Kharif crop.' },
      { name: isHi?'तिल':'Sesame',              emoji:'🌿', score:56, note: isHi?'तेलहन फसल।':'Premium oilseed prices.' },
      { name: isHi?'हल्दी':'Turmeric',          emoji:'🟡', score:50, note: isHi?'मसाला फसल।':'Premium spice, export demand.' },
    ];
  // ─── Sandy / Arid ─────────────────────────────────────────────────────────────
  } else if (s.includes('sandy') || s.includes('रेत') || r < 500 || t > 35) {
    topName = isHi ? 'बाजरा (Pearl Millet)' : 'Pearl Millet (Bajra)';
    topEmoji = '🌾'; topConf = 86;
    topWhy = isHi
      ? 'रेतीली मिट्टी और कम बारिश में बाजरा सबसे टिकाऊ और लाभदायक फसल है।'
      : 'Bajra is the most resilient crop for sandy soil and low rainfall. It withstands heat and drought while delivering reliable yield.';
    topProfit = isHi ? '₹12,000–₹18,000 प्रति एकड़' : '₹12,000–₹18,000 per acre';
    topCost   = isHi ? '₹4,000–₹6,000 प्रति एकड़'   : '₹4,000–₹6,000 per acre';
    topSeason = isHi ? 'जून–जुलाई में बुवाई, सितंबर–अक्टूबर में कटाई' : 'Sow Jun–Jul, harvest Sep–Oct (70–90 days)';
    alts = [
      { name: isHi?'मूंगफली':'Groundnut',    emoji:'🥜', score:81, note: isHi?'रेतीली मिट्टी में बेहतरीन।':'Sandy loam ideal, premium oil prices.' },
      { name: isHi?'तिल':'Sesame',            emoji:'🌿', score:74, note: isHi?'सूखे में सबसे टिकाऊ।':'Most drought-tolerant oilseed.' },
      { name: isHi?'अरंडी':'Castor',          emoji:'🌿', score:67, note: isHi?'कम उपजाऊ मिट्टी में भी।':'Tolerates poor sandy soil.' },
      { name: isHi?'मोठ बीन':'Moth Bean',     emoji:'🫘', score:61, note: isHi?'बहुत कम पानी में होती है।':'Extremely drought-tolerant pulse.' },
      { name: isHi?'ग्वार':'Guar',            emoji:'🌿', score:55, note: isHi?'अच्छा निर्यात।':'Strong guar gum export market.' },
      { name: isHi?'सूरजमुखी':'Sunflower',    emoji:'🌻', score:49, note: isHi?'अच्छा तेल।':'Moderate drought, good oil yield.' },
    ];
  // ─── High Rainfall / Clay / Alluvial ─────────────────────────────────────────
  } else if (r > 1200 || (s.includes('clay') || s.includes('alluvial') || s.includes('जलोढ़'))) {
    topName = isHi ? 'धान (Rice)' : 'Paddy (Rice)';
    topEmoji = '🌾'; topConf = 89;
    topWhy = isHi
      ? 'आपकी जलोढ़/चिकनी मिट्टी और अधिक वर्षा धान की खेती के लिए आदर्श है।'
      : 'Your high rainfall and clay/alluvial soil perfectly suit paddy. The moisture retention and water availability match rice\'s high demands.';
    topProfit = isHi ? '₹18,000–₹26,000 प्रति एकड़' : '₹18,000–₹26,000 per acre';
    topCost   = isHi ? '₹8,000–₹11,000 प्रति एकड़'  : '₹8,000–₹11,000 per acre';
    topSeason = isHi ? 'जून–जुलाई में रोपाई, नवंबर में कटाई' : 'Transplant Jun–Jul, harvest Nov (120–140 days)';
    alts = [
      { name: isHi?'जूट':'Jute',          emoji:'🌿', score:77, note: isHi?'अधिक नमी में बेहतरीन।':'Thrives in high humidity, fibre export.' },
      { name: isHi?'गन्ना':'Sugarcane',   emoji:'🎋', score:71, note: isHi?'पानी में बहुत फायदेमंद।':'Water-intensive but very profitable.' },
      { name: isHi?'केला':'Banana',       emoji:'🍌', score:65, note: isHi?'साल भर आय।':'Tropical humid, year-round income.' },
      { name: isHi?'अरवी':'Taro',         emoji:'🌿', score:59, note: isHi?'नम मिट्टी में अच्छी।':'Thrives moist, specialty vegetable.' },
      { name: isHi?'अदरक':'Ginger',       emoji:'🟡', score:53, note: isHi?'उच्च नमी में अच्छी।':'Premium spice, high value in humid.' },
      { name: isHi?'हल्दी':'Turmeric',    emoji:'🟡', score:48, note: isHi?'निर्यात मांग अच्छी।':'High-value spice, strong export demand.' },
    ];
  // ─── Default — Moderate conditions ───────────────────────────────────────────
  } else {
    topName = isHi ? 'मक्का (Maize)' : 'Maize';
    topEmoji = '🌽'; topConf = 83;
    topWhy = isHi
      ? 'आपकी दोमट मिट्टी और मध्यम वर्षा में मक्का सबसे संतुलित और लाभदायक फसल है।'
      : 'Maize is the most balanced choice for your loamy soil and moderate rainfall with strong market demand.';
    topProfit = isHi ? '₹16,000–₹24,000 प्रति एकड़' : '₹16,000–₹24,000 per acre';
    topCost   = isHi ? '₹7,000–₹9,000 प्रति एकड़'   : '₹7,000–₹9,000 per acre';
    topSeason = isHi ? 'जून में बुवाई, सितंबर–अक्टूबर में कटाई' : 'Sow Jun, harvest Sep–Oct (90–110 days)';
    alts = [
      { name: isHi?'सोयाबीन':'Soybean',       emoji:'🌿', score:78, note: isHi?'मिट्टी सुधारती है।':'Nitrogen-fixer, excellent market value.' },
      { name: isHi?'अरहर':'Pigeon Pea',        emoji:'🫘', score:72, note: isHi?'कम देखभाल में अच्छी।':'Low-maintenance, drought tolerant.' },
      { name: isHi?'मूंगफली':'Groundnut',      emoji:'🥜', score:65, note: isHi?'तेलहन, अच्छी मांग।':'Dual-purpose food and feed crop.' },
      { name: isHi?'धान':'Rice',               emoji:'🌾', score:60, note: isHi?'पानी पर्याप्त हो तो।':'Viable if water supply is reliable.' },
      { name: isHi?'तिल':'Sesame',             emoji:'🌿', score:54, note: isHi?'कम लागत, अच्छी कीमत।':'Low-cost oilseed, premium prices.' },
      { name: isHi?'प्याज':'Onion',            emoji:'🧅', score:48, note: isHi?'नकदी फसल।':'Volatile but high-reward cash crop.' },
    ];
  }

  // ─── Common steps, insights, risk, marketplace ────────────────────────────────
  const steps = isHi
    ? [
        `${topName} के लिए खेत की अच्छी तरह जुताई करें और पुरानी फसल के अवशेष हटाएं।`,
        'प्रमाणित बीज नजदीकी कृषि केंद्र या KVK से खरीदें।',
        'बुवाई से पहले मिट्टी परीक्षण करवाएं और जरूरत अनुसार खाद डालें।',
        'समय पर सिंचाई करें और खरपतवार नियंत्रण का ध्यान रखें।',
        'कीट-रोग की निगरानी करें और जरूरत पड़ने पर उचित दवाई का प्रयोग करें।',
        'सही समय पर कटाई करें और नजदीकी मंडी में उचित भाव पर बेचें।',
      ]
    : [
        `Plough the field thoroughly and remove all previous crop residues for ${topName}.`,
        'Purchase certified seeds from a nearby agricultural centre or KVK.',
        'Conduct a soil test before sowing and apply recommended fertiliser dosage.',
        'Irrigate on schedule and maintain strict weed control, especially in early growth.',
        'Monitor for pests and diseases regularly; apply appropriate treatment promptly.',
        'Harvest at optimal maturity and sell at the nearest mandi for best price.',
      ];

  const insights = [
    { type: 'green', icon: '✅', title: isHi?'अनुकूल परिस्थिति':'Favourable Condition',
      text: isHi?`आपकी ${soil} मिट्टी और ${climate} मौसम ${topName} के लिए उपयुक्त है।`:`Your ${soil} and ${climate} conditions are well-suited for ${topName} cultivation.` },
    { type: 'yellow', icon: '⚠️', title: isHi?'ध्यान रखें':'Caution',
      text: isHi?'बुवाई के सही समय का ध्यान रखें।':'Timing of sowing is critical — late sowing can reduce yield significantly.' },
    { type: 'blue', icon: '💧', title: isHi?'पानी प्रबंधन':'Water Management',
      text: isHi
        ? (water==='Low'?'ड्रिप सिंचाई अपनाएं।':water==='High'?'जल निकासी की व्यवस्था रखें।':'नियमित सिंचाई करें।')
        : (water==='Low'?'Consider drip irrigation to conserve moisture.':water==='High'?'Ensure drainage channels are in place.':'Irrigate regularly at key growth stages.') },
    { type: 'red', icon: '🌱', title: isHi?'मिट्टी सुधार':'Soil Amendment',
      text: isHi
        ? (fertility==='Low'?'जैविक खाद जरूर डालें।':'जैविक खाद मिलाएं।')
        : (fertility==='Low'?'Apply organic compost before sowing.':'Regularly add organic matter to maintain soil health.') },
  ];

  const riskLevel = (fertility === 'Low' && water === 'Low') ? 'Medium' : 'Low';

  return {
    topCrop: { name: topName, confidence: topConf, emoji: topEmoji, why: topWhy, profit: topProfit, cost: topCost, season: topSeason },
    alternatives: alts,
    steps,
    insights,
    risk: {
      level: riskLevel,
      reason: isHi
        ? (riskLevel==='Medium'?'कम उपजाऊ मिट्टी और पानी की कमी से जोखिम थोड़ा बढ़ता है।':'यह एक सिद्ध फसल है जिसकी बाज़ार में अच्छी मांग है।')
        : (riskLevel==='Medium'?'Low fertility and limited water increase risk slightly. Proper fertilisation and efficient irrigation can mitigate this.':'Proven crop with stable market demand and consistent government support pricing.'),
    },
    marketplace: [
      { item: isHi?`प्रमाणित ${topName} बीज`:`Certified ${topName} Seeds`, use: isHi?'अच्छी पैदावार के लिए':'Essential for uniform germination and high yield', approx_price: '₹80–₹200/kg' },
      { item: isHi?'यूरिया खाद':'Urea Fertiliser', use: isHi?'पौधों की बढ़वार के लिए':'Boosts vegetative growth and chlorophyll', approx_price: '₹270/50kg bag' },
      { item: isHi?'DAP खाद':'DAP Fertiliser', use: isHi?'जड़ विकास के लिए':'Promotes root development and flowering', approx_price: '₹1,350/50kg bag' },
      { item: isHi?'कीटनाशक दवाई':'Recommended Pesticide', use: isHi?'फसल की सुरक्षा':'Protects crop from common pests and diseases', approx_price: '₹350–₹600' },
    ],
  };
}

module.exports = { getFallbackRecommendation };
