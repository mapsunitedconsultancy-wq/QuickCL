// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// import {
//     getImageExtraction
// } from '../api';

// import {
//     Loader2,
//     ArrowLeft,
//     Image as ImageIcon,
//     CheckCircle2,
//     AlertCircle,
//     Package,
//     Clock,
//     ShieldCheck
// } from 'lucide-react';

// import toast from 'react-hot-toast';


// export default function ImageResults() {

//     const {
//         id
//     } = useParams();


//     const navigate =
//         useNavigate();


//     const [
//         extraction,
//         setExtraction
//     ] = useState(null);


//     const [
//         loading,
//         setLoading
//     ] = useState(true);


//     const [
//         error,
//         setError
//     ] = useState('');


//     // ============================================================
//     // LOAD RESULT
//     // ============================================================

//     useEffect(() => {

//         const loadResult =
//             async () => {

//                 try {

//                     setLoading(true);

//                     setError('');


//                     const res =
//                         await getImageExtraction(
//                             id
//                         );


//                     if (
//                         !res.data?.success
//                     ) {

//                         throw new Error(
//                             'Failed to load extraction.'
//                         );

//                     }


//                     setExtraction(
//                         res.data.data
//                     );

//                 } catch (err) {

//                     console.error(
//                         'Image result error:',
//                         err
//                     );


//                     const message =
//                         err.response?.data?.error ||
//                         err.response?.data?.message ||
//                         'Failed to load image extraction.';


//                     setError(
//                         message
//                     );


//                     toast.error(
//                         'Could not load extraction'
//                     );

//                 } finally {

//                     setLoading(false);

//                 }

//             };


//         if (id) {
//             loadResult();
//         }

//     }, [id]);


//     // ============================================================
//     // LOADING
//     // ============================================================

//     if (loading) {

//         return (

//             <div
//                 className="min-h-[70vh]
//                 flex items-center
//                 justify-center"
//             >

//                 <div
//                     className="flex flex-col
//                     items-center gap-3"
//                 >

//                     <Loader2
//                         size={30}
//                         className="animate-spin
//                         text-blue-700"
//                     />

//                     <p
//                         className="text-sm
//                         text-gray-400"
//                     >
//                         Loading extraction...
//                     </p>

//                 </div>

//             </div>

//         );

//     }


//     // ============================================================
//     // ERROR
//     // ============================================================

//     if (error) {

//         return (

//             <div
//                 className="max-w-5xl
//                 mx-auto"
//             >

//                 <div
//                     className="bg-red-50
//                     border border-red-200
//                     rounded-xl p-5"
//                 >

//                     <div
//                         className="flex items-center
//                         gap-2 text-red-700"
//                     >

//                         <AlertCircle
//                             size={18}
//                         />

//                         <p
//                             className="font-bold"
//                         >
//                             Unable to load extraction
//                         </p>

//                     </div>


//                     <p
//                         className="text-xs
//                         text-red-600 mt-2"
//                     >
//                         {error}
//                     </p>

//                 </div>

//             </div>

//         );

//     }


//     if (!extraction) {
//         return null;
//     }


//     // ============================================================
//     // DATA
//     // ============================================================

//     const extractedData =
//         extraction.extracted_json || {};


//     const items =
//         extraction.items || [];


//     // ============================================================
//     // FIELDS
//     //
//     // Supports:
//     //
//     // {
//     //   fields: {
//     //      invoice_no: {
//     //          value: "...",
//     //          confidence: 0.95
//     //      }
//     //   }
//     // }
//     //
//     // ============================================================

//     const fields =
//         extractedData.fields || {};


//     return (

//         <div
//             className="max-w-6xl
//             mx-auto pb-10"
//         >


//             {/* =====================================================
//                 HEADER
//             ====================================================== */}

//             <div
//                 className="flex flex-col
//                 sm:flex-row sm:items-center
//                 justify-between gap-4 mb-6"
//             >

//                 <div>

//                     <button
//                         onClick={() =>
//                             navigate(
//                                 '/image-extract'
//                             )
//                         }
//                         className="flex items-center
//                         gap-1.5 text-xs
//                         font-semibold
//                         text-gray-500
//                         hover:text-blue-700
//                         mb-3"
//                     >

//                         <ArrowLeft
//                             size={14}
//                         />

//                         Back to Image Extraction

//                     </button>


//                     <div
//                         className="flex items-center
//                         gap-2 mb-1"
//                     >

//                         <span
//                             className="text-[10px]
//                             font-bold px-2 py-1
//                             rounded bg-purple-100
//                             text-purple-800
//                             uppercase
//                             tracking-wider"
//                         >
//                             IMAGE EXTRACTION
//                         </span>

//                     </div>


//                     <h1
//                         className="text-2xl
//                         font-black text-gray-900"
//                     >
//                         Extraction Results
//                     </h1>


//                     <p
//                         className="text-sm
//                         text-gray-400 mt-1"
//                     >
//                         {extraction.file_name}
//                     </p>

//                 </div>


//                 {/* =================================================
//                     STATS
//                 ================================================== */}

//                 <div
//                     className="flex items-center
//                     gap-2"
//                 >

//                     <div
//                         className="bg-white
//                         border border-gray-200
//                         rounded-lg px-4 py-3"
//                     >

//                         <p
//                             className="text-[10px]
//                             text-gray-400"
//                         >
//                             FIELDS EXTRACTED
//                         </p>


//                         <p
//                             className="text-lg
//                             font-black
//                             text-gray-900"
//                         >
//                             {
//                                 extraction.extracted_fields_count
//                                 || 0
//                             }
//                         </p>

//                     </div>


//                     <div
//                         className="bg-white
//                         border border-gray-200
//                         rounded-lg px-4 py-3"
//                     >

//                         <p
//                             className="text-[10px]
//                             text-gray-400"
//                         >
//                             ACCURACY
//                         </p>


//                         <p
//                             className="text-lg
//                             font-black
//                             text-green-700"
//                         >
//                             {
//                                 extraction.accuracy_score
//                                 ?? 0
//                             }%
//                         </p>

//                     </div>

//                 </div>

//             </div>


//             {/* =====================================================
//                 EXTRACTION INFO
//             ====================================================== */}

//             <div
//                 className="grid grid-cols-1
//                 sm:grid-cols-3 gap-3 mb-4"
//             >

//                 <div
//                     className="card-base p-4"
//                 >

//                     <div
//                         className="flex items-center
//                         gap-2"
//                     >

//                         <ImageIcon
//                             size={16}
//                             className="text-purple-700"
//                         />

//                         <div>

//                             <p
//                                 className="text-[10px]
//                                 text-gray-400"
//                             >
//                                 IMAGE
//                             </p>

//                             <p
//                                 className="text-xs
//                                 font-bold text-gray-800
//                                 truncate max-w-[220px]"
//                             >
//                                 {extraction.file_name}
//                             </p>

//                         </div>

//                     </div>

//                 </div>


//                 <div
//                     className="card-base p-4"
//                 >

//                     <div
//                         className="flex items-center
//                         gap-2"
//                     >

//                         <Clock
//                             size={16}
//                             className="text-blue-700"
//                         />

//                         <div>

//                             <p
//                                 className="text-[10px]
//                                 text-gray-400"
//                             >
//                                 EXTRACTION TIME
//                             </p>

//                             <p
//                                 className="text-xs
//                                 font-bold text-gray-800"
//                             >
//                                 {
//                                     (
//                                         (
//                                             extraction.extraction_time_ms
//                                             || 0
//                                         ) / 1000
//                                     ).toFixed(2)
//                                 }s
//                             </p>

//                         </div>

//                     </div>

//                 </div>


//                 <div
//                     className="card-base p-4"
//                 >

//                     <div
//                         className="flex items-center
//                         gap-2"
//                     >

//                         <CheckCircle2
//                             size={16}
//                             className="text-green-600"
//                         />

//                         <div>

//                             <p
//                                 className="text-[10px]
//                                 text-gray-400"
//                             >
//                                 STATUS
//                             </p>

//                             <p
//                                 className="text-xs
//                                 font-bold text-green-700
//                                 capitalize"
//                             >
//                                 {extraction.status}
//                             </p>

//                         </div>

//                     </div>

//                 </div>

//             </div>


//             {/* =====================================================
//                 EXTRACTED FIELDS
//             ====================================================== */}

//             <div
//                 className="card-base p-5 mb-4"
//             >

//                 <div
//                     className="flex items-center
//                     gap-2 mb-5"
//                 >

//                     <div
//                         className="w-8 h-8
//                         rounded-lg bg-blue-100
//                         text-blue-800
//                         flex items-center
//                         justify-center"
//                     >

//                         <ShieldCheck
//                             size={16}
//                         />

//                     </div>


//                     <div>

//                         <h2
//                             className="text-sm
//                             font-bold text-gray-800"
//                         >
//                             Extracted Information
//                         </h2>


//                         <p
//                             className="text-[11px]
//                             text-gray-400"
//                         >
//                             Data identified by Gemini
//                             from the uploaded image.
//                         </p>

//                     </div>

//                 </div>


//                 {Object.keys(fields).length === 0 ? (

//                     <div
//                         className="text-center
//                         py-10 text-gray-400"
//                     >

//                         <ImageIcon
//                             size={30}
//                             className="mx-auto mb-3"
//                         />

//                         <p
//                             className="text-sm
//                             font-semibold"
//                         >
//                             No structured fields found
//                         </p>

//                     </div>

//                 ) : (

//                     <div
//                         className="grid grid-cols-1
//                         md:grid-cols-2
//                         xl:grid-cols-3 gap-3"
//                     >

//                         {Object.entries(
//                             fields
//                         ).map(
//                             ([key, field]) => {

//                                 const value =
//                                     field &&
//                                     typeof field === 'object' &&
//                                     Object.prototype.hasOwnProperty.call(
//                                         field,
//                                         'value'
//                                     )
//                                         ? field.value
//                                         : field;


//                                 if (
//                                     value === null ||
//                                     value === undefined ||
//                                     value === ''
//                                 ) {
//                                     return null;
//                                 }


//                                 return (

//                                     <div
//                                         key={key}
//                                         className="border
//                                         border-gray-100
//                                         rounded-xl p-3
//                                         bg-gray-50"
//                                     >

//                                         <p
//                                             className="text-[10px]
//                                             font-bold
//                                             text-gray-400
//                                             uppercase
//                                             tracking-wide
//                                             mb-1"
//                                         >
//                                             {key
//                                                 .replace(
//                                                     /_/g,
//                                                     ' '
//                                                 )}
//                                         </p>


//                                         <p
//                                             className="text-xs
//                                             font-semibold
//                                             text-gray-800
//                                             break-words"
//                                         >
//                                             {
//                                                 typeof value ===
//                                                 'object'
//                                                     ? JSON.stringify(
//                                                         value
//                                                     )
//                                                     : String(
//                                                         value
//                                                     )
//                                             }
//                                         </p>

//                                     </div>

//                                 );

//                             }
//                         )}

//                     </div>

//                 )}

//             </div>


//             {/* =====================================================
//                 LINE ITEMS
//             ====================================================== */}

//             {items.length > 0 && (

//                 <div
//                     className="card-base p-5"
//                 >

//                     <div
//                         className="flex items-center
//                         gap-2 mb-5"
//                     >

//                         <div
//                             className="w-8 h-8
//                             rounded-lg bg-blue-100
//                             text-blue-800
//                             flex items-center
//                             justify-center"
//                         >

//                             <Package
//                                 size={16}
//                             />

//                         </div>


//                         <div>

//                             <h2
//                                 className="text-sm
//                                 font-bold text-gray-800"
//                             >
//                                 Line Items
//                             </h2>


//                             <p
//                                 className="text-[11px]
//                                 text-gray-400"
//                             >
//                                 {
//                                     items.length
//                                 } items extracted
//                             </p>

//                         </div>

//                     </div>


//                     <div
//                         className="overflow-x-auto"
//                     >

//                         <table
//                             className="w-full
//                             text-xs"
//                         >

//                             <thead>

//                                 <tr
//                                     className="border-b
//                                     border-gray-200
//                                     text-left"
//                                 >

//                                     <th
//                                         className="py-3
//                                         px-2 text-gray-400"
//                                     >
//                                         #
//                                     </th>

//                                     <th
//                                         className="py-3
//                                         px-2 text-gray-400"
//                                     >
//                                         Description
//                                     </th>

//                                     <th
//                                         className="py-3
//                                         px-2 text-gray-400"
//                                     >
//                                         HS Code
//                                     </th>

//                                     <th
//                                         className="py-3
//                                         px-2 text-gray-400"
//                                     >
//                                         Quantity
//                                     </th>

//                                     <th
//                                         className="py-3
//                                         px-2 text-gray-400"
//                                     >
//                                         Unit
//                                     </th>

//                                     <th
//                                         className="py-3
//                                         px-2 text-gray-400"
//                                     >
//                                         Total Value
//                                     </th>

//                                     <th
//                                         className="py-3
//                                         px-2 text-gray-400"
//                                     >
//                                         Country
//                                     </th>

//                                 </tr>

//                             </thead>


//                             <tbody>

//                                 {items.map(
//                                     (item, index) => (

//                                         <tr
//                                             key={
//                                                 item.id ||
//                                                 index
//                                             }
//                                             className="border-b
//                                             border-gray-100"
//                                         >

//                                             <td
//                                                 className="py-3
//                                                 px-2
//                                                 font-bold"
//                                             >
//                                                 {
//                                                     item.sr_no ||
//                                                     index + 1
//                                                 }
//                                             </td>


//                                             <td
//                                                 className="py-3
//                                                 px-2"
//                                             >
//                                                 {
//                                                     item.item_description ||
//                                                     '-'
//                                                 }
//                                             </td>


//                                             <td
//                                                 className="py-3
//                                                 px-2 font-semibold"
//                                             >
//                                                 {
//                                                     item.hs_code ||
//                                                     '-'
//                                                 }
//                                             </td>


//                                             <td
//                                                 className="py-3
//                                                 px-2"
//                                             >
//                                                 {
//                                                     item.quantity ||
//                                                     '-'
//                                                 }
//                                             </td>


//                                             <td
//                                                 className="py-3
//                                                 px-2"
//                                             >
//                                                 {
//                                                     item.unit ||
//                                                     '-'
//                                                 }
//                                             </td>


//                                             <td
//                                                 className="py-3
//                                                 px-2"
//                                             >
//                                                 {
//                                                     item.total_value ||
//                                                     '-'
//                                                 }
//                                             </td>


//                                             <td
//                                                 className="py-3
//                                                 px-2"
//                                             >
//                                                 {
//                                                     item.country_of_origin ||
//                                                     '-'
//                                                 }
//                                             </td>

//                                         </tr>

//                                     )
//                                 )}

//                             </tbody>

//                         </table>

//                     </div>

//                 </div>

//             )}

//         </div>

//     );

// }













import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    getImageExtraction,
} from '../api';

import FieldRow from '../components/FieldRow.jsx';
import HSCodeSuggestion from '../components/HSCodeSuggestion.jsx';
import ConfidenceBadge from '../components/ConfidenceBadge.jsx';

import {
    Loader2,
    Download,
    FileSpreadsheet,
    FileText,
    ArrowLeft,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Database,
    Package,
    ExternalLink,
    Search,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

import toast from 'react-hot-toast';


// ============================================================
// Helpers
// ============================================================

const getValue = (field) => {

    if (
        field &&
        typeof field === 'object' &&
        Object.prototype.hasOwnProperty.call(field, 'value')
    ) {
        return field.value;
    }

    return field ?? null;
};


const getConfidence = (field) => {

    if (
        field &&
        typeof field === 'object' &&
        Object.prototype.hasOwnProperty.call(field, 'confidence')
    ) {

        const score =
            Number(field.confidence);

        if (!Number.isNaN(score)) {
            return Math.max(
                0,
                Math.min(1, score)
            );
        }
    }

    return 0;
};


const hasValue = (value) => {

    if (
        value === null ||
        value === undefined
    ) {
        return false;
    }

    if (
        typeof value === 'string'
    ) {
        return value.trim().length > 0;
    }

    if (
        Array.isArray(value)
    ) {
        return value.length > 0;
    }

    return true;
};


const isFieldObject = (value) => {

    return (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.prototype.hasOwnProperty.call(
            value,
            'value'
        ) &&
        Object.prototype.hasOwnProperty.call(
            value,
            'confidence'
        )
    );
};


const label = (key) => {

    if (!key) {
        return '';
    }

    return String(key)
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\s+/g, ' ')
        .replace(/^./, c => c.toUpperCase())
        .trim();
};


// ============================================================
// Section names
// ============================================================

const SECTION_TITLES = {

    job:
        'Job / File Header',

    importer_exporter:
        'Importer / Exporter',

    foreign_party:
        'Foreign Party',

    consignee:
        'Consignee / Buyer',

    shipment:
        'Shipment / Vessel',

    containers:
        'Container Details',

    invoice:
        'Invoice & Value',

    items:
        'Line Items',

    packing:
        'Packing Details',

    duty:
        'Duty & Tax',

    scheme:
        'Scheme Details',

    drawback:
        'Drawback',

    rodtep:
        'RoDTEP',

    esanchit:
        'e-Sanchit',

    declarations:
        'Declarations',

    licences:
        'Licences',

    certificate:
        'Certificate Information',

    additional:
        'Additional Information',

};


// ============================================================
// Recursively collect scalar fields
// ============================================================

function collectFields(section) {

    const extracted = [];
    const missing = [];


    function walk(
        node,
        path = []
    ) {

        if (
            node === null ||
            node === undefined
        ) {
            return;
        }


        // ----------------------------------------------------
        // Arrays
        // ----------------------------------------------------

        if (
            Array.isArray(node)
        ) {
            return;
        }


        // ----------------------------------------------------
        // Standard field
        //
        // {
        //     value,
        //     confidence
        // }
        // ----------------------------------------------------

        if (
            isFieldObject(node)
        ) {

            const value =
                getValue(node);


            const field = {

                key:
                    path.join('.'),

                label:
                    label(
                        path[path.length - 1]
                    ),

                value:
                    value,

                confidence:
                    getConfidence(node)

            };


            if (
                hasValue(value)
            ) {

                extracted.push(
                    field
                );

            } else {

                missing.push(
                    field
                );

            }

            return;
        }


        // ----------------------------------------------------
        // Object
        // ----------------------------------------------------

        if (
            typeof node === 'object'
        ) {

            for (
                const [
                    key,
                    value
                ]
                of Object.entries(node)
            ) {

                walk(
                    value,
                    [
                        ...path,
                        key
                    ]
                );

            }

            return;
        }


        // ----------------------------------------------------
        // Primitive fallback
        // ----------------------------------------------------

        const field = {

            key:
                path.join('.'),

            label:
                label(
                    path[path.length - 1]
                ),

            value:
                node,

            confidence:
                1

        };


        if (
            hasValue(node)
        ) {

            extracted.push(
                field
            );

        } else {

            missing.push(
                field
            );

        }

    }


    walk(section);


    return {

        extracted,
        missing

    };

}


// ============================================================
// Format display value
// ============================================================

function displayValue(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return '';
    }


    if (
        typeof value === 'object'
    ) {

        try {

            return JSON.stringify(
                value,
                null,
                2
            );

        } catch {

            return String(value);

        }

    }


    return String(value);

}


// ============================================================
// Build CSV
// ============================================================

function flattenForCSV(
    node,
    sectionName,
    rows,
    path = []
) {

    if (
        node === null ||
        node === undefined
    ) {
        return;
    }


    // --------------------------------------------------------
    // Arrays
    // --------------------------------------------------------

    if (
        Array.isArray(node)
    ) {

        node.forEach(
            (
                item,
                index
            ) => {

                flattenForCSV(
                    item,
                    sectionName,
                    rows,
                    [
                        ...path,
                        String(index + 1)
                    ]
                );

            }
        );

        return;
    }


    // --------------------------------------------------------
    // Objects
    // --------------------------------------------------------

    if (
        typeof node === 'object'
    ) {

        // Standard field
        if (
            isFieldObject(node)
        ) {

            const value =
                getValue(node);


            if (
                hasValue(value)
            ) {

                rows.push({

                    section:
                        sectionName,

                    field:
                        path
                            .map(label)
                            .join(' → '),

                    value:
                        displayValue(value),

                    confidence:
                        `${(
                            getConfidence(node) *
                            100
                        ).toFixed(1)}%`

                });

            }

            return;
        }


        Object.entries(node)
            .forEach(
                (
                    [key, value]
                ) => {

                    flattenForCSV(
                        value,
                        sectionName,
                        rows,
                        [
                            ...path,
                            key
                        ]
                    );

                }
            );

        return;
    }


    // --------------------------------------------------------
    // Primitive
    // --------------------------------------------------------

    if (
        hasValue(node)
    ) {

        rows.push({

            section:
                sectionName,

            field:
                path
                    .map(label)
                    .join(' → '),

            value:
                displayValue(node),

            confidence:
                '100%'

        });

    }

}


// ============================================================
// Dynamic Section
// ============================================================

function DynamicSection({
    sectionKey,
    section,
    number
}) {

    const {
        extracted,
        missing
    } =
        useMemo(
            () =>
                collectFields(section),
            [section]
        );


    const [
        showMissing,
        setShowMissing
    ] =
        useState(false);


    if (
        extracted.length === 0 &&
        missing.length === 0
    ) {
        return null;
    }


    return (

        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* Header */}

            <div
                className="
                    border-b
                    border-slate-200
                    bg-slate-50
                    px-5
                    py-4
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-900
                                text-xs
                                font-black
                                text-white
                            "
                        >

                            {number}

                        </div>


                        <div>

                            <h2
                                className="
                                    text-sm
                                    font-black
                                    text-slate-900
                                "
                            >

                                {
                                    SECTION_TITLES[
                                        sectionKey
                                    ] ||
                                    label(
                                        sectionKey
                                    )
                                }

                            </h2>


                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    text-slate-400
                                "
                            >

                                {extracted.length}
                                {' '}extracted

                                {missing.length > 0 &&
                                    ` • ${missing.length} not found`}

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Extracted fields */}

            {extracted.length > 0 && (

                <div
                    className="
                        divide-y
                        divide-slate-100
                    "
                >

                    {extracted.map(
                        field => (

                            <FieldRow
                                key={
                                    field.key
                                }

                                label={
                                    field.label
                                }

                                value={
                                    displayValue(
                                        field.value
                                    )
                                }

                                confidence={
                                    field.confidence
                                }

                                fieldKey={
                                    field.key
                                }
                            />

                        )
                    )}

                </div>

            )}


            {/* Missing fields */}

            {missing.length > 0 && (

                <div
                    className="
                        border-t
                        border-orange-100
                    "
                >

                    <button
                        type="button"

                        onClick={() =>
                            setShowMissing(
                                previous =>
                                    !previous
                            )
                        }

                        className="
                            flex
                            w-full
                            items-center
                            justify-between
                            bg-orange-50/70
                            px-5
                            py-3
                            text-left
                            transition
                            hover:bg-orange-50
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <AlertTriangle
                                size={14}
                                className="
                                    text-orange-500
                                "
                            />


                            <span
                                className="
                                    text-xs
                                    font-black
                                    text-orange-800
                                "
                            >

                                Fields not extracted

                            </span>


                            <span
                                className="
                                    rounded-full
                                    bg-orange-100
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-black
                                    text-orange-700
                                "
                            >

                                {missing.length}

                            </span>

                        </div>


                        {showMissing
                            ? (
                                <ChevronUp
                                    size={15}
                                />
                            )
                            : (
                                <ChevronDown
                                    size={15}
                                />
                            )
                        }

                    </button>


                    {showMissing && (

                        <div
                            className="
                                bg-orange-50/30
                                px-5
                                py-4
                            "
                        >

                            <p
                                className="
                                    mb-3
                                    text-[11px]
                                    text-slate-500
                                "
                            >

                                These fields were not
                                found in the uploaded
                                image. They are not
                                counted against the
                                extraction accuracy.

                            </p>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >

                                {missing.map(
                                    field => (

                                        <span
                                            key={
                                                field.key
                                            }

                                            className="
                                                rounded-lg
                                                border
                                                border-orange-200
                                                bg-white
                                                px-3
                                                py-1.5
                                                text-[10px]
                                                font-semibold
                                                text-slate-500
                                            "
                                        >

                                            {field.label}

                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            )}

        </section>

    );

}


// ============================================================
// Image Results
// ============================================================

export default function ImageResults() {

    const {
        id
    } =
        useParams();


    const navigate =
        useNavigate();


    const [
        data,
        setData
    ] =
        useState(null);


    const [
        items,
        setItems
    ] =
        useState([]);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    // ========================================================
    // Load image extraction
    // ========================================================

    useEffect(() => {

        if (!id) {
            return;
        }


        setLoading(true);


        getImageExtraction(id)

            .then(
                res => {

                    /*
                     * Your image-extract.js returns:
                     *
                     * {
                     *     success: true,
                     *     data: {
                     *         ...extraction,
                     *         items: [...]
                     *     }
                     * }
                     *
                     * So handle both:
                     *
                     * res.data.data
                     *
                     * and direct responses.
                     */

                    const extraction =
                        res.data?.data ||
                        res.data;


                    setData(
                        extraction
                    );


                    setItems(
                        extraction?.items ||
                        extraction?.image_extraction_items ||
                        []
                    );

                }
            )

            .catch(
                error => {

                    console.error(
                        'Image extraction load error:',
                        error
                    );

                    toast.error(
                        'Failed to load image extraction'
                    );

                }
            )

            .finally(
                () => {

                    setLoading(false);

                }
            );

    }, [id]);


    // ========================================================
    // CSV
    // ========================================================

    const handleCSVDownload =
        () => {

            if (!data) {
                return;
            }


            const rows = [];


            const json =
                data.extracted_json ||
                data.extractedData ||
                data.data ||
                {};


            Object.entries(
                json
            ).forEach(
                (
                    [
                        sectionKey,
                        section
                    ]
                ) => {

                    if (
                        sectionKey ===
                        'overall_confidence'
                    ) {
                        return;
                    }


                    if (
                        sectionKey ===
                        'document_type'
                    ) {
                        return;
                    }


                    flattenForCSV(
                        section,
                        SECTION_TITLES[
                            sectionKey
                        ] ||
                        label(
                            sectionKey
                        ),
                        rows,
                        []
                    );

                }
            );


            // ------------------------------------------------
            // Line items
            // ------------------------------------------------

            items.forEach(
                (
                    item,
                    index
                ) => {

                    const itemSection =
                        `Line Item ${index + 1}`;


                    Object.entries(
                        item
                    ).forEach(
                        (
                            [
                                key,
                                value
                            ]
                        ) => {

                            if (
                                [
                                    'id',
                                    'image_extraction_id',
                                    'created_at',
                                    'updated_at'
                                ].includes(key)
                            ) {
                                return;
                            }


                            if (
                                value === null ||
                                value === undefined ||
                                value === ''
                            ) {
                                return;
                            }


                            rows.push({

                                section:
                                    itemSection,

                                field:
                                    label(key),

                                value:
                                    displayValue(
                                        getValue(value)
                                    ),

                                confidence:
                                    isFieldObject(
                                        value
                                    )
                                        ? `${(
                                            getConfidence(
                                                value
                                            ) * 100
                                        ).toFixed(1)}%`
                                        : ''

                            });

                        }
                    );

                }
            );


            const header = [

                'Section',
                'Field',
                'Value',
                'Confidence'

            ];


            const escapeCSV =
                value => {

                    const str =
                        String(
                            value ?? ''
                        );


                    return `"${str.replace(
                        /"/g,
                        '""'
                    )}"`;

                };


            const csv =
                [
                    header,

                    ...rows.map(
                        row => [

                            row.section,
                            row.field,
                            row.value,
                            row.confidence

                        ]
                    )

                ]

                    .map(
                        row =>
                            row
                                .map(
                                    escapeCSV
                                )
                                .join(',')
                    )

                    .join('\n');


            const blob =
                new Blob(
                    [
                        '\uFEFF' +
                        csv
                    ],
                    {
                        type:
                            'text/csv;charset=utf-8;'
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    'a'
                );


            link.href =
                url;


            link.download =
                `${
                    data.job_number ||
                    data.jobNumber ||
                    `image-extraction-${id}`
                }.csv`;


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );


            toast.success(
                'CSV downloaded'
            );

        };


    // ========================================================
    // Loading
    // ========================================================

    if (loading) {

        return (

            <div
                className="
                    flex
                    min-h-[60vh]
                    items-center
                    justify-center
                "
            >

                <div
                    className="text-center"
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-50
                        "
                    >

                        <Loader2
                            size={25}
                            className="
                                animate-spin
                                text-blue-900
                            "
                        />

                    </div>


                    <p
                        className="
                            mt-4
                            text-sm
                            font-bold
                            text-slate-700
                        "
                    >

                        Loading image extraction...

                    </p>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                        "
                    >

                        Preparing your extracted data

                    </p>

                </div>

            </div>

        );

    }


    // ========================================================
    // Not found
    // ========================================================

    if (!data) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-10
                    text-center
                    shadow-sm
                "
            >

                <AlertTriangle
                    size={25}
                    className="
                        mx-auto
                        text-red-500
                    "
                />


                <h2
                    className="
                        mt-4
                        text-lg
                        font-black
                        text-slate-900
                    "
                >

                    Image extraction not found

                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        text-slate-400
                    "
                >

                    The requested image extraction
                    could not be loaded.

                </p>

            </div>

        );

    }


    // ========================================================
    // JSON
    // ========================================================

    const json =
        data.extracted_json ||
        data.extractedData ||
        data.data ||
        {};


    // ========================================================
    // Accuracy
    // ========================================================

    const accuracy =
        Number(
            data.accuracy_score ??
            data.accuracyPercent ??
            (
                Number(
                    data.accuracy || 0
                ) * 100
            )
        ) || 0;


    // ========================================================
    // Count extracted / missing fields
    // ========================================================

    let extractedFieldCount = 0;
    let missingFieldCount = 0;


    Object.entries(
        json
    ).forEach(
        (
            [
                key,
                section
            ]
        ) => {

            if (
                key ===
                'overall_confidence'
            ) {
                return;
            }


            if (
                key ===
                'document_type'
            ) {
                return;
            }


            if (
                key ===
                'items'
            ) {
                return;
            }


            if (
                key ===
                'line_items'
            ) {
                return;
            }


            if (
                key ===
                'containers'
            ) {
                return;
            }


            const result =
                collectFields(
                    section
                );


            extractedFieldCount +=
                result.extracted.length;


            missingFieldCount +=
                result.missing.length;

        }
    );


    // --------------------------------------------------------
    // Count line item fields too
    // --------------------------------------------------------

    items.forEach(
        item => {

            Object.entries(
                item
            ).forEach(
                (
                    [
                        key,
                        value
                    ]
                ) => {

                    if (
                        [
                            'id',
                            'image_extraction_id',
                            'created_at',
                            'updated_at'
                        ].includes(key)
                    ) {
                        return;
                    }


                    const extractedValue =
                        getValue(value);


                    if (
                        hasValue(
                            extractedValue
                        )
                    ) {

                        extractedFieldCount++;

                    } else {

                        missingFieldCount++;

                    }

                }
            );

        }
    );


    // ========================================================
    // Standard sections
    // ========================================================

    const standardSections =
        Object.entries(
            json
        ).filter(
            (
                [
                    key,
                    value
                ]
            ) => {

                if (
                    key ===
                    'overall_confidence'
                ) {
                    return false;
                }


                if (
                    key ===
                    'document_type'
                ) {
                    return false;
                }


                if (
                    key ===
                    'items'
                ) {
                    return false;
                }


                if (
                    key ===
                    'line_items'
                ) {
                    return false;
                }


                if (
                    key ===
                    'containers'
                ) {
                    return false;
                }


                if (
                    Array.isArray(
                        value
                    )
                ) {
                    return false;
                }


                return (
                    value &&
                    typeof value ===
                        'object'
                );

            }
        );


    return (

        <div
            className="
                space-y-5
                pb-10
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    bg-gradient-to-br
                    from-blue-950
                    via-slate-900
                    to-blue-900
                    p-6
                    shadow-xl
                    sm:p-7
                "
            >

                <div
                    className="
                        absolute
                        -right-24
                        -top-24
                        h-72
                        w-72
                        rounded-full
                        bg-blue-500/20
                        blur-3xl
                    "
                />


                <div
                    className="
                        absolute
                        -bottom-28
                        -left-28
                        h-72
                        w-72
                        rounded-full
                        bg-teal-500/10
                        blur-3xl
                    "
                />


                <div
                    className="
                        relative
                        z-10
                    "
                >

                    {/* Top */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            lg:flex-row
                            lg:items-start
                            lg:justify-between
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-4
                            "
                        >

                            <div
                                className="
                                    hidden
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-teal-400
                                    shadow-lg
                                    sm:flex
                                "
                            >

                                <FileText
                                    size={24}
                                    className="
                                        text-slate-950
                                    "
                                />

                            </div>


                            <div>

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >

                                    <h1
                                        className="
                                            text-2xl
                                            font-black
                                            tracking-tight
                                            text-white
                                        "
                                    >

                                        Image Extraction Results

                                    </h1>


                                    <span
                                        className="
                                            rounded-full
                                            bg-blue-100
                                            px-2.5
                                            py-1
                                            text-[10px]
                                            font-black
                                            text-blue-800
                                        "
                                    >

                                        IMAGE DOCUMENT

                                    </span>

                                </div>


                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-slate-300
                                    "
                                >

                                    Review the information
                                    extracted from your uploaded
                                    image.

                                </p>


                                <div
                                    className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-white/10
                                            bg-white/5
                                            px-3
                                            py-1.5
                                        "
                                    >

                                        <FileText
                                            size={13}
                                            className="
                                                text-slate-400
                                            "
                                        />


                                        <span
                                            className="
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-400
                                            "
                                        >

                                            Job

                                        </span>


                                        <span
                                            className="
                                                font-mono
                                                text-xs
                                                font-bold
                                                text-white
                                            "
                                        >

                                            {
                                                data.job_number ||
                                                data.jobNumber ||
                                                '--'
                                            }

                                        </span>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            text-slate-400
                                        "
                                    >

                                        <Clock
                                            size={13}
                                        />

                                        Image Extraction #{id}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Actions */}

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            <button
                                onClick={() =>
                                    navigate(-1)
                                }

                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/10
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-white
                                    backdrop-blur
                                    transition
                                    hover:bg-white/20
                                "
                            >

                                <ArrowLeft
                                    size={15}
                                />

                                Back

                            </button>


                            <button
                                onClick={
                                    handleCSVDownload
                                }

                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/10
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-white
                                    backdrop-blur
                                    transition
                                    hover:bg-white/20
                                "
                            >

                                <Download
                                    size={15}
                                />

                                CSV

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        METRICS
                    ================================================= */}

                    <div
                        className="
                            mt-7
                            grid
                            grid-cols-2
                            gap-3
                            sm:grid-cols-4
                        "
                    >

                        {/* Accuracy */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-white/10
                                bg-white/5
                                p-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <ShieldCheck
                                    size={15}
                                    className={
                                        accuracy >= 90
                                            ? 'text-teal-300'
                                            : 'text-yellow-300'
                                    }
                                />


                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                                >

                                    Accuracy

                                </span>

                            </div>


                            <p
                                className="
                                    mt-1
                                    text-lg
                                    font-black
                                    text-white
                                "
                            >

                                {accuracy.toFixed(1)}%

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-slate-400
                                "
                            >

                                Extracted fields only

                            </p>

                        </div>


                        {/* Extracted */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-white/10
                                bg-white/5
                                p-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <Database
                                    size={15}
                                    className="
                                        text-blue-300
                                    "
                                />


                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                                >

                                    Extracted

                                </span>

                            </div>


                            <p
                                className="
                                    mt-1
                                    text-lg
                                    font-black
                                    text-white
                                "
                            >

                                {
                                    extractedFieldCount
                                }

                            </p>

                        </div>


                        {/* Missing */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-white/10
                                bg-white/5
                                p-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <AlertTriangle
                                    size={15}
                                    className="
                                        text-orange-300
                                    "
                                />


                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                                >

                                    Not Found

                                </span>

                            </div>


                            <p
                                className="
                                    mt-1
                                    text-lg
                                    font-black
                                    text-white
                                "
                            >

                                {
                                    missingFieldCount
                                }

                            </p>

                        </div>


                        {/* Processing */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-white/10
                                bg-white/5
                                p-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <Clock
                                    size={15}
                                    className="
                                        text-teal-300
                                    "
                                />


                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                                >

                                    Processing

                                </span>

                            </div>


                            <p
                                className="
                                    mt-1
                                    text-lg
                                    font-black
                                    text-white
                                "
                            >

                                {(
                                    (
                                        data.extraction_time_ms ||
                                        data.extractionTimeMs ||
                                        0
                                    ) / 1000
                                ).toFixed(1)}s

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                EXTRACTION STATUS
            ================================================= */}

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-4
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                text-xs
                                font-black
                                text-slate-800
                            "
                        >

                            Extraction Status

                        </span>

                    </div>


                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-4
                        "
                    >

                        <span
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <ConfidenceBadge
                                score={0.95}
                            />

                            High 90%+

                        </span>


                        <span
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <ConfidenceBadge
                                score={0.75}
                            />

                            Review 70–89%

                        </span>


                        <span
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <ConfidenceBadge
                                score={0.5}
                            />

                            Verify &lt;70%

                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                EXTRACTED INFORMATION
            ================================================= */}

            <div>

                <h2
                    className="
                        text-lg
                        font-black
                        tracking-tight
                        text-slate-900
                    "
                >

                    Extracted Information

                </h2>


                <p
                    className="
                        mt-1
                        text-xs
                        text-slate-400
                    "
                >

                    Only information actually found in the
                    uploaded image is displayed as extracted.

                </p>

            </div>


            {/* =================================================
                STANDARD SECTIONS
            ================================================= */}

            <div
                className="
                    space-y-4
                "
            >

                {standardSections.map(
                    (
                        [
                            sectionKey,
                            section
                        ],
                        index
                    ) => (

                        <DynamicSection
                            key={
                                sectionKey
                            }

                            sectionKey={
                                sectionKey
                            }

                            section={
                                section
                            }

                            number={
                                index + 1
                            }

                        />

                    )
                )}

            </div>


            {/* =================================================
                CONTAINERS
            ================================================= */}

            {Array.isArray(
                json.containers
            ) &&
            json.containers.length > 0 && (

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            border-b
                            border-slate-200
                            bg-slate-50
                            px-5
                            py-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-100
                                "
                            >

                                <Package
                                    size={15}
                                    className="
                                        text-blue-800
                                    "
                                />

                            </div>


                            <div>

                                <h2
                                    className="
                                        text-sm
                                        font-black
                                        text-slate-900
                                    "
                                >

                                    Container Details

                                </h2>


                                <p
                                    className="
                                        mt-0.5
                                        text-[10px]
                                        text-slate-400
                                    "
                                >

                                    {
                                        json.containers.length
                                    }

                                    {' '}
                                    container
                                    {json.containers.length !== 1 &&
                                        's'}

                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            space-y-3
                            p-4
                        "
                    >

                        {json.containers.map(
                            (
                                container,
                                index
                            ) => {

                                const result =
                                    collectFields(
                                        container
                                    );


                                return (

                                    <div
                                        key={
                                            index
                                        }

                                        className="
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-slate-200
                                        "
                                    >

                                        <div
                                            className="
                                                bg-slate-50
                                                px-4
                                                py-3
                                            "
                                        >

                                            <span
                                                className="
                                                    text-xs
                                                    font-black
                                                    text-slate-800
                                                "
                                            >

                                                Container {
                                                    index + 1
                                                }

                                            </span>

                                        </div>


                                        {result.extracted.length > 0 && (

                                            <div
                                                className="
                                                    divide-y
                                                    divide-slate-100
                                                "
                                            >

                                                {result.extracted.map(
                                                    field => (

                                                        <FieldRow
                                                            key={
                                                                field.key
                                                            }

                                                            label={
                                                                field.label
                                                            }

                                                            value={
                                                                displayValue(
                                                                    field.value
                                                                )
                                                            }

                                                            confidence={
                                                                field.confidence
                                                            }

                                                        />

                                                    )
                                                )}

                                            </div>

                                        )}


                                        {result.missing.length > 0 && (

                                            <div
                                                className="
                                                    border-t
                                                    border-orange-100
                                                    bg-orange-50/40
                                                    px-4
                                                    py-3
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-black
                                                        text-orange-800
                                                    "
                                                >

                                                    Not extracted:

                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-[10px]
                                                        text-slate-500
                                                    "
                                                >

                                                    {
                                                        result.missing
                                                            .map(
                                                                f =>
                                                                    f.label
                                                            )
                                                            .join(
                                                                ', '
                                                            )
                                                    }

                                                </p>

                                            </div>

                                        )}

                                    </div>

                                );

                            }
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                LINE ITEMS
            ================================================= */}

            {items.length > 0 && (

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border-2
                        border-blue-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            border-b
                            border-blue-200
                            bg-gradient-to-r
                            from-blue-50
                            to-teal-50
                            px-5
                            py-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-900
                                "
                            >

                                <Package
                                    size={17}
                                    className="
                                        text-white
                                    "
                                />

                            </div>


                            <div>

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >

                                    <span
                                        className="
                                            rounded-md
                                            bg-blue-900
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-black
                                            text-white
                                        "
                                    >

                                        LINE ITEMS

                                    </span>


                                    <h2
                                        className="
                                            text-sm
                                            font-black
                                            text-blue-950
                                        "
                                    >

                                        Product Details

                                    </h2>


                                    <span
                                        className="
                                            rounded-md
                                            border
                                            border-blue-200
                                            bg-white
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-bold
                                            text-blue-700
                                        "
                                    >

                                        {items.length}
                                        {' '}
                                        item
                                        {items.length !== 1 &&
                                            's'}

                                    </span>

                                </div>


                                <p
                                    className="
                                        mt-1
                                        text-[11px]
                                        text-slate-500
                                    "
                                >

                                    Review product descriptions,
                                    quantities, values and HS codes.

                                </p>

                            </div>

                        </div>

                    </div>


                    <div>

                        {items.map(
                            (
                                item,
                                index
                            ) => {

                                const description =
                                    getValue(
                                        item.item_description ||
                                        item.description
                                    );


                                const hsCode =
                                    getValue(
                                        item.hs_code
                                    );


                                const confidence =
                                    getConfidence(
                                        item.confidence_score
                                    ) ||
                                    Number(
                                        item.confidence_score
                                    ) ||
                                    0;


                                return (

                                    <div
                                        key={
                                            item.id ||
                                            index
                                        }

                                        className="
                                            border-b
                                            border-slate-200
                                            last:border-0
                                        "
                                    >

                                        {/* Item header */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                bg-slate-50
                                                px-5
                                                py-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <span
                                                    className="
                                                        flex
                                                        h-7
                                                        w-7
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-blue-100
                                                        text-[10px]
                                                        font-black
                                                        text-blue-900
                                                    "
                                                >

                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        '0'
                                                    )}

                                                </span>


                                                <span
                                                    className="
                                                        text-xs
                                                        font-black
                                                        text-slate-700
                                                    "
                                                >

                                                    Item {
                                                        index + 1
                                                    }

                                                </span>

                                            </div>


                                            <ConfidenceBadge
                                                score={
                                                    confidence
                                                }
                                                showLabel
                                            />

                                        </div>


                                        {/* Fields */}

                                        <div
                                            className="
                                                divide-y
                                                divide-slate-100
                                            "
                                        >

                                            {/* Description */}

                                            {hasValue(
                                                description
                                            ) && (

                                                <FieldRow
                                                    label="Description"

                                                    value={
                                                        displayValue(
                                                            description
                                                        )
                                                    }

                                                    confidence={
                                                        getConfidence(
                                                            item.item_description ||
                                                            item.description
                                                        ) ||
                                                        confidence ||
                                                        0.95
                                                    }

                                                />

                                            )}


                                            {/* HS CODE */}

                                            {hasValue(
                                                hsCode
                                            ) && (

                                                <div
                                                    className="
                                                        border-b
                                                        border-slate-100
                                                    "
                                                >

                                                    <FieldRow
                                                        label="HS Code"

                                                        value={
                                                            displayValue(
                                                                hsCode
                                                            )
                                                        }

                                                        confidence={
                                                            getConfidence(
                                                                item.hs_code
                                                            ) ||
                                                            confidence ||
                                                            0
                                                        }

                                                    />


                                                    <div
                                                        className="
                                                            mx-5
                                                            mb-4
                                                            rounded-xl
                                                            border
                                                            border-blue-200
                                                            bg-blue-50
                                                            p-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-start
                                                                gap-3
                                                            "
                                                        >

                                                            <Search
                                                                size={17}
                                                                className="
                                                                    mt-0.5
                                                                    shrink-0
                                                                    text-blue-700
                                                                "
                                                            />


                                                            <div
                                                                className="
                                                                    flex-1
                                                                "
                                                            >

                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        font-black
                                                                        text-blue-950
                                                                    "
                                                                >

                                                                    Verify this HS Code

                                                                </p>


                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[11px]
                                                                        leading-5
                                                                        text-slate-600
                                                                    "
                                                                >

                                                                    The HS Code shown above
                                                                    was extracted from your
                                                                    image. It has not been
                                                                    automatically classified
                                                                    by the system.

                                                                    Verify the code and product
                                                                    description using the HS Code
                                                                    Lookup before final submission.

                                                                </p>


                                                                <div
                                                                    className="
                                                                        mt-3
                                                                        flex
                                                                        flex-wrap
                                                                        gap-2
                                                                    "
                                                                >

                                                                    <button
                                                                        type="button"

                                                                        onClick={() =>
                                                                            navigate(
                                                                                '/hs-lookup'
                                                                            )
                                                                        }

                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-2
                                                                            rounded-lg
                                                                            bg-blue-900
                                                                            px-3
                                                                            py-2
                                                                            text-[10px]
                                                                            font-black
                                                                            text-white
                                                                            transition
                                                                            hover:bg-blue-800
                                                                        "
                                                                    >

                                                                        <Search
                                                                            size={13}
                                                                        />

                                                                        Open HS Code Lookup

                                                                    </button>


                                                                    <a
                                                                        href="https://www.icegate.gov.in/"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"

                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-2
                                                                            rounded-lg
                                                                            border
                                                                            border-slate-200
                                                                            bg-white
                                                                            px-3
                                                                            py-2
                                                                            text-[10px]
                                                                            font-black
                                                                            text-slate-700
                                                                            transition
                                                                            hover:bg-slate-50
                                                                        "
                                                                    >

                                                                        <ExternalLink
                                                                            size={13}
                                                                        />

                                                                        Verify on ICEGATE

                                                                    </a>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            )}


                                            {/* Quantity / Unit / Values */}

                                            {[
                                                [
                                                    'Quantity',
                                                    item.quantity
                                                ],

                                                [
                                                    'Unit',
                                                    item.unit
                                                ],

                                                [
                                                    'Unit Price',
                                                    item.unit_price
                                                ],

                                                [
                                                    'Total Value',
                                                    item.total_value
                                                ],

                                                [
                                                    'FOB Value',
                                                    item.fob_value
                                                ],

                                                [
                                                    'Assessable Value INR',
                                                    item.assessable_value_inr
                                                ],

                                                [
                                                    'Country of Origin',
                                                    item.country_of_origin
                                                ],

                                                [
                                                    'BCD Rate',
                                                    item.bcd_rate
                                                ],

                                                [
                                                    'SWS Rate',
                                                    item.sws_rate
                                                ],

                                                [
                                                    'IGST Rate',
                                                    item.igst_rate
                                                ],

                                                [
                                                    'Compensation Cess',
                                                    item.comp_cess_rate
                                                ],

                                                [
                                                    'Exemption Notification',
                                                    item.exemption_notification
                                                ],

                                                [
                                                    'End Use Code',
                                                    item.end_use_code
                                                ]

                                            ].map(
                                                (
                                                    [
                                                        fieldLabel,
                                                        fieldValue
                                                    ]
                                                ) => {

                                                    if (
                                                        !hasValue(
                                                            getValue(
                                                                fieldValue
                                                            )
                                                        )
                                                    ) {
                                                        return null;
                                                    }


                                                    return (

                                                        <FieldRow
                                                            key={
                                                                fieldLabel
                                                            }

                                                            label={
                                                                fieldLabel
                                                            }

                                                            value={
                                                                displayValue(
                                                                    getValue(
                                                                        fieldValue
                                                                    )
                                                                )
                                                            }

                                                            confidence={
                                                                getConfidence(
                                                                    fieldValue
                                                                ) ||
                                                                confidence ||
                                                                0.95
                                                            }

                                                        />

                                                    );

                                                }
                                            )}

                                        </div>


                                        {/* AI suggestions */}

                                        {Array.isArray(
                                            item.ai_suggested_hs
                                        ) &&
                                        item.ai_suggested_hs.length > 0 && (

                                            <div
                                                className="
                                                    border-t
                                                    border-blue-100
                                                    bg-blue-50/40
                                                "
                                            >

                                                <HSCodeSuggestion
                                                    suggestions={
                                                        item.ai_suggested_hs
                                                    }

                                                    itemId={
                                                        item.id
                                                    }

                                                    onConfirm={() => {
                                                        toast(
                                                            'HS confirmation is not enabled for image extractions yet.'
                                                        );
                                                    }}

                                                />

                                            </div>

                                        )}

                                    </div>

                                );

                            }
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                NO ITEMS
            ================================================= */}

            {items.length === 0 && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <Package
                            size={18}
                            className="
                                text-slate-400
                            "
                        />


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-black
                                    text-slate-700
                                "
                            >

                                No line items extracted

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    text-slate-400
                                "
                            >

                                No product line-item data was
                                returned by the image extraction
                                engine.

                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                FINAL SUMMARY
            ================================================= */}

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-50
                            "
                        >

                            <CheckCircle2
                                size={19}
                                className="
                                    text-green-600
                                "
                            />

                        </div>


                        <div>

                            <p
                                className="
                                    text-sm
                                    font-black
                                    text-slate-800
                                "
                            >

                                Extraction Complete

                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-400
                                "
                            >

                                {
                                    extractedFieldCount
                                }
                                {' '}
                                fields extracted from image

                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-5
                        "
                    >

                        <div
                            className="
                                text-right
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                "
                            >

                                Processing Time

                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-sm
                                    font-black
                                    text-slate-800
                                "
                            >

                                {(
                                    (
                                        data.extraction_time_ms ||
                                        data.extractionTimeMs ||
                                        0
                                    ) / 1000
                                ).toFixed(1)}s

                            </p>

                        </div>


                        <div
                            className="
                                h-8
                                w-px
                                bg-slate-200
                            "
                        />


                        <div
                            className="
                                text-right
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                "
                            >

                                Accuracy

                            </p>


                            <p
                                className={`
                                    mt-0.5
                                    text-sm
                                    font-black
                                    ${
                                        accuracy >= 90
                                            ? 'text-green-700'
                                            : accuracy >= 70
                                                ? 'text-yellow-700'
                                                : 'text-red-700'
                                    }
                                `}
                            >

                                {accuracy.toFixed(1)}%

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                MISSING FIELD EXPLANATION
            ================================================= */}

            {missingFieldCount > 0 && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-orange-200
                        bg-orange-50/60
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <AlertTriangle
                            size={18}
                            className="
                                mt-0.5
                                shrink-0
                                text-orange-600
                            "
                        />


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-black
                                    text-orange-900
                                "
                            >

                                {
                                    missingFieldCount
                                }
                                {' '}
                                fields were not extracted

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    leading-5
                                    text-slate-600
                                "
                            >

                                These fields were not found
                                in the uploaded image. They
                                are displayed separately and
                                are{' '}

                                <strong>
                                    not counted as extraction
                                    failures
                                </strong>

                                {' '}
                                when calculating accuracy.

                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}