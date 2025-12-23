import { createClient } from '@/lib/supabase/server'
import { google } from '@ai-sdk/google'
import { streamText, embed } from 'ai'

export async function POST(req: Request) {
    console.log('RAG Chat API: Received request')
    try {
        const { messages } = await req.json()
        const lastMessage = messages[messages.length - 1]

        let context = ''
        try {
            console.log('RAG Chat API: Generating embedding')
            // 1. 把用户的问题变成向量
            const { embedding } = await embed({
                model: google.textEmbeddingModel("text-embedding-004"),
                value: lastMessage.content,
            })

            console.log('RAG Chat API: Searching documents')
            // 2. 在 Supabase 里搜索相似文档
            const supabase = createClient()
            const { data: documents, error: rpcError } = await supabase.rpc('match_documents', {
                query_embedding: embedding,
                match_threshold: 0.3, // 降低一点阈值
                match_count: 5
            })

            if (rpcError) {
                console.error('RAG Chat API: RPC Error:', rpcError)
            } else {
                context = documents?.map((doc: any) => doc.content).join('\n\n') || ''
                console.log('RAG Chat API: Found context length:', context.length)
            }
        } catch (e) {
            console.error('RAG Chat API: Vector search failed:', e)
            context = '知识库搜索暂时不可用。'
        }

        const systemPrompt = `
        你是一个乐于助人的 AI 助手。
        请根据下面的上下文（Context）来回答用户的问题。
        如果上下文中没有答案，就诚实地说你不知道，不要编造。
        
        Context:
        ${context}
      `

        console.log('RAG Chat API: Starting stream')
        // 4. 发送给 AI 生成回答
        const result = await streamText({
            model: google("gemini-1.5-flash"),
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
        })

        return result.toTextStreamResponse()
    } catch (error: any) {
        console.error('RAG Chat API Fatal Error:', error)
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
