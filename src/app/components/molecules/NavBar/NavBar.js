import AboutPopUpContainer from "../../atoms/AboutPopUpContainer/AboutPopUpContainer"
import Link from "next/link"
import { IoMdArrowBack } from "react-icons/io";


const NavBar = ({ title, previousLink }) => {
    return (
        <h1 className='text-xl font-black p-2 border-b-2 border-zinc-900'>
            {previousLink && <Link href={previousLink} className='font-black text-xl p2'>
                <IoMdArrowBack size={"1.5em"} style={{ display: 'inline' }} />
            </Link>}
            {title}
            <AboutPopUpContainer />
        </h1>

    )
}

export default NavBar
