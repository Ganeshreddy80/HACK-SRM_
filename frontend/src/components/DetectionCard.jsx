import React, { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle, Loader2, Link as LinkIcon, FileUp } from 'lucide-react';

const DetectionCard = ({ title, description, icon: Icon, type, formats }) => {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalysis = async (payload, isUrl = false) => {
        setLoading(true);
        setResult(null);
        setError(null);

        const formData = new FormData();
        if (isUrl) {
            formData.append('url', payload);
        } else {
            formData.append('file', payload);
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/detect-${type}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            let score = 0;
            if (type === 'image') score = data.type?.ai_generated;
            else if (type === 'video') score = data.data?.classes?.ai_generated;
            else if (type === 'audio') score = data.is_ai_generated;

            setResult(score);
        } catch (err) {
            setError("Analysis failed. Backend error.");
        } finally {
            setLoading(false);
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleAnalysis(file, false);
    };

    const onUrlSubmit = (e) => {
        e.preventDefault();
        if (url) handleAnalysis(url, true);
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>

            <p className="text-gray-500 mb-6 flex-grow leading-relaxed">{description}</p>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FileUp size={16} /> Upload
                </button>
                <button
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'url' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <LinkIcon size={16} /> Paste URL
                </button>
            </div>

            {activeTab === 'upload' ? (
                <div className="relative group cursor-pointer">
                    <input
                        type="file"
                        onChange={onFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center bg-gray-50/50 group-hover:bg-blue-50/30 group-hover:border-blue-200 transition-all duration-300">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                            <Upload size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Click to upload or drag file</span>
                        <span className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{formats}</span>
                    </div>
                </div>
            ) : (
                <form onSubmit={onUrlSubmit} className="h-48 flex flex-col justify-center">
                    <input
                        type="url"
                        placeholder="Paste image/video URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white transition-all outline-none mb-3"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        Analyze URL
                    </button>
                </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 min-h-[80px]">
                {loading && (
                    <div className="flex items-center justify-center text-blue-600 gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm font-medium">Analyzing content...</span>
                    </div>
                )}

                {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</div>}

                {result !== null && !loading && (
                    <div className={`p-4 rounded-xl flex items-center justify-between ${result > 0.5 ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
                        <div className="flex items-center gap-2">
                            {result > 0.5 ? (
                                <div className="flex items-center gap-2 text-red-700">
                                    <AlertTriangle size={20} />
                                    <span className="font-bold">AI Generated</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircle size={20} />
                                    <span className="font-bold">Likely Real</span>
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium opacity-80">
                            Confidence: {(result * 100).toFixed(1)}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetectionCard;
