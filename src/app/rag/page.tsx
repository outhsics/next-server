'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function ChatPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // 自动滚动到底部
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // 处理文件上传
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/ingest', {
                method: 'POST',
                body: formData,
            })
            if (res.ok) {
                alert('文件上传并学习成功！现在你可以通过对话问我关于它的内容了。')
                setFile(null)
            } else {
                alert('上传失败，请重试')
            }
        } catch (error) {
            console.error(error)
            alert('发生错误')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">

                {/* 头部：上传区域 */}
                <div className="p-6 bg-gray-900 text-white">
                    <h1 className="text-2xl font-bold mb-2">📚 AI 知识库问答</h1>
                    <p className="text-gray-400 text-sm mb-4">上传 PDF 文档，我会阅读并回答你的问题。</p>

                    <form onSubmit={handleUpload} className="flex gap-2 items-center">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700 cursor-pointer"
                        />
                        <button
                            type="submit"
                            disabled={!file || isUploading}
                            className={cn(
                                "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors",
                                "disabled:bg-gray-700 disabled:cursor-not-allowed"
                            )}
                        >
                            {isUploading ? '正在学习...' : '上传并学习'}
                        </button>
                    </form>
                </div>

                {/* 聊天区域 */}
                <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto p-6 space-y-4 bg-gray-50 pb-20" ref={scrollRef}>
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            <p>还没有消息，问我关于你上传文档的问题吧！</p>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={cn(
                                "flex",
                                m.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                    m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                )}
                            >
                                <div className="whitespace-pre-wrap">{m.content}</div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 text-gray-400 rounded-2xl px-4 py-2 text-sm animate-pulse">
                                AI 正在思考...
                            </div>
                        </div>
                    )}
                </div>

                {/* 输入框区域 */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                            value={input}
                            placeholder="问我任何关于文档的问题..."
                            onChange={handleInputChange}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input?.trim()}
                            className={cn(
                                "absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg transition-colors",
                                "hover:bg-blue-700",
                                "disabled:bg-gray-300"
                            )}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
