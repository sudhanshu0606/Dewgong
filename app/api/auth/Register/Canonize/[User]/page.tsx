"use client"

import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { Indie_Flower } from "next/font/google"
import axios from "axios"

const Text = Indie_Flower({ weight: "400", subsets: ["latin"] })


export default function Page({ params }: { params: { User: string } }) {

    const [isVerified, setisVerified] = useState(false)
    const router = useRouter()

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const Response = await axios.get(`/api/${params.User}`)
                console.log(Response)
                setisVerified(Response?.data?.User?.Verified)

            } catch (error) { toast("error") }

        }

        fetchUser()

    }, [])


    async function Verify() {

        try {

            console.log(params.User)
            const Response = await axios.put("/api/auth/Register/Canonize", params.User,{
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            Response && toast(Response?.data.msg)

            if (Response?.status === 200) { setisVerified(true) } else { setisVerified(false) }

        } catch (error) { toast.error(`An error Occurred: ${error}`) } finally { router.refresh() }

    }

    return (

        <main>

            {isVerified ? (

                <section className='h-screen w-screen flex justify-center items-center bg-[#111111]'>
                    <h1 className={`text-9xl text-center text-slate-300 font-Gloria-Hallelujah ${Text.className}`}>Congratulations! You'v been <br /><span className='text-red-500'>Verified</span> now.</h1>
                    <h1 className='p-4 px-8 cursor-pointer bg-white rounded-full absolute bottom-8 right-8' onClick={() => router.replace("/")}>Take Me Back To Home</h1>
                </section>

            ) : (

                <section className='flex justify-center items-center h-screen w-screen bg-[#111111]'>
                    <Button size="lg" variant="destructive" onClick={Verify}>I Would Like To Verify Myself That I Am Me</Button>
                </section>

            )}

        </main>

    )

}
