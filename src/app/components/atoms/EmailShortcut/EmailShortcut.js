import Image from "next/image";
import { emails, emailProviders } from "./utils";

const EmailShortcut = ({ email }) => {
	const provider = email.split("@")[1];
	const filteredMailProvider =
		emailProviders.find((item) => item.email === provider) || null;

	if (!filteredMailProvider) {
		return (
			<div className='border-t-2 border-color-primary mt-2 pt-2'>
				<p className='text-color-secondary pb-2'>
					{" "}
					Shortcut to popular Email Providers
				</p>
				<div className='grid grid-cols-2 gap-3'>
					{emails.map((item, index) => {
						return (
							<a
								key={index}
								href={item.url}
								target='_blank'
								className='flex-make-center gap-2 button-primary p-1'
							>
								<item.Icon size={25} style={{ display: "inline" }} />{" "}
								{item.name}
							</a>
						);
					})}
				</div>
			</div>
		);
	} else {
		return (
			<div className='border-t-2 border-color-primary mt-2 pt-2'>
				<p className='text-color-secondary pb-2'>
					{" "}
					Go to your Email application
				</p>

				<div className='flex-make-center'>
					<a
						href={filteredMailProvider.url}
						target='_blank'
						className='flex-make-center gap-2 button-primary p-1'
					>
						<filteredMailProvider.Icon
							size={25}
							style={{ display: "inline" }}
						/>{" "}
						{filteredMailProvider.name}
					</a>
				</div>
			</div>
		);
	}
};

export default EmailShortcut;
