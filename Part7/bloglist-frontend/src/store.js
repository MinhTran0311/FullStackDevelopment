import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'

export default configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,
    users: usersReducer,
  }
})