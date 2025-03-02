import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function SeasonSelector(props) {
	const { data, selected, setSelected } = props;

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<div>
					<div className='w-36'>
						<Listbox.Button
							className={`relative border font-semibold border-color-primary  w-full cursor-pointer rounded-md bg-color-primary py-1.5 pl-3 pr-10 text-left text-color-primary text-color-primary-hover shadow-sm focus:outline-none sm:leading-6 leading-6 transition-all duration-300`}
						>
							<span className='flex items-center'>
								{selected && (
									<span className='block truncate'>
										Season {selected?.attributes.number}
									</span>
								)}
							</span>
							<span className='absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
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
							<Listbox.Options className='absolute z-10 mt-1 max-h-56 w-auto border rounded border-color-primary overflow-auto bg-color-primary py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								{data.map((season) => (
									<Listbox.Option
										key={season.uuid}
										className={({ active }) =>
											classNames(
												active
													? "bg-color-hover-2 text-color-reverse"
													: "text-color-primary",
												"relative cursor-pointer select-none p-2"
											)
										}
										value={season}
									>
										{({ selected, active }) => (
											<>
												<div className='flex items-center'>
													<span
														className={classNames(
															selected
																? "font-bold"
																: "font-semibold",
															"block truncate"
														)}
													>
														Season{" "}
														{season.attributes.number === 99
															? "99 (Bonus)"
															: season.attributes.number}
														<span className='font-normal'>
															{" "}
															({season.attributes.episode_count}{" "}
															Episodes)
														</span>
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
