import { useField } from '../hook'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { useDispatch } from 'react-redux'
const LoginForm = ({ doLogin }) => {
  const username = useField('text', 'username')
  const password = useField('password', 'password')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await loginService.login({
        username: username.value, password: password.value,
      })
      blogService.setToken(response.data.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(response.data)
      )
      dispatch(setUser(response.data))
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
    username.reset()
    password.reset()
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          value={username.value}
          onChange={username.onChange}
          type={username.type}
          id={username.id}
        />
      </div>
      <div>
        password
        <input
          value={password.value}
          onChange={password.onChange}
          type={password.type}
          id={password.id}
        />
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  )
}

export default LoginForm
