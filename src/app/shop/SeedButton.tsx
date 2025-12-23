'use client'

import { useState } from 'react'

export default function SeedButton() {
    const [loading, setLoading] = useState(false)

    const handleSeed = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/seed', { method: 'POST' })
            const data = await res.json()
            if (data.success) {
                alert('数据初始化成功！页面将刷新')
                window.location.reload()
            } else {
                alert('初始化失败: ' + JSON.stringify(data))
            }
        } catch (e) {
            alert('Error: ' + e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleSeed}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? '正在进货中...' : '一键初始化商品数据'}
        </button>
    )
}
