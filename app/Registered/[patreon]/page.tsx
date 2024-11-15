"use client"

import { usePathname } from 'next/navigation'
import React from 'react'

const Page = () => {
    const pathname=usePathname()
    return (
        <main className=' h-screen w-screen flex justify-center items-center bg-[#1A1A1A]'>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 shadow-lg">
                Thank You {pathname.split("/").pop()?.split("-").pop()}
            </h1>
        </main>
    )
}

export default Page