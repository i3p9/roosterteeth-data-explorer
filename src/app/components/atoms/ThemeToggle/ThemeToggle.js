"use client";

import { useEffect } from "react";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

export default function ThemeToggle() {
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const shouldBeDark = savedTheme ? savedTheme === "dark" : true;
		document.documentElement.classList.toggle("dark", shouldBeDark);

		if (!savedTheme) {
			localStorage.setItem("theme", "dark");
		}
	}, []);

	const toggleTheme = () => {
		const isDark = document.documentElement.classList.toggle("dark");
		localStorage.setItem("theme", isDark ? "dark" : "light");
	};

	return (
		<button
			type='button'
			onClick={toggleTheme}
			className='flex items-center justify-center p-2 w-11 h-11 rounded-md text-color-primary'
		>
			{/* The theme class selects the icon before this component hydrates. */}
			<span className='hidden dark:block'>
				<IoSunnyOutline size={20} aria-hidden='true' />
				<span className='sr-only'>Switch to light mode</span>
			</span>
			<span className='block dark:hidden'>
				<IoMoonOutline size={20} aria-hidden='true' />
				<span className='sr-only'>Switch to dark mode</span>
			</span>
		</button>
	);
}
