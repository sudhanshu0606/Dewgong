import type { Metadata } from "next"
import { Toaster } from "sonner"
import "@/app/globals.css"

export const metadata: Metadata = {
    title: "rese",
    description: "some"
}

export default function ResetLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body >
                <Toaster />
                <main className=' flex flex-row justify-between items-center' >

                    {children}

                </main>
            </body>
        </html>
    )
}