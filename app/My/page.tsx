"use client"
import React, { useState } from 'react'

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
    useSidebar
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDown, Ellipsis, EllipsisVertical, Eye, ListFilter, Pause, Play, Settings2, Trash2, TvMinimal } from "lucide-react"

import AddStocks from "@/components/buttons/addStocks"
import { format } from "date-fns";
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export default function Page() {
    const lastNotificationTime = new Date
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex border-b  h-16 bg-white shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 ">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-black" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>My</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <section className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
                    <header className=' flex justify-between items-center'>
                        <div className=' flex justify-center items-center gap-4'>
                            <Button className=' flex justify-center items-center gap-2 poppins-light' variant="outline"><ListFilter /><span>Filter</span><ChevronDown /></Button>
                            <Button className=' flex justify-center items-center gap-3 poppins-light' variant="outline"><TvMinimal /><span>Display</span></Button>
                        </div>
                        <div className=' flex justify-center items-center gap-2'>
                            <AddStocks />
                            <Button size="icon" variant="outline"><EllipsisVertical /></Button>
                        </div>
                    </header>
                    <section className=' grid grid-rows-1 sm:grid-cols-3 gap-4 w-full'>
                        <StockSubscriptionCard
                            stockSymbol="AAPL"
                            companyName="Apple Inc."
                            currentPrice="150.30"
                            priceChange={+2.5}
                            notificationInterval={10}
                            alertThreshold={2}
                            lastNotificationTime={lastNotificationTime}
                            active={true}
                        />
                        <StockSubscriptionCard
                            stockSymbol="TSLA"
                            companyName="Tesla Inc."
                            currentPrice="950.75"
                            priceChange={-1.8}
                            notificationInterval={15}
                            alertThreshold={3}
                            lastNotificationTime={lastNotificationTime}
                            active={false}

                        />
                        <StockSubscriptionCard
                            stockSymbol="AMZN"
                            companyName="Amazon.com, Inc."
                            currentPrice="3200.50"
                            priceChange={+0.7}
                            notificationInterval={5}
                            alertThreshold={1.5}
                            lastNotificationTime={lastNotificationTime}
                            active={true}

                        />
                        <StockSubscriptionCard
                            stockSymbol="META"
                            companyName="Meta Platforms, Inc."
                            currentPrice="390.20"
                            priceChange={+1.2}
                            notificationInterval={30}
                            alertThreshold={4}
                            lastNotificationTime={lastNotificationTime}
                            active={false}

                        />
                        <StockSubscriptionCard
                            stockSymbol="NVDA"
                            companyName="Nvidia Corporation"
                            currentPrice="200.45"
                            priceChange={+5.3}
                            notificationInterval={10}
                            alertThreshold={2.2}
                            lastNotificationTime={lastNotificationTime}
                            active={false}

                        />

                    </section>
                </section>
            </SidebarInset>
        </SidebarProvider>
    )
}

interface StockSubscriptionCardProps {
    stockSymbol: string;
    companyName: string;
    currentPrice: string;
    priceChange: number;
    notificationInterval: number;
    alertThreshold: number;
    lastNotificationTime: Date;
    active: boolean
}

const StockSubscriptionCard: React.FC<StockSubscriptionCardProps> = ({
    stockSymbol,
    companyName,
    currentPrice,
    priceChange,
    notificationInterval,
    alertThreshold,
    lastNotificationTime,
    active
}) => {
    const router = useRouter()
    const [real, setreal] = useState(false)
    const { isMobile } = useSidebar()
    return (
        <div className=" w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <div className=" p-4 pb-0 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 cursor-pointer selection:bg-transparent" onClick={() => setreal(!real)}>
                    {real ? companyName : stockSymbol}
                </h3>
                <div className=' flex justify-center items-center gap-2'>
                    <Badge variant={active ? "default" : "secondary"}>{active ? "ACTIVE" : "PAUSED"}</Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger>

                            <Button size="icon" variant="ghost" className=' h-8 w-8'><Ellipsis /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}>

                            <DropdownMenuItem onClick={()=>router.replace(`/Stocks/${stockSymbol}`)}><Eye />Overview</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/My/${stockSymbol}`)}><Settings2 /> Settings</DropdownMenuItem>
                            {active?(
                                <DropdownMenuItem><Pause />Pause Notifications</DropdownMenuItem>

                            ):(

                                <DropdownMenuItem><Play />Activate Notifications</DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="danger"><Trash2 />Cancel Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
            <div className=" p-4 pt-2 space-y-1 ">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Current Price</span>
                    <span className=" text-lg font-semibold ">${currentPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Notification Interval</span>
                    <span className=" text-lg">{notificationInterval} Min</span>
                </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
                <p className="text-sm text-gray-600">Last Notification on {format(lastNotificationTime, 'dd MMMM yyyy ')} at {format(lastNotificationTime, 'HH:mm:ss')}</p>
            </div>

        </div>
    );
};



