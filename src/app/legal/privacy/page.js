import NavBar from "@/app/components/molecules/NavBar/NavBar";
import React from "react";

const PrivacyPolicy = () => {
	return (
		<>
			<NavBar
				title={"rt-archive"}
				renderAdditionalMenu
				previousLink={"/"}
			/>
			<div className='max-w-3xl mx-auto p-6 text-color-primary'>
				<h1 className='text-3xl font-bold mb-4'>Privacy Policy</h1>
				<p className='text-sm text-color-secondary mb-6'>
					Last Updated: 15th February, 2025
				</p>

				<section className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>
						1. Google Analytics
					</h2>
					<p>
						We use Google Analytics to gather insights into user
						interactions with our website. This helps us understand
						pain points and improve the overall user experience.
						Google Analytics collects anonymized data such as page
						views, session duration, and device type. No personally
						identifiable information (PII) is shared with Google
						Analytics.
					</p>
				</section>

				<section className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>
						2. User Accounts and Authentication
					</h2>
					<p>We offer two methods for account authentication:</p>
					<ul className='list-disc ml-6'>
						<li>
							<strong>Email Magic Link:</strong> We only store your
							email address to send you the login link, enabling
							actions like liking videos and posting comments.
						</li>
						<li>
							<strong>Google Login:</strong> If you log in with
							Google, we only store limited information: your email
							address, a unique Google-generated ID, and your name.
						</li>
					</ul>
				</section>

				<section className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>
						3. Data Sent to Our Servers
					</h2>
					<p>
						No personal data is sent to our servers without your
						explicit permission. Actions such as posting comments or
						liking videos require user interaction and consent.
					</p>
				</section>

				<section className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>
						4. Watch History
					</h2>
					<p>
						Your watch history is stored{" "}
						<strong>locally in your browser</strong> using IndexedDB.
						This ensures that your viewing history never leaves your
						device. While this means you cannot sync your history
						across multiple devices, it enhances privacy by keeping
						the data entirely within your control.
					</p>
				</section>

				<section className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>
						5. Data Security
					</h2>
					<p>
						We take appropriate security measures to protect your data
						from unauthorized access or disclosure. However, no online
						service is completely secure, so we encourage users to
						take personal precautions, such as using strong passwords
						and logging out after use.
					</p>
				</section>

				<section className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>
						6. Changes to This Privacy Policy
					</h2>
					<p>
						We may update this Privacy Policy periodically. If any
						significant changes occur, we will notify users via the
						website. Continued use of our site after modifications
						constitutes acceptance of the updated policy.
					</p>
				</section>

				<section>
					<h2 className='text-xl font-semibold mb-2'>
						7. Contact Us
					</h2>
					<p>
						If you have any questions or concerns regarding this
						Privacy Policy, please contact us at{" "}
						<strong>info@rtarchive.xyz</strong>.
					</p>
				</section>
			</div>
		</>
	);
};

export default PrivacyPolicy;
