import blogService from "../services/blogs"

const Blog = ({blog, deleteBlog, setBlogs, blogs, user }) => {

  const likeBlog = async () => {
    try {
      const updatedBlog = await blogService.update({...blog, likes: blog.likes+1})
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
    } catch (error) {
      
    }
  }

  return(
  <div>
    {blog.title} {blog.author} Likes: {blog.likes}<button onClick={() => deleteBlog(blog.id)}>Delete</button>
    <button onClick={likeBlog}>Like</button>
  </div>
  )
}

export default Blog