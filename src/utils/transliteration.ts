// Transliteration utility for Roman to Odia and Roman to Devanagari (Hindi)

const ODIA_DICTIONARY: Record<string, string> = {
  'namaste': 'ନମସ୍କାର',
  'namaskar': 'ନମସ୍କାର',
  'kemiti': 'କେମିତି',
  'achha': 'ଅଛ',
  'achhi': 'ଅଛି',
  'dhanyabad': 'ଧନ୍ୟବାଦ',
  'odisha': 'ଓଡ଼ିଶା',
  'bijuli': 'ବିଜୁଳି',
  'aloka': 'ଆଲୋକ',
  'pani': 'ପାଣି',
  'bata': 'ବାଟ',
  'pila': 'ପିଲା',
  'school': 'ବିଦ୍ୟାଳୟ',
  'bidyalaya': 'ବିଦ୍ୟାଳୟ',
  'shikshak': 'ଶିକ୍ଷକ',
  'shikshya': 'ଶିକ୍ଷା',
  'pariksha': 'ପରୀକ୍ଷା',
  'ganita': 'ଗଣିତ',
  'bigyana': 'ବିଜ୍ଞାନ',
  'sahitya': 'ସାହିତ୍ୟ',
  'bhugola': 'ଭୂଗୋଳ',
  'itihasa': 'ଇତିହାସ',
  'prasna': 'ପ୍ରଶ୍ନ',
  'uttara': 'ଉତ୍ତର',
  'sutra': 'ସୂତ୍ର',
  'chhabbi': 'ଛବି',
  'manachitra': 'ମାନଚିତ୍ର',
  'pruthibi': 'ପୃଥିବୀ',
  'surjya': 'ସୂର୍ଯ୍ୟ',
  'chandra': 'ଚନ୍ଦ୍ର',
  'taraka': 'ତାରକା',
  'gachha': 'ଗଛ',
  'paban': 'ପବନ',
  'katha': 'କଥା',
  'bahi': 'ବହି',
  'khata': 'ଖାତା',
  'shreni': 'ଶ୍ରେଣୀ',
  'sarala': 'ସରଳ',
  'sahaja': 'ସହଜ',
  'bujhili': 'ବୁଝିଲି',
  'bujha': 'ବୁଝା'
};

const HINDI_DICTIONARY: Record<string, string> = {
  'namaste': 'नमस्ते',
  'namaskar': 'नमस्कार',
  'kaise': 'कैसे',
  'ho': 'हो',
  'dhanyawad': 'धन्यवाद',
  'dhanyabad': 'धन्यवाद',
  'shukriya': 'शुक्रिया',
  'vidyalaya': 'विद्यालय',
  'shiksha': 'शिक्षा',
  'ganit': 'गणित',
  'vigyan': 'विज्ञान',
  'pariksha': 'परीक्षा',
  'prashna': 'प्रश्न',
  'uttar': 'उत्तर',
  'sootra': 'सूत्र',
  'sutra': 'सूत्र',
  'prakash': 'प्रकाश',
  'vidyut': 'विद्युत',
  'suraj': 'सूरज',
  'dharti': 'धरती',
  'chanda': 'चाँद',
  'kitab': 'किताब',
  'koshish': 'कोशिश',
  'samajh': 'समझ',
  'batao': 'बताओ',
  'aasan': 'आसान',
  'kripya': 'कृपया',
  'madad': 'मदद'
};

export function getTransliterationSuggestion(word: string, script: 'odia' | 'hindi'): string | null {
  const clean = word.toLowerCase().trim();
  if (!clean || clean.length < 2) return null;

  if (script === 'odia') {
    if (ODIA_DICTIONARY[clean]) return ODIA_DICTIONARY[clean];
  } else if (script === 'hindi') {
    if (HINDI_DICTIONARY[clean]) return HINDI_DICTIONARY[clean];
  }

  // Phonetic fallback rule engine
  return approximatePhonetic(clean, script);
}

function approximatePhonetic(word: string, script: 'odia' | 'hindi'): string | null {
  // Simple syllable parser
  const odiaMap: Record<string, string> = {
    'k': 'କ', 'kh': 'ଖ', 'g': 'ଗ', 'gh': 'ଘ',
    'ch': 'ଚ', 'chh': 'ଛ', 'j': 'ଜ', 'jh': 'ଝ',
    't': 'ତ', 'th': 'ଥ', 'd': 'ଦ', 'dh': 'ଧ', 'n': 'ନ',
    'p': 'ପ', 'ph': 'ଫ', 'b': 'ବ', 'bh': 'ଭ', 'm': 'ମ',
    'y': 'ଯ', 'r': 'ର', 'l': 'ଳ', 's': 'ସ', 'sh': 'ଶ', 'h': 'ହ',
    'a': 'ଅ', 'aa': 'ଆ', 'i': 'ଇ', 'ee': 'ଈ', 'u': 'ଉ', 'oo': 'ଊ', 'e': 'ଏ', 'o': 'ଓ'
  };

  const hindiMap: Record<string, string> = {
    'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ',
    'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ',
    't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
    'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
    'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व', 's': 'स', 'sh': 'श', 'h': 'ह',
    'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ee': 'ई', 'u': 'उ', 'oo': 'ऊ', 'e': 'ए', 'o': 'ओ'
  };

  const map = script === 'odia' ? odiaMap : hindiMap;
  if (map[word]) return map[word];
  return null;
}
