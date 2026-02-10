
'use client'

import { useState, useRef, useEffect } from 'react'
import { PlusCircle, Upload, FileSpreadsheet, Trash2, ScanLine } from 'lucide-react'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { createWorker } from 'tesseract.js'
import { cn } from '@/lib/utils'
import { ClientLayout } from '@/components/ClientLayout'


interface Product {
    id: string
    name: string
    shape: string
    solitaireWt: string
    cad: string
    quality: string
    grossWt: string
    goldPurity: string
    goldRate24k: string
    diaWt: string
    diaRate: string
    netWt: string
    making: string
    somnDia: string
    total: string
    date: string
    category: string
    image: string
}

const CATEGORIES = [
    "Rings",
    "Bracelet",
    "Pendant",
    "Earrings",
    "Necklace",
    "Two Finger Rings"
]

export default function Dashboard() {
    return <MainApp />
}


function MainApp() {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("All")
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load from localStorage on mount
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = () => {
        try {
            setLoading(true)
            const stored = localStorage.getItem('rrumi_products')
            if (stored) {
                const data = JSON.parse(stored)
                setProducts(data)
            }
        } catch (err) {
            console.error('Error loading products:', err)
        } finally {
            setLoading(false)
        }
    }

    // Form state
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        shape: '',
        solitaireWt: '',
        cad: 'YES',
        quality: 'D',
        grossWt: '',
        goldPurity: '18K',
        goldRate24k: '430',
        diaWt: '',
        diaRate: '450',
        netWt: '',
        making: '',
        somnDia: '',
        total: '',
        date: '',
        category: 'Rings',
        image: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const processImageText = async (imageSrc: string) => {
        setIsScanning(true)
        try {
            const worker = await createWorker('eng')
            const ret = await worker.recognize(imageSrc)
            const text = ret.data.text
            console.log('Detected Text:', text)

            setFormData(prev => {
                const newData = { ...prev, image: imageSrc }

                const extract = (regex: RegExp) => {
                    const match = text.match(regex)
                    return match ? match[1].trim() : null
                }

                const grossWt = extract(/GROSS\s*WT\s*[-–_:]?\s*([\d.,]+\s*g?)/i)
                const diaWt = extract(/DIA\s*WT\s*[-–_:]?\s*([\d.,]+\s*(?:CT|ct)?)/i)
                const netWt = extract(/NET\s*WT\s*[-–_:]?\s*([\d.,]+\s*g?)/i)
                const making = extract(/MAKING\s*[-–_:]?\s*([\d.,]+\s*AED?)/i)
                const total = extract(/TOTAL\s*[-–_:=]?\s*([\d.,]+\s*AED?)/i)
                const somnDia = extract(/SOMN\s*DIA\s*[-–_:]?\s*(.+)/i)

                const dateMatch = text.match(/(\d{2}\.\d{2}\.\d{2,4})/)
                if (dateMatch) newData.date = dateMatch[1]

                const lines = text.split('\n')
                const idLine = lines.find(line =>
                    /\bR[A-Z]*\d+[A-Z0-9]*\b/.test(line) &&
                    line.trim().length < 15 &&
                    !line.includes('RRUMI')
                )
                if (idLine) {
                    const idMatch = idLine.match(/\b(R[A-Z]*\d+[A-Z0-9]*)\b/)
                    if (idMatch) newData.name = idMatch[1]
                }

                if (grossWt) newData.grossWt = grossWt
                if (diaWt) newData.diaWt = diaWt
                if (netWt) newData.netWt = netWt
                if (making) newData.making = making
                if (total) newData.total = total
                if (somnDia) newData.somnDia = somnDia

                return newData
            })

            await worker.terminate()
        } catch (error) {
            console.error('OCR Error:', error)
        } finally {
            setIsScanning(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                processImageText(result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const newProduct: Product = {
                id: Date.now().toString(), // Generate unique ID using timestamp
                ...formData,
                date: formData.date || new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }),
            }

            const updatedProducts = [newProduct, ...products]
            setProducts(updatedProducts)
            localStorage.setItem('rrumi_products', JSON.stringify(updatedProducts))

            // Reset form
            setFormData({
                name: '',
                shape: '',
                solitaireWt: '',
                cad: 'YES',
                quality: 'D',
                grossWt: '',
                goldPurity: '18K',
                goldRate24k: '430',
                diaWt: '',
                diaRate: '450',
                netWt: '',
                making: '',
                somnDia: '',
                total: '',
                date: '',
                category: 'Rings',
                image: '',
            })
            setShowForm(false)
        } catch (err) {
            console.error('Error saving product:', err)
            alert('Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const updatedProducts = products.filter(p => p.id !== id)
            setProducts(updatedProducts)
            localStorage.setItem('rrumi_products', JSON.stringify(updatedProducts))
        } catch (err) {
            console.error('Error deleting:', err)
            alert('Failed to delete product')
        }
    }

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'Rrumi Jewelry'
        workbook.created = new Date()

        const addSheet = (sheetName: string, items: Product[]) => {
            if (items.length === 0) return

            const sheet = workbook.addWorksheet(sheetName)

            // Define columns
            sheet.columns = [
                { header: 'Sr No', key: 'srNo', width: 6 },
                { header: 'CODE', key: 'code', width: 15 },
                { header: 'PRODUCT', key: 'product', width: 15 },
                { header: 'SHAPE', key: 'shape', width: 10 },
                { header: 'SOLITAIRE WT', key: 'solitaireWt', width: 12 },
                { header: 'CAD', key: 'cad', width: 6 },
                { header: 'H/D', key: 'quality', width: 6 },
                { header: 'STL', key: 'stl', width: 6 },
                { header: 'RENDER PICK', key: 'renderPick', width: 12 },
                { header: 'GOLD WT 14K', key: 'goldWt14k', width: 12 },
                { header: 'GOLD WT 18K', key: 'goldWt18k', width: 12 },
                { header: '24K GOLD RATE', key: 'goldRate24k', width: 12 },
                { header: '14K GOLD VALUE', key: 'goldValue14k', width: 12 },
                { header: '18K GOLD VALUE', key: 'goldValue18k', width: 12 },
                { header: 'Shape', key: 'diaShape', width: 8 },
                { header: 'Size', key: 'diaSize', width: 8 },
                { header: 'Pcs', key: 'diaPcs', width: 6 },
                { header: 'TOTAL DIAMOND WT', key: 'diaWt', width: 15 },
                { header: 'RATE', key: 'diaRate', width: 8 },
                { header: 'TOTAL DIAMOND VALUE', key: 'diaValue', width: 15 },
                { header: 'MAKING', key: 'making', width: 10 },
                { header: '14K COST', key: 'cost14k', width: 12 },
                { header: '18K COST', key: 'cost18k', width: 12 },
            ]

            // Style header row
            sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
            sheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1a472a' }
            }

            items.forEach((item, index) => {
                // Calculations
                const goldRate24k = parseFloat((item.goldRate24k || '0').toString()) || 0
                const rate14k = goldRate24k * 0.585
                const rate18k = goldRate24k * 0.750


                const grossWt = parseFloat((item.grossWt || '0').toString().replace(/[^\d.]/g, '')) || 0
                const goldWt14k = item.goldPurity === '14K' ? grossWt : 0
                const goldWt18k = item.goldPurity === '18K' ? grossWt : 0

                const goldValue14k = goldWt14k * rate14k
                const goldValue18k = goldWt18k * rate18k

                const diaWt = parseFloat((item.diaWt || '0').toString().replace(/[^\d.]/g, '')) || 0
                const diaRate = parseFloat((item.diaRate || '0').toString()) || 0
                const diaValue = diaWt * diaRate

                const making = parseFloat((item.making || '0').toString().replace(/[^\d.]/g, '')) || 0

                const cost14k = goldValue14k + diaValue + making
                const cost18k = goldValue18k + diaValue + making

                const row = sheet.addRow({
                    srNo: index + 1,
                    code: item.name,
                    product: '', // Image placeholder
                    shape: item.shape,
                    solitaireWt: item.solitaireWt,
                    cad: item.cad,
                    quality: item.quality,
                    stl: '',
                    renderPick: '',
                    goldWt14k: goldWt14k || '',
                    goldWt18k: goldWt18k || '',
                    goldRate24k: item.goldRate24k,
                    goldValue14k: goldValue14k.toFixed(2),
                    goldValue18k: goldValue18k.toFixed(2),
                    diaShape: 'RD',
                    diaSize: '',
                    diaPcs: '',
                    diaWt: item.diaWt,
                    diaRate: item.diaRate,
                    diaValue: diaValue.toFixed(2),
                    making: making,
                    cost14k: cost14k.toFixed(2),
                    cost18k: cost18k.toFixed(2),
                })

                if (item.image) {
                    try {
                        const [metadata, base64Data] = item.image.split(',')
                        if (base64Data) {
                            const extension = metadata.match(/image\/(\w+)/)?.[1] || 'png'
                            const imageId = workbook.addImage({
                                base64: base64Data,
                                extension: extension as 'png' | 'jpeg' | 'gif',
                            })
                            sheet.addImage(imageId, {
                                tl: { col: 2, row: row.number - 1 },
                                ext: { width: 80, height: 80 },
                                editAs: 'oneCell'
                            })
                            row.height = 65
                        }
                    } catch (err) {
                        console.error('Error adding image', err)
                    }
                } else {
                    row.height = 20
                }
            })
        }

        // 1. All Items
        addSheet("All Items", products)

        // 2. Separate Categories
        CATEGORIES.forEach(cat => {
            const catItems = products.filter(p => p.category === cat)
            if (catItems.length > 0) {
                addSheet(cat, catItems)
            }
        })

        if (workbook.worksheets.length === 0) {
            workbook.addWorksheet("Empty")
        }

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), 'Rrumi_Detailed_Catalog.xlsx')
    }





    return (
        <ClientLayout title="Product Costing" subtitle="Product Costing">
            {/* Action Bar */}
            <div className="mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Product Costing</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{products.length} items in catalog</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleExportExcel}
                                className="flex items-center gap-2 bg-[#50C878] hover:bg-[#45b369] text-white px-4 py-2 rounded-md transition-colors font-medium text-sm shadow-sm"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>Export Excel</span>
                            </button>
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white px-4 py-2 rounded-md transition-colors font-semibold text-sm shadow-sm"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Add New Item</span>
                            </button>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                                selectedCategory === "All"
                                    ? "bg-[#F59E0B] text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            All Items
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                                    selectedCategory === cat
                                        ? "bg-[#F59E0B] text-white shadow-sm"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.filter(p => selectedCategory === "All" || p.category === selectedCategory).map((product) => (
                    <div
                        key={product.id}
                        className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative"
                    >
                        {/* Content */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <span className="inline-block px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-semibold uppercase tracking-wide mb-1">
                                        {product.category}
                                    </span>
                                    <h3 className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Rrumi Jewellery</h3>
                                    <h2 className="text-base font-bold text-gray-900 mt-0.5">{product.name}</h2>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-mono text-gray-400">{product.date}</span>
                                    <span className="inline-block text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded mt-1">
                                        {product.shape || 'RD'}
                                    </span>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="aspect-square bg-gray-50 rounded-md overflow-hidden flex items-center justify-center relative border border-gray-100 mb-3">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className="text-gray-400 text-xs">No Image</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between items-center py-1.5 px-2 rounded bg-gray-50">
                                    <span className="text-gray-600 font-medium">GROSS WT</span>
                                    <span className="text-gray-900 font-semibold">{product.grossWt}</span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 px-2 rounded bg-gray-50">
                                    <span className="text-gray-600 font-medium">DIA WT</span>
                                    <span className="text-gray-900 font-semibold">{product.diaWt}</span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 px-2 rounded bg-gray-50">
                                    <span className="text-gray-600 font-medium">MAKING</span>
                                    <span className="text-gray-900 font-semibold">{product.making}</span>
                                </div>

                                {/* Additional Details */}
                                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-100 text-[10px]">
                                    <div>
                                        <span className="text-gray-500">Solitaire:</span>
                                        <span className="ml-1 text-gray-700 font-medium">{product.solitaireWt || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Gold:</span>
                                        <span className="ml-1 text-gray-700 font-medium">{product.goldPurity}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">24k Rate:</span>
                                        <span className="ml-1 text-gray-700 font-medium">{product.goldRate24k}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Dia Rate:</span>
                                        <span className="ml-1 text-gray-700 font-medium">{product.diaRate}</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center py-2 px-2 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/20 mt-2">
                                    <span className="font-bold text-gray-900 text-xs">TOTAL</span>
                                    <span className="font-bold text-gray-900 text-xs">{product.total || 'Calculated'}</span>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                title="Delete Item"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {products.length === 0 && !loading && (
                    <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <FileSpreadsheet className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Products Yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Start building your jewelry catalog</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-md transition-colors text-sm"
                        >
                            Add Your First Item
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="col-span-full bg-white rounded-lg p-20 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-3 border-gray-200 border-t-[#F59E0B] rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-500 text-sm">Loading products...</p>
                    </div>
                )}
            </div>

            {/* Add Item Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-lg overflow-hidden shadow-xl my-8">
                        {/* Modal Header */}
                        <div className="relative p-5 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="text-2xl">✕</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Product ID *</label>
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. RDLR501"
                                            className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Date</label>
                                        <input
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 26.01.26"
                                            className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Category</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                type="button"
                                                key={cat}
                                                onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                                                    formData.category === cat
                                                        ? "bg-[#F59E0B] text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Specifications */}
                                <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Specifications</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-600 uppercase font-medium">Shape</label>
                                            <input name="shape" value={formData.shape} onChange={handleInputChange} placeholder="OVAL" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-600 uppercase font-medium">Solitaire Wt</label>
                                            <input name="solitaireWt" value={formData.solitaireWt} onChange={handleInputChange} placeholder="1ct" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-600 uppercase font-medium">CAD</label>
                                            <select name="cad" value={formData.cad} onChange={handleInputChange} className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 outline-none transition-all">
                                                <option>YES</option>
                                                <option>NO</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-600 uppercase font-medium">Quality</label>
                                            <input name="quality" value={formData.quality} onChange={handleInputChange} placeholder="D" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* Gold & Rates */}
                                <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Gold & Rates</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-600 uppercase font-medium">Gross Wt *</label>
                                            <input required name="grossWt" value={formData.grossWt} onChange={handleInputChange} placeholder="9.74" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-600 uppercase font-medium">Purity</label>
                                            <select name="goldPurity" value={formData.goldPurity} onChange={handleInputChange} className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 outline-none transition-all">
                                                <option>18K</option>
                                                <option>14K</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-600 uppercase font-medium">24K Rate *</label>
                                            <input required name="goldRate24k" value={formData.goldRate24k} onChange={handleInputChange} placeholder="430" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-600 uppercase font-medium">Making *</label>
                                            <input required name="making" value={formData.making} onChange={handleInputChange} placeholder="350" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Diamonds */}
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Diamond Details</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-600 uppercase font-medium">Total Dia Wt *</label>
                                        <input required name="diaWt" value={formData.diaWt} onChange={handleInputChange} placeholder="0.02" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-600 uppercase font-medium">Dia Rate</label>
                                        <input name="diaRate" value={formData.diaRate} onChange={handleInputChange} placeholder="450" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-600 uppercase font-medium">Total</label>
                                        <input name="total" value={formData.total} onChange={handleInputChange} placeholder="Optional" className="w-full bg-white border border-gray-300 focus:border-[#F59E0B] rounded-md px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Product Image (OCR Enabled)</label>
                                <div
                                    onClick={() => !isScanning && fileInputRef.current?.click()}
                                    className={cn(
                                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-gray-50",
                                        isScanning ? "cursor-wait border-[#F59E0B]/50 bg-[#F59E0B]/5" : "border-gray-300 hover:border-[#F59E0B] hover:bg-gray-100"
                                    )}
                                >
                                    {isScanning ? (
                                        <div className="flex flex-col items-center justify-center text-[#F59E0B] animate-pulse">
                                            <ScanLine className="w-7 h-7 mb-2 animate-bounce" />
                                            <span className="text-sm font-semibold">Scanning with OCR...</span>
                                        </div>
                                    ) : formData.image ? (
                                        <div className="relative w-full flex items-center justify-center group-hover:opacity-70 transition-opacity">
                                            <img src={formData.image} alt="Preview" className="h-28 object-contain rounded-md" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="bg-gray-900/80 text-white px-3 py-1.5 rounded-md text-xs font-medium">Click to change</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-7 h-7 text-gray-400" />
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600 font-medium">Upload & Auto-Scan</p>
                                                <p className="text-xs text-gray-400 mt-0.5">AI will extract details</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={isScanning}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 flex justify-end gap-3 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-md font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {loading ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
        </ClientLayout >
    )
}