import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    const cookieStore = cookies()
    const userId = cookieStore.get('shop-user-id')?.value

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. 查找用户的购物车
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        })

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // 2. 计算总价 (永远在服务器端计算价格，不要信前端传来的)
        let total = 0
        const orderItemsData = cart.items.map(item => {
            const price = Number(item.product.price)
            total += price * item.quantity
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price // 记录当时的单价
            }
        })

        // 3. 数据库事务：创建订单 + 清空购物车
        // $transaction 保证要么全成功，要么全失败
        const order = await prisma.$transaction(async (tx) => {
            // A. 创建订单
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    total: total,
                    status: 'PAID', // 模拟直接支付成功
                    items: {
                        createMany: {
                            data: orderItemsData
                        }
                    }
                }
            })

            // B. 清空购物车项 (但保留购物车空壳)
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            })

            return newOrder
        })

        return NextResponse.json({ success: true, orderId: order.id })

    } catch (error) {
        console.error('Checkout Error:', error)
        return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
    }
}
