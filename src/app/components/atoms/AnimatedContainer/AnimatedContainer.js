"use client";

import { motion } from "framer-motion";

const AnimatedContainer = ({ children }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 0.5,
				delay: 0.2,
				type: "spring",
				stiffness: 100,
			}}
		>
			{children}
		</motion.div>
	);
};

export default AnimatedContainer;
