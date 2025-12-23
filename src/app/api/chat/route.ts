import { createClient } from '@/lib/supabase/server'
import { google } from '@ai-sdk/google'
import { streamText, embed } from 'ai'

export async function POST(req: Request) {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1] // 获取用户最新的问题

    // 1. 把用户的问题变成向量
    const { embedding } = await embed({
        model: google.textEmbeddingModel("text-embedding-004"),
        value: lastMessage.content,
    })

    // 2. 在 Supabase 里搜索相似文档
    const supabase = createClient()
    const { data: documents } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5, // 相似度阈值
        match_count: 5 // 只找最相关的5段
    })

    // 3. 拼接上下文
    // 如果找到了相关文档，就把它们加到 Prompt 里告诉 AI
    const context = documents?.map((doc: any) => doc.content).join('\n\n') || ''

    const systemPrompt = `
    你是一个乐于助人的 AI 助手。
    请根据下面的上下文（Context）来回答用户的问题。
    如果上下文中没有答案，就诚实地说你不知道，不要编造。
    
    Context:
    ${context}
  `

    // 4. 发送给 GPT 生成回答
    const result = await streamText({
        model: google("gemini-1.5-flash"), // 免费且速度快
        messages: [
            { role: 'system', content: systemPrompt },
            ...messages // 带上之前的对话历史
        ],
    })

    return result.toTextStreamResponse()
}
