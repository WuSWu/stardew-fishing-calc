import React, { useState } from 'react';

    const Accordion = ({ title, children }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="collapsible-container">
            <button className="flex flex-row items-center justify-between collapsible-button" onClick={toggleCollapse}>
                <p className="text-lg font-bold">{title}</p>
                <p className="mr-2">{isOpen ? '收起' : '展开'}</p>
            </button>
            {isOpen && (
            <div className={isOpen ? 'content-container open' : 'content-container'}>
                <div className="px-2 py-4">
                    {children} 
                </div>
            </div>
            )}
        </div>
    );
};

export default Accordion;
