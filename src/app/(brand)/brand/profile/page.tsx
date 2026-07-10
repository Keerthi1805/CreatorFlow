import { requireBrand } from '@/lib/auth'
import { formatDate, formatCurrency } from '@/utils'
import Link from 'next/link'
import { Edit, Globe, Phone } from 'lucide-react'
export default async function BrandProfile() {
  const { profile, user } = await requireBrand()
  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-gray-900">Brand Profile</h1><Link href="/brand/profile/edit" className="h-9 px-4 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2"><Edit className="w-4 h-4"/>Edit Profile</Link></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600">{profile.companyName[0]}</div>
          <div><h2 className="text-lg font-bold">{profile.companyName}</h2><p className="text-sm text-gray-500">{profile.contactPerson}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              {profile.phone&&<span className="flex items-center gap-1"><Phone className="w-3 h-3"/>{profile.phone}</span>}
              {profile.website&&<span className="flex items-center gap-1"><Globe className="w-3 h-3"/>{profile.website}</span>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs mb-5">
          <div className="bg-emerald-50 rounded-lg p-3"><p className="text-emerald-400">Total Spend</p><p className="font-bold text-emerald-700 mt-1">{formatCurrency(profile.totalSpend)}</p></div>
          <div className="bg-indigo-50 rounded-lg p-3"><p className="text-indigo-400">Total Orders</p><p className="font-bold text-indigo-700 mt-1">{profile.totalOrders}</p></div>
          <div className="bg-purple-50 rounded-lg p-3"><p className="text-purple-400">Active Creators</p><p className="font-bold text-purple-700 mt-1">{profile.activeCreators}</p></div>
        </div>
        <div className="mb-4"><p className="text-xs text-gray-400 mb-2">Sourcing Categories</p><div className="flex flex-wrap gap-2">{profile.categories.map((c:string)=><span key={c} className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{c}</span>)}</div></div>
        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1"><p>Email: {user.email}</p>{profile.gstNumber&&<p>GST: {profile.gstNumber}</p>}<p>Member since {formatDate(user.createdAt)}</p></div>
      </div>
    </div>
  )
}
