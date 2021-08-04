import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO  from 'socket.io-client'
import App from './App.vue'

localStorage.debug = '*'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('http://localhost:3000',{
    path: '/socket'
  })
}))

new Vue({
  render: h => h(App),
}).$mount('#app')
