"use client"

import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useFormik } from "formik"

import { Loader2 } from "lucide-react"

import * as Dailog from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Macondo } from "next/font/google"
import axios from "axios"

const Text = Macondo({ weight: "400", subsets: ["latin"] })

export default function Page({ params }: { params: { User: string } }) {

    const [isPasswordChanged, setisPasswordChanged] = useState<Date | null>(null)
    const [isSubmitting, setisSubmitting] = useState(false)

    const router = useRouter()

    useEffect(() => {


        const fetchUser = async () => {

            try {

                const Response = await axios.get(`/api/${params.User}`)
                setisPasswordChanged(Response?.data?.User?.Reseting_Expires_In)

            } catch (error) { toast.error(`An error Occurred: ${error}`) }

        }

        fetchUser()

    }, [])

    const formik = useFormik({

        initialValues: {
            Set_Password: '',
            Confirm_Password: ''
        },

        // validate:Validate,
        // validateOnBlur:false,
        // validateOnChange:false,

        onSubmit: async values => {

            setisSubmitting(true)
            await formik.validateForm();

            if (formik.isValid) {

                try {

                    const data = {
                        Password: values.Confirm_Password,
                        _id: params.User,
                    }

                    const Response = await axios.put("/api/auth/Instate/Change-Your-Password", data)

                    Response && toast(Response?.data.msg)

                } catch (error) { toast.error(`An error Occurred: ${error}`) } finally { setisSubmitting(false) }

            } else { toast.error("The Values are not Valid ") }

        }

    })

    return (
        <>
            <main>
                {isPasswordChanged === null || isPasswordChanged === undefined ? (
                    <section className='h-screen w-screen flex justify-center items-center bg-[#111111]'>
                        <h1 className={`text-9xl text-slate-300 text-center ${Text.className}`}>The Time for <span className='text-red-500'>Password</span> Reset <span className='text-red-500'>Has</span> Ran Out</h1>
                        <h1 className='absolute bottom-8 right-8 p-4 bg-white rounded-full cursor-pointer' onClick={() => router.replace("/")}>Try Again</h1>
                    </section>
                ) : (
                    <section className='h-screen w-screen flex justify-center items-center bg-[#111111]'>
                        <form onSubmit={formik.handleSubmit}>


                            <section className='flex flex-col gap-4'>
                                <div>
                                    <Label htmlFor="Set Password" className="label">Set Password</Label>
                                    <Input type="password" name="Set_Password" id="Set Password" value={formik.values.Set_Password} onChange={formik.handleChange} placeholder="Set a Password" />
                                </div>
                                <div>
                                    <Label htmlFor="Confirm Password" className="label">Confirm Password</Label>
                                    <Input type="password" name="Confirm_Password" id="Confirm Password" value={formik.values.Confirm_Password} onChange={formik.handleChange} placeholder="Confirm the Password" />
                                </div>
                            </section>

                            {isSubmitting ? (
                                <Button disabled><Loader2 className='h-5 mr-2 w-5 animate-spin' />Finally Rese...</Button>
                            ) : (
                                <Button type="submit" onClick={() => console.log("hi")}><h1 className=' px-12'>Reset Password</h1></Button>
                            )}

                        </form>
                    </section>
                )}
            </main>
        </>
    )
}
