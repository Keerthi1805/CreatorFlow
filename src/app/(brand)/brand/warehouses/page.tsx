'use client'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Warehouse, Plus, X } from 'lucide-react'
export default function BrandWarehouses() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const qc = useQueryClient()
  const [name,setName]=useState(''); const [address,setAddress]=useState(''); const [city,setCity]=useState(''); const [state,setState]=useState(''); const [pincode,setPincode]=useState(''); const [contactPerson,setContactPerson]=useState(''); const [phone,setPhone]=useState(''); const [operatingHours,setOperatingHours]=useState(''); const [instructions,setInstructions]=useState('')
  const { data } = useQuery({ queryKey:['warehouses'], queryFn:async()=>{const r=await fetch('/api/warehouses');return r.json()} })
  const warehouses=data?.data??[]
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    await fetch('/api/warehouses',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,address,city,state,pincode,contactPerson,phone,operatingHours,instructions})})
    setLoading(false); setShowForm(false)
    setName('');setAddress('');setCity('');setState('');setPincode('');setContactPerson('');setPhone('');setOperatingHours('');setInstructions('')
    qc.invalidateQueries({queryKey:['warehouses']})
  }
  const ic="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Warehouses</h1><p className="text-sm text-gray-500">{warehouses.length} locations</p></div>
        <button onClick={()=>setShowForm(true)} className="h-10 px-4 bg-emerald-600 text-white text-sm rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2"><Plus className="w-4 h-4"/>Add Warehouse</button>
      </div>
      {showForm&&<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">Add Warehouse</h3><button onClick={()=>setShowForm(false)}><X className="w-4 h-4 text-gray-400"/></button></div>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500 block mb-1">Name *</label><input required autoComplete="off" value={name} onChange={e=>setName(e.target.value)} placeholder="Mumbai Main Warehouse" className={ic}/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Contact Person *</label><input required autoComplete="off" value={contactPerson} onChange={e=>setContactPerson(e.target.value)} placeholder="Ravi Kumar" className={ic}/></div>
            </div>
            <div><label className="text-xs text-gray-500 block mb-1">Address *</label><input required autoComplete="off" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Building, Street, Area" className={ic}/></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs text-gray-500 block mb-1">City *</label><input required autoComplete="off" value={city} onChange={e=>setCity(e.target.value)} placeholder="Mumbai" className={ic}/></div>
              <div><label className="text-xs text-gray-500 block mb-1">State *</label><input required autoComplete="off" value={state} onChange={e=>setState(e.target.value)} placeholder="Maharashtra" className={ic}/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Pincode *</label><input required autoComplete="off" value={pincode} onChange={e=>setPincode(e.target.value)} placeholder="400001" className={ic}/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500 block mb-1">Phone *</label><input required autoComplete="off" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98765 43210" className={ic}/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Operating Hours</label><input autoComplete="off" value={operatingHours} onChange={e=>setOperatingHours(e.target.value)} placeholder="Mon-Sat 9am-6pm" className={ic}/></div>
            </div>
            <div><label className="text-xs text-gray-500 block mb-1">Instructions</label><textarea rows={2} value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Entry gate, unloading instructions…" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/></div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={()=>setShowForm(false)} className="flex-1 h-9 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading||!name||!city} className="flex-1 h-9 bg-emerald-600 text-white text-sm rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50">{loading?'Adding…':'Add Warehouse'}</button>
            </div>
          </form>
        </div>
      </div>}
      {warehouses.length===0?<div className="bg-white rounded-xl border border-gray-100 shadow-soft p-16 text-center"><Warehouse className="w-10 h-10 text-gray-200 mx-auto mb-3"/><p className="text-sm text-gray-400">No warehouses yet</p></div>
        :<div className="grid grid-cols-2 gap-4">{warehouses.map((w:any)=>(
          <div key={w.id} className={`bg-white rounded-xl border shadow-soft p-5 ${w.isDefault?'border-emerald-200':'border-gray-100'}`}>
            {w.isDefault&&<span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">Default</span>}
            <h3 className="text-sm font-semibold mt-2">{w.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{w.address}</p>
            <p className="text-xs text-gray-500">{w.city}, {w.state} — {w.pincode}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <p>👤 {w.contactPerson} · {w.phone}</p>
              {w.operatingHours&&<p className="mt-0.5">🕐 {w.operatingHours}</p>}
              {w.instructions&&<p className="mt-0.5 text-gray-400 italic">"{w.instructions}"</p>}
            </div>
          </div>
        ))}</div>}
    </div>
  )
}
