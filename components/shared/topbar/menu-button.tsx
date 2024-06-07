'use client'

import { Button } from '@/components/elements'
import { cn } from '@/lib/utils'

type MenuButtonProps = {
	isOpen: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MenuButton({ isOpen, setOpen }: MenuButtonProps) {
	return (
		<Button
			variant='dark'
			className='p-2'
			onClick={() => setOpen(prev => !prev)}
			aria-label={isOpen ? 'Close menu' : 'Open menu'}
		>
			<div className='grid gap-1 w-5 h-3.5'>
				<div
					className={cn('menu-icon-line', {
						'rotate-45 translate-y-[.36rem]': isOpen
					})}
				/>
				<div
					className={cn('menu-icon-line w-3/4', {
						'opacity-0': isOpen
					})}
				/>
				<div
					className={cn('menu-icon-line', {
						'-rotate-45 -translate-y-[.36rem]': isOpen
					})}
				/>
			</div>
		</Button>
	)
}
