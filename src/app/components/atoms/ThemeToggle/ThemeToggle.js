'use client'

import { useState, useEffect } from 'react'
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5'

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true) // Start with dark as default
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        
        // Check if we have a saved theme, otherwise default to dark
        const savedTheme = localStorage.getItem('theme')
        const shouldBeDark = savedTheme ? savedTheme === 'dark' : true
        
        
        setIsDark(shouldBeDark)
        
        // Set the class on the html element
        if (shouldBeDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        
        // Save the theme if not already saved
        if (!savedTheme) {
            localStorage.setItem('theme', 'dark')
        }
    }, [])

    const toggleTheme = () => {
        const newIsDark = !isDark
        
        setIsDark(newIsDark)
        
        // Update the DOM class
        if (newIsDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        
        // Save to localStorage
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
        
    }

    if (!mounted) {
        return (
            <div className="flex items-center justify-center p-2 w-[44px] h-[44px]">
                <div className="w-5 h-5"></div>
            </div>
        )
    }

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-md transition-all duration-200 hover:scale-110 text-color-primary"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? (
                <IoSunnyOutline size={20} />
            ) : (
                <IoMoonOutline size={20} />
            )}
        </button>
    )
}