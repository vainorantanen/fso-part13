const Blog = ({blog, deleteBlog}) => (
  <div>
    {blog.title} {blog.author}<button onClick={() => deleteBlog(blog.id)}>Delete</button>
  </div>  
)

export default Blog