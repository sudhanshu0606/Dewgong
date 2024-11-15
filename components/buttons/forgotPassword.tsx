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
import { useFormik } from "formik"
import axios from "axios"
import { toast } from "sonner"

export function ForgotPassword() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className=' flex '>
                    {/* <Button variant="linkHover2" >Forgot Password</Button> */}
                    <Label htmlFor="forgot password" className=' cursor-pointer Link '>Forgot Password</Label>
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
                <Label htmlFor="forgot password" className=' cursor-pointer Link'>Forgot Password</Label>
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
    const [isSubmitting, setisSubmitting] = useState(false)

    const formik = useFormik({

        initialValues: {
            Mail: 'example@example.com',
        },

        // validate : Mail_Validate,
        validateOnBlur: false,
        validateOnChange: false,

        onSubmit: async values => {

            setisSubmitting(true)
            await formik.validateForm();

            if (formik.isValid) {

                try {


                    const Response = await axios.post("/api/auth/Instate",values);
                    Response && toast(Response?.data.msg)

                } catch (error) { toast.error(`An error Occurred: ${error}`) } finally { setisSubmitting(false) }

            } else { toast.error("The Values is not valid") }

        }

    });

    return (
        <form className={cn("grid items-start gap-4", className)} onSubmit={formik.handleSubmit}>
            <div className="grid gap-2">
                <Label htmlFor="email" className=' ml-2'>Email</Label>
                <Input type="email" name="Mail" id="email" value={formik.values.Mail} onChange={formik.handleChange} defaultValue="example@example.com" />
            </div>

            {isSubmitting ? (
                <Button disabled><Loader2 className=" mr-2 h-5 w-5 animate-spin" /><h1>Reset in moment</h1></Button>
            ) : (
                <Button type="submit" variant="ringHover">Forgot Password</Button>
                
            )}
        </form>
    )
}
