"use client"
import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarMenuButton } from "../ui/sidebar"
import { ChevronRight, Eye, EyeClosed, EyeOff, Loader2, User } from "lucide-react"
import { Separator } from "../ui/separator"
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"


export function Register() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className=' flex '>
                    {/* <Button variant="linkHover2" >Forgot Password</Button> */}
                    <Label htmlFor="forgot password" className=' cursor-pointer Link '>Register</Label>
                </DialogTrigger>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>

                    </DialogHeader>

                    <ProfileForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger className=' flex '>
                {/* <Button variant="linkHover2" >Forgot Password</Button> */}
                <Label htmlFor="forgot password" className=' cursor-pointer Link'>Register</Label>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DrawerDescription>

                </DrawerHeader>

                <ProfileForm className="px-4 pb-2 " />

            </DrawerContent>
        </Drawer>
    )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()
    const formik = useFormik({

        initialValues: {
            Username: 'example',
            Mail: 'example@example.com',
            Password: 'password',
        },

        // validate : Register_Validate,
        validateOnBlur: false,
        validateOnChange: false,

        onSubmit: async values => {

            setIsSubmitting(true)
            await formik.validateForm();

            if (formik.isValid) {

                try {


                    // console.log(values)
                    const Response = await axios.post("/api/auth/Register", values);
                    Response && toast(Response?.data.msg)

                    router.push(Response?.data.URL)

                } catch (error) { toast.error(`An error Occurred: ${error}`) } finally { setIsSubmitting(false) }

            } else { toast.error("The Values are not Valid") }

        }

    });



    // Toggle the password visibility
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className={cn("grid items-start gap-4", className)} onSubmit={formik.handleSubmit}>
            <div className="grid gap-2">
                <Label htmlFor="username" className=' ml-2'>Username</Label>
                <Input type="text" name="Username" id="username" value={formik.values.Username} onChange={formik.handleChange} defaultValue="example" />

            </div>
            <div className="grid gap-2">
                <Label htmlFor="email" className=' ml-2'>Email</Label>
                <Input type="email" name="Mail" id="email" value={formik.values.Mail} onChange={formik.handleChange} defaultValue="example@example.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password" className=' ml-2'>Password</Label>
                <div className="relative">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        name="Password"
                        id="password"
                        value={formik.values.Password}
                        onChange={formik.handleChange}
                        defaultValue="password"
                    />
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </div>
            </div>


            {isSubmitting ? (
                <Button disabled><Loader2 className=" mr-2 h-5 w-5 animate-spin" /><h1>Trying to Register You</h1></Button>
            ) : (
                <Button type="submit" variant="ringHover">Register</Button>

            )}
        </form>
    )
}
