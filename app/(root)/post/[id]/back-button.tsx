'use client'

import { Button, type ButtonProps } from '@/components/elements'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function BackButton({ className, ...props }: ButtonProps) {
	const router = useRouter()

	return (
		<Button
			variant='dark'
			size='sm'
			className={cn('gap-1', className)}
			onClick={() => router.back()}
			{...props}
		>
			<svg
				width='18'
				height='18'
				viewBox='0 0 18 19'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M12.5623 15.5001C12.5623 15.3501 12.5248 15.2001 12.4123 15.0876L6.78731 9.50005L12.4123 3.91255C12.6373 3.68755 12.6373 3.35005 12.4123 3.12505C12.1873 2.90005 11.8498 2.90005 11.6248 3.12505L5.6248 9.12505C5.3998 9.35005 5.3998 9.68755 5.6248 9.91255L11.6248 15.9126C11.8498 16.1376 12.1873 16.1376 12.4123 15.9126C12.5248 15.8001 12.5623 15.6501 12.5623 15.5001Z'
					fill='#fff'
				/>
			</svg>
			Back
		</Button>
	)
}
