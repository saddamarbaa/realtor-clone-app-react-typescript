import { useRouteError, useNavigate } from 'react-router-dom'

type RouteError = {
	statusText?: string
	message: string
}

export default function ErrorPage() {
	const error = useRouteError() as RouteError
	console.error(error)
	const navigate = useNavigate()

	const handleGoBack = (): void => {
		navigate('/')
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
			<h1 className="text-4xl font-bold text-red-500">Oops!</h1>
			<p className="mt-4 text-lg font-medium text-gray-700">
				Sorry, an unexpected error has occurred.
			</p>
			<p className="mt-2 text-sm italic text-gray-600">
				{error.statusText || error.message}
			</p>
			<button
				className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600"
				onClick={handleGoBack}>
				Go back to the home page
			</button>
		</div>
	)
}
