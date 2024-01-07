/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com', // google oauth provider
				pathname: '/a/**'
			},
			{
				protocol: 'https',
				hostname: 'utfs.io', // uploadthing
				pathname: '/f/**'
			}
		]
	}
}

module.exports = nextConfig
