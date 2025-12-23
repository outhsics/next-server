'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat-shop',
        initialMessages: [
            { id: 'Welcome', role: 'assistant', content: '您好！我是慧慧，这里的金牌导购。想买点什么？比如“推荐个跑步鞋”或者“有啥便宜的耳机”？' }
        ]
    })

    const scrollRef = useRef<HTMLDivElement>(null)

    // 自动滚动到底部
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // 一个简单的 Markdown Link 解析器，用于识别 [商品名](ID)
    // 如果是普通文本就直接显示，如果是这种格式就高亮或者做成按钮
    const renderContent = (content: string) => {
        // 正则：匹配 [text](digits)
        const parts = content.split(/(\[.*?\]\(\d+\))/g)

        return parts.map((part, i) => {
            const match = part.match(/^\[(.*?)\]\((\d+)\)$/)
            if (match) {
                const [_, name, id] = match
                return (
                    <span key={i} className="inline-flex items-center mx-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm cursor-pointer hover:bg-purple-200 border border-purple-200" title={`查看商品 ID: ${id}`}>
                        🎁 {name}
                    </span>
                )
            }
            return <span key={i}>{part}</span>
        })
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* 聊天窗口 */}
            <div className={cn(
                "bg-white shadow-2xl rounded-2xl w-[350px] md:w-[400px] overflow-hidden transition-all duration-300 transform origin-bottom-right mb-4 border border-gray-100",
                isOpen ? "scale-100 opacity-100 h-[500px]" : "scale-0 opacity-0 h-0 pointer-events-none"
            )}>
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">👩🏻‍💼</div>
                        <div>
                            <h3 className="font-bold">慧慧导购</h3>
                            <p className="text-xs opacity-80 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span> 在线为您服务
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded">
                        ✕
                    </button>
                </div>

                {/* Message List */}
                <div className="flex-1 p-4 overflow-y-auto h-[380px] bg-gray-50" ref={scrollRef}>
                    {messages.map(m => (
                        <div key={m.id} className={cn("flex mb-4", m.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                                m.role === 'user'
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                            )}>
                                {renderContent(m.content)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                <span className="animate-pulse text-gray-400 text-xs">慧慧正在思考...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        placeholder="问问慧慧..."
                    />
                    <button
                        type="submit"
                        disabled={!input?.trim() || isLoading}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors",
                            !input?.trim() ? "bg-gray-300" : "bg-purple-600 hover:bg-purple-700"
                        )}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* 悬浮按钮 (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl flex items-center justify-center text-3xl transition-transform hover:scale-110 active:scale-95",
                    isOpen ? "bg-gray-200 text-gray-600 rotate-90" : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                )}
            >
                {isOpen ? '✕' : '💬'}
            </button>

        </div>
    )
}
