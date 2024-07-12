import PropTypes from "prop-types";

const UserInformationCard = ({ email, createdAt, emailVerified }) => {
	return (
		<section className='text-lg'>
			<p>
				<span className='text-color-secondary'>Email:</span>{" "}
				<span className='font-md'>{email}</span>
			</p>
			<p>
				<span className='text-color-secondary'>Email Verified:</span>{" "}
				<span className='font-md'>
					{emailVerified ? "Yes" : "No"}
				</span>
			</p>
			<p>
				<span className='text-color-secondary'>Created At:</span>{" "}
				<span className='font-md'>{createdAt?.split("T")[0]}</span>
			</p>
		</section>
	);
};

UserInformationCard.propTypes = {
	email: PropTypes.string,
	createdAt: PropTypes.string,
	emailVerified: PropTypes.bool,
};

export default UserInformationCard;
