import { createClient } from '@/lib/supabase/server'
import { google } from '@ai-sdk/google'
import { streamText, embed } from 'ai'

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        const lastMessage = messages[messages.length - 1]

        // 1. 用户问题 -> 向量
        const { embedding } = await embed({
            model: google.textEmbeddingModel("text-embedding-004"),
            value: lastMessage.content,
        })

        // 2. 搜索相似商品
        const supabase = createClient()
        const { data: products, error: matchError } = await supabase.rpc('match_products', {
            query_embedding: embedding,
            match_threshold: 0.5, // 稍微放宽一点阈值，让它能搜到更多
            match_count: 4
        })

        if (matchError) {
            console.error('Supabase match_products error:', matchError)
        }

        // 3. 构建上下文
        const context = products?.map((p: any) => `
        [ID: ${p.id}]
        商品名: ${p.name}
        价格: ¥${p.price}
        描述: ${p.description}
        图片: ${p.image_url}
        `).join('\n---\n') || '没有找到十分匹配的商品'

        const systemPrompt = `
        你叫“慧慧”，是一个专业、热情且幽默的电商导购。
        你的任务是根据用户的需求，从下面的【商品列表】中推荐最合适的产品。
        
        【你的原则】
        1. **只推荐列表里有的商品**，不要瞎编。如果列表里没有合适的，就歉意地告诉用户暂时缺货。
        2. **不仅要介绍商品，还要给出购买理由**，比如“这款跑鞋特别适合您这种经常夜跑的人...”。
        3. 如果用户问价格，直接告诉他。
        4. 回复要简短有力，不要长篇大论。
        5. **重要**：在提及某个商品时，请务必使用 Markdown 的链接格式，格式为：[商品名称](商品ID)，例如 [Nike Air Zoom](12)。前端会识别这个格式并展示卡片。
    
        【商品列表】
        ${context}
      `

        // 4. 生成回复
        const result = await streamText({
            model: google("gemini-1.5-flash"),
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
        })

        return result.toTextStreamResponse()
    } catch (error) {
        console.error('Chat API Error:', error)
        return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

