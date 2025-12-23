import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { google } from '@ai-sdk/google'
import { embed } from 'ai'

const SAMPLE_PRODUCTS = [
    {
        name: "Nike Air Zoom Pegasus 40",
        description: "A springy ride for every run, familiar pegasus feel, returns for you to help you accomplish your goals. Breathable mesh upper.",
        price: 899,
        category: "Shoes",
        image_url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/89f9277d-780c-4573-8902-613861214e26/air-zoom-pegasus-40-road-running-shoes-6ps22p.png"
    },
    {
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30-hour battery life.",
        price: 2499,
        category: "Electronics",
        image_url: "https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        name: "MacBook Air M2",
        description: "Strikingly thin design. M2 chip for incredible speed and battery life. 13.6-inch Liquid Retina display. Big-time battery life.",
        price: 8999,
        category: "Electronics",
        image_url: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665"
    },
    {
        name: "Adidas Ultraboost Light",
        description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole.",
        price: 1399,
        category: "Shoes",
        image_url: "https://assets.adidas.com/images/w_600,f_auto,q_auto/5f65eb0090884daea821af0300a7019f_9366/Ultraboost_Light_Running_Shoes_White_HQ6351_01_standard.jpg"
    },
    {
        name: "Dyson V15 Detect",
        description: "Laser reveals microscopic dust. Intelligently optimizes suction and run time. Scientific proof of deep cleaning.",
        price: 5499,
        category: "Home",
        image_url: "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/vacuum-cleaners/cordless-stick-vacuums/v15-detect/v15-detect-gl-gold/V15-Detect-Gold-Primary-560x560.png"
    },
    {
        name: "IKEA POÄNG Armchair",
        description: "Layer-glued bent birch frame gives comfortable resilience. The high back provides good support for your neck.",
        price: 499,
        category: "Furniture",
        image_url: "https://www.ikea.com/us/en/images/products/poaeng-armchair-white-stained-oak-veneer-knisa-light-beige__0837284_pe778732_s5.jpg"
    }
]

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient()

        const results = []

        for (const product of SAMPLE_PRODUCTS) {
            // 生成 embedding
            // 我们把 标题 + 描述 + 分类 组合在一起生成向量
            const contentToEmbed = `${product.name} ${product.description} Category: ${product.category}`

            const { embedding } = await embed({
                model: google.textEmbeddingModel("text-embedding-004"),
                value: contentToEmbed,
            })

            // 存入数据库
            const { data, error } = await supabase.from('products').insert({
                ...product,
                embedding
            }).select()

            if (error) {
                console.error('Error inserting product:', error)
            } else {
                results.push(data[0])
            }
        }

        return NextResponse.json({
            success: true,
            message: `First ${results.length} products seeded successfully!`,
            products: results
        })

    } catch (error) {
        console.error('Seed error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
