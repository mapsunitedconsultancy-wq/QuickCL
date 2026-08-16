// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { extractImage } from '../api';
// import {
//   Loader2,
//   Zap,
//   AlertCircle,
//   Image as ImageIcon,
//   ShieldCheck,
//   ArrowRight,
//   CheckCircle2,
//   Upload,
//   X,
//   FileImage,
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// export default function ImageExtract() {
//   const navigate = useNavigate();

//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState('');
//   const [error, setError] = useState('');

//   // ============================================================
//   // HANDLE IMAGE SELECTION
//   // ============================================================

//   const handleFileChange = (selectedFile) => {
//     if (!selectedFile) return;

//     setError('');

//     const allowedTypes = [
//       'image/png',
//       'image/jpeg',
//       'image/jpg',
//     ];

//     if (!allowedTypes.includes(selectedFile.type)) {
//       setError(
//         'Only PNG, JPG and JPEG images are supported.'
//       );

//       return;
//     }

//     // 20 MB limit
//     if (selectedFile.size > 20 * 1024 * 1024) {
//       setError(
//         'Image size must be less than 20 MB.'
//       );

//       return;
//     }

//     setFile(selectedFile);

//     const objectUrl =
//       URL.createObjectURL(selectedFile);

//     setPreview(objectUrl);
//   };

//   // ============================================================
//   // FILE INPUT
//   // ============================================================

//   const handleInputChange = (event) => {
//     const selectedFile =
//       event.target.files?.[0];

//     handleFileChange(selectedFile);
//   };

//   // ============================================================
//   // DRAG & DROP
//   // ============================================================

//   const handleDrop = (event) => {
//     event.preventDefault();

//     const droppedFile =
//       event.dataTransfer.files?.[0];

//     handleFileChange(droppedFile);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   // ============================================================
//   // REMOVE IMAGE
//   // ============================================================

//   const removeImage = () => {
//     setFile(null);
//     setPreview(null);
//     setError('');
//     setProgress('');
//   };

//   // ============================================================
//   // IMAGE EXTRACTION
//   // ============================================================

//   const handleExtract = async () => {
//     if (!file) {
//       setError(
//         'Please upload an image before starting extraction.'
//       );

//       return;
//     }

//     setLoading(true);
//     setError('');

//     setProgress('Uploading image...');

//     try {
//       const formData = new FormData();

//       formData.append('image', file);

//       setProgress(
//         'Sending image to Gemini AI...'
//       );

//       setTimeout(
//         () =>
//           setProgress(
//             'Gemini is reading the image...'
//           ),
//         3000
//       );

//       setTimeout(
//         () =>
//           setProgress(
//             'Extracting available fields...'
//           ),
//         7000
//       );

//       setTimeout(
//         () =>
//           setProgress(
//             'Almost done...'
//           ),
//         12000
//       );

//       const res =
//         await extractImage(formData);

//       const extractionId =
//         res.data?.extractionId ||
//         res.data?.id;

//       toast.success(
//         'Image extracted successfully'
//       );

//       // If backend returns an extraction ID,
//       // navigate to results.
//       if (extractionId) {
//         navigate(
//           `/results/${extractionId}`
//         );
//       } else {
//         toast.success(
//           'Extraction completed successfully'
//         );
//       }

//     } catch (err) {

//       console.error(
//         'Image extraction error:',
//         err
//       );

//       const message =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         'Image extraction failed. Try again.';

//       setError(message);

//       toast.error(
//         'Image extraction failed'
//       );

//     } finally {

//       setLoading(false);
//       setProgress('');

//     }
//   };

//   // ============================================================
//   // FORMAT FILE SIZE
//   // ============================================================

//   const formatFileSize = (bytes) => {

//     if (bytes < 1024) {
//       return `${bytes} B`;
//     }

//     if (bytes < 1024 * 1024) {
//       return `${(bytes / 1024).toFixed(1)} KB`;
//     }

//     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
//   };

//   // ============================================================
//   // UI
//   // ============================================================

//   return (
//     <div className="max-w-5xl mx-auto pb-10">

//       {/* =====================================================
//           HEADER
//       ====================================================== */}

//       <div
//         className="flex flex-col sm:flex-row
//           sm:items-center justify-between
//           gap-4 mb-6"
//       >

//         <div>

//           <div className="flex items-center gap-2 mb-1">

//             <span
//               className="text-[10px] font-bold
//                 px-2 py-1 rounded
//                 bg-purple-100 text-purple-800
//                 uppercase tracking-wider"
//             >
//               AI IMAGE EXTRACTION
//             </span>

//           </div>

//           <h1
//             className="text-2xl font-black
//               text-gray-900"
//           >
//             Extract From Image
//           </h1>

//           <p
//             className="text-sm text-gray-400 mt-1"
//           >
//             Upload an image and let Gemini AI
//             extract all available information
//             automatically.
//           </p>

//         </div>

//         <div
//           className="hidden sm:flex items-center
//             gap-2 text-xs text-gray-400
//             bg-white border border-gray-200
//             rounded-lg px-3 py-2"
//         >
//           <Zap
//             size={14}
//             className="text-purple-700"
//           />

//           AI Powered

//         </div>

//       </div>


//       {/* =====================================================
//           IMAGE UPLOAD
//       ====================================================== */}

//       <div
//         className="card-base p-5 mb-4"
//       >

//         <div
//           className="flex items-center
//             justify-between mb-4"
//         >

//           <div
//             className="flex items-center gap-2"
//           >

//             <div
//               className="w-8 h-8 rounded-lg
//                 bg-purple-100 text-purple-800
//                 flex items-center justify-center"
//             >
//               <ImageIcon size={16} />
//             </div>

//             <div>

//               <h2
//                 className="text-sm font-bold
//                   text-gray-800"
//               >
//                 Upload Image
//               </h2>

//               <p
//                 className="text-[11px]
//                   text-gray-400"
//               >
//                 Upload a document image for AI
//                 extraction
//               </p>

//             </div>

//           </div>

//           <span
//             className="text-[10px] font-bold
//               px-2 py-1 rounded
//               bg-red-50 text-red-600"
//           >
//             REQUIRED
//           </span>

//         </div>


//         {!file ? (

//           /* =================================================
//              DROP ZONE
//           ================================================== */

//           <label
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             className="
//               relative
//               flex flex-col
//               items-center
//               justify-center
//               min-h-[280px]
//               border-2
//               border-dashed
//               border-gray-300
//               rounded-2xl
//               bg-gray-50
//               hover:bg-purple-50
//               hover:border-purple-300
//               transition-all
//               cursor-pointer
//             "
//           >

//             <input
//               type="file"
//               accept=".png,.jpg,.jpeg,image/png,image/jpeg"
//               onChange={handleInputChange}
//               className="hidden"
//             />

//             <div
//               className="w-16 h-16
//                 rounded-2xl
//                 bg-purple-100
//                 text-purple-700
//                 flex items-center
//                 justify-center mb-4"
//             >
//               <Upload size={28} />
//             </div>

//             <p
//               className="text-sm font-bold
//                 text-gray-800"
//             >
//               Upload an image
//             </p>

//             <p
//               className="text-xs
//                 text-gray-400 mt-1"
//             >
//               Drag & drop your image here
//               or click to browse
//             </p>

//             <div
//               className="flex items-center
//                 gap-2 mt-4"
//             >

//               <span
//                 className="text-[10px]
//                   font-bold px-2 py-1
//                   rounded bg-white
//                   border border-gray-200
//                   text-gray-500"
//               >
//                 PNG
//               </span>

//               <span
//                 className="text-[10px]
//                   font-bold px-2 py-1
//                   rounded bg-white
//                   border border-gray-200
//                   text-gray-500"
//               >
//                 JPG
//               </span>

//               <span
//                 className="text-[10px]
//                   font-bold px-2 py-1
//                   rounded bg-white
//                   border border-gray-200
//                   text-gray-500"
//               >
//                 JPEG
//               </span>

//             </div>

//             <p
//               className="text-[10px]
//                 text-gray-400 mt-3"
//             >
//               Maximum 20 MB
//             </p>

//           </label>

//         ) : (

//           /* =================================================
//              IMAGE PREVIEW
//           ================================================== */

//           <div>

//             <div
//               className="relative
//                 rounded-2xl
//                 border border-gray-200
//                 bg-gray-50
//                 overflow-hidden"
//             >

//               <img
//                 src={preview}
//                 alt="Uploaded document"
//                 className="
//                   w-full
//                   max-h-[550px]
//                   object-contain
//                   bg-gray-100
//                 "
//               />

//               <button
//                 type="button"
//                 onClick={removeImage}
//                 disabled={loading}
//                 className="
//                   absolute
//                   top-3
//                   right-3
//                   w-9
//                   h-9
//                   rounded-full
//                   bg-white
//                   border
//                   border-gray-200
//                   shadow-md
//                   flex
//                   items-center
//                   justify-center
//                   text-gray-600
//                   hover:text-red-600
//                   hover:bg-red-50
//                   transition-colors
//                   disabled:opacity-50
//                 "
//               >
//                 <X size={17} />
//               </button>

//             </div>


//             {/* FILE INFO */}

//             <div
//               className="flex items-center
//                 gap-3 mt-3
//                 p-3 rounded-xl
//                 bg-gray-50
//                 border border-gray-100"
//             >

//               <div
//                 className="w-9 h-9
//                   rounded-lg
//                   bg-purple-100
//                   text-purple-700
//                   flex items-center
//                   justify-center"
//               >
//                 <FileImage size={17} />
//               </div>

//               <div className="flex-1 min-w-0">

//                 <p
//                   className="text-xs
//                     font-bold
//                     text-gray-800
//                     truncate"
//                 >
//                   {file.name}
//                 </p>

//                 <p
//                   className="text-[10px]
//                     text-gray-400"
//                 >
//                   {formatFileSize(file.size)}
//                 </p>

//               </div>

//               <CheckCircle2
//                 size={18}
//                 className="text-green-600"
//               />

//             </div>

//           </div>

//         )}

//       </div>


//       {/* =====================================================
//           EXTRACTION INFORMATION
//       ====================================================== */}

//       <div
//         className="card-base p-5 mb-4"
//       >

//         <div
//           className="flex items-center
//             gap-2 mb-4"
//         >

//           <div
//             className="w-8 h-8 rounded-lg
//               bg-blue-100 text-blue-800
//               flex items-center justify-center"
//           >
//             <Zap size={16} />
//           </div>

//           <div>

//             <h2
//               className="text-sm font-bold
//                 text-gray-800"
//             >
//               AI Image Extraction
//             </h2>

//             <p
//               className="text-[11px]
//                 text-gray-400"
//             >
//               Gemini will extract all readable
//               information available in the image.
//             </p>

//           </div>

//         </div>


//         <div
//           className="grid grid-cols-1
//             sm:grid-cols-3 gap-3"
//         >

//           <div
//             className="p-4 rounded-xl
//               bg-gray-50
//               border border-gray-100"
//           >

//             <p
//               className="text-[10px]
//                 uppercase tracking-wider
//                 font-bold text-gray-400"
//             >
//               Input
//             </p>

//             <p
//               className="text-sm
//                 font-bold text-gray-800 mt-1"
//             >
//               Image
//             </p>

//           </div>


//           <div
//             className="p-4 rounded-xl
//               bg-gray-50
//               border border-gray-100"
//           >

//             <p
//               className="text-[10px]
//                 uppercase tracking-wider
//                 font-bold text-gray-400"
//             >
//               AI Engine
//             </p>

//             <p
//               className="text-sm
//                 font-bold text-gray-800 mt-1"
//             >
//               Gemini
//             </p>

//           </div>


//           <div
//             className="p-4 rounded-xl
//               bg-gray-50
//               border border-gray-100"
//           >

//             <p
//               className="text-[10px]
//                 uppercase tracking-wider
//                 font-bold text-gray-400"
//             >
//               Output
//             </p>

//             <p
//               className="text-sm
//                 font-bold text-gray-800 mt-1"
//             >
//               Structured Data
//             </p>

//           </div>

//         </div>

//       </div>


//       {/* =====================================================
//           ERROR
//       ====================================================== */}

//       {error && (

//         <div
//           className="flex items-start
//             gap-3 bg-red-50
//             border border-red-200
//             text-red-700 text-sm
//             p-4 rounded-xl mb-4"
//         >

//           <AlertCircle
//             size={18}
//             className="shrink-0 mt-0.5"
//           />

//           <div>

//             <p className="font-bold">
//               Image Extraction Error
//             </p>

//             <p className="text-xs mt-0.5">
//               {error}
//             </p>

//           </div>

//         </div>

//       )}


//       {/* =====================================================
//           EXTRACTION ACTION
//       ====================================================== */}

//       <div
//         className="card-base p-5"
//       >

//         <div
//           className="flex flex-col
//             sm:flex-row
//             sm:items-center
//             justify-between
//             gap-4"
//         >

//           <div>

//             <p
//               className="text-sm
//                 font-bold text-gray-800"
//             >
//               Ready to extract?
//             </p>

//             <p
//               className="text-[11px]
//                 text-gray-400 mt-1"
//             >
//               Gemini will analyze the image
//               and extract all available data.
//             </p>

//           </div>


//           <button
//             onClick={handleExtract}
//             disabled={!file || loading}
//             className="
//               btn-primary
//               min-w-[210px]
//               py-3
//               px-5
//               text-sm
//               flex
//               items-center
//               justify-center
//               gap-2
//               disabled:opacity-60
//               disabled:cursor-not-allowed
//             "
//           >

//             {loading ? (

//               <>

//                 <Loader2
//                   size={17}
//                   className="animate-spin"
//                 />

//                 {progress || 'Processing...'}

//               </>

//             ) : (

//               <>

//                 <Zap size={17} />

//                 Extract From Image

//                 <ArrowRight size={15} />

//               </>

//             )}

//           </button>

//         </div>


//         {/* =================================================
//             PROGRESS
//         ================================================== */}

//         {loading && (

//           <div
//             className="mt-5 pt-4
//               border-t border-gray-100"
//           >

//             <div
//               className="flex items-center
//                 gap-2 mb-2"
//             >

//               <div
//                 className="w-2 h-2
//                   rounded-full
//                   bg-purple-700
//                   animate-pulse"
//               />

//               <span
//                 className="text-xs
//                   font-semibold
//                   text-purple-800"
//               >
//                 {progress}
//               </span>

//             </div>

//             <div
//               className="h-1.5
//                 bg-gray-100
//                 rounded-full
//                 overflow-hidden"
//             >

//               <div
//                 className="h-full
//                   bg-purple-700
//                   rounded-full
//                   animate-pulse"
//                 style={{
//                   width: '70%',
//                 }}
//               />

//             </div>

//           </div>

//         )}

//       </div>


//       {/* =====================================================
//           FOOTER
//       ====================================================== */}

//       <div
//         className="flex items-center
//           justify-center gap-2 mt-4"
//       >

//         <ShieldCheck
//           size={13}
//           className="text-gray-400"
//         />

//         <p
//           className="text-[10px]
//             text-gray-400"
//         >
//           Supports PNG · JPG · JPEG ·
//           Maximum 20 MB per image
//         </p>

//       </div>

//     </div>
//   );
// }











import { useState } from 'react';
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
    X
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


    const [file, setFile] =
        useState(null);

    const [preview, setPreview] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [progress, setProgress] =
        useState('');

    const [error, setError] =
        useState('');


    // ============================================================
    // SELECT IMAGE
    // ============================================================

    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files?.[0];


        if (!selectedFile) {
            return;
        }


        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ];


        if (
            !allowedTypes.includes(
                selectedFile.type
            )
        ) {

            setError(
                'Only JPG, JPEG and PNG images are supported.'
            );

            return;

        }


        // Maximum 10 MB

        if (
            selectedFile.size >
            10 * 1024 * 1024
        ) {

            setError(
                'Image size must be less than 10 MB.'
            );

            return;

        }


        setError('');

        setFile(selectedFile);


        const objectUrl =
            URL.createObjectURL(
                selectedFile
            );

        setPreview(objectUrl);

    };


    // ============================================================
    // REMOVE IMAGE
    // ============================================================

    const removeImage = () => {

        setFile(null);

        setPreview(null);

        setError('');

    };


    // ============================================================
    // EXTRACT
    // ============================================================

    const handleExtract = async () => {

        if (isLimitReached) {
            setError('Plan limit reached. Please upgrade to a higher plan.');
            toast.error('Limit reached. Please upgrade.');
            return;
        }

        if (!file) {

            setError(
                'Please upload an image first.'
            );

            return;

        }


        setLoading(true);

        setError('');

        setProgress(
            'Uploading image...'
        );


        try {

            const formData =
                new FormData();


            formData.append(
                'image',
                file
            );


            setProgress(
                'Reading image...'
            );


            const res =
                await extractImage(
                    formData
                );


            setProgress(
                'Extraction completed...'
            );


            const id =
                res.data.id ||
                res.data.extractionId;


            if (!id) {

                throw new Error(
                    'Extraction ID was not returned by the server.'
                );

            }


            toast.success(
                `Image extracted successfully`
            );


            // ==================================================
            // GO TO RESULTS PAGE
            // ==================================================

            navigate(
                `/image-results/${id}`
            );


        } catch (err) {

            console.error(
                'Image extraction error:',
                err
            );


            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Image extraction failed. Try again.';


            setError(message);

            toast.error(
                'Image extraction failed'
            );

        } finally {

            setLoading(false);

            setProgress('');

        }

    };


    return (

        <div className="max-w-5xl mx-auto pb-10">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div
                className="flex flex-col sm:flex-row
                sm:items-center justify-between
                gap-4 mb-6"
            >

                <div>

                    <div
                        className="flex items-center
                        gap-2 mb-1"
                    >

                        <span
                            className="text-[10px]
                            font-bold px-2 py-1 rounded
                            bg-purple-100 text-purple-800
                            uppercase tracking-wider"
                        >
                            IMAGE EXTRACTION
                        </span>

                    </div>


                    <h1
                        className="text-2xl font-black
                        text-gray-900"
                    >
                        Extract From Image
                    </h1>


                    <p
                        className="text-sm text-gray-400
                        mt-1"
                    >
                        Upload a JPG, JPEG or PNG image
                        and extract all
                        available information.
                    </p>

                </div>

            </div>

            {/* =====================================================
                LIMIT WARNING
            ====================================================== */}
            {isLimitReached && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl mb-6 shadow-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600" />
                    <div>
                        <p className="font-bold">
                            {currentPlan === 'demo' ? 'Free' : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan Limit Reached
                        </p>
                        <p className="text-xs mt-0.5">
                            You have used all {extractionsUsed}/{planLimit} extractions allowed on your plan. To continue creating new document extractions, please upgrade to a higher plan.
                        </p>
                    </div>
                </div>
            )}

            {/* =====================================================
                UPLOAD CARD
            ====================================================== */}

    <div
        className="card-base p-5 mb-4"
    >

        <div
            className="flex items-center
                    gap-2 mb-4"
        >

            <div
                className="w-8 h-8 rounded-lg
                        bg-purple-100 text-purple-700
                        flex items-center justify-center"
            >

                <ImageIcon size={16} />

            </div>


            <div>

                <h2
                    className="text-sm font-bold
                            text-gray-800"
                >
                    Upload Image
                </h2>


                <p
                    className="text-[11px]
                            text-gray-400"
                >
                    Supported formats: JPG,
                    JPEG and PNG
                </p>

            </div>


            <span
                className="ml-auto text-[10px]
                        font-bold px-2 py-1 rounded
                        bg-red-50 text-red-600"
            >
                REQUIRED
            </span>

        </div>


        {!file ? (

            <label
                className="block cursor-pointer"
            >

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                />


                <div
                    className="border-2 border-dashed
                            border-gray-200 rounded-xl
                            p-10 text-center
                            hover:border-purple-300
                            hover:bg-purple-50/30
                            transition-all"
                >

                    <div
                        className="w-14 h-14
                                mx-auto mb-4 rounded-xl
                                bg-purple-100
                                text-purple-700
                                flex items-center
                                justify-center"
                    >

                        <ImageIcon
                            size={26}
                        />

                    </div>


                    <p
                        className="text-sm
                                font-bold text-gray-800"
                    >
                        Click to upload an image
                    </p>


                    <p
                        className="text-xs
                                text-gray-400 mt-1"
                    >
                        JPG · JPEG · PNG
                        · Maximum 10 MB
                    </p>

                </div>

            </label>

        ) : (

            <div>

                <div
                    className="relative
                            rounded-xl overflow-hidden
                            border border-gray-200
                            bg-gray-50"
                >

                    {preview && (

                        <img
                            src={preview}
                            alt="Selected"
                            className="w-full
                                    max-h-[500px]
                                    object-contain"
                        />

                    )}


                    <button
                        type="button"
                        onClick={removeImage}
                        disabled={loading}
                        className="absolute
                                top-3 right-3
                                w-9 h-9 rounded-full
                                bg-white shadow-md
                                flex items-center
                                justify-center
                                text-gray-600
                                hover:text-red-600
                                disabled:opacity-50"
                    >

                        <X size={17} />

                    </button>

                </div>


                <div
                    className="flex items-center
                            gap-3 mt-3 p-3 rounded-lg
                            bg-gray-50 border
                            border-gray-100"
                >

                    <CheckCircle2
                        size={17}
                        className="text-green-600"
                    />


                    <div
                        className="flex-1 min-w-0"
                    >

                        <p
                            className="text-xs
                                    font-bold text-gray-800
                                    truncate"
                        >
                            {file.name}
                        </p>


                        <p
                            className="text-[10px]
                                    text-gray-400"
                        >
                            {(
                                file.size /
                                1024 /
                                1024
                            ).toFixed(2)}
                            {' '}MB
                        </p>

                    </div>

                </div>

            </div>

        )}

    </div>


    {/* =====================================================
                ERROR
            ====================================================== */}

    {
        error && (

            <div
                className="flex items-start
                    gap-3 bg-red-50 border
                    border-red-200 text-red-700
                    text-sm p-4 rounded-xl mb-4"
            >

                <AlertCircle
                    size={18}
                    className="shrink-0 mt-0.5"
                />


                <div>

                    <p className="font-bold">
                        Image Extraction Error
                    </p>


                    <p className="text-xs mt-0.5">
                        {error}
                    </p>

                </div>

            </div>

        )
    }


    {/* =====================================================
                ACTION
            ====================================================== */}

    <div
        className="card-base p-5"
    >

        <div
            className="flex flex-col
                    sm:flex-row sm:items-center
                    justify-between gap-4"
        >

            <div>

                <p
                    className="text-sm font-bold
                            text-gray-800"
                >
                    Ready to extract?
                </p>


                <p
                    className="text-[11px]
                            text-gray-400 mt-1"
                >
                    We will analyze the
                    image and extract all
                    available information.
                </p>

            </div>


            <button
                onClick={handleExtract}
                disabled={
                    loading ||
                    !file ||
                    isLimitReached
                }
                className="
                            btn-primary
                            min-w-[190px]
                            py-3
                            px-5
                            text-sm
                            flex
                            items-center
                            justify-center
                            gap-2
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "
            >

                {loading ? (

                    <>

                        <Loader2
                            size={17}
                            className="animate-spin"
                        />

                        {progress ||
                            'Processing...'}

                    </>

                ) : (

                    <>

                        <Zap size={17} />

                        Extract Image

                        <ArrowRight
                            size={15}
                        />

                    </>

                )}

            </button>

        </div>


        {loading && (

            <div
                className="mt-5 pt-4
                        border-t border-gray-100"
            >

                <div
                    className="flex items-center
                            gap-2 mb-2"
                >

                    <div
                        className="w-2 h-2
                                rounded-full
                                bg-purple-700
                                animate-pulse"
                    />

                    <span
                        className="text-xs
                                font-semibold
                                text-purple-800"
                    >
                        {progress}
                    </span>

                </div>


                <div
                    className="h-1.5 bg-gray-100
                            rounded-full overflow-hidden"
                >

                    <div
                        className="h-full
                                bg-purple-700
                                rounded-full
                                animate-pulse"
                        style={{
                            width: '70%'
                        }}
                    />

                </div>

            </div>

        )}

    </div>


    {/* =====================================================
                FOOTER
            ====================================================== */}

    <div
        className="flex items-center
                justify-center gap-2 mt-4"
    >

        <ShieldCheck
            size={13}
            className="text-gray-400"
        />


        <p
            className="text-[10px]
                    text-gray-400"
        >
            JPG · JPEG · PNG
            · Maximum 10 MB per file
        </p>

    </div>

</div>

    );

}