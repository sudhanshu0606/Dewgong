"use client"

import React, { useState } from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SelectInterval({ selectedTime, selectedValue, onValueChange }) {
    // Define intervals based on the selected time unit
    const intervalOptions = {
        Minutes: ["1", "2", "5", "10", "15", "20", "30", "45", "60"], // Expanded intervals in minutes for flexibility
        Hours: ["1", "2", "3", "4", "6", "8", "12", "16", "24"], // Expanded to include 4, 8, and 16 hour intervals
        Days: ["1", "2", "3", "5", "7", "10", "14", "30"], // Added 3, 14, 30 days for a wider range
        Weeks: ["1", "2", "3", "4", "6", "8"], // Added 6 and 8 weeks for a more flexible set
        Months: ["1", "2", "3", "6", "12", "18", "24"], // Added 18 and 24 months for longer intervals
    };


    // Get the appropriate intervals based on the selected time unit
    const options = intervalOptions[selectedTime] || intervalOptions["Minutes"]; // Default to "Minutes"

    return (
        <Select value={selectedValue} onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder={selectedValue} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((interval) => (
                        <SelectItem key={interval} value={interval}>
                            {interval}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export function SelectTime({ selectedValue, onValueChange }) {
    // const [selectedValue, setSelectedValue] = useState("Minutes");

    return (
        <Select value={selectedValue} onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder={selectedValue} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="Minute">Minute</SelectItem>
                    <SelectItem value="Hour">Hour</SelectItem>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Week">Week</SelectItem>
                    <SelectItem value="Month">Month</SelectItem>

                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
