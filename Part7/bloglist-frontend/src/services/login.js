import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  try {
    const data = await axios.post(baseUrl, credentials)
    return data
  } catch (exception){
    if (exception.response && exception.response.status === 401) {
      throw new Error('wrong username or password', false)
    } else {
      throw new Error('An error occurred', false)
    }
  }
}

export default { login }