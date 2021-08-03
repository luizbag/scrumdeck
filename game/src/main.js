import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import socketio from 'socket.io-client'
import UUID from 'vue-uuid'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(UUID)
Vue.use(new VueSocketIO({
  debug: true,
  connection: socketio('/')
}));

new Vue({
  render: h => h(App),
}).$mount('#app')
