import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Box, Button } from '@mui/material'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }


  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <Box>
      <Box sx={hideWhenVisible}>
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </Box>
      <Box sx={showWhenVisible}>
        {props.children}
        <Button variant="contained" color="secondary" onClick={toggleVisibility}>
          cancel
        </Button>
      </Box>
    </Box>
  )

})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'


export default Togglable