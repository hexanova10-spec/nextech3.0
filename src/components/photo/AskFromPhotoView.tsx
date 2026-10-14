import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { Camera, Upload, Sparkles, BookOpen, Layers, CheckCircle2, Bookmark, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { offlineStorage } from '../../services/offlineStorage';

interface AskFromPhotoViewProps {
  profile: StudentProfile;
  activeSubject: string;
}

// Convert common AI Markdown/LaTeX output into clean, readable text without showing raw symbols.
const formatPhotoAnswer = (answer: string): string => {
  return answer
    .replace(/\\\\?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\\\?(?:Omega|omega)/g, 'Ω')
    .replace(/\\\\times/g, '×')
    .replace(/\\\\cdot/g, '·')
    .replace(/\\\\(?:text|mathrm)\{([^{}]*)\}/g, '$1')
    .replace(/\\\\(?:left|right)/g, '')
    .replace(/\\\\(?:,|;|!|quad|qquad)/g, ' ')
    .replace(/\$\$?/g, '')
    .replace(/\\\\[()[\]]/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/[{}]/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const AskFromPhotoView: React.FC<AskFromPhotoViewProps> = ({ profile, activeSubject }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [taskQuery, setTaskQuery] = useState('Give a simple answer in easy language');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Sample pre-loaded textbook images for instant testing
  const sampleImages = [
    {
      id: 'circuit',
      name: 'Class 10 Physics: Circuit & Ohm’s Law',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180" fill="%23f8fafc"><rect width="100%" height="100%" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="2"/><text x="20" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23334155">CBSE / BSE Class 10 Physics</text><circle cx="60" cy="90" r="15" fill="%23e0e7ff" stroke="%234f46e5" stroke-width="2"/><text x="56" y="94" font-size="10" font-weight="bold" fill="%234f46e5">V</text><rect x="130" y="80" width="40" height="20" fill="%23dcfce7" stroke="%2316a34a" stroke-width="2"/><text x="138" y="94" font-size="10" font-weight="bold" fill="%2316a34a">6 Ω</text><rect x="190" y="80" width="40" height="20" fill="%23dcfce7" stroke="%2316a34a" stroke-width="2"/><text x="198" y="94" font-size="10" font-weight="bold" fill="%2316a34a">3 Ω</text><line x1="75" y1="90" x2="130" y2="90" stroke="%23334155" stroke-width="2"/><line x1="170" y1="90" x2="190" y2="90" stroke="%23334155" stroke-width="2"/><line x1="230" y1="90" x2="260" y2="90" stroke="%23334155" stroke-width="2"/><text x="30" y="150" font-size="11" fill="%23475569">Q: Find equivalent resistance when connected in parallel.</text></svg>'
    },
    {
      id: 'photosynthesis',
      name: 'Class 9 Biology: Chloroplast Diagram',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180" fill="%23f8fafc"><rect width="100%" height="100%" fill="%23ecfdf5" stroke="%23a7f3d0" stroke-width="2"/><text x="20" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23065f46">Class 9 Biology: Chloroplast</text><ellipse cx="150" cy="100" rx="90" ry="50" fill="%23d1fae5" stroke="%23059669" stroke-width="2"/><circle cx="120" cy="95" r="12" fill="%2310b981"/><circle cx="150" cy="95" r="12" fill="%2310b981"/><circle cx="180" cy="95" r="12" fill="%2310b981"/><text x="50" y="160" font-size="11" fill="%23047857">Label: Thylakoid, Stroma, Granum</text></svg>'
    }
  ];

  // Convert uploads and built-in SVG samples to a compact JPEG accepted by the vision API.
  const normalizeImageForUpload = (dataUrl: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        try {
          const maxDimension = 1800;
          const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Your browser could not prepare this image. Please try another photo.');
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.86));
        } catch (error) { reject(error); }
      };
      image.onerror = () => reject(new Error('This image could not be read. Please choose a JPG or PNG photo.'));
      image.src = dataUrl;
    });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setResult('Please choose an image file (JPG, PNG, or WebP).');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const normalized = await normalizeImageForUpload(String(reader.result || ''));
        setSelectedImage(normalized);
        setResult(null);
      } catch (error) {
        setResult(error instanceof Error ? error.message : 'Could not prepare this image. Please try another photo.');
      }
    };
    reader.onerror = () => setResult('The selected image could not be read. Please try again.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          prompt: taskQuery,
          classNum: profile.classNum,
          subject: activeSubject,
          language: profile.tutorLanguage
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Photo solver failed (HTTP ${res.status})`);
      setResult(data.solution || 'The AI did not return a solution. Please try again.');
    } catch (err) {
      console.warn('Vision solver request failed:', err);
      setResult(`Photo solver unavailable: ${err instanceof Error ? err.message : 'Please check the backend and Gemini configuration, then try again.'}`);

    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToNotes = async () => {
    if (!result) return;
    await offlineStorage.saveNote({
      id: 'photo-note-' + Date.now(),
      title: `Photo Solution: ${taskQuery}`,
      topic: activeSubject,
      content: result,
      subject: activeSubject,
      classNum: profile.classNum,
      createdAt: new Date().toISOString()
    });
    alert('Solution saved to your Offline Notes!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#492873] via-[#6842A6] to-[#7E57C2] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#7E57C2]/15 border border-[#B57EDC]/30 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#B57EDC]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B57EDC]/30 text-[#E6E6FA] border border-[#B57EDC]/40 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            Multimodal Vision Doubt Solver
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ask from Photo (ଫଟୋରୁ ପଚାରନ୍ତୁ)
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
            Upload a photo of your question. PATHSHALA AI will give a short, easy-to-understand answer in <strong>{profile.tutorLanguage}</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Image Upload & Preview */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-600" />
            1. Upload or Select Textbook Image
          </h2>

          {selectedImage ? (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center max-h-64 p-2">
                <img
                  src={selectedImage}
                  alt="Textbook doubt preview"
                  className="max-h-60 object-contain rounded-xl"
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                  }}
                  className="text-rose-600 font-semibold hover:underline"
                >
                  Remove & Choose Another
                </button>
                <span className="text-slate-400">Class {profile.classNum} • {activeSubject}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-2xl p-8 hover:bg-indigo-50/50 cursor-pointer transition text-center space-y-2 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 block">
                    Upload textbook photo or screenshot
                  </span>
                  <span className="text-xs text-slate-500">
                    Supports JPG, PNG, WEBP (Up to 10MB)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Instant sample images */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Or Test with Instant Sample Textbook Photos:
                </span>
                <div className="space-y-2">
                  {sampleImages.map((s) => (
                    <button
                      key={s.id}
                      onClick={async () => {
                        try {
                          setSelectedImage(await normalizeImageForUpload(s.dataUrl));
                          setResult(null);
                        } catch (error) {
                          setResult(error instanceof Error ? error.message : 'Could not prepare this sample image.');
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30 text-left text-xs font-semibold text-slate-700 flex items-center justify-between transition"
                    >
                      <span className="truncate">{s.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Query & Analysis Options */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              2. What do you need help with?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Give a simple answer in easy language',
                'Solve with short steps',
                'Explain this diagram in easy words',
                'Generate 2 practice questions like this',
                'Translate textbook terms to Odia'
              ].map((queryOption) => (
                <button
                  key={queryOption}
                  onClick={() => setTaskQuery(queryOption)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    taskQuery === queryOption
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {queryOption}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Custom Question or Specific Doubt:
              </label>
              <input
                type="text"
                value={taskQuery}
                onChange={(e) => setTaskQuery(e.target.value)}
                placeholder="e.g. Why did we use 1/R formula here?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Agent is analyzing textbook photo in {profile.tutorLanguage}...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Get Simple Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Your Simple Answer
                </h3>
                <span className="text-xs text-slate-500">
                  Target: Class {profile.classNum} • Language: {profile.tutorLanguage}
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveToNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save to Offline Notes
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
            {formatPhotoAnswer(result)}
          </div>
        </div>
      )}
    </div>
  );
};
