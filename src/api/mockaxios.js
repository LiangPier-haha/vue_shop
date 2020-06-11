import axios from 'axios'
import Vue from 'vue'


const service = axios.create({
    baseURL: "http://localhost:8080/mock"
})
service.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})

Vue.prototype.$mockhttp = service