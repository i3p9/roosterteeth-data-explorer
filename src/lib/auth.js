export async function verifyJWT(req) {
	const authHeader = req.headers.get("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return {
			success: false,
			status: 401,
			message: "Missing or invalid authorization token",
		};
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = JSON.parse(atob(token.split(".")[1]));

		// Verify issuer (iss)
		if (
			!decoded.iss.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL)
		) {
			return {
				success: false,
				status: 401,
				message: "Invalid token issuer",
			};
		}

		// Check token expiration
		if (decoded.exp * 1000 < Date.now()) {
			return {
				success: false,
				status: 401,
				message: "Token has expired",
			};
		}

		return {
			success: true,
			user: decoded,
		};
	} catch (tokenError) {
		return {
			success: false,
			status: 401,
			message: "Invalid token format",
		};
	}
}
