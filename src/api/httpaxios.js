import axios from 'axios'
import Vue from 'vue'


const service = axios.create({
    baseURL: "http://123.56.255.138:8888/api/private/v1/"
})
service.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})

Vue.prototype.$http = service