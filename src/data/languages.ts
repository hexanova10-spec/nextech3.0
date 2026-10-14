import { LanguageInfo } from '../types';

export const INDIAN_LANGUAGES: LanguageInfo[] = [
  { id: 'odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Oriya', popular: true, hasAudioTTS: true },
  { id: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', popular: true, hasAudioTTS: true },
  { id: 'english', name: 'English', nativeName: 'English', script: 'Latin', popular: true, hasAudioTTS: true },
  { id: 'urdu', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', rtl: true, popular: true, hasAudioTTS: true },
  { id: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', popular: true, hasAudioTTS: true },
  { id: 'marathi', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', popular: true, hasAudioTTS: true },
  { id: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', popular: true, hasAudioTTS: true },
  { id: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', popular: true, hasAudioTTS: true },
  { id: 'bengali', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', popular: true, hasAudioTTS: true },
  { id: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', popular: false, hasAudioTTS: true },
  { id: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', popular: false, hasAudioTTS: true },
  { id: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', popular: false, hasAudioTTS: true },
  { id: 'assamese', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese', popular: false, hasAudioTTS: false },
  { id: 'sanskrit', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', popular: false, hasAudioTTS: true },
  { id: 'kashmiri', name: 'Kashmiri', nativeName: 'کٲشُر', script: 'Perso-Arabic', rtl: true, popular: false, hasAudioTTS: false },
  { id: 'konkani', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', popular: false, hasAudioTTS: false },
  { id: 'nepali', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', popular: false, hasAudioTTS: true },
  { id: 'sindhi', name: 'Sindhi', nativeName: 'سنڌي', script: 'Perso-Arabic', rtl: true, popular: false, hasAudioTTS: false },
  { id: 'manipuri', name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meitei Mayek', popular: false, hasAudioTTS: false },
  { id: 'bodo', name: 'Bodo', nativeName: 'बर\'', script: 'Devanagari', popular: false, hasAudioTTS: false },
  { id: 'dogri', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', popular: false, hasAudioTTS: false },
  { id: 'santali', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', popular: false, hasAudioTTS: false },
  { id: 'maithili', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', popular: false, hasAudioTTS: false }
];

export interface KeyboardLayout {
  id: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
  vowels: string[];
  consonants: string[];
  matras: string[];
  numbers: string[];
  special: string[];
}

export const REGIONAL_KEYBOARDS: Record<string, KeyboardLayout> = {
  odia: {
    id: 'odia',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    vowels: ['ଅ', 'ଆ', 'ଇ', 'ଈ', 'ଉ', 'ଊ', 'ଋ', 'ଏ', 'ଐ', 'ଓ', 'ଔ'],
    consonants: [
      'କ', 'ଖ', 'ଗ', 'ଘ', 'ଙ',
      'ଚ', 'ଛ', 'ଜ', 'ଝ', 'ଞ',
      'ଟ', 'ଠ', 'ଡ', 'ଢ', 'ଣ',
      'ତ', 'ଥ', 'ଦ', 'ଧ', 'ନ',
      'ପ', 'ଫ', 'ବ', 'ଭ', 'ମ',
      'ଯ', 'ର', 'ଳ', 'ୱ', 'ଶ',
      'ଷ', 'ସ', 'ହ', 'କ୍ଷ', 'ଜ୍ଞ', 'ୟ', 'ଡ଼', 'ଢ଼'
    ],
    matras: ['ା', 'ି', 'ୀ', 'ୁ', 'ୂ', 'ୃ', 'େ', 'ୈ', 'ୋ', 'ୌ', '୍', 'ଂ', 'ଃ', 'ଁ'],
    numbers: ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'],
    special: ['।', '॥', '?', '!', '(', ')', '+', '=', '%']
  },
  hindi: {
    id: 'hindi',
    name: 'Hindi / Devanagari',
    nativeName: 'हिन्दी',
    vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
    consonants: [
      'क', 'ख', 'ग', 'घ', 'ङ',
      'च', 'छ', 'ज', 'झ', 'ञ',
      'ट', 'ठ', 'ड', 'ढ', 'ण',
      'त', 'थ', 'द', 'ध', 'न',
      'प', 'फ', 'ब', 'भ', 'म',
      'य', 'र', 'ल', 'व', 'श',
      'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'
    ],
    matras: ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', '्', 'ं', 'ः', 'ँ'],
    numbers: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
    special: ['।', '॥', '?', '!', '(', ')', '+', '-', '=']
  },
  urdu: {
    id: 'urdu',
    name: 'Urdu',
    nativeName: 'اردو',
    rtl: true,
    vowels: ['ا', 'آ', 'و', 'ی', 'ے', 'ع'],
    consonants: [
      'ب', 'پ', 'ت', 'ٹ', 'ث',
      'ج', 'چ', 'ح', 'خ', 'د',
      'ڈ', 'ذ', 'ر', 'ڑ', 'ز',
      'ژ', 'س', 'ش', 'ص', 'ض',
      'ط', 'ظ', 'غ', 'ف', 'ق',
      'ک', 'گ', 'ل', 'م', 'ن',
      'ں', 'ہ', 'ھ', 'ء'
    ],
    matras: ['َ', 'ِ', 'ُ', 'ً', 'ٍ', 'ٌ', 'ّ', 'ْ'],
    numbers: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
    special: ['؟', '!', '،', '۔', '(', ')']
  },
  telugu: {
    id: 'telugu',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    vowels: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ'],
    consonants: [
      'క', 'ఖ', 'గ', 'ఘ', 'ఙ',
      'చ', 'ఛ', 'జ', 'ఝ', 'ఞ',
      'ట', 'ఠ', 'డ', 'ఢ', 'ణ',
      'త', 'థ', 'ద', 'ధ', 'న',
      'ప', 'ఫ', 'బ', 'భ', 'మ',
      'య', 'ర', 'ల', 'వ', 'శ',
      'ష', 'స', 'హ', 'ళ', 'క్ష', 'ఱ'
    ],
    matras: ['ా', 'ి', 'ీ', 'ు', 'ూ', 'ృ', 'ె', 'ే', 'ై', 'ొ', 'ో', 'ౌ', '్', 'ం', 'ః'],
    numbers: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'],
    special: ['?', '!', '(', ')', '+', '=']
  },
  bengali: {
    id: 'bengali',
    name: 'Bengali',
    nativeName: 'বাংলা',
    vowels: ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ'],
    consonants: [
      'ক', 'খ', 'গ', 'ঘ', 'ঙ',
      'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
      'ট', 'ঠ', 'ড', 'ঢ', 'ণ',
      'ত', 'থ', 'দ', 'ଧ', 'ন',
      'প', 'ফ', 'ব', 'ভ', 'ম',
      'য', 'র', 'ল', 'শ', 'ষ',
      'স', 'হ', 'ক্ষ', 'ড়', 'ঢ়', 'য়'
    ],
    matras: ['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ', '্', 'ং', 'ঃ', 'ঁ'],
    numbers: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
    special: ['।', '?', '!', '(', ')']
  },
  kannada: {
    id: 'kannada',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    vowels: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ'],
    consonants: [
      'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
      'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ',
      'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
      'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ',
      'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
      'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ',
      'ಷ', 'ಸ', 'ಹ', 'ಳ', 'ಕ್ಷ', 'ಜ್ಞ'
    ],
    matras: ['ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೃ', 'ೆ', 'ೇ', 'ೈ', 'ೊ', 'ೋ', 'ೌ', '್', 'ಂ', 'ಃ'],
    numbers: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
    special: ['?', '!', '(', ')', '+']
  },
  tamil: {
    id: 'tamil',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    vowels: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'],
    consonants: [
      'க', 'ங', 'ச', 'ஞ', 'ட',
      'ண', 'த', 'ந', 'ப', 'ம',
      'ய', 'ர', 'ல', 'வ', 'ழ',
      'ள', 'ற', 'ன', 'ஜ', 'ஷ', 'ஸ', 'ஹ'
    ],
    matras: ['ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ', '்', 'ஃ'],
    numbers: ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'],
    special: ['?', '!', '(', ')']
  },
  marathi: {
    id: 'marathi',
    name: 'Marathi',
    nativeName: 'मराठी',
    vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
    consonants: [
      'क', 'ख', 'ग', 'घ', 'ङ',
      'च', 'छ', 'ज', 'झ', 'ञ',
      'ट', 'ठ', 'ड', 'ढ', 'ण',
      'त', 'थ', 'द', 'ध', 'न',
      'प', 'फ', 'ब', 'भ', 'म',
      'य', 'र', 'ल', 'व', 'श',
      'ष', 'स', 'ह', 'ळ', 'क्ष', 'ज्ञ'
    ],
    matras: ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', '्', 'ं', 'ः'],
    numbers: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
    special: ['।', '॥', '?', '!', '(', ')']
  },
  english: {
    id: 'english',
    name: 'English',
    nativeName: 'English',
    vowels: ['A', 'E', 'I', 'O', 'U', 'a', 'e', 'i', 'o', 'u'],
    consonants: [
      'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z',
      'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'
    ],
    matras: [],
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    special: ['.', ',', '?', '!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '+', '=', '/', ':', ';']
  },
  gujarati: {
    id: 'gujarati',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    vowels: ['અ', 'આ', 'ઇ', 'ઈ', 'ઉ', 'ઊ', 'ઋ', 'એ', 'ઐ', 'ઓ', 'ઔ', 'અં', 'અઃ'],
    consonants: [
      'ક', 'ખ', 'ગ', 'ઘ', 'ઙ',
      'ચ', 'છ', 'જ', 'ઝ', 'ઞ',
      'ટ', 'ઠ', 'ડ', 'ઢ', 'ણ',
      'ત', 'થ', 'દ', 'ધ', 'ન',
      'પ', 'ફ', 'બ', 'ભ', 'મ',
      'ય', 'ર', 'લ', 'વ', 'શ',
      'ષ', 'સ', 'હ', 'ળ', 'ક્ષ', 'જ્ઞ'
    ],
    matras: ['ા', 'િ', 'ી', 'ુ', 'ૂ', 'ૃ', 'ે', 'ૈ', 'ો', 'ૌ', '્', 'ં', 'ઃ'],
    numbers: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'],
    special: ['।', '॥', '?', '!', '(', ')', '+', '-']
  },
  punjabi: {
    id: 'punjabi',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    vowels: ['ਅ', 'ਆ', 'ਇ', 'ਈ', 'ਉ', 'ਊ', 'ਏ', 'ਐ', 'ਓ', 'ਔ'],
    consonants: [
      'ਸ', 'ਹ', 'ਕ', 'ਖ', 'ਗ', 'ਘ', 'ਙ',
      'ਚ', 'ਛ', 'ਜ', 'ਝ', 'ਞ',
      'ਟ', 'ਠ', 'ਡ', 'ਢ', 'ਣ',
      'ਤ', 'ਥ', 'ਦ', 'ਧ', 'ਨ',
      'ਪ', 'ਫ', 'ਬ', 'ਭ', 'ਮ',
      'ਯ', 'ਰ', 'ਲ', 'ਵ', 'ੜ',
      'ਸ਼', 'ਖ਼', 'ਗ਼', 'ਜ਼', 'ਫ਼'
    ],
    matras: ['ਾ', 'ਿ', 'ੀ', 'ੁ', 'ੂ', 'ੇ', 'ੈ', 'ੋ', 'ੌ', '੍', 'ਂ', '਼', 'ੱ'],
    numbers: ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'],
    special: ['।', '॥', '?', '!', '(', ')']
  },
  malayalam: {
    id: 'malayalam',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    vowels: ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'],
    consonants: [
      'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ',
      'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ',
      'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ',
      'ത', 'ഥ', 'ദ', 'ധ', 'ന',
      'പ', 'ഫ', 'ബ', 'ഭ', 'മ',
      'യ', 'ര', 'ല', 'വ', 'ശ',
      'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'
    ],
    matras: ['ാ', 'ി', 'ീ', 'ു', 'ൂ', 'ൃ', 'െ', 'േ', 'ൈ', 'ൊ', 'ോ', 'ൌ', '്', 'ം', 'ഃ'],
    numbers: ['൦', '൧', '൨', '൩', '൪', '൫', '൬', '൭', '൮', '൯'],
    special: ['?', '!', '(', ')', '+', '=']
  }
};

