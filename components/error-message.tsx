import { cn } from '@/lib/utils'
import Image from 'next/image'

type ErrorMessageProps = {
	message: string | undefined
	className?: string
}

export default function ErrorMessage({
	message = 'Something went wrong. Please try again later.',
	className
}: ErrorMessageProps) {
	return (
		<p
			role='alert'
			className={cn(
				'bg-semantic-danger/40 p-2 rounded-lg my-6 flex items-center gap-2 w-fit',
				className
			)}
		>
			<Image
				src='/assets/icons/error.svg'
				alt=''
				width={18}
				height={18}
			/>
			{message}
		</p>
	)
}
