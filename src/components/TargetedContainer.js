'use client'
import React, { useState, useEffect } from 'react';

const TargetedContainer = ({ options, onSelect, children, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchInvalid, setIsSearchInvalid] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const img = (selectedOption[0]) ? "/stardew-fishing-calc/assets/tile"+selectedOption[0]+".png" : "/stardew-fishing-calc/assets/tile691.png"

    const filteredOptions = (options !== undefined) ?
    options.filter(option => option[1].toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

    useEffect(() => {
        if (filteredOptions.length === 0) {
            setIsSearchInvalid(true);
        } else {
            setIsSearchInvalid(false);
        }
    }, [filteredOptions]);

    useEffect(() => {
        document.getElementById("dropdownSearch").value = (selectedOption[1]) ? selectedOption[1] : "Select fish";
        onSelect((selectedOption[1]) ? selectedOption[1] : "")
    }, [selectedOption, isOpen])

    const openDropdownAndEmpty = () => {
        document.getElementById("dropdownSearch").value = ""
        setSearchTerm("");
        setIsOpen(true);
    }

    const openDropdown = () => {
        setIsOpen(true);
    }

    const closeDropdown = () => {
        setIsOpen(false);
    }

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOptionSelect = (event) => {
        const index = event.target.value;
        setSelectedOption(filteredOptions[index]);
        closeDropdown();
    };

    return (
        <div className="flex flex-col rounded-lg border-gray-400 bg-gray-200 border-2 p-2 mb-2 gap-2">
            {children}
            <div className='flex flex-row gap-4 px-6 py-2 place-items-center'>
                <div className={`h-full w-10 ${disabled ? "grayscale contrast-50" : ""}`}>
                    <img
                        src={img}
                        alt={(selectedOption[1]) ? selectedOption[1] : "None selected"}
                        className="block size-10 z-20"
                        style={{imageRendering: 'pixelated'}}
                    />
                </div>
                <div className='grid auto-rows-auto'>
                    <span className={`font-bold ${disabled ? "text-gray-600" : "text-black"}`}>{(selectedOption[1]) ? selectedOption[1] : "None selected"}</span>
                </div>
            </div>
            <div className="relative inline-block">
                <input
                    id="dropdownSearch"
                    placeholder="Search fish"
                    className={`px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${(selectedOption[1]) ? "text-black" : "text-gray-600"}`}
                    onClick={openDropdownAndEmpty}
                    onFocus={openDropdown}
                    onBlur={closeDropdown}
                    onInput={handleInputChange}
                    onChange={handleInputChange}
                />
                <ul className={`absolute left-0 z-10 w-full mt-2 max-h-48 bg-white border border-gray-300 overflow-auto rounded shadow-md ${isOpen ? '' : 'hidden'}`}>
                    {filteredOptions.map(([key, option], index) => (
                        <li className="px-4 py-2 hover:cursor-pointer hover:bg-gray-100"
                            key={key}
                            type="string"
                            value={index}
                            onMouseDown={(e) => {e.preventDefault()}}
                            onClick={handleOptionSelect}
                        >{option}</li>
                    ))}
                    <li className={`px-4 py-2 bg-gray-100 ${isSearchInvalid ? '' : 'hidden'}`}>No results</li>
                </ul>
            </div>
        </div>
        
    );
};

export default TargetedContainer;