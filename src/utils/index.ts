import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function formatCurrency(n: number) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n) }
export function formatDate(d: Date | string | null | undefined) { if (!d) return '—'; try { return format(new Date(d), 'dd MMM yyyy') } catch { return '—' } }
export function formatRelative(d: Date | string | null | undefined) { if (!d) return '—'; try { return formatDistanceToNow(new Date(d), { addSuffix: true }) } catch { return '—' } }
export function generateOrderNumber() { return `CF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,5).toUpperCase()}` }

export const ORDER_STATUS_LABELS: Record<string, string> = {
  DRAFT:'Draft', CONFIRMED:'Confirmed', SAMPLE_REQUESTED:'Sample Requested', SAMPLE_UPLOADED:'Sample Uploaded',
  SAMPLE_APPROVED:'Sample Approved', SAMPLE_REJECTED:'Sample Rejected', IN_PRODUCTION:'In Production',
  PRODUCTION_25:'Production 25%', PRODUCTION_50:'Production 50%', PRODUCTION_75:'Production 75%',
  PRODUCTION_COMPLETE:'Production Complete', QUALITY_CHECK:'Quality Check', PACKAGING:'Packaging',
  READY_TO_SHIP:'Ready to Ship', SHIPPED:'Shipped', DELIVERED:'Delivered', COMPLETED:'Completed',
  CANCELLED:'Cancelled', DISPUTED:'Disputed',
}

export function getOrderStatusColor(s: string) {
  const m: Record<string,string> = {
    DRAFT:'bg-gray-100 text-gray-600', CONFIRMED:'bg-blue-100 text-blue-700',
    SAMPLE_REQUESTED:'bg-purple-100 text-purple-700', SAMPLE_UPLOADED:'bg-indigo-100 text-indigo-700',
    SAMPLE_APPROVED:'bg-teal-100 text-teal-700', SAMPLE_REJECTED:'bg-red-100 text-red-700',
    IN_PRODUCTION:'bg-amber-100 text-amber-700', PRODUCTION_25:'bg-amber-100 text-amber-700',
    PRODUCTION_50:'bg-orange-100 text-orange-700', PRODUCTION_75:'bg-orange-100 text-orange-700',
    PRODUCTION_COMPLETE:'bg-lime-100 text-lime-700', QUALITY_CHECK:'bg-cyan-100 text-cyan-700',
    PACKAGING:'bg-sky-100 text-sky-700', READY_TO_SHIP:'bg-emerald-100 text-emerald-700',
    SHIPPED:'bg-blue-100 text-blue-800', DELIVERED:'bg-green-100 text-green-700',
    COMPLETED:'bg-green-100 text-green-800', CANCELLED:'bg-gray-100 text-gray-500', DISPUTED:'bg-red-100 text-red-800',
  }
  return m[s] ?? 'bg-gray-100 text-gray-600'
}
