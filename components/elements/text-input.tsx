'use client'

import Image from 'next/image'
import { FormField } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'

type TextInputProps = FormField

export default function TextInput({
	label,
	description,
	name,
	textarea,
	textareaProps,
	errors = [],
	labelProps,
	className,
	...rest
}: TextInputProps) {
	const { pending } = useFormStatus()

	const TextInputElement = () => (
		<div className={cn('relative', !label && className)}>
			{textarea ? (
				<textarea
					className={cn(
						'block bg-neutral-600 p-3 rounded-lg w-full disabled:brightness-75',
						{
							'border border-semantic-danger': errors.length
						}
					)}
					id={label}
					name={name || label}
					autoComplete='off'
					disabled={pending}
					{...textareaProps}
				/>
			) : (
				<>
					{description?.length && (
						<p className='text-neutral-500 text-sm mb-2'>{description}</p>
					)}
					<input
						className={cn(
							'block bg-neutral-600 p-3 rounded-lg w-full disabled:brightness-75',
							{
								'border border-semantic-danger': errors.length
							}
						)}
						id={label}
						name={name || label}
						autoComplete='off'
						disabled={pending}
						{...rest}
					/>
				</>
			)}
			{!!errors.length && (
				<Image
					src='/assets/icons/error.webp'
					alt='Error'
					width={18}
					height={18}
					className='absolute top-1/2 right-4 -translate-y-1/2'
				/>
			)}
		</div>
	)

	const TextInputError = () =>
		!!errors?.length && (
			<ul className='text-semantic-danger'>
				{errors.map((error, i) => (
					<li key={i}>{error}</li>
				))}
			</ul>
		)

	if (!label)
		return (
			<>
				<TextInputElement />
				<TextInputError />
			</>
		)

	return (
		<>
			<div className={cn('grid gap-3 mt-5', label && className)}>
				<label
					htmlFor={label}
					className='capitalize w-fit'
					{...labelProps}
				>
					{label}
				</label>

				<TextInputElement />
			</div>
			<TextInputError />
		</>
	)
}
