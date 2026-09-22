import BlogPostForm from "@/components/admin/BlogPostForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default function NewBlogPostPage() {
  return (
    <div>
      <BackLink href="/admin/blog" label="Back to blog posts" />
      <PageHeader title="New Blog Post" />
      <div className="mt-6">
        <BlogPostForm />
      </div>
    </div>
  );
}
