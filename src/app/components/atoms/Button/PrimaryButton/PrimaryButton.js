import React from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const PrimaryButton = ({
	title,
	shortTitle,
	successToastMessage,
	failedToastMessage,
	onClickFunc,
	startIcon,
	endIcon,
}) => {
	const handleOnClick = () => {
		onClickFunc();
		if (successToastMessage) {
			const successNotify = () => toast.success(successToastMessage);
			successNotify();
		}
	};

	return (
		<>
			<div className='m-2 relative border font-semibold rounded-md border-color-primary'>
				<button
					className='relative w-full button-styled text-color-primary bg-color-primary py-1.5 px-3 shadow-sm'
					onClick={() => handleOnClick()}
				>
					{startIcon &&
						React.cloneElement(startIcon, {
							style: { display: "inline", marginRight: "0.5rem" },
						})}
					{shortTitle ? (
						<>
							<span className='hidden md:block md:inline'>
								{title}
							</span>
							<span className='block md:hidden inline'>
								{shortTitle}
							</span>
						</>
					) : (
						<span className='inline'>{title}</span>
					)}
					{endIcon &&
						React.cloneElement(endIcon, {
							style: { display: "inline", marginLeft: "0.5rem" },
						})}
				</button>
			</div>
		</>
	);
};

PrimaryButton.propTypes = {
	title: PropTypes.string,
	shortTitle: PropTypes.string,
	onClickFunc: PropTypes.func,
	successToastMessage: PropTypes.string,
	failedToastMessage: PropTypes.string,
	startIcon: PropTypes.element,
	endIcon: PropTypes.element,
};

export default PrimaryButton;
