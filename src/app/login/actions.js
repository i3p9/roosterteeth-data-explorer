"use server";

import { createClient } from "../utils/supabase/server";
import { generateUsername } from "../utils/generateUsername";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const CALLBACK_URL = `${BASE_URL}/api/auth/callback`;

export async function loginWithEmail(email) {
	const supabase = await createClient();

	try {
		const { data: dataUser, error } =
			await supabase.auth.signInWithOtp({
				email: email,
				options: {
					shouldCreateUser: true,
					emailRedirectTo: CALLBACK_URL,
					data: {
						display_name: generateUsername(),
					},
				},
			});

		if (error) throw error;
		return { success: true, data: dataUser };
	} catch (error) {
		return { success: false, error: error.message };
	}
}

export async function loginWithGoogle() {
	const supabase = await createClient();
	try {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: CALLBACK_URL,
			},
			data: {
				display_name: generateUsername(),
			},
		});
		if (data.url) {
			redirect(data.url);
		}
		if (error) throw error;
	} catch (error) {
		throw error;
		// return { success: false, error: error.message };
	}
}
