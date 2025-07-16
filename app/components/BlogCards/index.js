"use client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import { useRouter } from "next/navigation";

const BlogCards = ({ blogs, posts, showPosts = false }) => {
  const router = useRouter();

  const handleNavigation = (slug) => {
    router.push(`/blogs${slug}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((blog, index) => (
              <Card
                key={index}
                className="cursor-pointer transition-shadow hover:shadow-lg p-3"
                onClick={() => handleNavigation(blog.slug)}
              >
                <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={blog.image && blog.image?.startsWith('https') ? blog.image : defaultMedia.src}
                    alt={blog.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardContent className="pt-2 pb-2">
                  <CardTitle className="mt-2 text-[#1b262c] font-bold text-lg font-sans leading-tight">
                    {blog.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="flex gap-4 mt-1 text-[15px] text-[var(--main-accent-color)] font-sans pt-2">
                  <p>{blog.date}</p>
                  <p>by {blog.author}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        {showPosts && (
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="mt-9">
              <p className="text-2xl font-bold text-[var(--main-accent-dark)] mb-2 font-sans">Latest Posts</p>
            </div>
            <div className="space-y-6">
              {posts.map((post, index) => (
                <div key={index}>
                  <div className="flex gap-8 mt-2 text-[17px] text-[var(--main-accent-color)] font-sans">
                    <p>{post.date}</p>
                    <p>by {post.author}</p>
                  </div>
                  <p className="mt-2 text-[#1b262c] font-semibold text-lg font-sans leading-snug">{post.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCards;
