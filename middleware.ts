export { default } from 'next-auth/middleware'

export const config = {
	matcher: ['/((?!register|login|onboarding|assets|_next/static|robots.txt).*)']
}
