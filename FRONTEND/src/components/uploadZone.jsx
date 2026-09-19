import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';

export default function UploadZone({ label, required, file, onFileChange, accept }) {
  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onFileChange(accepted[0]);
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/tiff': ['.tiff'],
    },
    maxSize: 20 * 1024 * 1024, // 20 MB
    maxFiles: 1,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    onFileChange(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-[16px] p-5 text-center cursor-pointer transition-all duration-200 group ${
        isDragActive
          ? 'border-[#007aff] bg-[#007aff]/5 scale-[1.01]'
          : file
          ? 'border-[#34c759] bg-[#34c759]/5'
          : 'border-[rgba(60,60,67,0.18)] bg-[#f9f9fb] hover:border-[#007aff] hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
      }`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-[12px] bg-[#34c759]/15 text-[#34c759] flex items-center justify-center">
            <FileText size={20} strokeWidth={2.2} />
          </div>
          <p className="text-xs font-semibold text-[#1c1c1e] truncate max-w-full px-2">
            {file.name}
          </p>
          <p className="text-[11px] text-[#48484a]">
            {(file.size / 1024).toFixed(0)} KB
          </p>
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-white border border-[rgba(60,60,67,0.15)] text-[#ff3b30] rounded-full shadow-sm hover:bg-[#ff3b30]/10 hover:border-[#ff3b30]/30 transition active:scale-95"
            title="Remove file"
          >
            <X size={13} strokeWidth={2.4} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-10 h-10 flex items-center justify-center rounded-[12px] bg-[#007aff]/10 text-[#007aff] group-hover:scale-105 transition">
            <Upload size={18} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1c1c1e]">{label}</p>
            <p className="text-[11px] text-[#636366] mt-0.5">
              {isDragActive ? 'Drop file here' : 'Click or drag file'}
            </p>
          </div>
          <div>
            {required ? (
              <span className="text-[10px] font-semibold text-[#ff3b30] bg-[#ff3b30]/10 border border-[#ff3b30]/20 px-2 py-0.5 rounded-full">
                REQUIRED
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-[#48484a] bg-[rgba(60,60,67,0.08)] px-2 py-0.5 rounded-full">
                OPTIONAL
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
