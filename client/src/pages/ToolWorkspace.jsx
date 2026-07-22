import React, { useState, useEffect, useRef } from 'react';
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
  FileText,
  RotateCcw,
  Paintbrush
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { AI_TOOLS } from '../components/layout/InnerSidebar';
import { 
  generateArticleApi, 
  generateBlogTitlesApi, 
  generateImageApi, 
  removeBackgroundApi, 
  removeObjectApi 
} from '../services/api';

export default function ToolWorkspace() {
  const { toolId } = useParams();
  const location = useLocation();
  const { user } = useUser();

  const activeTool = AI_TOOLS.find(t => t.id === toolId || t.path === location.pathname) || AI_TOOLS[0];

  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [output, setOutput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Canvas Drawing States for Object Removal Tool
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasMask, setHasMask] = useState(false);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);

  useEffect(() => {
    setPrompt('');
    setSelectedFile(null);
    setFilePreview('');
    setOutput('');
    setImageUrl('');
    setErrorMessage('');
    setIsGenerating(false);
    setIsDownloading(false);
    setHasMask(false);
  }, [activeTool.id]);

  // Render uploaded image onto interactive drawing canvas
  useEffect(() => {
    if (activeTool.id === 'remove-object' && selectedFile && filePreview && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = filePreview;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (!maskCanvasRef.current) {
          maskCanvasRef.current = document.createElement('canvas');
        }
        const maskCanvas = maskCanvasRef.current;
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, img.width, img.height);
        setHasMask(false);
      };
    }
  }, [filePreview, activeTool.id, selectedFile]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (activeTool.id !== 'remove-object') return;
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    drawStroke(x, y, true);
  };

  const draw = (e) => {
    if (!isDrawing || activeTool.id !== 'remove-object') return;
    const { x, y } = getCanvasCoords(e);
    drawStroke(x, y, false);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawStroke = (x, y, isStart) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.65)';

    maskCtx.lineWidth = brushSize;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.strokeStyle = 'white';

    if (isStart) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();

      maskCtx.beginPath();
      maskCtx.moveTo(x, y);
      maskCtx.lineTo(x, y);
      maskCtx.stroke();
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();

      maskCtx.lineTo(x, y);
      maskCtx.stroke();
    }
    setHasMask(true);
  };

  const clearMask = () => {
    if (!canvasRef.current || !selectedFile || !filePreview) return;
    const img = new Image();
    img.src = filePreview;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
      setHasMask(false);
    };
  };

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

  const handleCopy = () => {
    const textToCopy = output || imageUrl;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = async () => {
    if (!imageUrl || isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ashu-ai-${activeTool.id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('CORS blob download fallback:', err.message);
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.download = `ashu-ai-${activeTool.id}.png`;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const inpaintCanvasLocally = (sourceCanvas, maskCanvas) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceCanvas.width;
    tempCanvas.height = sourceCanvas.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(sourceCanvas, 0, 0);

    const maskCtx = maskCanvas.getContext('2d');
    const width = tempCanvas.width;
    const height = tempCanvas.height;

    const imgData = ctx.getImageData(0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height);

    const pixels = imgData.data;
    const maskPixels = maskData.data;

    // 1. Identify mask pixels (1 = painted object to erase, 0 = background)
    const isMasked = new Uint8Array(width * height);
    let maskCount = 0;
    for (let i = 0; i < width * height; i++) {
      if (maskPixels[i * 4] > 128) {
        isMasked[i] = 1;
        maskCount++;
      }
    }

    if (maskCount === 0) return tempCanvas.toDataURL('image/png');

    // Working float buffers for smooth color diffusion
    const workR = new Float32Array(width * height);
    const workG = new Float32Array(width * height);
    const workB = new Float32Array(width * height);
    const known = new Uint8Array(width * height);

    for (let i = 0; i < width * height; i++) {
      const p = i * 4;
      workR[i] = pixels[p];
      workG[i] = pixels[p + 1];
      workB[i] = pixels[p + 2];
      known[i] = isMasked[i] ? 0 : 1;
    }

    // 2. Multi-Pass Inward Heat Diffusion (Fast Marching Boundary Propagation)
    let changed = true;
    let passes = 0;
    const maxPasses = 120;

    while (changed && passes < maxPasses) {
      changed = false;
      passes++;

      const nextR = new Float32Array(workR);
      const nextG = new Float32Array(workG);
      const nextB = new Float32Array(workB);
      const nextKnown = new Uint8Array(known);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (known[idx]) continue;

          let rSum = 0, gSum = 0, bSum = 0, count = 0;

          // Check 8-neighbor box around pixel
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx;
                if (known[nIdx]) {
                  const weight = (dx === 0 || dy === 0) ? 1.0 : 0.707;
                  rSum += workR[nIdx] * weight;
                  gSum += workG[nIdx] * weight;
                  bSum += workB[nIdx] * weight;
                  count += weight;
                }
              }
            }
          }

          if (count > 0) {
            nextR[idx] = rSum / count;
            nextG[idx] = gSum / count;
            nextB[idx] = bSum / count;
            nextKnown[idx] = 1;
            changed = true;
          }
        }
      }

      workR.set(nextR);
      workG.set(nextG);
      workB.set(nextB);
      known.set(nextKnown);
    }

    // 3. Anti-Aliasing Smooth Pass over masked region for seamless edge blending
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (isMasked[idx]) {
          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nIdx = (y + dy) * width + (x + dx);
              rSum += workR[nIdx];
              gSum += workG[nIdx];
              bSum += workB[nIdx];
              count++;
            }
          }
          const p = idx * 4;
          pixels[p] = Math.round(rSum / count);
          pixels[p + 1] = Math.round(gSum / count);
          pixels[p + 2] = Math.round(bSum / count);
          pixels[p + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return tempCanvas.toDataURL('image/png');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage('');
    setOutput('');
    setImageUrl('');

    try {
      if (activeTool.id === 'write-article') {
        const res = await generateArticleApi({ prompt, tone, length, userId: user?.id });
        setOutput(res.result);
      } else if (activeTool.id === 'blog-titles') {
        const res = await generateBlogTitlesApi({ prompt, category, userId: user?.id });
        setOutput(res.result);
      } else if (activeTool.id === 'image-generator') {
        const res = await generateImageApi({ prompt, isPublic: true, userId: user?.id });
        setImageUrl(res.imageUrl);
      } else if (activeTool.id === 'remove-background') {
        if (!selectedFile) throw new Error('Please select an image file to upload.');
        const formData = new FormData();
        formData.append('image', selectedFile);
        if (user?.id) formData.append('userId', user.id);
        const res = await removeBackgroundApi(formData);
        setImageUrl(res.imageUrl);
      } else if (activeTool.id === 'remove-object') {
        if (!selectedFile) throw new Error('Please select an image file to upload.');
        
        let inpaintedDataUrl = '';
        if (canvasRef.current && maskCanvasRef.current && hasMask) {
          inpaintedDataUrl = inpaintCanvasLocally(canvasRef.current, maskCanvasRef.current);
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('objectPrompt', prompt || 'object');
        if (user?.id) formData.append('userId', user.id);
        if (inpaintedDataUrl) {
          formData.append('inpaintedDataUrl', inpaintedDataUrl);
        }
        if (maskCanvasRef.current && hasMask) {
          formData.append('maskDataUrl', maskCanvasRef.current.toDataURL('image/png'));
        }
        const res = await removeObjectApi(formData);
        setImageUrl(inpaintedDataUrl || res.imageUrl);
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

  const ToolIcon = activeTool.icon;
  const isImageTool = ['image-generator', 'remove-background', 'remove-object'].includes(activeTool.id);
  const isFileUploadTool = ['remove-background', 'remove-object'].includes(activeTool.id);

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
            {/* File Upload Slot for Image Tools */}
            {isFileUploadTool && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block flex items-center justify-between">
                  <span>Upload Source File (Image)</span>
                  {selectedFile && activeTool.id === 'remove-object' && (
                    <button
                      type="button"
                      onClick={clearMask}
                      className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Drawing
                    </button>
                  )}
                </label>
                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-zinc-950/60 rounded-xl cursor-pointer transition-colors group">
                  <Upload className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors mb-1" />
                  <span className="text-xs text-zinc-300 font-medium truncate max-w-full">
                    {selectedFile ? selectedFile.name : 'Click to select file'}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">
                    Supports PNG, JPG, WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Interactive Drawing Canvas for Remove Object Tool */}
            {activeTool.id === 'remove-object' && selectedFile && filePreview && (
              <div className="space-y-3 p-3 rounded-xl bg-zinc-950/80 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                    <Paintbrush className="w-3.5 h-3.5" />
                    <span>Paint Over Object to Remove</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {hasMask ? 'Stroke Painted' : 'Draw circle over object'}
                  </span>
                </div>

                {/* Canvas Container */}
                <div className="relative flex justify-center bg-zinc-900 rounded-lg overflow-hidden border border-white/10 max-h-[220px]">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="max-h-[210px] w-auto object-contain cursor-crosshair touch-none"
                  />
                </div>

                {/* Brush Size Slider */}
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1 shrink-0">
                    Brush: {brushSize}px
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={clearMask}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium border border-white/10 shrink-0 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Prompt Input */}
            {(!isFileUploadTool || activeTool.id === 'remove-object' || !selectedFile) && (
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

            {/* Tone & Length Selectors for Articles */}
            {activeTool.id === 'write-article' && (
              <>
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

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 block">Article Length</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Short', label: 'Short (~600w)' },
                      { id: 'Medium', label: 'Medium (~1200w)' },
                      { id: 'Long', label: 'Long (2000+w)' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLength(item.id)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all truncate ${
                          length === item.id
                            ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                            : 'bg-zinc-950/50 text-zinc-400 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
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
        <div className="lg:col-span-7 bg-zinc-900/90 border border-white/10 rounded-2xl p-5 flex flex-col h-[480px] shadow-xl relative overflow-hidden">
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
                <button
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </button>
              )}
            </div>
          </div>

          {/* Output Content Stage - Fixed height with inner scrolling */}
          <div className="flex-1 mt-4 p-4 md:p-5 rounded-xl bg-zinc-950/80 border border-white/5 text-xs text-zinc-200 overflow-y-auto h-[390px] flex flex-col space-y-3">
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
