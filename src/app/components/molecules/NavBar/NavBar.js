"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import PropTypes from "prop-types";
import { AiOutlineMail } from "react-icons/ai";
// import { motion } from "framer-motion";

const additionalMenu = [
	{
		title: "search",
		path: "/search",
		short: "/s",
	},
	{
		title: "random",
		path: "/random",
		short: "/r",
	},
	{
		title: "download",
		path: "/download",
		short: "/d",
	},
	// {
	// 	title: "account",
	// 	path: "/account",
	// 	short: "/a",
	// },
];

const AdditionalMenuComponent = ({ pathname }) => {
	return (
		<div className='flex flex-row gap-3'>
			{additionalMenu.map((menu, index) => {
				if (menu.path === pathname) {
					return null;
				}
				return (
					<div
						className='transition ease-in-out duration-150 hover:scale-110'
						key={index}
					>
						<Link href={menu.path}>
							<button className='text-base font-light border-b border-color-primary ml-4 sm:hidden'>
								{menu.short}
							</button>
						</Link>
						{pathname === menu.path && (
							<div className='absolute w-full bg-zinc-950 dark:bg-zinc-100 h-0.5 transform -translate-y-1/2' />
						)}
					</div>
				);
			})}
			{additionalMenu.map((menu, index) => {
				return (
					<div
						className='relative transition ease-in-out duration-150 hover:scale-110'
						key={index}
					>
						<Link key={index} href={menu.path}>
							<button
								className={`text-base stretch-90 hidden sm:inline-block ${
									pathname === menu.path
										? "font-semibold"
										: "font-light"
								}`}
							>
								{menu.title}/
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
}) => {
	const pathname = usePathname();
	return (
		<div className='w-full'>
			<h1 className='flex justify-between font-semibold stretch-125 text-xl text-color-primary p-2 border-b-2 border-color-primary'>
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
				{title}
				{renderAdditionalMenu && (
					<AdditionalMenuComponent pathname={pathname} />
				)}
				<div className='ml-auto flex gap-1 items-center transition ease-in-out duration-150 hover:scale-[1.02]'>
					<AiOutlineMail />{" "}
					<a
						href='mailto:info@rtarchive.xyz'
						className='text-sm font-medium'
						target='_blank'
					>
						info@rtarchive.xyz
					</a>
				</div>
			</h1>
		</div>
	);
};

NavBar.propTypes = {
	title: PropTypes.string,
	previousLink: PropTypes.any,
	renderAdditionalMenu: PropTypes.bool,
};

export default NavBar;
