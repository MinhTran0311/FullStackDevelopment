import { useSelector } from 'react-redux'
import Blog from './Blog'

const BlogList = (updateBlog, deleteBlog) => {
  const blogs = useSelector((state) => {
    return [...state.blogs].sort((a, b) => b.likes - a.likes)
  })

  return (blogs.map(blog =>
    <Blog key={blog.id}
      isAuthor={true}
      blog={blog}
      updateBlog={updateBlog}
      deleteBlog={deleteBlog}
    />
  ))
}

export default BlogList