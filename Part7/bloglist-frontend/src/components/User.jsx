import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { initializeUsers } from '../reducers/usersReducer'
import { Container, Typography, List, ListItem } from '@mui/material'

const User = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const users = useSelector((state) => state.users)
  const user = users.find((user) => user.id === id)
  useEffect(() => {
    if (!users.length) {
      dispatch(initializeUsers())
    }
  }, [dispatch, users.length])

  if (!user) {
    return null
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Added Blogs
      </Typography>
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default User
