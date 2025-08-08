"use client";
import { useState } from "react";
const {
	FaInfoCircle,
	FaChevronDown,
	FaChevronUp,
} = require("react-icons/fa");

const WhatIsThis = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<>
			<div className='bg-blue-200 dark:bg-blue-700 p-2 rounded text-color-primary my-2'>
				<p className='font-medium flex items-center gap-1'>
					<FaInfoCircle style={{ display: "inline" }} /> what is this?
				</p>
				<div className='relative'>
					<div
						className={`text-sm lg:text-base text-justify overflow-hidden transition-all duration-300 ease-in-out ${
							isExpanded
								? "max-h-96 opacity-100"
								: "max-h-0 opacity-0"
						} md:max-h-none md:opacity-100`}
					>
						<p className='pt-2'>
							This is a collection of videos from the long gone Inside
							Gaming YouTube channel. I archived them back in 2018
							when the channel was shut down. I didn&apos;t know a lot
							about the proper way of archiving things so the
							thumbnail, metadata and almost all info other then the
							video themselves are long gone. This page is mainly made
							for myself to browse the archive in a organized manner.
						</p>
					</div>

					{/* Mobile-only toggle button */}
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className='md:hidden flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors duration-200 mt-2'
					>
						{isExpanded ? (
							<>
								<FaChevronUp className='transition-transform duration-200' />
								Show less
							</>
						) : (
							<>
								<FaChevronDown className='transition-transform duration-200' />
								Show more
							</>
						)}
					</button>
				</div>
			</div>
		</>
	);
};

export default WhatIsThis;
