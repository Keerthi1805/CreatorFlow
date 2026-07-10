import { requireBrand } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/utils'
import { CollabRequestForm } from '@/components/brand/collab-request-form'
import { Star, MapPin, Package, Clock } from 'lucide-react'
const CATS=['All','Bangles','Jewelry','Sarees','Clothing','Handicrafts','Pottery','Leather','Accessories','Crochet','Home Decor','Candles']
export default async function BrandDiscover({ searchParams }: { searchParams: { category?: string; search?: string } }) {
  const { profile } = await requireBrand()
  const cat=searchParams.category; const search=searchParams.search
  const creators = await prisma.creatorProfile.findMany({
    where:{ ...(cat&&cat!=='All'&&{categories:{has:cat}}), ...(search&&{OR:[{businessName:{contains:search,mode:'insensitive'}},{city:{contains:search,mode:'insensitive'}}]}), isActive:true },
    include:{ user:{select:{name:true,verificationStatus:true}}, products:{where:{isActive:true},take:3} },
    orderBy:{rating:'desc'},
  })
  const sentRequests = await prisma.collabRequest.findMany({ where:{brandId:profile.id}, select:{creatorId:true,status:true} })
  const sentMap = new Map(sentRequests.map(r=>[r.creatorId,r.status]))
  return (
    <div className="space-y-5 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-900">Discover Creators</h1><p className="text-sm text-gray-500">{creators.length} creators on the platform</p></div>
      <form className="flex gap-2"><input name="search" defaultValue={search} placeholder="Search by name or city…" className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/><button type="submit" className="h-10 px-4 bg-emerald-600 text-white text-sm rounded-lg font-semibold hover:bg-emerald-700">Search</button></form>
      <div className="flex gap-2 flex-wrap">{CATS.map(c=><a key={c} href={`?category=${c}`} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${(cat||'All')===c?'bg-emerald-600 text-white border-emerald-600':'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>{c}</a>)}</div>
      <div className="grid grid-cols-3 gap-4">
        {creators.length===0?<div className="col-span-3 bg-white rounded-xl border border-gray-100 shadow-soft p-16 text-center"><p className="text-gray-400 text-sm">No creators found</p></div>
          :creators.map(creator=>{const status=sentMap.get(creator.id);return(
          <div key={creator.id} className="bg-white rounded-xl border border-gray-100 shadow-soft p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-600">{creator.businessName[0]}</div>
                <div><h3 className="text-sm font-semibold">{creator.businessName}</h3><div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><MapPin className="w-3 h-3"/>{creator.city}, {creator.state}</div></div>
              </div>
              {creator.user.verificationStatus==='VERIFIED'&&<span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>}
            </div>
            <div className="flex items-center gap-3 text-xs mb-3">
              <span className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3"/>{creator.rating.toFixed(1)}</span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-gray-500"><Package className="w-3 h-3"/>{creator.productionCapacity?.toLocaleString()}/mo</span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-gray-500"><Clock className="w-3 h-3"/>{creator.experienceYears}yr</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">{creator.categories.map((c:string)=><span key={c} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{c}</span>)}</div>
            {creator.products.length>0&&<div className="mb-4 space-y-1">{creator.products.map(p=><div key={p.id} className="flex justify-between text-xs text-gray-500"><span className="truncate">{p.name}</span><span className="font-semibold text-gray-900 ml-2 flex-shrink-0">{formatCurrency(p.pricePerUnit)}/unit</span></div>)}</div>}
            <div className="mt-auto">{status?<div className={`h-9 flex items-center justify-center text-xs font-semibold rounded-lg ${status==='ACCEPTED'?'bg-green-50 text-green-600':status==='REJECTED'?'bg-gray-50 text-gray-400':'bg-amber-50 text-amber-600'}`}>{status==='ACCEPTED'?'✓ Connected':status==='REJECTED'?'Request Declined':'Request Pending'}</div>:<CollabRequestForm creatorId={creator.id} creatorName={creator.businessName}/>}</div>
          </div>
        )})}
      </div>
    </div>
  )
}
