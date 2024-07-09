import { useState } from 'react'

const Blog = ({ isAuthor, blog, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [isShow, setIsShow] = useState(false)

  const toggleVisibility = (event) => {
    setIsShow(!isShow)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }
      await updateBlog(blog.id, updatedBlog)
    } catch(exception) {
      console.log(exception)
    }
  }

  const handleDelete = async () => {
    await deleteBlog(blog.id)
  }

  if (!isShow){
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{isShow ?  'hide' : 'view'}</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <p>
        title: {blog.title} <button onClick={toggleVisibility}>{isShow ?  'hide' : 'view'}</button>
      </p>
      <p>url: {blog.url}</p>
      <p>likes: {blog.likes} <button onClick={handleLike}>like</button></p>
      <p>author: {blog.author}</p>
      {isAuthor && <button onClick={handleDelete}>remove</button>}
    </div>
  )
}

export default Blog