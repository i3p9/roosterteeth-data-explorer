"use client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function HealthPage() {
	return (
		<div className='p-4'>
			<h1 className='text-2xl font-bold mb-4'>Health Check</h1>
			<p>Base URL: {BASE_URL}</p>
		</div>
	);
}
