<template>
  <div id="app" class="container">
    <div v-if="!game" class="row">
      <h1>New Game</h1>
    </div>
    <div v-else class="row">
      <h1>{{ game.name }}</h1>
      <p>Invite someone: <a v-bind:href=game.url>{{ game.url }}</a></p>
    </div>
    <div v-if="game">
      <div v-if="person">
        <Cards @selected="selected" :person=person :blocked=blocked />
        <People :people=people @reset="reset" @cards_shown="cardsShown"/>
      </div>
      <div v-else>
        <Person @name_entered="nameEntered" />
      </div>
    </div>
    <div v-else>
      <NewGame @new_game="newGame"/>
    </div>
  </div>
</template>

<script>
  import Cards from './components/Cards'
  import People from './components/People'
  import Person from './components/Person'
  import NewGame from './components/NewGame'

  export default {
    name: 'App',
    components: {
      Cards,
      People,
      Person,
      NewGame
    },
    sockets: {
      connect() {
        this.connected();
      },

      game_created(game) {
        console.log("game_created", game);
        this.setGame(game);
      },

      joined_game(game) {
        console.log("joined_game", game);
        this.setGame(game);
        this.setPeople(game.people);
      },

      card_selected(data) {
        console.log("card_selected", data);
        this.cardSelected(data);
      }
    },
    data() {
      return {
        game: null,
        blocked: false,
        person: null,
        people: []
      }
    },
    methods: {
      selected (person) {
        console.log("selected", person)
        console.log("game", this.game)
        console.log("people", this.people)
        this.people.forEach((p) => {
          if(p.name === person.name)
            p.selected = person.selected
        })
        this.$socket.client.emit('card_selected', {id: this.game.id, card: person.selected, person: person.name});
      },
      cardSelected (data) {
        console.log('cardSelected', data);
        this.people.forEach((p) => {
          console.log('p', p)
          if(p.name === data.person) {
            console.log(true)
            p.selected = data.card
          }
        })
        console.log(this.people)
      },
      connected() {
        console.log('Connected to server!')
      },
      reset () {
        this.blocked=false
      },
      cardsShown() {
        this.blocked=true
      },
      nameEntered(person) {
        console.log('nameEntered', person)
        this.person = person;
        var id = ''
        if(window.location.pathname !== '/') {
          console.log(true)
          id = window.location.pathname.slice(1);
        } else {
          console.log(false)
          id = this.game.id
        }
        this.$socket.client.emit('join_game', {game:id, person:person.name});
      },
      newGame(name) {
        console.log(name)
        this.$socket.client.emit('new_game', name);
      },
      setGame(game) {
        console.log('setGame', game)
        this.game = {
          name: game.name,
          id: game.id,
          url: window.location.origin + "/" + game.id
        }
      },
      setPeople(people) {
        console.log('setPeople', people)
        people.forEach((p) => {
          this.people.push({
            name: p
          })
        })
        console.log(this.people)
      }
    }
  }
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css");
.row {
  padding-top: 1em;
}
</style>
