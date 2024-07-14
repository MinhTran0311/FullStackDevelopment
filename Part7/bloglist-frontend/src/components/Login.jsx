import { useField } from '../hook'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { useDispatch } from 'react-redux'
import { TextField, Button, Box, Typography } from '@mui/material'
import Notification from './Notification'

const LoginForm = ({ doLogin }) => {
  const username = useField('text', 'username')
  const password = useField('password', 'password')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await loginService.login({
        username: username.value,
        password: password.value,
      })
      blogService.setToken(response.data.token)
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(response.data)
      )
      dispatch(setUser(response.data))
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
    username.reset()
    password.reset()
  }

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcom to the blog application
      </Typography>
      <Notification />
      <Typography variant="h4" component="h1" gutterBottom>
        Log in
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Username"
          value={username.value}
          onChange={username.onChange}
          type={username.type}
          id={username.id}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Password"
          value={password.value}
          onChange={password.onChange}
          type={password.type}
          id={password.id}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        id="login-button"
        fullWidth
      >
        Login
      </Button>
    </Box>
  )
}

export default LoginForm
