import useIntersectionObserver from "@/app/hooks/useIntersectionObserver";
import Image from "next/image";
import { useState } from "react";
import AdaptiveImage from "../AdaptiveImage/AdaptiveImage";

function LazyImage({ mobileSrc, desktopSrc, alt, className, pos }) {
	const [ref, isIntersecting] = useIntersectionObserver({
		rootMargin: "100px", // Start loading 100px before the image enters the viewport
		threshold: 0.1,
	});
	const [isLoaded, setIsLoaded] = useState(false);

	const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

	const toBase64 = (str) =>
		typeof window === "undefined"
			? Buffer.from(str).toString("base64")
			: window.btoa(str);

	return (
		<div
			ref={ref}
			className={`${className} relative aspect-[3/4] md:aspect-video`}
		>
			{isIntersecting ? (
				// <Image
				// 	src={desktopSrc}
				// 	alt={alt}
				// 	className='w-full h-auto rounded-lg'
				// 	sizes='(max-width: 768px) 50vw, 33vw'
				// 	fill
				// 	style={{ objectFit: "cover" }}
				// 	quality={85}
				// 	placeholder={`data:image/svg+xml;base64,${toBase64(
				// 		shimmer(700, 475)
				// 	)}`}
				// 	srcSet={`${mobileSrc} 768w, ${desktopSrc} 1200w`}
				// 	priority={pos < 20 ? true : false}
				// />
				<AdaptiveImage
					mobileImage={mobileSrc}
					desktopImage={desktopSrc}
					alt={alt}
					className={className}
				/>
			) : (
				<div className={`${className} bg-gray-200`} /> // Placeholder
			)}
		</div>
	);
}

export default LazyImage;
