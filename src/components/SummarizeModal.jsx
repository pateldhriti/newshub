import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Sparkles, Loader, Copy, Check } from "lucide-react";
import {
    summarizeText,
    setInputText,
    resetSummarization,
} from "../features/summarization/summarizationSlice";

export default function SummarizeModal({ isOpen, onClose, initialText = "" }) {
    const dispatch = useDispatch();
    const { inputText, summary, loading, error } = useSelector(
        (state) => state.summarization
    );
    const [copied, setCopied] = useState(false);

    // Set initial text when modal opens
    useEffect(() => {
        if (isOpen && initialText) {
            dispatch(setInputText(initialText));
        }
    }, [isOpen, initialText, dispatch]);

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            dispatch(resetSummarization());
            setCopied(false);
        }
    }, [isOpen, dispatch]);

    const handleSummarize = () => {
        if (inputText.trim()) {
            dispatch(summarizeText(inputText));
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
            onKeyDown={handleKeyDown}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                AI Summary
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Generate intelligent summaries with AI
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Input Section */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Text to Summarize
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => dispatch(setInputText(e.target.value))}
                            placeholder="Paste or type the text you want to summarize..."
                            className="w-full h-48 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            disabled={loading}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {inputText.length} characters
                            </p>
                            <button
                                onClick={handleSummarize}
                                disabled={!inputText.trim() || loading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Summarizing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Summarize
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Summary Section */}
                    {summary && (
                        <div className="animate-fadeIn">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    AI Generated Summary
                                </label>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                    {summary}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!summary && !loading && !error && (
                        <div className="text-center py-8">
                            <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                                <Sparkles className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">
                                Enter text above and click "Summarize" to generate an AI
                                summary
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
