import React from "react";

const InsideGamingIcon = ({ className = "" }) => {
	return (
		<img 
			src="/ig_logo.png" 
			alt="Inside Gaming" 
			className={`w-5 h-5 object-contain ${className}`}
		/>
	);
};

export default InsideGamingIcon;