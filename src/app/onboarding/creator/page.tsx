'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATS = ['Bangles','Jewelry','Sarees','Clothing','Handicrafts','Pottery','Leather','Accessories','Crochet','Home Decor','Candles','Other']
const ic = "w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"

export default function CreatorOnboarding() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cats, setCats] = useState<string[]>([])
  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [location, setLocation] = useState('')
  const [productionCapacity, setProductionCapacity] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [bio, setBio] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch('/api/auth/creator-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, ownerName, gstNumber, phone, city, state, pincode, location, productionCapacity: Number(productionCapacity) || 0, experienceYears: Number(experienceYears) || 0, bio, categories: cats }),
      })
      if (res.ok) router.push('/creator/dashboard')
      else { const d = await res.json(); alert(d.error || 'Failed to save profile'); }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Set up your Creator Profile</h1><p className="text-gray-500 mt-1 text-sm">Brands will use this to discover and evaluate you</p></div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label><input required autoComplete="off" placeholder="e.g. Lakshmi Bangles" value={businessName} onChange={e => setBusinessName(e.target.value)} className={ic} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label><input required autoComplete="off" placeholder="Your full name" value={ownerName} onChange={e => setOwnerName(e.target.value)} className={ic} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label><input autoComplete="off" placeholder="27XXXXX1234Z1Z5" value={gstNumber} onChange={e => setGstNumber(e.target.value)} className={ic} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input required autoComplete="off" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className={ic} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input required autoComplete="off" placeholder="Jaipur" value={city} onChange={e => setCity(e.target.value)} className={ic} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">State *</label><input required autoComplete="off" placeholder="Rajasthan" value={state} onChange={e => setState(e.target.value)} className={ic} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label><input autoComplete="off" placeholder="302001" value={pincode} onChange={e => setPincode(e.target.value)} className={ic} /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label><input autoComplete="off" placeholder="Street, Area, City" value={location} onChange={e => setLocation(e.target.value)} className={ic} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Capacity (units)</label><input type="number" autoComplete="off" placeholder="500" value={productionCapacity} onChange={e => setProductionCapacity(e.target.value)} className={ic} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label><input type="number" autoComplete="off" placeholder="5" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} className={ic} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Categories *</label>
            <div className="flex flex-wrap gap-2">
              {CATS.map(c => (
                <button key={c} type="button" onClick={() => setCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${cats.includes(c) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">About your business</label><textarea rows={3} placeholder="Describe your craft, specialities…" value={bio} onChange={e => setBio(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white resize-none" /></div>
          <button type="submit" disabled={loading || !businessName || !ownerName || !city || !state || !phone || cats.length === 0}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50">
            {loading ? 'Saving…' : 'Complete Setup →'}
          </button>
        </form>
      </div>
    </div>
  )
}
