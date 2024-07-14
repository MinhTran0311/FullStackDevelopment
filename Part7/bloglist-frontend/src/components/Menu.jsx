import { Link } from 'react-router-dom'
import { setUser, clearUser } from '../reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'

const Menu = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const padding = {
    paddingRight: 5
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(clearUser())
  }

  return (
    <div>
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      {user.name} logged in
      <button onClick={handleLogout} id="logout-button">
              logout
      </button>
    </div>
  )
}

export default Menu