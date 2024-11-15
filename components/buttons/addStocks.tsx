"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { SquarePlus } from "lucide-react"

import { useState } from "react"
import { SelectInterval, SelectTime } from "./interval"
import { Checkbox } from "../ui/checkbox"

export default function AddStocks() {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger >
                    <Button className=' flex justify-center items-center gap-2 poppins-light' variant="ringHover"><SquarePlus /><span>Add Stocks</span></Button>
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
            <DrawerTrigger >
                <Button className=' flex justify-center items-center gap-2 poppins-light' variant="ringHover"><SquarePlus /><span>Add Stocks</span></Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4 pb-2" />

            </DrawerContent>
        </Drawer>
    )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
    // State to hold the selected values
    const [selectedInterval, setSelectedInterval] = useState<string>("5"); // For SelectInterval
    const [selectedTime, setSelectedTime] = useState<string>("Minute"); // For SelectTime
    const [stock, setStock] = useState<string>("AAPL");
    

    // Function to handle when the selected interval changes
    

    // Function to handle when the selected time unit changes
    const handleTimeChange = (newValue: string) => {
        setSelectedTime(newValue);
    };

    return (
        <form className={cn("grid items-start gap-4", className)}>
            <div className="grid gap-2">
                <Label htmlFor="stock" className="ml-2">
                    Stocks
                </Label>
                <Input
                    type="text"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    id="stock"
                />
            </div>

            <div className="grid gap-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="interval" className="ml-2">
                        Interval (Every)
                    </Label>
                    
                </div>
                <div className="flex justify-around items-center gap-2">
                    <div className="w-1/4">

                        <Input
                            type="number"
                            id="interval"
                            value={selectedInterval}
                            onChange={(e) => setSelectedInterval(e.target.value)}
                            min="1"
                        />

                    </div>
                    <div className="w-3/4">
                        <SelectTime
                            selectedValue={selectedTime}
                            onValueChange={handleTimeChange}
                        />
                    </div>
                </div>
            </div>

            <div className="p-3 bg-blue-100 text-blue-800 border-l-4 border-blue-500 rounded-md shadow-sm">
                <h1>
                    You will get notifications for <span className="font-medium">{stock}</span> once every{" "}
                    <span className="font-medium">
                        {selectedInterval === "1" ? (
                            ""
                        ) : (
                            <span>{selectedInterval}</span>
                        )}
                    </span> {" "}
                    {/* <span className="font-medium">{selectedTime}</span> */}
                    <span className="font-medium">{selectedInterval === "1" ? (

                        `${selectedTime}`
                    ) : (
                        `${selectedTime + "s"}`
                    )}</span>
                </h1>
            </div>

            <Button type="submit">Save changes</Button>
        </form>
    );
}




