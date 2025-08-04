"use client";
import React from "react";
import NavBar from "../components/molecules/NavBar/NavBar";
import { motion } from "framer-motion";
import compressedMaster from "./data/compressed_master.json";
import ShowSection from "./components/ShowSection";
import WhatIsThis from "./components/WhatIsThis";

const InsideGaming = () => {
	return (
		<>
			<NavBar title='Inside Gaming' renderHome />
			<div className='container mx-auto px-4 py-6'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className='text-3xl font-bold text-color-primary mb-6'>
						Inside Gaming Archive
					</h1>
					<WhatIsThis />

					{compressedMaster.map((show, index) => (
						<ShowSection
							key={show[0].show_slug}
							show={show[0]}
							index={index}
						/>
					))}
				</motion.div>
			</div>
		</>
	);
};

export default InsideGaming;
