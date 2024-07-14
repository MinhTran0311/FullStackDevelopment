import { useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/userReducer'
import { initializeBlogs } from './reducers/blogReducer'
import BlogList from './components/BlogList'
import Menu from './components/Menu'
import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import Users from './components/Users'
import Blog from './components/Blog'
import User from './components/User'
import { initializeUsers } from './reducers/usersReducer'
import { Box, Container, Typography } from '@mui/material'

const App = () => {
  const user = useSelector((state) => state.user)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const blogPage = () => (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm />
        </Togglable>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Notification />
      </Box>
      <Box>
        <BlogList />
      </Box>
    </Container>
  )

  const blogs = useSelector((state) => {
    return [...state.blogs]
  })

  return (
    <div>
      {user === null ? (
        <LoginForm />
      ) : (
        <div>
          <Menu />
          <Routes>
            <Route path="/" element={blogPage()} />
            <Route path="/users" element={<Users />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/users/:id" element={<User />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
