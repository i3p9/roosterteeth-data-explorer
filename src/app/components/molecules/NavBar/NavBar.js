import AboutPopUpContainer from "../../atoms/AboutPopUpContainer/AboutPopUpContainer"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import PropTypes from 'prop-types';

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
        title: "browse",
        path: "/browse",
        short: "/b"
    },
]

const AdditionalMenuComponent = ({ pathname }) => {
    return (
        <>
            {additionalMenu.map((menu, index) => {
                if (menu.path === pathname) {
                    return null;
                }
                return (
                    <Link key={index} href={menu.path}>
                        <button className="text-base font-light border-b border-zinc-900 ml-4 sm:hidden">
                            {menu.short}
                        </button>
                    </Link>
                )
            })}
            {additionalMenu.map((menu, index) => {
                if (menu.path === pathname) {
                    return null;
                }
                return (
                    <Link key={index} href={menu.path}>
                        <button className="text-base font-light border-b border-zinc-900 ml-4 hidden sm:inline-block">
                            {menu.title}
                        </button>
                    </Link>
                )
            })}
        </>
    )
}


const NavBar = ({ title, previousLink, renderAdditionalMenu = false }) => {
    const pathname = usePathname()
    console.log(pathname);

    return (
        <h1 className='text-xl font-black p-2 border-b-2 border-zinc-900'>
            {previousLink && <Link href={previousLink} className='font-black text-xl p2'>
                <IoMdArrowBack size={"1.5em"} style={{ display: 'inline' }} />
            </Link>}
            {title}
            {renderAdditionalMenu && <AdditionalMenuComponent pathname={pathname} />}
            <AboutPopUpContainer />
        </h1>

    )
}

NavBar.propTypes = {
    title: PropTypes.string,
    previousLink: PropTypes.any,
    renderAdditionalMenu: PropTypes.bool
}

export default NavBar
