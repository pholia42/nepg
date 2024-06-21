import axios from 'axios'

axios.defaults.baseURL="http://localhost:8082"

axios.defaults.timeout=3000
axios.interceptors.request.use(
config =>{
const token = sessionStorage.getItem('token')

if (token) {

config.headers['token'] = `${token}`
}
return config
},
error =>{
return Promise.reject(error)
}
)
export default axios