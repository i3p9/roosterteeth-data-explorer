import PropTypes from "prop-types";
import { HeartFill, HeartOutline } from "../../svgs/Heart";

const LikedButton = ({ onClickAction, isLiked }) => {
	return (
		<>
			{isLiked ? (
				<p
					className='flex-make-center rounded-md text-color-primary bg-color-primary px-4 gap-2'
					onClick={() => onClickAction()}
				>
					<HeartFill />
					Liked{" "}
				</p>
			) : (
				<button
					className='flex-make-center rounded-md text-color-primary bg-color-primary hover:bg-black/30 px-4 gap-2'
					onClick={() => onClickAction()}
				>
					<HeartOutline />
					Like{" "}
				</button>
			)}
		</>
	);
};

LikedButton.propTypes = {
	onClickAction: PropTypes.any,
	isLiked: PropTypes.bool,
};

export default LikedButton;
