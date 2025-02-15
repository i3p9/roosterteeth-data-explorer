"use client";

import { useState } from "react";
import NavBar from "../components/molecules/NavBar/NavBar";
import "./login.css";
import { loginWithEmail, loginWithGoogle } from "./actions";
import SignInWithGoogle from "../components/buttons/SignInWithGoogle/SignInWithGoogle";
import { MdDone } from "react-icons/md";
import { TbCircleDashed } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa6";
import { BiErrorCircle } from "react-icons/bi";
import toast from "react-hot-toast";

const LoginButton = ({ formStatus, disabled }) => {
	return (
		<button
			disabled={disabled}
			className={`px-3 py-[12px] rounded-lg transition-all duration-300 w-full ${
				formStatus.state === "error"
					? "bg-red-500 text-white"
					: formStatus.state === "success"
					? "bg-green-600 text-white"
					: "bg-color-reverse text-color-reverse"
			} ${disabled ? "opacity-50" : "hover:opacity-90"}`}
		>
			<div className='flex items-center justify-center gap-2'>
				{formStatus.state === "loading" && (
					<>
						<TbCircleDashed className='w-5 h-5 animate-spin' />
						<span>Sending...</span>
					</>
				)}
				{formStatus.state === "error" && (
					<>
						<BiErrorCircle className='w-5 h-5' />
						<span>Try Again</span>
					</>
				)}
				{formStatus.state === "success" && (
					<>
						<MdDone className='w-5 h-5' />
						<span>Check Email</span>
					</>
				)}
				{formStatus.state === "default" && (
					<>
						<FaArrowRight className='w-5 h-5' />
						<span>Continue</span>
					</>
				)}
			</div>
		</button>
	);
};

const LoginPage = () => {
	const [userData, setUserData] = useState({
		email: "",
	});
	const [formStatus, setFormStatus] = useState({
		state: "default", // possible values: 'default', 'loading', 'error', 'success'
	});

	const login = async (e) => {
		setFormStatus({ state: "loading" });
		e.preventDefault();
		try {
			const result = await loginWithEmail(userData?.email);

			console.log("result: ", result);

			if (result.success) {
				setFormStatus({ state: "success" });
				toast.success("Magic Link to sent to email!");
				// await clinet.auth.getSession();
			} else {
				setFormStatus({ state: "error" });
				toast.error("Something went wrong!");
			}
		} catch (error) {
			setFormStatus({ state: "error" });
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const googleLogin = async (e) => {
		e.preventDefault();
		await loginWithGoogle();
	};

	return (
		<>
			<NavBar title='Login' previousLink={"/"} renderAdditionalMenu />
			<div className='container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]'>
				<div className='w-full max-w-md border-2 border-color-primary relative dot-shadow'>
					<div className='bg-color-secondary text-color-primary'>
						<h1 className='font-black text-color-primary text-2xl mb-4 p-6'>
							Login
						</h1>
					</div>
					<div className='px-6 pb-6'>
						<p className='text-sm mb-6 text-color-secondary'>
							Login to post comments, like videos, and create
							playlists (coming soon), and not much more.
						</p>

						<form onSubmit={login} className='space-y-4'>
							<div className='flex flex-col'>
								<label
									className='text-sm mb-2 text-color-secondary'
									htmlFor='email'
								>
									Email address:
								</label>
								<input
									type='email'
									name='email'
									value={userData?.email}
									onChange={handleChange}
									placeholder='name@domain.com'
									className='border-2 border-color-secondary text-color-primary bg-color-primary px-4 py-2 rounded-lg w-full hover:border-color-primary transition-all duration-300'
								/>
							</div>

							<LoginButton
								formStatus={formStatus}
								disabled={
									!userData?.email || formStatus.state === "success"
								}
							/>
						</form>

						<div className='mt-6 text-center'>
							<div className='relative'>
								<div className='absolute inset-0 flex items-center'>
									<div className='w-full border-t border-gray-300'></div>
								</div>
								<div className='relative flex justify-center text-sm'>
									<span className='px-2 bg-color-primary text-color-secondary'>
										Or, use a provider
									</span>
								</div>
							</div>

							<form onSubmit={googleLogin} className='mt-4'>
								<SignInWithGoogle />
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
