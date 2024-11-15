import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css"

export const metadata: Metadata = {
    title: "conf",
    description: "some"
}

export default function ConfirmationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (

        <html lang="en">
            <body >
                <Toaster />
                <main>

                    {children}
                </main>
            </body>
        </html>
    )
}