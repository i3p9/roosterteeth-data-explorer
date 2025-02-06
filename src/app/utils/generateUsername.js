const descriptors = [
	// Colors
	"Blue",
	"Crimson",
	"Azure",
	"Violet",
	"Golden",
	"Silver",
	// Personality
	"Brave",
	"Wise",
	"Silent",
	"Swift",
	"Mystic",
	"Noble",
	// Nature
	"Storm",
	"Forest",
	"Ocean",
	"Mountain",
	"Star",
	"Moon",
	// Elements
	"Fire",
	"Ice",
	"Wind",
	"Thunder",
	"Shadow",
	"Light",
];

const subjects = [
	// Animals
	"Wolf",
	"Dragon",
	"Phoenix",
	"Raven",
	"Lion",
	"Tiger",
	// Roles
	"Knight",
	"Sage",
	"Hunter",
	"Ranger",
	"Warrior",
	"Scout",
	// Nature
	"River",
	"Cloud",
	"Peak",
	"Grove",
	"Dawn",
	"Dusk",
	// Objects
	"Blade",
	"Shield",
	"Crown",
	"Arrow",
	"Spirit",
	"Heart",
];

export const generateUsername = () => {
	const descriptor =
		descriptors[Math.floor(Math.random() * descriptors.length)];
	const subject =
		subjects[Math.floor(Math.random() * subjects.length)];

	// Generate a random number between 1 and 999, padded with zeros
	const number = Math.floor(Math.random() * 999) + 1;
	const paddedNumber = number.toString().padStart(3, "0");

	// 50% chance to include the number
	const includeNumber = Math.random() < 0.5;

	return includeNumber
		? `${descriptor}${subject}${paddedNumber}`
		: `${descriptor}${subject}`;
};
