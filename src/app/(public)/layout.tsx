import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Welcome to our platform',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
