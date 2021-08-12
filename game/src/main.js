import Vue from 'vue'

import VueAnalytics from 'vue-analytics'

import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';

import App from './App.vue'

//localStorage.debug = '*'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
  id: 'G-8REZJME34R'
})

const socket = io();

Vue.use(VueSocketIOExt, socket);

new Vue({
  render: h => h(App),
}).$mount('#app')
