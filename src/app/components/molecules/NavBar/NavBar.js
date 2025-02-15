"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import PropTypes from "prop-types";
import { AiOutlineMail } from "react-icons/ai";
import { IoHomeOutline, IoSearch } from "react-icons/io5";
import { IoDownloadOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";

const additionalMenu = [
	{
		title: "Search",
		path: "/search",
		short: "/s",
		icon: <IoSearch />,
	},
	// {
	// 	title: "random",
	// 	path: "/random",
	// 	short: "/r",
	// },
	{
		title: "Download",
		path: "/download",
		short: "/d",
		icon: <IoDownloadOutline />,
	},
	{
		title: "Account",
		path: "/user/account",
		short: "/a",
		icon: <MdOutlineAccountCircle />,
	},
];

const homeMenu = [
	{
		title: "Home",
		path: "/",
		icon: <IoHomeOutline />,
	},
];

const HomeMenuComponent = ({ pathname }) => {
	return (
		<div className='flex flex-row gap-2 px-2'>
			{homeMenu.map((menu, index) => {
				if (menu.path === pathname) {
					return null;
				}
				return (
					<div
						className='relative transition ease-in-out duration-150 hover:scale-110 ml-2'
						key={index}
					>
						<Link href={menu.path}>
							<button className='flex items-center gap-1 p-2 rounded-md'>
								<span className='text-xl bg-color-reverse text-color-reverse md:hidden p-2 rounded-md'>
									{menu.icon}
								</span>
								<span className='hidden md:inline text-base font-mono'>
									{menu.title}
								</span>
							</button>
						</Link>
						{pathname === menu.path && (
							<div className='absolute w-full bg-zinc-950 dark:bg-zinc-100 h-0.5 transform -translate-y-1/2' />
						)}
					</div>
				);
			})}
		</div>
	);
};

const AdditionalMenuComponent = ({ pathname }) => {
	return (
		<div className='flex flex-row gap-2 px-2'>
			{additionalMenu.map((menu, index) => {
				if (menu.path === pathname) {
					return null;
				}
				return (
					<div
						className='relative transition ease-in-out duration-150 hover:scale-110 ml-2'
						key={index}
					>
						<Link href={menu.path}>
							<button className='flex items-center gap-1 p-2 rounded-md'>
								<span className='text-xl bg-color-reverse text-color-reverse md:hidden p-2 rounded-md'>
									{menu.icon}
								</span>
								<span className='hidden md:inline text-base font-mono'>
									{menu.title}
								</span>
							</button>
						</Link>
						{pathname === menu.path && (
							<div className='absolute w-full bg-zinc-950 dark:bg-zinc-100 h-0.5 transform -translate-y-1/2' />
						)}
					</div>
				);
			})}
		</div>
	);
};

const NavBar = ({
	title,
	previousLink,
	renderAdditionalMenu = false,
	renderHome = false,
}) => {
	const pathname = usePathname();
	return (
		<div className='w-full'>
			<nav className='flex items-center font-semibold stretch-125 text-xl text-color-primary p-2 border-b-2 border-color-primary min-h-[70px] md:min-h-[50px] relative'>
				{previousLink && (
					<div className='relative transition ease-in-out duration-150 hover:scale-110'>
						<Link
							href={previousLink}
							className='font-black text-color-primary text-xl p2'
						>
							<IoMdArrowBack
								size={"1.5em"}
								style={{ display: "inline" }}
							/>
						</Link>
					</div>
				)}
				<span className='text-color-primary select-none'>
					{title || ""}
				</span>
				{renderAdditionalMenu && (
					<div className='md:absolute md:left-1/2 md:-translate-x-1/2 md:w-fit ml-auto md:ml-0'>
						<AdditionalMenuComponent pathname={pathname} />
					</div>
				)}
				{renderHome && (
					<div className='md:absolute md:left-1/2 md:-translate-x-1/2 md:w-fit ml-auto md:ml-0'>
						<HomeMenuComponent pathname={pathname} />
					</div>
				)}
				<div className='hidden sm:flex ml-auto gap-1 items-center transition ease-in-out duration-150 hover:scale-[1.02]'>
					<AiOutlineMail />{" "}
					<a
						href='mailto:info@rtarchive.xyz'
						className='text-sm font-medium'
						target='_blank'
					>
						info@rtarchive.xyz
					</a>
				</div>
			</nav>
		</div>
	);
};

NavBar.propTypes = {
	title: PropTypes.string,
	previousLink: PropTypes.any,
	renderAdditionalMenu: PropTypes.bool,
};

export default NavBar;
