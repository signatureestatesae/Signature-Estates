import { createClient } from "@/lib/supabase/server";
import BlogList from "@/components/admin/BlogList";
import { PageHeader, PrimaryButton } from "@/components/admin/ui";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id,title,author,published,published_at,created_at,cover_image")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        description="Articles shown on /blog."
        actions={<PrimaryButton href="/admin/blog/new">+ New Post</PrimaryButton>}
      />

      <div className="mt-6">
        <BlogList rows={posts ?? []} />
      </div>
    </div>
  );
}
