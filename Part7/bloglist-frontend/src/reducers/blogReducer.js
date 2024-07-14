import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    replaceBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      const deletedBlogId = action.payload
      return state.filter((blog) => blog.id !== deletedBlogId)
    },
  },
})

export const { replaceBlog, appendBlog, setBlogs, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const notes = await blogService.getAll()
    dispatch(setBlogs(notes))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newNote = await blogService.create(content)
    dispatch(appendBlog(newNote))
  }
}

export const likeBlog = (blogToChange) => {
  return async (dispatch) => {
    // const updatedBlog = { ...blogToChange, votes: blogToChange.votes + 1 }
    const returnedBlog = await blogService.update(
      blogToChange.id,
      blogToChange
    )
    dispatch(replaceBlog(returnedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    const deletedBlog = await blogService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}

export default blogSlice.reducer
