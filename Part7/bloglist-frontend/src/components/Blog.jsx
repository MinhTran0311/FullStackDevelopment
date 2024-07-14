import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { updateBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useField } from '../hook'
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  Divider,
} from '@mui/material'
import React from 'react'

const Blog = () => {
  const { id } = useParams()
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === id)
  const currentUser = useSelector((state) => state.user)
  let commentId = 1
  const comment = useField('text', 'comment')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLike = async () => {
    try {
      dispatch(
        updateBlog({
          id: blog.id,
          user: blog.user.id,
          likes: blog.likes + 1,
          author: blog.author,
          title: blog.title,
          url: blog.url,
          comments: blog.comments,
        })
      )
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteBlog(blog.id))
      navigate('/')
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const udpateBlog = {
      ...blog,
      user: blog.user.id,
      comments: [...blog.comments, comment.value],
    }

    try {
      dispatch(updateBlog(udpateBlog))
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
    comment.reset()
  }

  const isAuthor = currentUser && blog.user.username === currentUser.username
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {blog.title} by {blog.author}
      </Typography>
      <Typography variant="body1">{blog.url}</Typography>
      <Box mt={2}>
        <Typography variant="body1">
          {blog.likes} likes{' '}
          <Button variant="contained" color="primary" onClick={handleLike}>
            like
          </Button>
        </Typography>
      </Box>
      <Typography variant="body1">added by: {blog.user.username}</Typography>
      {isAuthor && (
        <Box mt={2}>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            remove
          </Button>
        </Box>
      )}
      <Box mt={4}>
        <Typography variant="h5" component="h2">
          Comments
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            value={comment.value}
            onChange={comment.onChange}
            type={comment.type}
            id={comment.id}
            label="Add a comment"
            variant="outlined"
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit">
            add comment
          </Button>
        </form>
        <List>
          {blog.comments &&
            blog.comments.map((comment, index) => (
              <React.Fragment key={index}>
                <ListItem>{comment}</ListItem>
                {index < blog.comments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
        </List>
      </Box>
    </Container>
  )
}

export default Blog
