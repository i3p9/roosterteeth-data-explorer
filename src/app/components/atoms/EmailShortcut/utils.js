import { FaYahoo } from "react-icons/fa6";
import {
	SiMicrosoftoutlook,
	SiProtonmail,
	SiGmail,
	SiZoho,
	SiApple,
} from "react-icons/si";

export const emailProviders = [
	{
		email: "gmail.com",
		url: "https://mail.google.com",
		name: "Gmail",
		Icon: SiGmail,
	},
	{
		email: "yahoo.com",
		url: "https://mail.yahoo.com",
		name: "Yahoo Mail",
		Icon: FaYahoo,
	},
	{
		email: "ymail.com",
		url: "https://mail.yahoo.com",
		name: "Yahoo Mail",
		Icon: FaYahoo,
	},
	{
		email: "protonmail.ch",
		url: "https://mail.proton.me",
		name: "Proton Mail",
		Icon: SiProtonmail,
	},
	{
		email: "protonmail.com",
		url: "https://mail.proton.me",
		name: "Proton Mail",
		Icon: SiProtonmail,
	},
	{
		email: "pm.me",
		url: "https://mail.proton.me",
		name: "Proton Mail",
		Icon: SiProtonmail,
	},
	{
		email: "proton.me",
		url: "https://mail.proton.me",
		name: "Proton Mail",
		Icon: SiProtonmail,
	},
	{
		email: "outlook.com",
		url: "https://outlook.live.com/mail",
		name: "Outlook Mail",
		Icon: SiMicrosoftoutlook,
	},
	{
		email: "hotmail.com",
		url: "https://outlook.live.com/mail",
		name: "Outlook Mail",
		Icon: SiMicrosoftoutlook,
	},
	{
		email: "icloud.com",
		url: "https://www.icloud.com/mail",
		name: "iCloud Mail",
		Icon: SiApple,
	},
	{
		email: "me.com",
		url: "https://www.icloud.com/mail",
		name: "iCloud Mail",
		Icon: SiApple,
	},
	{
		email: "mac.com",
		url: "https://www.icloud.com/mail",
		name: "iCloud Mail",
		Icon: SiApple,
	},
];

export const emails = [
	{
		name: "Gmail",
		imageUrl: "https://cdn.rtarchive.xyz/icons/gmail.webp",
		url: "https://mail.google.com",
		Icon: SiGmail,
	},
	{
		name: "Outlook",
		imageUrl: "https://cdn.rtarchive.xyz/icons/outlook.webp",
		url: "https://outlook.live.com/mail",
		Icon: SiMicrosoftoutlook,
	},
	{
		name: "Proton Mail",
		imageUrl: "https://cdn.rtarchive.xyz/icons/proton.webp",
		url: "https://mail.proton.me",
		Icon: SiProtonmail,
	},
	{
		name: "Yahoo Mail",
		imageUrl: "https://cdn.rtarchive.xyz/icons/ymail.webp",
		url: "https://mail.yahoo.com",
		Icon: FaYahoo,
	},
	{
		name: "Zoho Mail",
		imageUrl: "https://cdn.rtarchive.xyz/icons/zoho.webp",
		url: "https://mail.zoho.com/zm",
		Icon: SiZoho,
	},
	{
		name: "iCloud Mail",
		imageUrl: "https://cdn.rtarchive.xyz/icons/icloud.webp",
		url: "https://www.icloud.com/mail",
		Icon: SiApple,
	},
];
