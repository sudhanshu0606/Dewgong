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
import { ForgotPassword } from "./forgotPassword"
import { Register } from "./register"
import { useRouter } from "next/navigation"
import { useFormik } from "formik"
import axios from "axios"
import { toast } from "sonner"

export function LogIn() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger >
                    <SidebarMenuButton variant="ringHover" tooltip="">
                        <User />
                        <span>Log In</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 " />
                    </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm />
                    <div className=' flex justify-center items-center gap-4'>
                        <div className=' w-full h-[1px] bg-black'></div>
                        <span>Or</span>
                        <div className=' w-full h-[1px] bg-black'></div>

                    </div>
                    <div className=' flex justify-between items-center gap-4'>
                        <Button variant="secondary" className=' w-full flex justify-center items-center gap-2 border'><FaGoogle /><span>Google</span></Button>
                        <Button variant="secondary" className=' w-full flex justify-center items-center gap-2 border'><FaGithub /><span>Github</span></Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger >
                <SidebarMenuButton variant="ringHover" tooltip="">
                    <User />
                    <span>Log In</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4 pb-2" />
                <div className=' flex justify-center items-center gap-4 px-4'>
                    <div className=' w-full h-[1px] bg-black'></div>
                    <span>Or</span>
                    <div className=' w-full h-[1px] bg-black'></div>

                </div>
                <div className=' flex justify-between items-center gap-4 p-2 px-4'>
                    <Button variant="secondary" className=' w-full flex justify-center items-center gap-2'><FaGoogle /><span>Google</span></Button>
                    <Button variant="secondary" className=' w-full flex justify-center items-center gap-2'><FaGithub /><span>Github</span></Button>
                </div>

            </DrawerContent>
        </Drawer>
    )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setisSubmitting] = useState(false)

    const router = useRouter()

    const formik = useFormik({

        initialValues: {

            Mail: 'example@example.com',
            Password: 'password',
        },

        // validate : Log_In_Validate,
        validateOnBlur: false,
        validateOnChange: false,

        onSubmit: async values => {

            setisSubmitting(true)
            await formik.validateForm();

            if (formik.isValid) {

                try {


                    const Response = await axios.post("/api/auth/Induct", values);
                    Response && toast(Response?.data.msg)

                    const Quark = await Response?.data.Quark;
                    localStorage.removeItem("Quark");
                    localStorage.setItem("Quark", Quark);

                    const User = await Response?.data.Username;
                    localStorage.removeItem("User");
                    localStorage.setItem("User", User);

                } catch (error) { toast.error(`An Error Occurred: ${error}`) }

                finally {

                    setisSubmitting(false)
                    router.refresh()

                }

            } else { toast.error("The Values are not Valid") }

        }

    });
    // Toggle the password visibility
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };



    return (
        <form
            className={cn("grid items-start gap-4", className)}
            onSubmit={formik.handleSubmit}
        >

            <div className="grid gap-2">
                <Label htmlFor="email" className="ml-2">Email</Label>

                <Input type="email" name="Mail" id="email" value={formik.values.Mail} onChange={formik.handleChange} defaultValue="example@example.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password" className="ml-2">Password</Label>
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


            <div className=' w-full flex justify-between items-center px-2'>
                <ForgotPassword />
                <Register />
            </div>

            {isSubmitting ? (
                <Button disabled className='w-full'><Loader2 className="mr-2 h-5 w-5 animate-spin" /><h1>Trying to Log In</h1></Button>
            ) : (
                <Button type="submit" variant="ringHover">Log In</Button>

            )}
        </form>
    );
}
