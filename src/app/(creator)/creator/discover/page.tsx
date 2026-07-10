import { requireCreator } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BrandRequestForm } from '@/components/creator/brand-request-form'
import { MapPin, Globe, CheckCircle2 } from 'lucide-react'
const CATS=['All','Bangles','Jewelry','Sarees','Clothing','Handicrafts','Pottery','Leather','Accessories','Crochet','Home Decor','Candles']
export default async function CreatorDiscover({ searchParams }: { searchParams: { category?: string; search?: string } }) {
  const { profile } = await requireCreator()
  const cat=searchParams.category; const search=searchParams.search
  const brands = await prisma.brandProfile.findMany({
    where:{ ...(cat&&cat!=='All'&&{categories:{has:cat}}), ...(search&&{OR:[{companyName:{contains:search,mode:'insensitive'}},{contactPerson:{contains:search,mode:'insensitive'}}]}), isActive:true },
    include:{ user:{select:{verificationStatus:true}}, warehouses:{select:{city:true,state:true},take:1} },
    orderBy:{ createdAt:'desc' },
  })
  const sentRequests = await prisma.collabRequest.findMany({ where:{creatorId:profile.id}, select:{brandId:true,status:true} })
  const sentMap = new Map(sentRequests.map(r=>[r.brandId,r.status]))
  return (
    <div className="space-y-5 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-900">Discover Brands</h1><p className="text-sm text-gray-500">{brands.length} brands on the platform</p></div>
      <form className="flex gap-2"><input name="search" defaultValue={search} placeholder="Search by company name…" className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /><button type="submit" className="h-10 px-4 bg-indigo-600 text-white text-sm rounded-lg font-semibold hover:bg-indigo-700">Search</button></form>
      <div className="flex gap-2 flex-wrap">{CATS.map(c=><a key={c} href={`?category=${c}`} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${(cat||'All')===c?'bg-indigo-600 text-white border-indigo-600':'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>{c}</a>)}</div>
      <div className="grid grid-cols-3 gap-4">
        {brands.length===0?<div className="col-span-3 bg-white rounded-xl border border-gray-100 shadow-soft p-16 text-center"><p className="text-gray-400 text-sm">No brands found</p></div>
          :brands.map(brand=>{const status=sentMap.get(brand.id);return(
          <div key={brand.id} className="bg-white rounded-xl border border-gray-100 shadow-soft p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-lg font-bold text-emerald-600">{brand.companyName[0]}</div>
                <div><h3 className="text-sm font-semibold text-gray-900">{brand.companyName}</h3><p className="text-xs text-gray-400">{brand.contactPerson}</p></div>
              </div>
              {brand.user.verificationStatus==='VERIFIED'&&<span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">✓ Verified</span>}
            </div>
            {brand.warehouses[0]&&<div className="flex items-center gap-1 text-xs text-gray-400 mb-2"><MapPin className="w-3 h-3"/>{brand.warehouses[0].city}, {brand.warehouses[0].state}</div>}
            {brand.website&&<div className="flex items-center gap-1 text-xs text-gray-400 mb-3"><Globe className="w-3 h-3"/>{brand.website}</div>}
            <div className="flex flex-wrap gap-1 mb-3">{brand.categories.map((c:string)=><span key={c} className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{c}</span>)}</div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Total Orders</p><p className="font-semibold">{brand.totalOrders}</p></div>
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Active Creators</p><p className="font-semibold">{brand.activeCreators}</p></div>
            </div>
            <div className="mt-auto">{status?<div className={`h-9 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg ${status==='ACCEPTED'?'bg-green-50 text-green-600':status==='REJECTED'?'bg-gray-50 text-gray-400':'bg-amber-50 text-amber-600'}`}>{status==='ACCEPTED'&&<CheckCircle2 className="w-3.5 h-3.5"/>}{status==='ACCEPTED'?'Connected':status==='REJECTED'?'Request Declined':'Request Pending'}</div>:<BrandRequestForm brandId={brand.id} brandName={brand.companyName} />}</div>
          </div>
        )})}
      </div>
    </div>
  )
}
