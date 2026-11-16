const requiredBuildVariables = [
	"NEXT_PUBLIC_SUPABASE_URL",
	"NEXT_PUBLIC_SUPABASE_ANON_KEY",
	"NEXT_PUBLIC_BASE_URL",
	"MONGODB_URI",
];

export function validateBuildEnv(env) {
	const missing = requiredBuildVariables.filter((name) => !env[name]?.trim());
	if (missing.length === 0) return;

	throw new Error([
		"RTArchive build is missing required environment variables:",
		...missing.map((name) => `  - ${name}`),
		"",
		"Cloudflare: open the Worker's Settings > Build > Build variables and secrets.",
		"Add them to the production or preview build settings used by this branch.",
		"Worker runtime secrets are configured separately and do not supply build variables.",
		"See .env.example and CLOUDFLARE.md. Secret values are never printed by this check.",
	].join("\n"));
}
