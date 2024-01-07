'use client'

import { useState } from 'react'

export default function useArray<T>(defaultValue: T[]) {
	const [array, setArray] = useState(defaultValue)

	const methods = {
		push: function (element: T) {
			// Add element at the end
			setArray(a => [...a, element])
		},
		pop: function () {
			// Remove last element
			setArray(a => a.slice(0, -1))
		},
		shift: function () {
			// Remove first element
			setArray(a => a.slice(1))
		},
		unshift: function (element: T) {
			// Add element at begining
			setArray(a => [element, ...a])
		},
		filter: function (
			callback: (value: T, index: number, array: T[]) => boolean
		) {
			// Filter elements
			setArray(a => a.filter(callback))
		},
		replace: function (index: number, element: T) {
			// Replace element at given index with given element
			setArray(a => [...a.slice(0, index), element, ...a.slice(index + 1)])
		},
		update: function (index: number, element: T) {
			// Add given element at given index
			setArray(a => [...a.slice(0, index), element, ...a.slice(index)])
		},
		remove: function (index: number) {
			// Remove element from given index
			setArray(a => [...a.slice(0, index), ...a.slice(index + 1)])
		},
		clear: function () {
			// Empty array
			setArray([])
		}
	}

	return { array, set: setArray, ...methods }
}
