import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'

type UnavailableProps = {
	children: React.ReactNode
	tooltip?: boolean
}

export default function Unavailable({
	children,
	tooltip = false
}: UnavailableProps) {
	return tooltip ? (
		<Tooltip>
			<TooltipTrigger className='relative before:content-[""] before:absolute before:inset-0 before:z-10'>
				{children}
			</TooltipTrigger>
			<TooltipContent>Coming soon</TooltipContent>
		</Tooltip>
	) : (
		<div className='relative'>
			<div className='w-full h-full absolute inset-0 z-10 bg-neutral-800/90 grid place-items-center opacity-0 hover:opacity-100 transition-opacity duration-200 select-none'>
				Coming soon
			</div>
			{children}
		</div>
	)
}
