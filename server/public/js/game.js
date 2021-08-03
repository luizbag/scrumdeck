const socket = io("/");

const available_cards = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', 'c']

const app = Vue.createApp({
	data() {
		return {
			game_id: '12345'
		}
	}
})

app.component('game', {
})

app.component('deck', {
})

app.mount('#app')