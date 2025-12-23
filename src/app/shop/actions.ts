'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addToCart(productId: number | string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const pid = BigInt(productId)

    let cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
    })

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: user.id }
        })
    }

    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId: pid
        }
    })

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + 1 }
        })
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: pid,
                quantity: 1
            }
        })
    }

    revalidatePath('/shop')
    revalidatePath('/shop/cart')
}

export async function recordHistory(userId: string, productId: number | string) {
    try {
        // Upsert? Or just create?
        // Let's remove old entry for same product and add new one to update timestamp
        // But Prisma doesn't support easy upsert on non-unique fields easily without composite unique key.
        // Let's just create for now, or check exists.
        // Better: delete old history for this product/user to keep only latest
        const pid = BigInt(productId)

        // Use a transaction or just simple calls
        await prisma.browseHistory.deleteMany({
            where: {
                userId,
                productId: pid
            }
        })

        await prisma.browseHistory.create({
            data: {
                userId,
                productId: pid
            }
        })

    } catch (e) {
        console.error('Failed to record history', e)
    }
}

export async function getBrowseHistory() {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return []

        const history = await prisma.browseHistory.findMany({
            where: { userId: user.id },
            orderBy: { viewedAt: 'desc' },
            take: 10,
            include: {
                product: true
            }
        })

        return history.map(h => h.product)
    } catch (e) {
        console.error('Failed to get browse history:', e)
        return []
    }
}
