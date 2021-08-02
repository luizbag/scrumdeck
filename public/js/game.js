const socket = io("/");

const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

const app = Vue.createApp({})

app.component('deck')