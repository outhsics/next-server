import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { google } from '@ai-sdk/google'
import { embed } from 'ai'
// @ts-ignore
// @ts-ignore
let pdf = require('pdf-parse');
if (pdf.default) {
    pdf = pdf.default;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        console.log('Received file:', file.name, 'Size:', file.size, 'Type:', file.type);

        // 1. 读取文件内容
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        console.log('Buffer created, length:', buffer.length);

        // 2. 解析 PDF 文本
        const data = await pdf(buffer)
        const text = data.text

        // 3. 生成向量 (Embeddings)
        // 使用 Google Gemini 的 embedding 模型
        const { embedding } = await embed({
            model: google.textEmbeddingModel("text-embedding-004"),
            value: text,
        })

        // 4. 存入 Supabase
        const supabase = createClient()
        const { error } = await supabase.from('documents').insert({
            content: text,
            embedding: embedding,
            metadata: { filename: file.name }
        })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'File processed and stored' })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
