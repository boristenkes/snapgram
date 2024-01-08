'use client'

import Image from 'next/image'
import { FormField } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'

type InputProps = FormField

export default function Input({
	label,
	name,
	textarea,
	textareaProps,
	errors = [],
	labelProps,
	className,
	...rest
}: InputProps) {
	const { pending } = useFormStatus()

	const InputElement = () => (
		<div className='relative'>
			{textarea ? (
				<textarea
					className={cn(
						'block bg-neutral-600 p-3 rounded-lg w-full disabled:brightness-75',
						{
							'input--error': errors.length
						}
					)}
					id={label}
					name={name || label}
					autoComplete='off'
					disabled={pending}
					{...textareaProps}
				/>
			) : (
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
			)}
			{Boolean(errors.length) && (
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

	const InputError = () =>
		Boolean(errors?.length) && (
			<ul className='text-semantic-danger'>
				{errors.map((error, i) => (
					<li key={i}>{error}</li>
				))}
			</ul>
		)

	if (!label)
		return (
			<>
				<InputElement />
				<InputError />
			</>
		)

	return (
		<>
			<div className='grid gap-3 mt-5'>
				<label
					htmlFor={label}
					className='capitalize w-fit'
					{...labelProps}
				>
					{label}
				</label>

				<InputElement />
			</div>
			<InputError />
		</>
	)
}
