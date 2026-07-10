import { SignUp } from '@clerk/nextjs'
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">C</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">CraftFlow</span>
        </div>
        <SignUp routing="hash" appearance={{ elements: { rootBox: 'w-full', card: 'shadow-xl border border-gray-100 rounded-2xl w-full', formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg', footerActionLink: 'text-indigo-600' } }} />
      </div>
    </div>
  )
}
