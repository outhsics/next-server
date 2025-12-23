import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import Image from 'next/image'
// 优化 2: 动态导入
// 只有当组件真的需要被渲染时，才会加载它的 JS 代码
import dynamic from 'next/dynamic'
import Link from 'next/link'
import SeedButton from './SeedButton'
import AddToCartButton from './AddToCartButton'
import RecentlyViewed from './RecentlyViewed'

const ChatWidget = dynamic(() => import('./ChatWidget'), {
    ssr: false, // 客服组件只在客户端渲染
    loading: () => <div className="fixed bottom-6 right-6 w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
})

// 增加 SQL 操作：支持按分类筛选
async function getProducts(category?: string) {
    const supabase = createClient()
    let query = supabase.from('products').select('*').order('id')

    // SQL: WHERE category = 'xxx'
    if (category && category !== '全部') {
        query = query.eq('category', category)
    }

    const { data } = await query
    return data as Product[]
}

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
    const currentCategory = searchParams.category || '全部'
    const products = await getProducts(currentCategory) || []

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 z-10 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link href="/shop" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-80 transition-opacity">
                        🛍️ AI 商城 V2
                    </Link>

                    <nav className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                        {[
                            { name: '全部', id: '全部' },
                            { name: '鞋类', id: '鞋类' },
                            { name: '数码', id: '数码' },
                            { name: '家具', id: '家具' },
                            { name: '家居', id: '家居' },
                        ].map((item) => (
                            <Link
                                key={item.id}
                                href={`/shop${item.id === '全部' ? '' : `?category=${item.id}`}`}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${currentCategory === item.id || (currentCategory === '全部' && item.id === '全部')
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center">
                        <Link href="/shop/cart" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative" title="查看购物车">
                            <span className="text-xl">🛒</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">

                {/* Banner */}
                <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-3xl mb-8 shadow-lg shadow-blue-200">
                    <h1 className="text-3xl font-bold mb-2">当前分类: {currentCategory}</h1>
                    <p className="opacity-90">探索 AI 驱动的智能购物体验</p>
                </header>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl text-gray-600 mb-4">暂无 {currentCategory} 类商品</h3>
                        {currentCategory === '全部' && (
                            <>
                                <p className="mb-8">点击下方按钮初始化测试数据</p>
                                <SeedButton />
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link href={`/shop/product/${product.id}`} key={product.id} className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 flex flex-col h-full">
                                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                                        <Image
                                            src={product.image_url || 'https://via.placeholder.com/400'}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                                            {product.category}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-800 truncate mb-1">{product.name}</h3>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-lg font-bold text-gray-900">¥{product.price}</span>
                                            <AddToCartButton productId={product.id} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Recently Viewed Products */}
                <RecentlyViewed />
            </main>

            {/* Chat Widget - 智能导购浮窗 */}
            <ChatWidget />
        </div>
    )
}

