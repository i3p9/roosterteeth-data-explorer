import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { FaChevronDown } from "react-icons/fa";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ChannelSelector(props) {
    const { channels, selected, setSelected, nolabel = false, noimage = false } = props

    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <>
                    {!nolabel && <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Select a Channel</Listbox.Label>
                    }
                    <div className="relative mt-2 border-2 border-zinc-800">
                        {/* focus:ring-2 focus:ring-zinc-900 */}
                        <Listbox.Button className="relative w-full cursor-default bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                                {!noimage && <img src={`https://cdn.ffaisal.com/channels_small/${selected.uuid}.png`} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />}
                                <span className={classNames(noimage ? '' : 'ml-3', 'block truncate')}>{selected.name}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <FaChevronDown className="h-5 w-5 text-zinc-800" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {channels.map((channel) => (
                                    <Listbox.Option
                                        key={channel.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-zinc-800 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={channel}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    {!noimage && <img src={`https://cdn.ffaisal.com/channels_small/${channel.uuid}.png`} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />}
                                                    <span
                                                        className={classNames(selected ? 'font-semibold' : 'font-normal', noimage ? '' : 'ml-3', 'block truncate')}
                                                    >
                                                        {channel.name}
                                                    </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-zinc-800',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                    </span>
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
    )
}
