"use client";

import { useState } from "react";
import { mySupabaseClient } from "../lib/supabase";
import NavBar from "../components/molecules/NavBar/NavBar";
import Spinner from "../components/atoms/Spinner/Spinner";
import { IoCheckmark } from "react-icons/io5";
import "./login.css";

const LoginPage = () => {
	const [userData, setUserData] = useState({
		email: "",
	});
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const login = async (e) => {
		setLoading(true);
		e.preventDefault();
		try {
			let { data: dataUser, error } =
				await mySupabaseClient.auth.signInWithOtp({
					email: userData?.email,
					options: {
						shouldCreateUser: true,
						emailRedirectTo: "https://rtarchive.xyz/account",
					},
				});

			if (dataUser) {
				// console.log("response: ", dataUser);
				setSuccess(true);
				setLoading(false);
			}
			if (error) {
				console.log("Error from notcatch apiii: ", error);
				console.log("msg: ", error.message);
				setLoading(false);
				setIsError(true);
			}
		} catch (error) {
			console.log("Error from apiii: ", error);
			setLoading(false);
			setIsError(true);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<>
			<NavBar title='Login' previousLink={"/"} />
			<div className='container mx-auto p-10 flex items-center justify-center text-color-primary'>
				<form
					onSubmit={login}
					className='flex flex-col p-8 border-2 border-color-primary relative dot-shadow'
				>
					<div className='flex flex-col items-center'>
						<p className='font-black text-2xl stretch-125 mb-2'>
							Login to continue
						</p>
						<p className=' text-md stretch-110 mb-2 line-clamp-4'>
							By loggin in, you can like videos, create playlists
							(coming soon) and hoesntly, not much more.
						</p>

						<label htmlFor='email'>Enter email </label>
						<input
							type='email'
							name='email'
							value={userData?.email}
							onChange={handleChange}
							className='border-2 border-color-primary p-1 m-2 rounded-lg w-80'
						/>
						{success ? (
							<button
								disabled
								className='p-1 m-2 button-disabled rounded-lg w-80 flex items-center justify-center gap-2'
							>
								{isError ? (
									<span>Something went wrong!</span>
								) : (
									<span>
										Sent! Check your email.{" "}
										<IoCheckmark style={{ display: "inline" }} />
									</span>
								)}
							</button>
						) : (
							<button className='p-1 m-2 button-primary rounded-lg w-80 flex items-center justify-center gap-2'>
								Send Login Link {loading && <Spinner size={4} />}
							</button>
						)}
					</div>
				</form>
			</div>
		</>
	);
};

export default LoginPage;
