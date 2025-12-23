import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '../../AddToCartButton'
import { recordHistory } from '../../actions'

async function getProduct(id: string) {
    const supabase = createClient()
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    return product
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id)

    if (!product) {
        notFound()
    }

    // Record history if logged in
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        // user.id is string
        // product.id is BigInt, passing to action. Action expects number|string.
        // We pass Safe string
        await recordHistory(user.id, product.id.toString())
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <Link href="/shop" className="text-gray-500 hover:text-black mb-6 inline-block">
                    ← 返回商店
                </Link>

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                    {/* 左侧大图 */}
                    <div className="md:w-1/2 bg-gray-100 relative h-[400px] md:h-auto">
                        <Image
                            src={product.image_url || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    {/* 右侧信息 */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">{product.category}</div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl font-bold text-gray-900">¥{Number(product.price)}</span>
                            {Number(product.price) > 1000 && <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">免运费</span>}
                        </div>

                        <div className="flex gap-4">
                            <AddToCartButton productId={product.id.toString()} />
                            <button className="w-16 h-16 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 text-2xl">
                                ❤️
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500 flex gap-6">
                            <span className="flex items-center gap-2">🚚 48小时发货</span>
                            <span className="flex items-center gap-2">🛡️ 7天无理由退换</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
