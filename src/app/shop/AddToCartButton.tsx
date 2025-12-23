'use client'

import { useTransition } from 'react'
import { addToCart } from './actions'

export default function AddToCartButton({ productId }: { productId: number | string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <button
            onClick={() => startTransition(() => addToCart(productId))}
            disabled={isPending}
            className={`
                bg-black text-white px-4 py-2 rounded-lg text-sm font-bold 
                transition-all active:scale-95
                ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-80'}
            `}
        >
            {isPending ? '添加中...' : '加入购物车'}
        </button>
    )
}
