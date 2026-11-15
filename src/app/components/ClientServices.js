"use client";

import Script from "next/script";
import { Toaster } from "react-hot-toast";

export default function ClientServices() {
	return (
		<>
			<Toaster />
			<Script id='analytics-init' strategy='afterInteractive'>{`
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', 'G-RBMWJ5WGSM');
			`}</Script>
			<Script
				id='analytics-script'
				strategy='afterInteractive'
				src='https://www.googletagmanager.com/gtag/js?id=G-RBMWJ5WGSM'
			/>
		</>
	);
}
