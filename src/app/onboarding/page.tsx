'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  async function choose(role: 'CREATOR' | 'BRAND') {
    setLoading(true)
    await user?.update({ unsafeMetadata: { role } })
    await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) })
    setLoading(false)
    router.push(role === 'CREATOR' ? '/onboarding/creator' : '/onboarding/brand')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg"><span className="text-white text-xl font-bold">C</span></div>
            <span className="text-3xl font-bold text-gray-900">CraftFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Welcome! How will you use CraftFlow?</h1>
          <p className="text-gray-500 mt-2 text-sm">Choose your role to set up your account</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[
            { role: 'CREATOR' as const, emoji: '🎨', title: "I'm a Creator", desc: 'Artisan, manufacturer, or designer selling wholesale to brands', examples: ['Bangle Maker','Jewelry Designer','Saree Manufacturer','Handicraft Artist','Candle Maker'], color: 'hover:border-indigo-400 hover:shadow-card', badge: 'bg-indigo-400' },
            { role: 'BRAND' as const, emoji: '🏢', title: "I'm a Brand", desc: 'Retailer or marketplace sourcing products from verified creators', examples: ['Fashion Retailer','Jewelry Brand','Marketplace Seller','Boutique Owner','eCommerce Brand'], color: 'hover:border-emerald-400 hover:shadow-card', badge: 'bg-emerald-400' },
          ].map(item => (
            <button key={item.role} onClick={() => choose(item.role)} disabled={loading}
              className={`group bg-white border-2 border-gray-200 ${item.color} rounded-2xl p-8 text-left transition-all disabled:opacity-50`}>
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
              <div className="mt-4 space-y-1">
                {item.examples.map(e => (
                  <div key={e} className="flex items-center gap-2 text-xs text-gray-400">
                    <span className={`w-1 h-1 rounded-full ${item.badge}`} />{e}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
        {loading && <p className="text-center text-sm text-gray-400 mt-6">Setting up your account…</p>}
      </div>
    </div>
  )
}
