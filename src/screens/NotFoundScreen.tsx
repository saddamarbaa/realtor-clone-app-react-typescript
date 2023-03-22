import { Link } from 'react-router-dom'

export default function NotFoundScreen() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
			<div className="max-w-lg text-center">
				<h1 className="text-4xl font-bold text-red-500">Oops!</h1>
				<p className="b-4 mb-5 mt-4  text-lg font-medium text-gray-700">
					We re sorry. The page you requested could not be found. Please go back
					to the homepage or contact us
				</p>

				<Link
					to="/"
					className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600">
					Go back
				</Link>
			</div>
		</div>
	)
}
