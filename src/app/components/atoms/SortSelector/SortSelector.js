import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function SortSelector(props) {
	const { data, selected, setSelected } = props;

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<div className='w-42'>
						<Listbox.Button
							className={`relative w-full border font-semibold border-color-primary rounded-md bg-color-primary py-1.5 pl-3 pr-10 text-left text-color-primary text-color-primary-hover shadow-sm focus:outline-none sm:leading-6 leading-6 transition-all duration-300`}
						>
							{selected && (
								<span className='block truncate'>
									{selected?.shortTitle}
								</span>
							)}
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
							<Listbox.Options className='absolute z-10 mt-1 max-h-56 w-auto border-2 rounded border-color-primary overflow-auto bg-color-primary py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								{data.map((option) => (
									<Listbox.Option
										key={option.value}
										className={({ active }) =>
											classNames(
												active
													? "bg-color-hover-2 text-color-reverse transition-all duration-300"
													: "text-color-primary",
												"relative cursor-pointer select-none p-2"
											)
										}
										value={option}
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
														{option.title}
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
				</>
			)}
		</Listbox>
	);
}
