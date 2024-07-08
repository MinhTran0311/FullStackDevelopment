import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 
  const [user, setUser] = useState(null)
  const [notiMessage, setNotiMessage] = useState({
    message: "",
    isSuccess: false,
  });

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

  const showMessage = (message, isSuccess) => {
    setNotiMessage({
      message: message,
      isSuccess: isSuccess,
    });
    setTimeout(() => {
      setNotiMessage({ ...notiMessage, message: null });
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const response = await loginService.login({
        username, password,
      })
      blogService.setToken(response.data.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(response.data)
      ) 
      setUser(response.data)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage(exception.message, false)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    window.location.reload()
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title,
        author,
        url
      }
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      showMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, true)
    } catch (exception) {
      showMessage(`${exception}`, false)
    }
  }

  const loginForm = () => (<>
    <h2>Log in to application</h2>
    <Notification notiMessage={notiMessage} />
    <form onSubmit={handleLogin}>
    <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form></>
  )
  

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">save</button>
    </form>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        <div>
          {blogForm()}
          <h2>blogs</h2>
          <Notification notiMessage={notiMessage} />
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
      
    </div>
  )
}

export default App