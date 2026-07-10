'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATS = ['Bangles','Jewelry','Sarees','Clothing','Handicrafts','Pottery','Leather','Accessories','Crochet','Home Decor','Candles','Other']
const ic = "w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"

export default function BrandOnboarding() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cats, setCats] = useState<string[]>([])
  const [companyName, setCompanyName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch('/api/auth/brand-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, contactPerson, gstNumber, phone, website, categories: cats }),
      })
      if (res.ok) router.push('/brand/dashboard')
      else { const d = await res.json(); alert(d.error || 'Failed to save profile'); }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Set up your Brand Profile</h1><p className="text-gray-500 mt-1 text-sm">Creators will use this to understand your sourcing needs</p></div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Company / Brand Name *</label><input required autoComplete="off" placeholder="e.g. Ethnique Retail" value={companyName} onChange={e => setCompanyName(e.target.value)} className={ic} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label><input required autoComplete="off" placeholder="Your full name" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className={ic} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label><input autoComplete="off" placeholder="27XXXXX1234Z1Z5" value={gstNumber} onChange={e => setGstNumber(e.target.value)} className={ic} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input required autoComplete="off" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className={ic} /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Website</label><input autoComplete="off" placeholder="https://yourcompany.com" value={website} onChange={e => setWebsite(e.target.value)} className={ic} /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sourcing Categories *</label>
            <div className="flex flex-wrap gap-2">
              {CATS.map(c => (
                <button key={c} type="button" onClick={() => setCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${cats.includes(c) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>{c}</button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading || !companyName || !contactPerson || !phone || cats.length === 0}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50">
            {loading ? 'Saving…' : 'Complete Setup →'}
          </button>
        </form>
      </div>
    </div>
  )
}
