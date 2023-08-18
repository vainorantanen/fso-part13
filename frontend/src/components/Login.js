import React, {useState} from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const Login = ({ setUser, setErrorMessage }) => {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)
        try {
          const user = await loginService.login({
            username, password,
          })
    
          window.localStorage.setItem(
            'loggedBlogappUser', JSON.stringify(user)
          ) 
    
          blogService.setToken(user.token)
          console.log(user.token)
          setUser(user)
          setUsername('')
          setPassword('')
        } catch (exception) {
          setErrorMessage('wrong username or password')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
    
      }


  return (
    <div>
      <h2>Login to the application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    </div>   
  )
}

export default Login