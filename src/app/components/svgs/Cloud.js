import { IoCloudDone, IoCloudOffline } from "react-icons/io5";

export const CloudAvailable = ({ size = 18 }) => {
	return (
		<div className='text-green-600 border border-zinc-900 p-0.5 px-2 rounded-lg bg-zinc-50'>
			<IoCloudDone size={size} />
		</div>
	);
};

export const CloudUnavailable = ({ size = 20 }) => {
	return (
		<div className='text-red-500 border border-zinc-900 p-0.5 px-2 rounded-lg bg-zinc-50'>
			<IoCloudOffline size={size} />
		</div>
	);
};
