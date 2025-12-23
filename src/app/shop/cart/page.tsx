import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import CheckoutButton from './CheckoutButton'

export const dynamic = 'force-dynamic' // Ensure we don't cache this page as it depends on user data

export default async function CartPage({ searchParams }: { searchParams: { checkout?: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (searchParams?.checkout === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-2xl font-bold text-green-600 mb-2">支付成功！</h1>
                <p className="text-gray-500 mb-8">感谢您的购买，订单已生成。</p>
                <Link href="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    继续购物
                </Link>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <h1 className="text-2xl font-bold mb-4">请先登录</h1>
                <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg">去登录</Link>
            </div>
        )
    }

    const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
            items: {
                include: {
                    product: true
                },
                orderBy: {
                    id: 'asc'
                }
            }
        },
        orderBy: { updatedAt: 'desc' }
    })

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <div className="text-6xl mb-4">🛒</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">购物车是空的</h1>
                <p className="text-gray-500 mb-8">去挑选一些喜欢的商品吧</p>
                <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
                    去购物
                </Link>
            </div>
        )
    }

    const total = cart.items.reduce((sum, item) => {
        return sum + (Number(item.product.price) * item.quantity)
    }, 0)

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">购物车 ({cart.items.length})</h1>
                    <Link href="/shop" className="text-gray-500 hover:text-black">继续购物</Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl flex gap-4 shadow-sm border border-gray-100">
                                <div className="w-24 h-24 bg-gray-100 rounded-xl relative overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.product.image_url || '/placeholder.png'}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500">{item.product.category}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-red-500">
                                            ✕
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                            <button className="px-3 py-1 hover:bg-gray-50">-</button>
                                            <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                            <button className="px-3 py-1 hover:bg-gray-50">+</button>
                                        </div>
                                        <span className="font-bold text-lg">¥{Number(item.product.price) * item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:w-80">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
                            <h2 className="font-bold text-lg mb-4">订单摘要</h2>

                            <div className="space-y-2 mb-6 text-gray-600">
                                <div className="flex justify-between">
                                    <span>商品总额</span>
                                    <span>¥{total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>运费</span>
                                    <span>{total > 1000 ? '免费' : '¥0.00'}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 mb-6 flex justify-between font-bold text-xl">
                                <span>合计</span>
                                <span>¥{total}</span>
                            </div>

                            <CheckoutButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
