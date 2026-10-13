"use client";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import styles from "./NavBar.module.css";
import { usePathname } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import PropTypes from "prop-types";
import { AiOutlineMail } from "react-icons/ai";
import { IoHomeOutline, IoSearch } from "react-icons/io5";
import { IoDownloadOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";
import InsideGamingIcon from "../../icons/InsideGamingIcon";
import ThemeToggle from "../../atoms/ThemeToggle/ThemeToggle";

// Remember the last icon across navbar mounts during client navigation.
let previousIconIsBack;

const NavigationIcon = ({ isBack }) => {
	const [morph, setMorph] = useState("");

	// Start from the outgoing icon before the new navbar is painted.
	useLayoutEffect(() => {
		if (previousIconIsBack !== undefined && previousIconIsBack !== isBack) {
			setMorph(isBack ? styles.toBack : styles.toHome);
		}
		previousIconIsBack = isBack;
	}, [isBack]);

	return (
		<span
			className={`${styles.navigationIcon} ${isBack ? styles.backIcon : ""} ${morph}`}
			aria-hidden='true'
			onAnimationEnd={() => setMorph("")}
		>
			<Image
				src='/apple-icon.png'
				alt=''
				width={28}
				height={28}
				priority
				unoptimized
				className={`${styles.homeLogo} ${styles.cassette}`}
			/>
			<IoMdArrowBack size={28} className={styles.arrow} />
		</span>
	);
};

const additionalMenu = [
	{
		title: "Search",
		path: "/search",
		short: "/s",
		icon: <IoSearch />,
	},
	{
		title: "Download",
		path: "/download",
		short: "/d",
		icon: <IoDownloadOutline />,
	},
	{
		title: "Inside Gaming",
		path: "/inside-gaming",
		short: "/i",
		icon: <InsideGamingIcon />,
	},
	// {
	// 	title: "Account",
	// 	path: "/user/account",
	// 	short: "/a",
	// 	icon: <MdOutlineAccountCircle />,
	// },
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
		<div className='flex flex-row gap-1 md:gap-2 shrink-0'>
			{homeMenu.map((menu, index) => {
				if (menu.path === pathname) {
					return null;
				}
				return (
					<div
						className='relative'
						key={index}
					>
						<Link href={menu.path} aria-label={menu.title} className='flex items-center justify-center gap-1 w-8 h-8 md:w-auto md:px-2 rounded-md'>
								<span className='text-xl md:hidden'>
									{menu.icon}
								</span>
								<span className='hidden md:inline text-base font-mono'>
									{menu.title}
								</span>
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
		<div className='flex flex-row gap-1 md:gap-2 shrink-0'>
			{additionalMenu.map((menu, index) => {
				if (menu.path === pathname) {
					return null;
				}
				return (
					<div
						className='relative'
						key={index}
					>
						<Link href={menu.path} aria-label={menu.title} className='flex items-center justify-center gap-1 w-8 h-8 md:w-auto md:px-2 rounded-md'>
								<span className='text-xl md:hidden'>
									{menu.icon}
								</span>
								<span className='hidden md:inline text-base font-mono'>
									{menu.title}
								</span>
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
	hideBorder = false,
}) => {
	const pathname = usePathname();
	return (
		<div className='w-full'>
			<nav className={`flex items-center gap-2 font-semibold stretch-125 text-xl text-color-primary p-2 border-b-2 ${hideBorder ? "border-transparent" : "border-color-primary"} h-[76px] md:h-16 relative`}>
				{previousLink ? (
					<Link
						href={previousLink}
						aria-label='Back'
						className='flex items-center justify-center w-8 h-11 shrink-0 rounded-md text-color-primary'
					>
						<NavigationIcon isBack />
					</Link>
				) : (
					<span className='flex items-center justify-center w-8 h-11 shrink-0' aria-hidden='true'>
						<NavigationIcon isBack={false} />
					</span>
				)}
				<span className='text-color-primary select-none truncate min-w-0'>
					{title || ""}
				</span>
				{renderAdditionalMenu && (
					<div className='xl:absolute xl:left-1/2 xl:-translate-x-1/2 xl:w-fit ml-auto xl:ml-0 shrink-0'>
						<AdditionalMenuComponent pathname={pathname} />
					</div>
				)}
				{renderHome && (
					<div className='xl:absolute xl:left-1/2 xl:-translate-x-1/2 xl:w-fit ml-auto xl:ml-0 shrink-0'>
						<HomeMenuComponent pathname={pathname} />
					</div>
				)}
				<div className='hidden sm:flex ml-auto gap-4 items-center shrink-0'>
					<ThemeToggle />
					<div className='hidden xl:flex gap-1 items-center'>
						<AiOutlineMail />{" "}
						<a
							href='mailto:info@rtarchive.xyz'
							className='text-sm font-medium'
							target='_blank'
						>
							info@rtarchive.xyz
						</a>
					</div>
				</div>
			</nav>
		</div>
	);
};

NavBar.propTypes = {
	title: PropTypes.string,
	previousLink: PropTypes.any,
	renderAdditionalMenu: PropTypes.bool,
	hideBorder: PropTypes.bool,
};

export default NavBar;
