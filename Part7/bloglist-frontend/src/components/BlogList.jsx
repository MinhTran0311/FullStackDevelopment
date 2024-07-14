import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

const BlogList = () => {
  const blogs = useSelector((state) => {
    return [...state.blogs].sort((a, b) => b.likes - a.likes)
  })

  return (
    <Box>
      {blogs.map((blog) => (
        <Box key={blog.id} sx={{ border: '1px solid grey', borderRadius: 2, padding: 2, marginBottom: 2 }}>
          <Link to={`/blogs/${blog.id}`} color="inherit">
            <Typography variant="h6" component="span">
              {blog.title}
            </Typography>
            <Typography variant="body2" component="span" sx={{ marginLeft: 1 }}>
              by {blog.author}
            </Typography>
          </Link>
        </Box>
      ))}
    </Box>
  )
}

export default BlogList
