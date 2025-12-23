import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const cookieStore = cookies()
    const userId = cookieStore.get('shop-user-id')?.value

    if (!userId) {
        return NextResponse.json({ items: [] })
    }

    try {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    },
                    orderBy: {
                        productId: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(cart || { items: [] })
    } catch (error) {
        console.error('Cart GET Error:', error)
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = cookies()
    const userId = cookieStore.get('shop-user-id')?.value

    if (!userId) {
        return NextResponse.json({ error: 'User ID missing' }, { status: 400 })
    }

    const body = await req.json()
    const { productId, quantity } = body

    if (!productId) {
        return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    try {
        // 1. 确保购物车存在
        let cart = await prisma.cart.findFirst({
            where: { userId }
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId }
            })
        }

        // 2. 检查商品是否已在购物车
        // upsert: 如果存在就更新数量，不存在就创建
        // 但 prisma upsert 只能基于 @unique 字段。我们可以手动查一下
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: BigInt(productId)
            }
        })

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + (quantity || 1) }
            })
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: BigInt(productId),
                    quantity: quantity || 1
                }
            })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Cart POST Error:', error)
        return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
    }
}
