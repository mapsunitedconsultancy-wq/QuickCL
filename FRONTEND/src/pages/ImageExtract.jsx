import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractImage } from '../api';
import {
  Loader2,
  Zap,
  AlertCircle,
  Image as ImageIcon,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  X,
  Clock,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageExtract() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentPlan = (user?.plan || 'demo').toLowerCase();
  const extractionsUsed = user?.extractionsUsed || 0;

  let planLimit = 40;
  if (currentPlan === 'pro') {
    planLimit = 120;
  } else if (currentPlan === 'enterprise') {
    planLimit = Infinity;
  }

  const isLimitReached = extractionsUsed >= planLimit;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  // Process and validate selected image file
  const processSelectedFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPG, JPEG and PNG images are supported.');
      return;
    }

    // Maximum 10 MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10 MB.');
      return;
    }

    setError('');
    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    processSelectedFile(selectedFile);
  };

  // Listen for paste event to capture clipboard image (Ctrl+V)
  useEffect(() => {
    const handlePaste = (event) => {
      if (isLimitReached) return;
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const blob = items[i].getAsFile();
          if (blob) {
            const pastedFile = new File(
              [blob],
              `pasted-image-${Date.now()}.${blob.type.split('/')[1] || 'png'}`,
              { type: blob.type }
            );
            processSelectedFile(pastedFile);
            toast.success('Image pasted from clipboard!');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [isLimitReached]);

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setError('');
  };

  const handleExtract = async () => {
    if (isLimitReached) {
      setError('Plan limit reached. Please upgrade to a higher plan.');
      toast.error('Limit reached. Please upgrade.');
      return;
    }

    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setProgress('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('image', file);

      setProgress('Reading image...');

      const res = await extractImage(formData);

      setProgress('Extraction completed...');

      const id = res.data.id || res.data.extractionId;

      if (!id) {
        throw new Error('Extraction ID was not returned by the server.');
      }

      toast.success('Image extracted successfully');
      navigate(`/image-results/${id}`);
    } catch (err) {
      console.error('Image extraction error:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Image extraction failed. Try again.';
      setError(message);
      toast.error('Image extraction failed');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ================= HERO (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        {/* Soft background ambient gradient */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#af52de]/10 to-[#007aff]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#af52de]/20 bg-[#af52de]/10 px-3 py-1 text-xs font-semibold text-[#1c1c1e]">
            <ImageIcon size={14} className="text-[#af52de]" strokeWidth={2.2} />
            Vision & OCR Engine
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
            Extract From Image
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#48484a] leading-relaxed">
            Upload or paste your Commercial Invoice, Bill of Lading, or Packing List image to extract structured customs data automatically.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 rounded-[14px] border border-[rgba(60,60,67,0.15)] bg-[#f2f2f7] px-5 py-3 text-sm font-semibold text-[#1c1c1e] transition hover:bg-[#e5e5ea] active:scale-[0.98]"
            >
              <Clock size={16} strokeWidth={2.2} />
              View Extraction History
            </button>
          </div>
        </div>
      </div>

      {/* ================= LIMIT WARNING ================= */}
      {isLimitReached && (
        <div className="flex items-start gap-3 rounded-[16px] bg-[#ff9500]/10 border border-[#ff9500]/25 p-5 text-[#1c1c1e]">
          <AlertCircle size={20} className="shrink-0 mt-0.5 text-[#ff9500]" />
          <div>
            <p className="font-bold text-sm">
              {currentPlan === 'demo' ? 'Free' : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan Limit Reached
            </p>
            <p className="text-xs text-[#48484a] mt-1 leading-relaxed">
              You have used all {extractionsUsed}/{planLimit} extractions allowed on your plan. To continue creating new document extractions, please upgrade to a higher plan.
            </p>
          </div>
        </div>
      )}

      {/* ================= UPLOAD CARD ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#af52de]/10 text-[#af52de] flex items-center justify-center">
              <ImageIcon size={18} strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Upload Image
              </h2>
              <p className="text-xs text-[#48484a]">
                Add / paste your commercial invoice, bill of lading, or packing list image
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30]">
            REQUIRED
          </span>
        </div>

        {!file ? (
          <label className="block cursor-pointer group">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="border-2 border-dashed border-[rgba(60,60,67,0.18)] bg-[#f9f9fb] rounded-[18px] p-10 text-center transition-all duration-200 group-hover:border-[#af52de] group-hover:bg-white group-hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <div className="w-14 h-14 mx-auto mb-4 rounded-[16px] bg-[#af52de]/10 text-[#af52de] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload size={24} strokeWidth={2.2} />
              </div>

              <p className="text-sm font-bold text-[#1c1c1e]">
                Upload your Invoice, Bill of Lading, or Packing List — Drag, Drop, or Paste
              </p>

              <p className="text-xs text-[#636366] mt-1.5">
                Supports JPG, JPEG, PNG · Paste directly from clipboard (Ctrl+V) · Max 10 MB
              </p>
            </div>
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-[16px] overflow-hidden border border-[rgba(60,60,67,0.12)] bg-[#f9f9fb]">
              {preview && (
                <img
                  src={preview}
                  alt="Selected"
                  className="w-full max-h-[500px] object-contain p-2"
                />
              )}

              <button
                type="button"
                onClick={removeImage}
                disabled={loading}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[rgba(60,60,67,0.15)] flex items-center justify-center text-[#ff3b30] hover:bg-[#ff3b30]/10 transition active:scale-95 disabled:opacity-50"
                title="Remove image"
              >
                <X size={15} strokeWidth={2.4} />
              </button>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-[14px] bg-[#f9f9fb] border border-[rgba(60,60,67,0.08)]">
              <div className="w-9 h-9 rounded-[10px] bg-[#34c759]/15 text-[#34c759] flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} strokeWidth={2.4} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1c1c1e] truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-[#48484a]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-start gap-3 rounded-[16px] bg-[#ff3b30]/10 border border-[#ff3b30]/25 p-5 text-[#1c1c1e]">
          <AlertCircle size={20} className="shrink-0 mt-0.5 text-[#ff3b30]" />
          <div>
            <p className="font-bold text-sm text-[#ff3b30]">Image Extraction Error</p>
            <p className="text-xs text-[#48484a] mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ================= ACTION ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-[#1c1c1e] tracking-tight">
              Ready to extract?
            </p>
            <p className="text-xs text-[#48484a] mt-1">
              We will analyze the image and extract all available information.
            </p>
          </div>

          <button
            onClick={handleExtract}
            disabled={loading || !file || isLimitReached}
            className="min-w-[200px] rounded-[14px] bg-[#007aff] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" strokeWidth={2.2} />
                {progress || 'Processing...'}
              </>
            ) : (
              <>
                <Zap size={16} strokeWidth={2.2} />
                Extract Image
                <ArrowRight size={15} strokeWidth={2.2} />
              </>
            )}
          </button>
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="mt-6 pt-5 border-t border-[rgba(60,60,67,0.08)]">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-2 h-2 rounded-full bg-[#af52de] animate-pulse" />
              <span className="text-xs font-semibold text-[#af52de]">
                {progress}
              </span>
            </div>

            <div className="h-2 bg-[#f2f2f7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#af52de] rounded-full animate-pulse transition-all duration-300"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <ShieldCheck size={14} className="text-[#636366]" />
        <p className="text-xs text-[#636366]">
          JPG · JPEG · PNG · Maximum 10 MB per file · Clipboard paste supported
        </p>
      </div>
    </div>
  );
}
