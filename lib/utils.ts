import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function deepFreeze(value: Record<any, any> | any[]) {
	const isArray = Array.isArray(value)

	const propNames = isArray ? value : Object.keys(value)

	for (const name of propNames) {
		const val = isArray ? name : value[name]

		if ((val && typeof val === 'object') || typeof val === 'function') {
			deepFreeze(val)
		}
	}

	return Object.freeze(value)
}

const MAX_IMAGE_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ACCEPTABLE_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp'
]

type ValidateImageOptions = {
	maxSize?: number
	acceptableTypes?: string[]
}

export function validateImage(
	image: File,
	{
		maxSize = MAX_IMAGE_FILE_SIZE,
		acceptableTypes = ACCEPTABLE_IMAGE_TYPES
	}: ValidateImageOptions = {}
) {
	const errors = []

	if (!acceptableTypes.includes(image.type)) {
		const acceptableTypesStr = `${acceptableTypes
			.map(type => type.slice(6)) // exclude "image/" from type
			.slice(0, -1) // exclude last type
			.join(', ')} and ${acceptableTypes.at(-1)?.slice(6)}`

		errors.push(`Only ${acceptableTypesStr} images are allowed.`)
	}

	if (image?.size > maxSize)
		errors.push(
			`Please choose an image smaller than ${bytesToMegabytes(maxSize)}MB`
		)

	return { success: !errors.length, errors }
}

export function removeDuplicates(
	array: any[] | undefined,
	id?: string | number
) {
	if (!array) return

	if (typeof array[0] !== 'object') {
		return Array.from(new Set([...array]))
	}

	if (!id) throw new Error('id is required when array contains objects')

	return array.filter(
		(item, index, self) => index === self.findIndex(t => t[id] === item[id])
	)
}

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const bytesToMegabytes = (bytes: number) => bytes / (1024 * 1024)

export const megabytesToBytes = (mb: number) => mb * (1024 * 1024)

export const id = () => Math.random().toString(36).slice(2)
