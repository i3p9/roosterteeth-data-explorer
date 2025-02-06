"use client";
import PropTypes from "prop-types";
import { HeartFill, HeartOutline } from "../../svgs/Heart";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LikedButton = ({ onClickAction, isLiked, isLoggedIn }) => {
	const [showDialog, setShowDialog] = useState(false);
	const router = useRouter();

	const handleClick = () => {
		if (!isLoggedIn) {
			setShowDialog(true);
			return;
		}
		onClickAction();
	};

	return (
		<>
			{isLiked ? (
				<p
					className='button-styled flex-make-center px-4 gap-2'
					onClick={handleClick}
				>
					<HeartFill className='transition-transform duration-300 ease-in-out transform hover:scale-110' />
					Liked{" "}
				</p>
			) : (
				<button
					className='button-styled flex-make-center px-4 gap-2'
					onClick={handleClick}
				>
					<HeartOutline className='transition-transform duration-300 ease-in-out transform hover:scale-110' />
					Like{" "}
				</button>
			)}

			{showDialog && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-color-primary p-6 rounded-lg shadow-lg popup-content'>
						<h3 className='text-lg font-semibold mb-4 text-color-primary'>
							Please Log In
						</h3>
						<p className='mb-4 text-color-secondary'>
							You need to be logged in to like this item.
						</p>
						<div className='flex gap-4'>
							<button
								onClick={() => router.push("/login")}
								className='button-primary px-4 py-2'
							>
								Log In
							</button>
							<button
								onClick={() => setShowDialog(false)}
								className='button-secondary px-4 py-2 rounded-md'
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

LikedButton.propTypes = {
	onClickAction: PropTypes.any,
	isLiked: PropTypes.bool,
	isLoggedIn: PropTypes.bool,
};

export default LikedButton;
