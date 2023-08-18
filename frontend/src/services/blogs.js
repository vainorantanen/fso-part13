import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const update = async (object) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios.put(`${baseUrl}/${object.id}`, object, config)
  return request.data
}
// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create, remove, update }