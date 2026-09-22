import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (!post) notFound();

  return (
    <div>
      <BackLink href="/admin/blog" label="Back to blog posts" />
      <PageHeader title="Edit Blog Post" description={post.title} />
      <div className="mt-6">
        <BlogPostForm
          initial={{
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            cover_image: post.cover_image,
            author: post.author,
            published: post.published,
            published_at: post.published_at,
          }}
        />
      </div>
    </div>
  );
}
