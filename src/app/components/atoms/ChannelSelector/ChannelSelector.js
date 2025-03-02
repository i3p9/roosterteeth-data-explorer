import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function ChannelSelector(props) {
	const {
		channels,
		selected,
		setSelected,
		nolabel = false,
		noimage = false,
		height,
	} = props;

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<div>
					{!nolabel && (
						<Listbox.Label
							className={`block text-sm font-medium leading-${height} text-color-primary`}
						>
							Select a Channel
						</Listbox.Label>
					)}
					<div className='relative rounded-md'>
						<Listbox.Button
							style={{ lineHeight: height }}
							className={`relative w-full rounded-md cursor-pointer bg-color-primary py-1.5 pl-3 pr-10 text-left text-color-primary shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-500 transition-all duration-200 focus:outline-none ${
								height ? "" : "sm:leading-6 leading-6"
							}`}
						>
							<span className='flex items-center'>
								{!noimage && (
									<img
										src={`https://cdn.rtarchive.xyz/channels_small/${selected.uuid}.png`}
										alt=''
										className='h-5 w-5 flex-shrink-0 rounded-full'
									/>
								)}
								<span
									className={classNames(
										noimage ? "" : "ml-3",
										"block truncate"
									)}
								>
									{selected.name}
								</span>
							</span>
							<span className='pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
								{open ? (
									<FaChevronUp
										className='h-5 w-5'
										aria-hidden='true'
									/>
								) : (
									<FaChevronDown
										className='h-5 w-5'
										aria-hidden='true'
									/>
								)}
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							enter='transition ease-out duration-100'
							enterFrom='transform opacity-0 scale-95'
							enterTo='transform opacity-100 scale-100'
							leave='transition ease-in duration-75'
							leaveFrom='transform opacity-100 scale-100'
							leaveTo='transform opacity-0 scale-95'
						>
							<Listbox.Options className='absolute rounded-md z-10 mt-1 max-h-56 w-full border border-color-primary overflow-auto bg-color-primary py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								{channels.map((channel) => (
									<Listbox.Option
										key={channel.id}
										className={({ active }) =>
											classNames(
												active
													? "bg-color-reverse text-color-reverse"
													: "text-color-primary",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={channel}
									>
										{({ selected, active }) => (
											<>
												<div className='flex items-center'>
													{!noimage && (
														<img
															src={`https://cdn.rtarchive.xyz/channels_small/${channel.uuid}.png`}
															alt=''
															className='h-5 w-5 flex-shrink-0 rounded-full'
														/>
													)}
													<span
														className={classNames(
															selected
																? "font-semibold"
																: "font-normal",
															noimage ? "" : "ml-3",
															"block truncate"
														)}
													>
														{channel.name}
													</span>
												</div>

												{selected ? (
													<span
														className={classNames(
															active
																? "text-color-primary"
																: "text-color-reverse",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													></span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</div>
			)}
		</Listbox>
	);
}
