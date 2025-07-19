import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* Sol Bölüm: Marka adı ve açıklama, mobilde üstte, masaüstünde solda */}
      <div className='flex flex-col justify-center items-center w-full md:w-1/2 bg-background text-white transition-colors py-12 md:py-0'>
        <div className='text-center px-10'>
          <h3 className='text-4xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white'>Anonymous Intelligence</h3>
          <p className='text-base font-medium opacity-80 text-gray-700 dark:text-gray-200'>We are Anonymous. We are Legion. We do not forgive. We do not forget. Expect us.</p>
        </div>
      </div>
      {/* Sağ Bölüm: Sade kart ve form */}
      <div className='flex flex-1 justify-center items-center bg-background transition-colors'>
        <div className='w-full max-w-md px-4'>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
