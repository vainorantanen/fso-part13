import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import ErrorNotification from './components/errorNotification'
import SuccessNotification from './components/successNotification'

import './index.css'
import { BlogList } from './components/BlogList'
import Login from './components/Login'

const BlogForm = ({ handleLogout, addBlog, blogTitle, setBlogAuthor, setBlogTitle, setBlogUrl,
   blogAuthor,  blogUrl, year, setYear}) => {
  return (
  <div>
    <h2>blogs</h2>

    
    <button onClick={handleLogout}>logout</button>

    <h2>Create new</h2>
    <form onSubmit={addBlog}>
Title: <input 
  type="text"
  value={blogTitle}
  onChange={({ target }) => setBlogTitle(target.value)} // Corrected
/>
<br />
Author: <input
  type="text"
  value={blogAuthor}
  onChange={({ target }) => setBlogAuthor(target.value)} // Corrected
/>
<br />
URL: <input 
  type="text"
  value={blogUrl}
  onChange={({ target }) => setBlogUrl(target.value)} // Corrected
/>
<br />
Year: <input 
  type="number"
  value={year}
  onChange={({ target }) => setYear(target.value)} // Corrected
/>
<button type="submit">Create</button>
</form>

  </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [ year, setYear ] = useState(2000)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = async () => {
    //event.preventDefault()
    try {
      console.log("trying to log out")
      window.localStorage.removeItem('loggedBlogappUser')
      console.log("logged out succesfully")
    } catch (exception) {
      console.log("logout failed")
      setTimeout(() => {
      }, 5000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObj = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
      likes : 0,
      year: Number(year)
    }

    const returnedBlog = await blogService.create(blogObj)
    setBlogs(blogs.concat(returnedBlog))

    setSuccessMessage(`a new blog ${blogObj.title} by ${blogAuthor} added`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)

    setBlogAuthor('')
    setBlogTitle('')
    setBlogUrl('')
  }

  const deleteBlog = async (blogId) => {
    try {
      await blogService.remove(blogId)
      setBlogs(blogs.filter(b => b.id !== blogId))
      setSuccessMessage('Poisto onnistui')
    } catch (error) {
      setErrorMessage('Poisto epäonnistui')
    }
  }

  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      {!user && <Login setUser={setUser} setErrorMessage={setErrorMessage}/>}
      {user && (
        <div>
          <p>{user.username} logged in</p>
          </div>
      )}
      <BlogForm handleLogout={handleLogout} addBlog={addBlog}
      blogTitle={blogTitle} setBlogAuthor={setBlogAuthor}
       setBlogTitle={setBlogTitle} setBlogUrl={setBlogUrl}
        blogAuthor={blogAuthor} blogUrl={blogUrl} year={year}
        setYear={setYear}
        />
    <BlogList blogs={blogs} deleteBlog={deleteBlog} setBlogs={setBlogs} user={user}/>
    </div>
  )
}

//{!user && loginForm()}
//<p>{user.name} logged in</p>

export default App