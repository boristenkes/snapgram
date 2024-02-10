import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...args: ClassValue[]) {
	return twMerge(clsx(args))
}

export function isBase64(imageData: string) {
	const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
	return base64Regex.test(imageData)
}

export function time({ millis }: { millis?: boolean } = {}) {
	const d = new Date()
	const hrs = leadingZeros(d.getHours())
	const mins = leadingZeros(d.getMinutes())
	const secs = leadingZeros(d.getSeconds())

	if (millis) {
		const m = d.getMilliseconds()
		const millis = m < 10 ? `00${m}` : m < 100 ? `0${m}` : m.toString()
		return `${hrs}:${mins}:${secs}:${millis}:`
	}

	return `${hrs}:${mins}:${secs}:`
}

export function leadingZeros(n: number) {
	return n < 10 ? `0${n}` : n.toString()
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

	if (!errors.length) return { success: true, errors }

	return { success: false, errors }
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

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const bytesToMegabytes = (bytes: number) => bytes / (1024 * 1024)

export const megabytesToBytes = (mb: number) => mb * (1024 * 1024)

export const id = () => {
	const rand = Math.random().toString(36)
	const date = Date.now().toString(36)

	return (rand + date).slice(2)
}
