import Link from 'next/link'

export default function NotFound() {
    return (
        <div class="min-h-screen flex flex-grow items-center justify-center">
            <div className="rounded-md bg-pink-200 p-24 text-center shadow-xl flex flex-col items-center">
                <p class="primary-text mb-8 font-light">its not you, its me</p>
                <img src={`/404.gif`} alt="404 gif" />
                <Link href="/" className="mt-8 shadow-xl rounded px-4 py-2 font-semibold button-primary">Go back to Home</Link>
            </div>
        </div>
    )
}
