'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
const CATS=['Bangles','Jewelry','Sarees','Clothing','Handicrafts','Pottery','Leather','Accessories','Crochet','Home Decor','Candles','Other']
const ic="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
export default function EditCreatorProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
  const [bankAccount, setBankAccount] = useState('')
  const [ifscCode, setIfscCode] = useState('')

  useEffect(() => {
    fetch('/api/auth/creator-profile')
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const p = d.data
          setBusinessName(p.businessName || '')
          setOwnerName(p.ownerName || '')
          setGstNumber(p.gstNumber || '')
          setPhone(p.phone || '')
          setCity(p.city || '')
          setState(p.state || '')
          setPincode(p.pincode || '')
          setLocation(p.location || '')
          setProductionCapacity(String(p.productionCapacity || ''))
          setExperienceYears(String(p.experienceYears || ''))
          setBio(p.bio || '')
          setCats(p.categories || [])
          setBankAccount(p.bankAccount || '')
          setIfscCode(p.ifscCode || '')
        }
        setLoading(false)
      })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/auth/creator-profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName, ownerName, gstNumber, phone, city, state, pincode, location, productionCapacity: Number(productionCapacity) || 0, experienceYears: Number(experienceYears) || 0, bio, categories: cats, bankAccount, ifscCode }),
    })
    setSaving(false)
    router.push('/creator/profile')
  }

  if (loading) return <div className="p-8 text-center text-gray-400 text-sm">Loading profile…</div>

  return (
    <div className="max-w-2xl animate-fade-in">
      <Link href="/creator/profile" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5"><ArrowLeft className="w-4 h-4" /> Back to Profile</Link>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Edit Profile</h1>
      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 shadow-soft p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label><input required autoComplete="off" value={businessName} onChange={e => setBusinessName(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label><input required autoComplete="off" value={ownerName} onChange={e => setOwnerName(e.target.value)} className={ic} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label><input autoComplete="off" value={gstNumber} onChange={e => setGstNumber(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input autoComplete="off" value={phone} onChange={e => setPhone(e.target.value)} className={ic} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input required autoComplete="off" value={city} onChange={e => setCity(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">State *</label><input required autoComplete="off" value={state} onChange={e => setState(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label><input autoComplete="off" value={pincode} onChange={e => setPincode(e.target.value)} className={ic} /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label><input autoComplete="off" value={location} onChange={e => setLocation(e.target.value)} className={ic} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Capacity (units)</label><input type="number" autoComplete="off" value={productionCapacity} onChange={e => setProductionCapacity(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label><input type="number" autoComplete="off" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} className={ic} /></div>
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
        <div><label className="block text-sm font-medium text-gray-700 mb-1">About your business</label><textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Bank Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label><input autoComplete="off" value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="Account number" className={ic} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label><input autoComplete="off" value={ifscCode} onChange={e => setIfscCode(e.target.value)} placeholder="SBIN0001234" className={ic} /></div>
          </div>
        </div>
        <button type="submit" disabled={saving || !businessName || !city || cats.length === 0} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm disabled:opacity-50">{saving ? 'Saving…' : 'Save Changes'}</button>
      </form>
    </div>
  )
}
