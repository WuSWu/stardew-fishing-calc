'use client'
import React from 'react';
import styles from './Background.module.css'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <a
                    href='https://github.com/brokencygnus/stardew-fishing-calc'
                    target={"_blank"}>
                    <h1 className="text-xl sm:text-2xl font-bold">github.com/brokencygnus/stardew-fishing-calc</h1>
                </a>
            </div>
        </header>

        <div className={`flex-grow ${styles.scrollingBG}`}>
            <main className="content-center flex-grow container mx-auto">
                {children} 
            </main>
        </div>

        <footer className="bg-gray-800 text-white text-center p-4">
            <div className="container mx-auto">
            Stardew Valley made by ConcernedApe - Website by brokencygnus with help from Sicarious
            </div>
        </footer>
        
    </div>
  );
};

export default Layout;
