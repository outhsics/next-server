'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function AnonymousLoginButton({ className }: { className?: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAnonymousLogin = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInAnonymously()
            if (error) {
                console.error('Anonymous login failed:', error)
                alert('登录失败，请确保在 Supabase 后台 Authentication -> Providers 中开启了 "Anonymous Sign-ins"。')
            } else {
                router.refresh()
                router.push('/shop')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleAnonymousLogin}
            disabled={loading}
            className={cn("flex items-center justify-center gap-2", className)}
        >
            {loading ? '登录中...' : '游客一键免密/免注册登录'}
        </button>
    )
}
