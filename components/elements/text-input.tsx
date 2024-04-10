'use client'

import Image from 'next/image'
import { FormField } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'
import { forwardRef } from 'react'

type TextInputProps = FormField

const Input = forwardRef<
	HTMLInputElement,
	TextInputProps & { pending?: boolean }
>(
	(
		{ label, className, description, errors, name, disabled, pending, ...rest },
		ref
	) => (
		<div className={cn('relative', !label && className)}>
			{description?.length && (
				<p className='text-neutral-500 text-sm mb-2'>{description}</p>
			)}
			<input
				className={cn(
					'block bg-neutral-600 p-3 rounded-lg w-full disabled:brightness-50',
					{
						'border border-semantic-danger outline-semantic-danger':
							errors?.length,
						className: !!label
					}
				)}
				id={name}
				name={name || label}
				autoComplete='off'
				disabled={disabled || pending}
				ref={ref}
				{...rest}
			/>
			{!!errors?.length && (
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
)

const Errors = ({ errors }: { errors: string | string[] | undefined }) => {
	return (
		!!errors?.length &&
		(typeof errors === 'string' ? (
			<p className='text-semantic-danger'>{errors}</p>
		) : (
			<ul className='text-semantic-danger'>
				{errors.map((error, i) => (
					<li key={i}>{error}</li>
				))}
			</ul>
		))
	)
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			label,
			description,
			name,
			errors = [],
			labelProps,
			disabled,
			className,
			...rest
		},
		ref
	) => {
		const { pending } = useFormStatus()

		if (!label)
			return (
				<>
					<Input
						label={label}
						className={className}
						description={description}
						errors={errors}
						name={name}
						disabled={disabled}
						pending={pending}
						ref={ref}
						{...rest}
					/>
					<Errors errors={errors} />
				</>
			)

		return (
			<>
				<div className={cn('grid gap-3', label && className)}>
					<label
						htmlFor={name}
						className='capitalize w-fit'
						{...labelProps}
					>
						{label}
					</label>

					<Input
						label={label}
						className={className}
						description={description}
						errors={errors}
						name={name}
						disabled={disabled}
						pending={pending}
						ref={ref}
						{...rest}
					/>
				</div>
				<Errors errors={errors} />
			</>
		)
	}
)
TextInput.displayName = 'TextInput'

export default TextInput
