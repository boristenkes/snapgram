import { bottombarLinks } from '@/constants'
import BottombarLink from './bottombar-link'

export default function Bottombar() {
	return (
		<header className='fixed bottom-0 inset-x-0 self-end z-40 bg-neutral-700/80 backdrop-blur-3xl rounded-t-2xl | md:hidden'>
			<nav>
				<ul className='flex justify-around py-3'>
					{bottombarLinks.map(link => (
						<BottombarLink
							key={link.path}
							{...link}
							className='flex-col items-center'
						/>
					))}
				</ul>
			</nav>
		</header>
	)
}
