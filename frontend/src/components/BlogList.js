import React from 'react'
import Blog from './Blog'

export const BlogList = ({ blogs, deleteBlog, setBlogs, user }) => {
  return (
    <div>
        {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} setBlogs={setBlogs} blogs={blogs}
      user={user}/>
    )}
    </div>
  )
}
