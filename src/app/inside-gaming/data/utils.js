const showData = [
	{
		show_slug: "others",
		show_name: "Miscellaneous Video",
	},
	{
		show_slug: "q_and_a",
		show_name: "Q&A",
	},
	{
		show_slug: "gameplay_random",
		show_name: "Random Gameplay",
	},
	{
		show_slug: "gameplay_ARMA3",
		show_name: "ARMA3",
	},
	{
		show_slug: "gameplay_Chaser",
		show_name: "Chaser",
	},
	{
		show_slug: "gameplay_GTA4",
		show_name: "GTA 4 Mods",
	},
	{
		show_slug: "gameplay_GTA5",
		show_name: "GTA 5 Gameplay",
	},
	{
		show_slug: "gameplay_Heavy Fire Afghanistan",
		show_name: "Heavy Fire Afghanistan",
	},
	{
		show_slug: "gameplay_Ride To Hell",
		show_name: "Ride To Hell",
	},
	{
		show_slug: "gameplay_SIMS 4",
		show_name: "Sims 4",
	},
	{
		show_slug: "gameplay_SiN Episodes",
		show_name: "SiN Episodes",
	},
	{
		show_slug: "gameplay_Sims",
		show_name: "Sims",
	},
	{
		show_slug: "gameplay_Simulators",
		show_name: "Simulators",
	},
	{
		show_slug: "gameplay_Sniper Elite",
		show_name: "Sniper Elite",
	},
	{
		show_slug: "gameplay_Steam_Roulette",
		show_name: "Steam Roulette",
	},
	{
		show_slug: "gameplay_Ubersoldier",
		show_name: "Ubersoldier",
	},
];

const getProperShowName = (showName) => {
	const show = showData.find(
		(show) => show.show_slug.toLowerCase() === showName.toLowerCase()
	);
	return show?.show_name || showName;
};

export { getProperShowName };
