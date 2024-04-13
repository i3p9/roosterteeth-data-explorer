import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { FaChevronDown } from "react-icons/fa";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ChannelSelector(props) {
    const { channels, selected, setSelected, nolabel = false, noimage = false, height } = props

    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <div>
                    {!nolabel && <Listbox.Label className={`block text-sm font-medium leading-${height} text-color-primary`}>Select a Channel</Listbox.Label>
                    }
                    <div className="relative border-2 border-color-primary">
                        {/* focus:ring-2 focus:ring-zinc-900 */}
                        <Listbox.Button
                            style={{ lineHeight: height }}
                            className={`relative w-full cursor-default bg-color-primary py-1.5 pl-3 pr-10 text-left text-color-primary shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none ${height ? '' : 'sm:leading-6 leading-6'}`}>
                            <span className="flex items-center">
                                {!noimage && <img src={`https://cdn.ffaisal.com/channels_small/${selected.uuid}.png`} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />}
                                <span className={classNames(noimage ? '' : 'ml-3', 'block truncate')}>{selected.name}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <FaChevronDown className="h-5 w-5 text-color-primary" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full border-x-2 border-b-2 border-color-primary overflow-auto bg-color-primary py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {channels.map((channel) => (
                                    <Listbox.Option
                                        key={channel.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-color-reverse text-color-reversed' : 'text-color-primary',
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
                                                            active ? 'text-color-primary' : 'text-color-reversed',
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
                </div>
            )
            }
        </Listbox >
    )
}
