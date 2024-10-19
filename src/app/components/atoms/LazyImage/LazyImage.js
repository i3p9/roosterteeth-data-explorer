import React, { useState, useEffect } from "react";
import useIntersectionObserver from "@/app/hooks/useIntersectionObserver";
import styles from "./LazyImage.module.css";

function LazyImage({ mobileSrc, desktopSrc, alt, className, pos }) {
	const [ref, isIntersecting] = useIntersectionObserver({
		rootMargin: "100px",
		threshold: 0.1,
	});
	const [hasLoaded, setHasLoaded] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	const handleImageLoad = () => {
		setImageLoaded(true);
	};

	useEffect(() => {
		if (isIntersecting && !hasLoaded) {
			setHasLoaded(true);
		}
	}, [isIntersecting, hasLoaded]);

	return (
		<div
			className={`${imageLoaded ? styles.loaded : styles.loading}`}
		>
			<div
				ref={ref}
				className={`${className} relative aspect-[3/4] md:aspect-video bg-gray-400 overflow-hidden shadow-xl`}
			>
				{/* Text overlay that's visible only when image hasn't loaded */}
				<div className='absolute inset-0 flex items-center justify-center z-10'>
					<span className='text-gray-300 text-center font-bold px-4 py-2'>
						{alt}
					</span>
				</div>

				{hasLoaded ? (
					<picture className='absolute inset-0 z-20'>
						<source media='(min-width: 768px)' srcSet={desktopSrc} />
						<img
							src={mobileSrc}
							alt={alt}
							className='w-full h-full object-cover'
							loading='lazy'
							onLoad={handleImageLoad}
						/>
					</picture>
				) : (
					<div
						className={`${className} bg-gray-400 absolute inset-0 z-0`}
					/>
				)}
			</div>
		</div>
	);
}

export default React.memo(LazyImage);
