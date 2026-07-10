'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
export default function NewOrder() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [creators, setCreators] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedCreator, setSelectedCreator] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [items, setItems] = useState([{ productId:'', productName:'', quantity:'', unitPrice:'' }])
  const [warehouseId, setWarehouseId] = useState('')
  const [colorVariants, setColorVariants] = useState('')
  const [materialRequirements, setMaterialRequirements] = useState('')
  const [packagingInstructions, setPackagingInstructions] = useState('')
  const [privateLabelRequired, setPrivateLabelRequired] = useState(false)
  const [brandLogoRequired, setBrandLogoRequired] = useState(false)
  const [deliveryDeadline, setDeliveryDeadline] = useState('')
  const [advanceAmount, setAdvanceAmount] = useState('')
  const [notes, setNotes] = useState('')
  useEffect(()=>{
    fetch('/api/creators').then(r=>r.json()).then(d=>setCreators(d.data??[]))
    fetch('/api/warehouses').then(r=>r.json()).then(d=>setWarehouses(d.data??[]))
  },[])
  useEffect(()=>{
    if(!selectedCreator){setProducts([]);return}
    const c=creators.find((c:any)=>c.id===selectedCreator)
    setProducts(c?.products??[])
  },[selectedCreator,creators])
  function addItem(){setItems(i=>[...i,{productId:'',productName:'',quantity:'',unitPrice:''}])}
  function removeItem(i:number){setItems(items=>items.filter((_,idx)=>idx!==i))}
  function updateItem(i:number,field:string,value:string){
    setItems(items=>items.map((item,idx)=>{
      if(idx!==i)return item
      const u={...item,[field]:value}
      if(field==='productId'){const p=products.find((p:any)=>p.id===value);if(p){u.productName=p.name;u.unitPrice=String(p.pricePerUnit)}}
      return u
    }))
  }
  const total=items.reduce((s,i)=>s+(Number(i.quantity)||0)*(Number(i.unitPrice)||0),0)
  async function submit(e:React.FormEvent){
    e.preventDefault();setLoading(true)
    const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({creatorId:selectedCreator,warehouseId:warehouseId||undefined,items:items.map(i=>({productId:i.productId,productName:i.productName,quantity:Number(i.quantity),unitPrice:Number(i.unitPrice)})),colorVariants:colorVariants.split(',').map(s=>s.trim()).filter(Boolean),materialRequirements,packagingInstructions,privateLabelRequired,brandLogoRequired,deliveryDeadline:deliveryDeadline||undefined,advanceAmount:Number(advanceAmount)||0,notes})})
    setLoading(false)
    if(res.ok)router.push('/brand/orders')
  }
  const ic="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
  return (
    <div className="max-w-3xl animate-fade-in">
      <Link href="/brand/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5"><ArrowLeft className="w-4 h-4"/>Back</Link>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Place New Order</h1>
      <form onSubmit={submit} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-5">
          <h2 className="text-sm font-semibold mb-3">Select Creator *</h2>
          <select required value={selectedCreator} onChange={e=>setSelectedCreator(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="">-- Select a creator --</option>
            {creators.map((c:any)=><option key={c.id} value={c.id}>{c.businessName} — {c.city}</option>)}
          </select>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-5">
          <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold">Order Items *</h2><button type="button" onClick={addItem} className="text-xs text-emerald-600 hover:underline flex items-center gap-1"><Plus className="w-3.5 h-3.5"/>Add Item</button></div>
          <div className="space-y-3">
            {items.map((item,i)=>(
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">{i===0&&<label className="text-xs text-gray-500 block mb-1">Product</label>}
                  <select required value={item.productId} onChange={e=>updateItem(i,'productId',e.target.value)} disabled={!selectedCreator} className={`${ic} disabled:bg-gray-50`}>
                    <option value="">-- Select product --</option>
                    {products.map((p:any)=><option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-span-3">{i===0&&<label className="text-xs text-gray-500 block mb-1">Qty</label>}<input type="number" required placeholder="100" value={item.quantity} onChange={e=>updateItem(i,'quantity',e.target.value)} className={ic}/></div>
                <div className="col-span-3">{i===0&&<label className="text-xs text-gray-500 block mb-1">Unit Price (₹)</label>}<input type="number" required placeholder="120" value={item.unitPrice} onChange={e=>updateItem(i,'unitPrice',e.target.value)} className={ic}/></div>
                <div className="col-span-1 flex items-center justify-center">{items.length>1&&<button type="button" onClick={()=>removeItem(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>}</div>
              </div>
            ))}
          </div>
          {total>0&&<div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm"><span className="text-gray-500">Total</span><span className="font-bold">₹{total.toLocaleString('en-IN')}</span></div>}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-5">
          <h2 className="text-sm font-semibold mb-3">Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 block mb-1">Color Variants (comma separated)</label><input placeholder="Red, Blue, Green" value={colorVariants} onChange={e=>setColorVariants(e.target.value)} className={ic}/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Delivery Deadline</label><input type="date" value={deliveryDeadline} onChange={e=>setDeliveryDeadline(e.target.value)} className={ic}/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Material Requirements</label><input placeholder="Premium lac only…" value={materialRequirements} onChange={e=>setMaterialRequirements(e.target.value)} className={ic}/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Advance Amount (₹)</label><input type="number" placeholder="0" value={advanceAmount} onChange={e=>setAdvanceAmount(e.target.value)} className={ic}/></div>
          </div>
          <div className="mt-3"><label className="text-xs text-gray-500 block mb-1">Packaging Instructions</label><textarea rows={2} placeholder="Individual pouch per set…" value={packagingInstructions} onChange={e=>setPackagingInstructions(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/></div>
          <div className="mt-3 flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={privateLabelRequired} onChange={e=>setPrivateLabelRequired(e.target.checked)} className="w-4 h-4 accent-emerald-600"/>Private Label</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={brandLogoRequired} onChange={e=>setBrandLogoRequired(e.target.checked)} className="w-4 h-4 accent-emerald-600"/>Brand Logo</label>
          </div>
        </div>
        {warehouses.length>0&&<div className="bg-white rounded-xl border border-gray-100 shadow-soft p-5"><h2 className="text-sm font-semibold mb-3">Ship To Warehouse</h2><select value={warehouseId} onChange={e=>setWarehouseId(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"><option value="">-- Select warehouse --</option>{warehouses.map((w:any)=><option key={w.id} value={w.id}>{w.name} — {w.city}</option>)}</select></div>}
        <button type="submit" disabled={loading||!selectedCreator||items.every(i=>!i.productId)} className="w-full h-12 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50">{loading?'Placing Order…':'Place Order & Notify Creator'}</button>
      </form>
    </div>
  )
}
