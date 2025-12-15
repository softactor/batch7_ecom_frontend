import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import Pusher from 'pusher-js'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'



createApp(App)
.use(Pusher)
.use(createPinia())
.use(router)
.use(Vue3Toastify,{
    position: "top-right",
    autoClose: 3000,
}).mount('#app')
