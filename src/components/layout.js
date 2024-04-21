'use client'
import React from 'react';

const Layout = ({ children }) => {
  return (
    <html>
        <body>
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <header className="bg-gray-800 text-white p-4">
                    <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">will change to link when repo is uploaded</h1>
                    </div>
                </header>

                {/* Main Content */}
                <main className="content-center flex-grow container mx-auto">
                    {children} 
                </main>

                <footer className="bg-gray-800 text-white text-center p-4">
                    <div className="container mx-auto">
                    2024 brokencygnus, with calculation guidance from sicarious
                    </div>
                </footer>
                
            </div>
        </body>
    </html>
  );
};

export default Layout;
