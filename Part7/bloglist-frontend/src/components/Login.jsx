import { useField } from '../hook'

const LoginForm = ({ doLogin }) => {
  const username = useField('text', 'username')
  const password = useField('password', 'password')

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({ username: username.value, password: password.value })
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
          id={username.id}
        />
      </div>
      <div>
        password
        <input
          value={password.value}
          onChange={password.onChange}
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
