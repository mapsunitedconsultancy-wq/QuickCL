import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Camera } from 'lucide-react';

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
    maxSize: 10 * 1024 * 1024, // 10 MB
    maxFiles: 1,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    onFileChange(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-5 text-center
        cursor-pointer transition-all
        ${isDragActive ? 'border-blue-500 bg-blue-50' :
          file ? 'border-green-400 bg-green-50' :
          'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'}`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="flex flex-col items-center gap-2">
          <FileText size={28} className="text-green-600" />
          <p className="text-xs font-bold text-green-800 truncate max-w-full px-2">
            {file.name}
          </p>
          <p className="text-[10px] text-green-600">
            {(file.size / 1024).toFixed(0)} KB
          </p>
          <button onClick={removeFile}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center
              bg-red-100 text-red-600 rounded-full hover:bg-red-200">
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100
            rounded-full">
            <Upload size={18} className="text-blue-700" />
          </div>
          <p className="text-xs font-bold text-gray-700">{label}</p>
          <p className="text-[10px] text-gray-400">
            {isDragActive ? 'Drop file here' : 'Click or drag file'}
          </p>
          {required
            ? <span className="text-[9px] font-bold text-red-600 bg-red-50
                px-2 py-0.5 rounded">REQUIRED</span>
            : <span className="text-[9px] font-bold text-gray-400 bg-gray-100
                px-2 py-0.5 rounded">OPTIONAL</span>}
        </div>
      )}
    </div>
  );
}
