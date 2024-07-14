import { Link } from 'react-router-dom'
import { clearUser } from '../reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { AppBar, Toolbar, Button, Typography, Box, Divider } from '@mui/material'

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
    <AppBar position="static" >
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'white' }} />
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body1" component="span" sx={{ marginRight: 2 }}>
          Blog app
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body1" component="span" sx={{ marginRight: 2 }}>
          {user.name} logged in
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'white' }} />
        <Button color="inherit" onClick={handleLogout} id="logout-button">
          logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Menu