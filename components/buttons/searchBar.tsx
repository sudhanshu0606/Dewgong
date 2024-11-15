import React, { useState } from 'react'

const SearchBarWithSuggestions = () => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);

    // Example suggestion data (you can replace this with API call or dynamic data)
    const allSuggestions = [
        'React', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Node.js', 'HTML', 'CSS', 'GraphQL', 'Firebase'
    ];

    // Handle input change
    const handleInputChange = (e: { target: { value: any } }) => {
        const value = e.target.value;
        setInput(value);

        // Filter suggestions based on the input value
        if (value.length > 0) {
            const filteredSuggestions = allSuggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    // Handle selecting a suggestion
    const handleSuggestionClick = (suggestion: never) => {
        setSelectedLabels([...selectedLabels, suggestion]);
        setInput(''); // Clear input field after selecting a suggestion
        setSuggestions([]); // Hide suggestions after selection
    };

    // Remove a selected label
    const handleLabelRemove = (label: never) => {
        setSelectedLabels(selectedLabels.filter(item => item !== label));
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Selected Labels */}
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedLabels.map((label, index) => (
                        <span key={index} className="inline-flex items-center px-4 py-2 text-sm bg-blue-200 text-blue-800 rounded-full">
                            {label}
                            <button
                                className="ml-2 text-blue-800"
                                onClick={() => handleLabelRemove(label)}
                            >
                                x
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchBarWithSuggestions;