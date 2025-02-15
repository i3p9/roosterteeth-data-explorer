import PropTypes from "prop-types";
import { CgUnavailable } from "react-icons/cg";
import { PiGoogleLogoBold } from "react-icons/pi";
import { HiOutlineMail } from "react-icons/hi";

const icons = {
	google: <PiGoogleLogoBold title='Google' key={"googleIconUA"} />,
	email: <HiOutlineMail title='Email' key={"emailIconUA"} />,
};

const UserInformationCard = ({ user }) => {
	const identities = user?.identities?.map((id) => id.provider) || [];

	const renderProviders = (ids) => {
		if (!ids || ids.length < 1) {
			return (
				<p className='inline-flex'>
					<CgUnavailable />
				</p>
			);
		}
		return (
			<p className='inline-flex gap-2'>
				{ids.map((id) => {
					return icons[id];
				})}
			</p>
		);
	};

	return (
		<section className='text-lg'>
			<p>
				<span className='text-color-secondary'>Email:</span>{" "}
				<span className='font-md'>{user?.email}</span>
			</p>
			<p>
				<span className='text-color-secondary'>Email Verified:</span>{" "}
				<span className='font-md'>
					{user?.email_confirmed_at?.length > 0 ? "Yes" : "No"}
				</span>
			</p>
			<p>
				<span className='text-color-secondary'>Created At:</span>{" "}
				<span className='font-md'>
					{user?.created_at?.split("T")[0]}
				</span>
			</p>
			<div className='flex items-center gap-2'>
				<p className='text-color-secondary'>Connected via:</p>
				{renderProviders(identities)}
			</div>
		</section>
	);
};

UserInformationCard.propTypes = {
	user: PropTypes.object,
};

export default UserInformationCard;
