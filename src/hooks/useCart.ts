'use client'

import { useState, useEffect } from 'react'

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getCookie(name: string) {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null
}

function setCookie(name: string, value: string, days: number) {
    if (typeof document === 'undefined') return
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function useCart() {
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // 初始化 User ID
    useEffect(() => {
        let id = getCookie('shop-user-id')
        if (!id) {
            id = generateUUID()
            setCookie('shop-user-id', id, 30) // 30 days
        }
        setUserId(id)
    }, [])

    const addToCart = async (productId: number) => {
        if (!userId) return
        setLoading(true)
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ productId }),
                headers: { 'Content-Type': 'application/json' }
            })
            if (!res.ok) throw new Error('Add Failed')
            // Option: refresh cart state here or just alert
            alert('已加入购物车！')
        } catch (e) {
            alert('添加失败，请重试')
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return { userId, addToCart, loading }
}
