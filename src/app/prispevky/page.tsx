import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

export const metadata = { title: 'Detail prispevku | RobertWeb' };

async function getPostDetail(id: string) {
  // This is a placeholder. Replace with your actual API call or database query
  const posts = [
    { id: "1", title: "First Post", content: "This is the first post" },
    { id: "2", title: "Second Post", content: "This is the second post" },
  ]
  return posts.find(post => post.id === id)
}

export default async function PostDetail({ 
  params,
}: {
  params: {
    prispevokId: string
  };
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/prihlasenie")
  }

  const post = await getPostDetail(params.prispevokId)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-lg mb-4">{post.content}</p>
      <p className="text-sm text-gray-500">Post ID: {params.prispevokId}</p>
    </div>
  );
}

