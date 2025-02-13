"use client";
import {
	createContext,
	useContext,
	useState,
	useEffect,
} from "react";
import { createClient } from "../utils/supabase/client";
import { updateUserDisplayName } from "@/app/account/actions";
import { generateUsername } from "@/app/utils/generateUsername";

const supabaseClient = createClient();

export const UserContext = createContext();

export function UserContextProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [userToken, setUserToken] = useState();
	// Use the singleton instance instead of creating a new one
	const supabase = supabaseClient;

	const fetchCurrentUser = async () => {
		const anonymousUser = {
			user: {
				aud: "anonymous",
				is_anonymous: true,
			},
		};

		try {
			// First, check localStorage
			const storedUser = localStorage.getItem("currentUser");
			if (storedUser) {
				const userData = JSON.parse(storedUser);
				if (userData && userData.user !== null) {
					setCurrentUser(userData);
					return;
				}
			}

			// If not in localStorage, fetch from Supabase
			const { data, error } = await supabase.auth.getUser();
			if (error) throw error;

			if (data) {
				setCurrentUser(data);
				localStorage.setItem("currentUser", JSON.stringify(data));
			} else {
				setCurrentUser(anonymousUser);
			}
		} catch (error) {
			console.error("YoError fetching user data:", error);
			setCurrentUser(anonymousUser);
		}
	};

	const forceFetchCurrentUser = async () => {
		const { data, error } = await supabase.auth.getUser();

		if (error) {
			console.error("Error fetching user data:", error);
		}

		if (data) {
			setCurrentUser(data);
			// Update localStorage with fresh data
			localStorage.setItem("currentUser", JSON.stringify(data));
			return data;
		} else {
			const anonymousUser = {
				user: {
					aud: "anonymous",
					is_anonymous: true,
				},
			};
			setCurrentUser(anonymousUser);
			return anonymousUser;
		}
	};

	// Clear user data from localStorage on logout
	const logout = async () => {
		await supabase.auth.signOut();
		localStorage.removeItem("currentUser");
		setCurrentUser(null);
	};

	// Fetch user data on initial load
	useEffect(() => {
		fetchCurrentUser();
		fetchUserToken();
	}, []);

	//fetch user token from  session
	const fetchUserToken = async () => {
		const { data, error } = await supabase.auth.getSession();
		if (data) {
			setUserToken(data?.session?.access_token);
		}
	};

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN") {
				const user = session?.user;

				// Check if user exists and has no display name
				if (user && !user.user_metadata?.display_name) {
					try {
						const randomUsername = generateUsername();
						await updateUserDisplayName(supabase, randomUsername);
						console.log(
							"Auto-generated display name:",
							randomUsername
						);
					} catch (error) {
						console.error("Failed to set display name:", error);
					}
				}
			}
		});

		// Cleanup subscription on unmount
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return (
		<UserContext.Provider
			value={{
				supabase,
				currentUser,
				fetchCurrentUser,
				logout,
				forceFetchCurrentUser,
				userToken,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export const useCurrentUser = () => useContext(UserContext);
