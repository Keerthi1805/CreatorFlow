'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
const CATS=['Bangles','Jewelry','Sarees','Clothing','Handicrafts','Pottery','Leather','Accessories','Crochet','Home Decor','Candles','Other']
const ic="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
export default function EditBrandProfile() {
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [cats,setCats]=useState<string[]>([])
  const [companyName,setCompanyName]=useState('')
  const [contactPerson,setContactPerson]=useState('')
  const [gstNumber,setGstNumber]=useState('')
  const [phone,setPhone]=useState('')
  const [website,setWebsite]=useState('')
  useEffect(()=>{
    fetch('/api/auth/brand-profile').then(r=>r.json()).then(d=>{
      if(d.data){const p=d.data;setCompanyName(p.companyName||'');setContactPerson(p.contactPerson||'');setGstNumber(p.gstNumber||'');setPhone(p.phone||'');setWebsite(p.website||'');setCats(p.categories||[])}
      setLoading(false)
    })
  },[])
  async function submit(e:React.FormEvent){
    e.preventDefault();setSaving(true)
    await fetch('/api/auth/brand-profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({companyName,contactPerson,gstNumber,phone,website,categories:cats})})
    setSaving(false);router.push('/brand/profile')
  }
  if(loading) return <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
  return (
    <div className="max-w-2xl animate-fade-in">
      <Link href="/brand/profile" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5"><ArrowLeft className="w-4 h-4"/>Back to Profile</Link>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Edit Brand Profile</h1>
      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 shadow-soft p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label><input required autoComplete="off" value={companyName} onChange={e=>setCompanyName(e.target.value)} className={ic}/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label><input required autoComplete="off" value={contactPerson} onChange={e=>setContactPerson(e.target.value)} className={ic}/></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label><input autoComplete="off" value={gstNumber} onChange={e=>setGstNumber(e.target.value)} className={ic}/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input autoComplete="off" value={phone} onChange={e=>setPhone(e.target.value)} className={ic}/></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Website</label><input autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://yourcompany.com" className={ic}/></div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sourcing Categories *</label>
          <div className="flex flex-wrap gap-2">{CATS.map(c=><button key={c} type="button" onClick={()=>setCats(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c])} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${cats.includes(c)?'bg-emerald-600 text-white border-emerald-600':'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>{c}</button>)}</div>
        </div>
        <button type="submit" disabled={saving||!companyName||!contactPerson||cats.length===0} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm disabled:opacity-50">{saving?'Saving…':'Save Changes'}</button>
      </form>
    </div>
  )
}
