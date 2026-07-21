import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Sliders, 
  Zap, 
  Layers,
  Upload,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { AI_TOOLS } from '../components/layout/InnerSidebar';
import { 
  generateArticleApi, 
  generateBlogTitlesApi, 
  generateImageApi, 
  removeBackgroundApi, 
  removeObjectApi, 
  reviewResumeApi 
} from '../services/api';

export default function ToolWorkspace() {
  const { toolId } = useParams();
  const location = useLocation();

  const activeTool = AI_TOOLS.find(t => t.id === toolId || t.path === location.pathname) || AI_TOOLS[0];

  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [category, setCategory] = useState('General');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setPrompt('');
    setSelectedFile(null);
    setFilePreview('');
    setOutput('');
    setImageUrl('');
    setErrorMessage('');
    setIsGenerating(false);
  }, [activeTool.id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(file.name);
      }
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage('');
    setOutput('');
    setImageUrl('');

    try {
      if (activeTool.id === 'write-article') {
        const res = await generateArticleApi({ prompt, tone, length: 'Medium' });
        setOutput(res.result);
      } else if (activeTool.id === 'blog-titles') {
        const res = await generateBlogTitlesApi({ prompt, category });
        setOutput(res.result);
      } else if (activeTool.id === 'image-generator') {
        const res = await generateImageApi({ prompt, isPublic: true });
        setImageUrl(res.imageUrl);
      } else if (activeTool.id === 'remove-background') {
        if (!selectedFile) throw new Error('Please select an image file to upload.');
        const formData = new FormData();
        formData.append('image', selectedFile);
        const res = await removeBackgroundApi(formData);
        setImageUrl(res.imageUrl);
      } else if (activeTool.id === 'remove-object') {
        if (!selectedFile) throw new Error('Please select an image file to upload.');
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('objectPrompt', prompt || 'object');
        const res = await removeObjectApi(formData);
        setImageUrl(res.imageUrl);
      } else if (activeTool.id === 'resume-review') {
        if (selectedFile) {
          const formData = new FormData();
          formData.append('resume', selectedFile);
          const res = await reviewResumeApi(formData);
          setOutput(res.result);
        } else if (prompt) {
          const res = await reviewResumeApi({ resumeText: prompt });
          setOutput(res.result);
        } else {
          throw new Error('Please upload a PDF resume or paste resume text.');
        }
      }
    } catch (err) {
      console.error('Generation Error:', err);
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setErrorMessage('Network Error: Express backend server is offline on Port 5000. Please start the backend server by running "npm run server" or "npm run dev"!');
      } else {
        setErrorMessage(err.response?.data?.message || err.message || 'Generation failed. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = output || imageUrl;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ToolIcon = activeTool.icon;
  const isImageTool = ['image-generator', 'remove-background', 'remove-object'].includes(activeTool.id);
  const isFileUploadTool = ['remove-background', 'remove-object', 'resume-review'].includes(activeTool.id);

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <ToolIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-100">{activeTool.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-900 text-indigo-400 border border-white/10">
                {activeTool.category}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{activeTool.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Unlimited Free
          </span>
        </div>
      </div>

      {/* Split Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* Left Pane (Options & Input Controls) */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Tool Parameters
            </h2>
            <span className="text-[11px] text-zinc-500 font-mono">Step 1 of 2</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* File Upload Slot for Image/PDF Tools */}
            {isFileUploadTool && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Upload Source File ({activeTool.id === 'resume-review' ? 'PDF Resume' : 'Image'})
                </label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-zinc-950/60 rounded-xl cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400 transition-colors mb-1" />
                  <span className="text-xs text-zinc-300 font-medium truncate max-w-full">
                    {selectedFile ? selectedFile.name : 'Click to select file'}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">
                    {activeTool.id === 'resume-review' ? 'Supports PDF' : 'Supports PNG, JPG, WEBP'}
                  </span>
                  <input
                    type="file"
                    accept={activeTool.id === 'resume-review' ? '.pdf,text/plain' : 'image/*'}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Prompt Input */}
            {(!isFileUploadTool || activeTool.id === 'remove-object' || activeTool.id === 'resume-review' || !selectedFile) && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">
                  {activeTool.id === 'remove-object' ? 'Object to Remove' : 'Prompt / Topic'}
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Enter details for ${activeTool.name}...`}
                  className="w-full p-3 bg-zinc-950/80 border border-white/10 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none"
                />
              </div>
            )}

            {/* Tone Selector for Articles */}
            {activeTool.id === 'write-article' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">Writing Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Professional', 'Creative', 'Casual'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTone(item)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        tone === item
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-zinc-950/50 text-zinc-400 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Selector for Blog Titles */}
            {activeTool.id === 'blog-titles' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">Blog Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950/80 border border-white/10 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Tech">Technology & Dev</option>
                  <option value="Business">Business & SaaS</option>
                  <option value="Lifestyle">Lifestyle & Productivity</option>
                  <option value="Marketing">Marketing & Growth</option>
                </select>
              </div>
            )}

            {/* Error Feedback */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Generate Action Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Result
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Pane (Generated Result Preview) */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-white/10 rounded-2xl p-5 flex flex-col min-h-[440px] shadow-xl relative overflow-hidden">
          {/* Output Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold text-zinc-200">Generated Result</h2>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!output && !imageUrl}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              {imageUrl && (
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              )}
            </div>
          </div>

          {/* Output Content Stage */}
          <div className="flex-1 mt-4 p-4 rounded-xl bg-zinc-950/80 border border-white/5 text-xs text-zinc-200 overflow-y-auto min-h-[320px] flex flex-col">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 text-zinc-500 py-16 flex-1">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-xs font-medium animate-pulse text-zinc-300">Processing multi-modal AI generation...</p>
              </div>
            ) : imageUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3 p-2">
                <img
                  src={imageUrl}
                  alt="Generated Result"
                  className="max-h-[380px] w-auto rounded-xl border border-white/10 shadow-2xl object-contain"
                />
                <span className="text-[11px] text-zinc-400 font-mono">Cloudinary Render Link Active</span>
              </div>
            ) : output ? (
              <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-2 font-sans">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-2 text-zinc-600 py-16 flex-1">
                <Layers className="w-10 h-10 stroke-1" />
                <p className="text-xs">No result generated yet. Configure parameters and click Generate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
