import AboutPopUpContainer from "../../atoms/AboutPopUpContainer/AboutPopUpContainer"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import PropTypes from 'prop-types';
import { motion } from 'framer-motion'

const additionalMenu = [
    {
        title: "search",
        path: "/search",
        short: "/s"
    },
    {
        title: "random",
        path: "/random",
        short: "/r"

    },
    {
        title: "download",
        path: "/download",
        short: "/d"
    },
]

const AdditionalMenuComponent = ({ pathname }) => {
    return (
        <div className="flex flex-row gap-3">
            {additionalMenu.map((menu, index) => {
                if (menu.path === pathname) {
                    return null;
                }
                return (
                    <motion.div whileHover={{ scale: 1.1 }} key={index}>
                        <Link href={menu.path}>
                            <button className="text-base font-light border-b border-color-primary ml-4 sm:hidden">
                                {menu.short}
                            </button>
                        </Link>
                        {pathname === menu.path && (
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                exit={{ scaleX: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute w-full bg-zinc-950 h-0.5 transform -translate-y-1/2"
                            />
                        )}
                    </motion.div>
                )
            })}
            {additionalMenu.map((menu, index) => {
                // if (menu.path === pathname) {
                //     return null;
                // }
                return (
                    <motion.div className="relative" whileHover={{ scale: 1.1 }} key={index}>
                        <Link key={index} href={menu.path}>
                            <button className={`text-base stretch-90 hidden sm:inline-block ${pathname === menu.path ? 'font-semibold' : 'font-light'}`}>
                                {menu.title}/
                            </button>
                        </Link>
                        {pathname === menu.path && (
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                exit={{ scaleX: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute w-full bg-zinc-950 h-0.5 transform -translate-y-1/2"
                            />
                        )}

                    </motion.div>
                )
            })}
        </div>
    )
}


const NavBar = ({ title, previousLink, renderAdditionalMenu = false }) => {
    const pathname = usePathname()
    return (
        <div className="w-full">
            <h1 className='flex font-semibold stretch-125 text-xl text-color-primary p-2 border-b-2 border-color-primary'>
                {previousLink && (
                    <motion.div className="relative" whileHover={{ scale: 1.1 }}>
                        <Link href={previousLink} className='font-black text-color-primary text-xl p2'>
                            <IoMdArrowBack size={"1.5em"} style={{ display: 'inline' }} />
                        </Link>
                    </motion.div>
                )}
                {title}
                {renderAdditionalMenu && <AdditionalMenuComponent pathname={pathname} />}
                {/* <AboutPopUpContainer /> */}
            </h1>
        </div>
    )
}

NavBar.propTypes = {
    title: PropTypes.string,
    previousLink: PropTypes.any,
    renderAdditionalMenu: PropTypes.bool
}

export default NavBar
