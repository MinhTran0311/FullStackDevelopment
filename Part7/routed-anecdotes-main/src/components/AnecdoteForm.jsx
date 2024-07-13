import {
    useNavigate
  } from 'react-router-dom'

export const AnecdoteForm = () => {
    const navigate = useNavigate()

    const onSubmit = (event) =>{
        event.preventDefault()
        navigate('/')
    }
    return(<div>form</div>)
}