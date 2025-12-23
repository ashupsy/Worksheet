
import React, { useState, useEffect } from 'react';
import { generateWorksheet } from './services/geminiService';
import { Worksheet, TherapyModality } from './types';
import { MODALITIES } from './constants';
import WorksheetEditor from './components/WorksheetEditor';

const App: React.FC = () => {
  const [selectedModality, setSelectedModality] = useState<TherapyModality>('CBT');
  const [focus, setFocus] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentWorksheet, setCurrentWorksheet] = useState<Worksheet | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!focus.trim()) {
      setError("Please specify a focus for the worksheet (e.g. Anxiety, Self-esteem)");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateWorksheet(selectedModality, focus, context);
      setCurrentWorksheet(generated);
    } catch (err) {
      setError("Failed to generate worksheet. Please check your API key and network connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    setCurrentWorksheet(null);
    setFocus('');
    setContext('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation / Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-file-medical text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">PsycheSheet AI</h1>
              <p className="text-xs text-slate-500">Professional Therapeutic Worksheets</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentWorksheet && (
              <>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-print"></i>
                  Print / Save PDF
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors"
                >
                  New Worksheet
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar / Generator Panel */}
          <aside className={`lg:col-span-4 space-y-6 no-print ${currentWorksheet ? 'hidden lg:block' : 'col-span-12'}`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <i className="fas fa-magic text-indigo-500"></i>
                Generator Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Therapy Modality</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MODALITIES.map((mod) => (
                      <button
                        key={mod.value}
                        onClick={() => setSelectedModality(mod.value)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedModality === mod.value
                            ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <i className={`fas ${mod.icon} block mb-2 text-indigo-600`}></i>
                        <span className="text-xs font-semibold text-slate-700">{mod.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Primary Focus</label>
                  <input
                    type="text"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    placeholder="e.g. Panic Attacks, Perfectionism, OCD"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <p className="mt-1 text-xs text-slate-400">What specific issue should the worksheet address?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Optional Context</label>
                  <textarea
                    rows={3}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. Client is a 30yo professional struggling with work-life balance..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm flex gap-2 items-start">
                    <i className="fas fa-exclamation-circle mt-1"></i>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                    isLoading 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:shadow-indigo-500/25'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Crafting Content...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-wand-sparkles"></i>
                      Generate Worksheet
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-800 text-white p-6 rounded-xl">
              <h3 className="text-md font-bold mb-2">Pro Tips</h3>
              <ul className="text-sm text-slate-400 space-y-3">
                <li className="flex gap-2">
                  <i className="fas fa-check text-emerald-400 mt-1"></i>
                  Be specific with the focus for better tailored exercises.
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check text-emerald-400 mt-1"></i>
                  Everything in the generated form is live-editable.
                </li>
                <li className="flex gap-2">
                  <i className="fas fa-check text-emerald-400 mt-1"></i>
                  Use the "Print" function to save as a professional PDF.
                </li>
              </ul>
            </div>
          </aside>

          {/* Worksheet Preview / Editor */}
          <div className={`lg:col-span-8 ${!currentWorksheet ? 'flex flex-col items-center justify-center py-20 bg-white/50 border-2 border-dashed border-slate-200 rounded-2xl min-h-[400px]' : ''}`}>
            {currentWorksheet ? (
              <WorksheetEditor 
                worksheet={currentWorksheet} 
                onUpdate={setCurrentWorksheet} 
              />
            ) : (
              <div className="text-center px-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <i className="fas fa-file-signature text-4xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">No Worksheet Generated</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Configure your therapy modality and focus on the left, then click generate to create a custom therapeutic form.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center no-print">
        <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
          Created for Therapeutic Professionals &bull; Powered by Gemini AI
        </p>
      </footer>
    </div>
  );
};

export default App;
