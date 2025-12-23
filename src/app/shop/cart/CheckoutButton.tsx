'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCheckout = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/checkout', {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed')
            }

            // Success
            router.refresh() // Refresh server components to reflect empty cart
            router.push('/shop?checkout=success')

        } catch (error) {
            console.error('Checkout error:', error)
            alert('结算失败，请稍后重试')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                </>
            ) : (
                '立即结算'
            )}
        </button>
    )
}
