"use client"

import React, { useCallback, useState, useEffect } from 'react'
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
import { debounce } from 'lodash'
import axios from 'axios'

// Type the data object for type safety
interface StockData {
    symbol: string;
    name: string;
}

interface StockInfo {
    stock: string;
    stockSymbol: string;
    currentPrice: number;
}

export default function Page() {
    const [value, setValue] = useState<string>("")
    const [finalValue, setFinalValue] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<StockData[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)

    // Fetch stock data when finalValue is set
    useEffect(() => {
        const getStockData = async () => {
            if (!finalValue) return;  // Don't make the API call if finalValue is empty
            try {
                const response = await axios.get(`https://script.google.com/macros/s/AKfycbxqFyDE3Mq9Lhj1uc7wf5vJiWjL_Ah9CpipLAhqqXRol6_ryqeNnPGzXcC7sx1_xlSOew/exec?stock=${finalValue}`)
                console.log(response)
                // Assuming the API returns stock data like this:
                const { stock, stockSymbol, currentPrice } = response.data.data
                setStockInfo({ stock, stockSymbol, currentPrice })
            } catch (error) {
                console.log(error)
                setError("Error fetching stock data.")
            }
        }
        getStockData()
    }, [finalValue])

    // Debounced function to fetch suggestions
    const fetchSuggestions = useCallback(
        debounce(async (query: string) => {
            if (!query) {
                setSuggestions([])
                return
            }

            setLoading(true)
            setError(null) // Reset the error state on new request

            try {
                const response = await fetch(`/api/stocks?q=${query}`)
                const dat = await response.json()
                const data = dat.filteredSuggestions

                // Ensure the data is in the correct format before setting it
                if (Array.isArray(data)) {
                    setSuggestions(data)
                } else {
                    setError("Invalid response format")
                }
            } catch (err) {
                setError("Error fetching data")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }, 400), // 300ms delay after the user stops typing
        []
    )

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        fetchSuggestions(e.target.value)  // Call the debounced function
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && selectedIndex !== -1) {
            const selectedSuggestion = suggestions[selectedIndex]
            setFinalValue(selectedSuggestion.symbol)
            setValue(selectedSuggestion.name)
            setSuggestions([])  // Clear suggestions after selection
            setSelectedIndex(-1)
        } else if (e.key === 'ArrowDown') {
            if (selectedIndex < suggestions.length - 1) {
                setSelectedIndex(prevIndex => prevIndex + 1)
            }
        } else if (e.key === 'ArrowUp') {
            if (selectedIndex > 0) {
                setSelectedIndex(prevIndex => prevIndex - 1)
            }
        }
    }

    const handleClear = () => {
        setValue('')
        setFinalValue('')
        setSuggestions([])
        setSelectedIndex(-1)
        setError(null)  // Clear any existing error when clearing the input
    }

    const handleSelectSuggestion = (symbol: string) => {
        const selected = suggestions.find(item => item.symbol === symbol)
        if (selected) {
            setValue(selected.name)
            setFinalValue(symbol)
            setSuggestions([])  // Clear suggestions after selection
            setSelectedIndex(-1)
        }
    }

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Cleanup debounce on component unmount
        return () => {
            fetchSuggestions.cancel()
        }
    }, [fetchSuggestions])

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
                <section className="p-2">
                    <div className="relative">
                        <Input
                            id="inputField"
                            className="py-6 pl-4 pr-10"
                            type="text"
                            value={value}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                            placeholder="Enter stock symbol or name"
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
                    {error && <h1 className="w-full flex justify-center items-center text-red-500">error</h1>}

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

                    {/* Display Stock Info if available */}
                    {stockInfo && (
                        <div className=" mt-2 border border-gray-300 p-4 rounded-md shadow-md">
                            <h3 className="text-xl font-semibold">Stock Information</h3>
                            <p><strong>stock</strong> {stockInfo.stock}</p>
                            <p><strong>stock symbol</strong> {stockInfo.stockSymbol}</p>
                            <p><strong>current price</strong> {stockInfo.currentPrice}</p>
                            {/* <p><strong>Percentage Change:</strong> {stockInfo.percentageChange >= 0 ? `+${stockInfo.percentageChange.toFixed(2)}%` : `${stockInfo.percentageChange.toFixed(2)}%`}</p> */}
                        </div>
                    )}
                </section>

            </SidebarInset>
        </SidebarProvider>
    );
}
