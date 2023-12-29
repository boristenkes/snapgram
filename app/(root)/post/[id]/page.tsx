export default function PostPage({
	params: { id }
}: {
	params: { id: string }
}) {
	return <h1>{id}</h1>
}
