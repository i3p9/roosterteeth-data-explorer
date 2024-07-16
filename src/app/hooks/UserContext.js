"use client";
import {
	createContext,
	useContext,
	useState,
	useEffect,
} from "react";
import { mySupabaseClient } from "../lib/supabase";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState();

	const fetchCurrentUser = async () => {
		// First, check localStorage
		const storedUser = localStorage.getItem("currentUser");
		if (storedUser) {
			try {
				const userData = JSON.parse(storedUser);
				if (userData && userData.user !== null) {
					setCurrentUser(userData);
					return;
				}
			} catch (error) {
				console.error("Error parsing stored user data:", error);
			}
		}

		// If not in localStorage, fetch from Supabase
		const { data, error } = await mySupabaseClient.auth.getUser();
		if (data) {
			console.log("user data: ", data);
			setCurrentUser(data);
			// Save to localStorage
			localStorage.setItem("currentUser", JSON.stringify(data));
		} else {
			const anonymousUser = {
				user: {
					aud: "anonymous",
					is_anonymous: true,
				},
			};
			setCurrentUser(anonymousUser);
			// localStorage.setItem(
			// 	"currentUser",
			// 	JSON.stringify(anonymousUser)
			// );
		}
	};

	// Clear user data from localStorage on logout
	const logout = async () => {
		await mySupabaseClient.auth.signOut();
		localStorage.removeItem("currentUser");
		setCurrentUser(null);
	};

	// Fetch user data on initial load
	useEffect(() => {
		fetchCurrentUser();
	}, []);

	return (
		<UserContext.Provider
			value={{ currentUser, fetchCurrentUser, logout }}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useCurrentUser = () => useContext(UserContext);
