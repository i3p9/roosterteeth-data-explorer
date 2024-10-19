import React, { useState, useEffect } from "react";
import useIntersectionObserver from "@/app/hooks/useIntersectionObserver";

function LazyImage({ mobileSrc, desktopSrc, alt, className, pos }) {
	const [ref, isIntersecting] = useIntersectionObserver({
		rootMargin: "100px",
		threshold: 0.1,
	});
	const [hasLoaded, setHasLoaded] = useState(false);

	useEffect(() => {
		if (isIntersecting && !hasLoaded) {
			setHasLoaded(true);
		}
	}, [isIntersecting, hasLoaded]);

	return (
		<div
			ref={ref}
			className={`${className} relative aspect-[3/4] md:aspect-video`}
		>
			{hasLoaded ? (
				<picture>
					<source media='(min-width: 768px)' srcSet={desktopSrc} />

					<img
						src={mobileSrc}
						alt={alt}
						className='rounded-lg w-full h-auto'
						loading='lazy'
					/>
				</picture>
			) : (
				<div className={`${className} bg-gray-200`} /> // Placeholder
			)}
		</div>
	);
}

export default React.memo(LazyImage);
