'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signIn(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Sign in error:', error)
        return redirect('/login?message=' + encodeURIComponent('登录失败: ' + error.message))
    }

    return redirect('/shop')
}

export async function signUp(formData: FormData) {
    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error('Sign up error:', error)
        return redirect('/login?message=' + encodeURIComponent('注册失败: ' + error.message))
    }

    return redirect('/login?message=' + encodeURIComponent('请检查您的邮箱以完成注册'))
}
