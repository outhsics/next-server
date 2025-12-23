
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { SubmitButton } from './SubmitButton'
import { AnonymousLoginButton } from './AnonymousLoginButton'

export default function Login({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    const signIn = async (formData: FormData) => {
        'use server'

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

    const signUp = async (formData: FormData) => {
        'use server'

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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-full bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm text-foreground font-medium"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                返回首页
            </Link>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🛍️</div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">登录商城</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">选择您喜欢的登录方式</p>
                    </div>

                    {/* 快捷登录区 */}
                    <div className="space-y-3 mb-8">
                        {/* 微信登录 (模拟) */}
                        <button type="button" className="w-full bg-[#07C160] hover:bg-[#06ad56] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8 8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" opacity="0"></path><path d="M17 10c.8 0 1.5-.4 1.8-1 .4-.8.2-1.7-.4-2.3-.6-.6-1.5-.8-2.3-.4-.6.3-1 .9-1 1.7 0 1.1.9 2 1.9 2zm-6 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm8.5 5c0-2.5-2.2-4.5-5-4.5-.3 0-.6 0-.8.1-.5-2.2-2.5-3.8-4.9-3.8-2.8 0-5 2.2-5 5 0 1.5.7 2.8 1.7 3.7-.1.4-.2 1-.3 1.1-.1.2-.2.4-.2.5 0 .3.2.5.5.5.1 0 .2 0 .3-.1l1.7-.9c.7.3 1.5.4 2.3.4 1 0 1.9-.3 2.7-.8.5.5 1.1.8 1.8.8 2.8 0 5-2 5-4.5z" /></svg>
                            微信一键登录
                        </button>

                        <div className="relative flex py-2 items-center">
                            <span className="flex-shrink-0 mx-auto text-gray-400 text-xs">或</span>
                        </div>

                        {/* 匿名登录 */}
                        <AnonymousLoginButton className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]" />
                    </div>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">邮箱账号登录</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                    </div>

                    <form className="flex flex-col gap-4 text-foreground">
                        <div className="space-y-1">
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                name="email"
                                placeholder="请输入邮箱"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                type="password"
                                name="password"
                                placeholder="请输入密码"
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <SubmitButton
                                formAction={signIn}
                                className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
                                pendingText="登录中..."
                            >
                                邮箱登录
                            </SubmitButton>

                            <SubmitButton
                                formAction={signUp}
                                className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
                                pendingText="注册中..."
                            >
                                注册新号
                            </SubmitButton>
                        </div>

                        {searchParams?.message && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
                                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                                    {decodeURIComponent(searchParams.message)}
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

