import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

export default function Footer() {
	const navigate = useNavigate()
	return (
		<footer className="flex flex-col items-center justify-center border-t bg-[#2b2b2b] p-12 px-4  text-white">
			<div className="flex items-center">
				<span className="mr-2">© 2023 Copyright:</span>
				<Link
					to={`https://github.com/saddamarbaa`}
					className="font-bold text-amber-500 hover:underline"
					target="_blank"
					rel="noopener noreferrer">
					Saddam Arbaa
				</Link>
			</div>
			<div className="mt-4 text-center">
				Want to see how I built this website? Check out my{' '}
				<Link
					to="https://github.com/saddamarbaa/realtor-clone-app-react-typescript"
					className="font-bold text-amber-500 hover:underline"
					target="_blank"
					rel="noopener noreferrer">
					Github repository
				</Link>{' '}
				<p className="mt-1">
					for the source code, and learn about the technologies and techniques I
					used to create it.
				</p>
			</div>
		</footer>
	)
}
