import { bottombarLinks } from '@/constants'
import Image from 'next/image'
import SidebarLink from './SidebarLink'
import BottombarLink from './BottombarLink'

export default function Bottombar() {
	return (
		<header className='sticky bottom-0 bg-neutral-700/80 backdrop-blur-3xl rounded-t-2xl lg:hidden'>
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
