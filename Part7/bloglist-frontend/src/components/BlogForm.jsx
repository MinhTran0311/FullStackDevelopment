import { useField } from '../hook'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Box, TextField, Button } from '@mui/material'

const BlogForm = () => {
  const title = useField('text', 'title')
  const author = useField('text', 'author')
  const url = useField('text', 'url')
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    }

    try {
      dispatch(createBlog(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          true
        )
      )
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <Box component="form" onSubmit={addBlog} sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Title"
          value={title.value}
          onChange={title.onChange}
          id={title.id}
          placeholder="title"
          variant="outlined"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Author"
          value={author.value}
          onChange={author.onChange}
          id={author.id}
          placeholder="author"
          variant="outlined"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="URL"
          value={url.value}
          onChange={url.onChange}
          id={url.id}
          placeholder="url"
          variant="outlined"
        />
      </Box>
      <Button variant="contained" color="primary" type="submit">
        Save
      </Button>
    </Box>
  )
}

export default BlogForm
