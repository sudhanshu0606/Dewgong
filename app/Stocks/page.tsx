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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { X } from 'lucide-react'

// Type the data object
const data: Record<string, string> = {
    "AAPL": "APPLE INC",
    "GOOGL": "ALPHABET INC",
    "AMZN": "AMAZON.COM INC",
    "MSFT": "MICROSOFT CORPORATION",
    "TSLA": "TESLA INC",
    "META": "META PLATFORMS INC",
    "NVDA": "NVIDIA CORPORATION",
    "INTC": "INTEL CORPORATION",
    "AMD": "ADVANCED MICRO DEVICES INC",
    "NFLX": "NETFLIX INC",
    "DIS": "THE WALT DISNEY COMPANY",
    "BA": "BOEING COMPANY",
    "V": "VISA INC",
    "PYPL": "PAYPAL HOLDINGS INC",
    "WMT": "WALMART INC",
    "JNJ": "JOHNSON & JOHNSON",
    "PG": "PROCTER & GAMBLE CO",
    "KO": "COCA-COLA COMPANY",
    "MCD": "MCDONALD'S CORPORATION",
    "CVX": "CHEVRON CORPORATION",
    "XOM": "EXXON MOBIL CORPORATION"
};

export default function Page() {
    const [value, setValue] = useState<string>("");
    const [finalValue, setFinalValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<{ symbol: string, name: string }[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    finalValue && console.log(finalValue)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);

        if (e.target.value) {
            const filteredSuggestions = Object.entries(data)
                .filter(([symbol, name]) =>
                    symbol.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    name.toLowerCase().includes(e.target.value.toLowerCase())
                )
                .map(([symbol, name]) => ({ symbol, name }));
            setSuggestions(filteredSuggestions);
            setSelectedIndex(-1);
        } else {
            setSuggestions([]);
            setSelectedIndex(-1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && selectedIndex !== -1) {
            const selectedSuggestion = suggestions[selectedIndex];
            setFinalValue(selectedSuggestion.symbol);
            setValue(selectedSuggestion.name);
            setSuggestions([]);
            setSelectedIndex(-1);
        } else if (e.key === 'ArrowDown') {
            if (selectedIndex < suggestions.length - 1) {
                setSelectedIndex(prevIndex => prevIndex + 1);
            }
        } else if (e.key === 'ArrowUp') {
            if (selectedIndex > 0) {
                setSelectedIndex(prevIndex => prevIndex - 1);
            }
        }
    };

    const handleClear = () => {
        setValue('');
        setFinalValue('');
        setSuggestions([]);
        setSelectedIndex(-1);
    };

    const handleSelectSuggestion = (symbol: string) => {
        setValue(data[symbol]);
        setFinalValue(symbol);
        setSuggestions([]);
        setSelectedIndex(-1);
    };

    const router = useRouter();
    const pathname = usePathname();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex border-b h-16 bg-white shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-black" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="cursor-pointer hidden md:block">
                                    <BreadcrumbLink onClick={() => router.replace("/")}>
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{pathname.split("/").pop()}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <section className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
                    <div>
                        <div className="relative">
                            <Input
                                id="inputField"
                                className="py-6 pl-4 pr-10"
                                type="text"
                                value={value}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                autoComplete="off"
                                placeholder="Enter any Stock name"
                            />

                            {value && (
                                <X
                                    onClick={handleClear}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                    aria-label="Clear"
                                />
                            )}
                        </div>

                        {loading && <h1 className="w-full flex justify-center items-center">Loading...</h1>}
                        {error && <h1 className="w-full flex justify-center items-center">ERR</h1>}


                        {suggestions.length > 0 && (
                            <div className="mt-2 w-full border border-gray-300 shadow-md rounded-md">
                                <ul>
                                    {suggestions.map(({ symbol, name }, index) => (
                                        <li
                                            key={symbol}
                                            className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${selectedIndex === index ? 'bg-gray-100' : ''}`}
                                            onClick={() => handleSelectSuggestion(symbol)}
                                        >
                                            {name} ({symbol})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </section>
            </SidebarInset>
        </SidebarProvider>
    );
}
