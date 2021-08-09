import Vue from 'vue'

import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';

import App from './App.vue'

//localStorage.debug = '*'

Vue.config.productionTip = false

const socket = io();

Vue.use(VueSocketIOExt, socket);

new Vue({
  render: h => h(App),
}).$mount('#app')
