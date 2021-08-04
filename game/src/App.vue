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

      game_found(game) {
        console.log("game_found", game);
        this.setGame(game);
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
        console.log("socket", this.$socket)
        this.people.forEach((p) => {
          if(p.name === person.name)
            p.selected = person.selected
        })
        this.$socket.client.emit('card_selected', {id: this.game.id, card: person.selected, person: person.name});
      },
      cardSelected (data) {
        console.log(data);
      },
      connected() {
        console.log('Connected to server!')
        console.log(window.location.pathname);
        if(window.location.pathname !== '/') {
          var id = window.location.pathname.slice(1);
          console.log(id);
          this.$socket.client.emit('get_game', id);
        }
      },
      reset () {
        this.blocked=false
      },
      cardsShown() {
        this.blocked=true
      },
      nameEntered(person) {
        this.person = person;
        this.people.push(person);
      },
      newGame(name) {
        console.log(name)
        this.$socket.client.emit('new_game', name);
      },
      setGame(game) {
        console.log(game)
        this.game = {
          name: game.name,
          uuid: game.uuid,
          url: window.location.origin + "/" + game.id
        }
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
