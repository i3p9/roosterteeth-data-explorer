const { FaInfoCircle } = require("react-icons/fa");

const UnavailableHelp = () => {
	return (
		<>
			<div className='bg-red-300 dark:bg-red-800 p-2 rounded text-color-primary mt-2'>
				<p className='font-medium flex items-center gap-1'>
					<FaInfoCircle style={{ display: "inline" }} /> Download
					button disabled?
				</p>
				<p>
					If some of the shows you arere trying to download are
					unavailable and you cant access the download button, it is
					likely because the rights to those shows have been purchased
					by another party or the specific creator has gone
					independent, leading to their removal.
				</p>
			</div>
		</>
	);
};

export default UnavailableHelp;
