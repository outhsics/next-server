import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
          AI Full Stack Demo
        </h1>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          体验下一代 Web 开发技术栈。
          <br />集成 Next.js, Gemini AI, Supabase 与 Vector Search。
        </p>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          {/* Card 1: RAG */}
          <Link href="/rag" className="group block p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">知识库问答</h2>
            <p className="text-gray-500">
              上传 PDF 文档，让 AI 学习并回答相关问题 (RAG)。
            </p>
          </Link>

          {/* Card 2: Shop */}
          <Link href="/shop" className="group block p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-purple-200">
            <div className="text-4xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">AI 导购电商</h2>
            <p className="text-gray-500">
              具备向量搜索的商品列表，以及全能的“慧慧”导购助手。
            </p>
          </Link>
        </div>
      </div>

      <footer className="mt-20 text-gray-400 text-sm">
        Built with Next.js 14 & Gemini
      </footer>
    </div>
  )
}
