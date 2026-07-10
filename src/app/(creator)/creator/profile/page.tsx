import { requireCreator } from '@/lib/auth'
import { formatDate } from '@/utils'
import Link from 'next/link'
import { Edit } from 'lucide-react'
export default async function CreatorProfile() {
  const { profile, user } = await requireCreator()
  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-gray-900">My Profile</h1><Link href="/creator/profile/edit" className="h-9 px-4 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2"><Edit className="w-4 h-4"/>Edit Profile</Link></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">{profile.businessName[0]}</div>
          <div><h2 className="text-lg font-bold text-gray-900">{profile.businessName}</h2><p className="text-sm text-gray-500">{profile.ownerName}</p><p className="text-xs text-gray-400 mt-1">{profile.city}, {profile.state}</p></div>
        </div>
        {profile.bio&&<p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">{profile.bio}</p>}
        <div className="grid grid-cols-3 gap-3 text-xs mb-4">
          <div className="bg-indigo-50 rounded-lg p-3"><p className="text-indigo-400">Experience</p><p className="font-bold text-indigo-700 mt-1">{profile.experienceYears} yrs</p></div>
          <div className="bg-emerald-50 rounded-lg p-3"><p className="text-emerald-400">Capacity/mo</p><p className="font-bold text-emerald-700 mt-1">{profile.productionCapacity?.toLocaleString()} units</p></div>
          <div className="bg-amber-50 rounded-lg p-3"><p className="text-amber-400">Rating</p><p className="font-bold text-amber-700 mt-1">{profile.rating.toFixed(1)} ★</p></div>
        </div>
        <div className="mb-4"><p className="text-xs text-gray-400 mb-2">Categories</p><div className="flex flex-wrap gap-2">{profile.categories.map((c:string)=><span key={c} className="text-[11px] bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">{c}</span>)}</div></div>
        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1"><p>Email: {user.email}</p>{profile.phone&&<p>Phone: {profile.phone}</p>}{profile.gstNumber&&<p>GST: {profile.gstNumber}</p>}<p>Member since {formatDate(user.createdAt)}</p></div>
      </div>
    </div>
  )
}
