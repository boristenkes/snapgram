'use client'

import Image from 'next/image'

type InputProps = {
	type?: React.HTMLInputTypeAttribute
	label?: string
	name?: string
	textarea?: boolean
	required?: boolean
	autoFocus?: boolean
	placeholder?: string
	defaultValue?: string
	errors?: string[]
}

export default function Input({
	type = 'text',
	label,
	name,
	textarea = false,
	required = false,
	autoFocus = false,
	placeholder = '',
	defaultValue = '',
	errors = []
}: InputProps) {
	const InputElement = () => (
		<div className='relative'>
			<input
				defaultValue={defaultValue}
				type={type}
				className={`input${errors.length ? ' input--error' : ''}`}
				required={required}
				id={label}
				name={name || label}
				autoComplete='off'
				autoFocus={autoFocus}
				placeholder={placeholder}
			/>
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
			<div className='input_wrapper'>
				<label
					htmlFor={label}
					className='input_label'
				>
					{label}
				</label>

				<InputElement />
			</div>
			<InputError />
		</>
	)
}
