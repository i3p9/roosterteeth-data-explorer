import { useState, useEffect, useRef } from "react";

function useIntersectionObserver(options = {}) {
	const [isIntersecting, setIsIntersecting] = useState(false);
	const ref = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			setIsIntersecting(entry.isIntersecting);
		}, options);

		const currentRef = ref.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [options]);

	return [ref, isIntersecting];
}

export default useIntersectionObserver;
