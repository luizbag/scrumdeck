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
        <Cards @selected="selected" v-bind:person=person v-bind:blocked=blocked />
        <People v-bind:people=people @reset="reset" @cards_shown="cardsShown"/>
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

      person_disconnected(personId) {
        console.log("person_disconnected", personId);
        this.personDisconnected(personId);
      },

      card_selected(data) {
        console.log("card_selected", data);
        this.cardSelected(data);
      },

      game_found(game) {
        console.log("game_found", game);
        this.setGame(game);
        this.setPeople(game.people);
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
        var data = {id: this.game.id, card: person.selected, person: person.name}
        console.log("data", data)
        this.$socket.client.emit('card_selected', data)
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
        this.people = this.people.map((x) => x)
        console.log(this.people)
      },
      connected() {
        console.log('Connected to server!')
        var g = this.getGameFromPath()
        if(g) {
          this.$socket.client.emit('get_game', g)
        }
      },
      personDisconnected(id) {
        console.log("personDisconnected");
        this.people = this.people.filter((p) => { return p.id !== id });
      },
      reset (fromServer) {
        console.log('reset');
        this.blocked=false
        if(!fromServer)
          this.$socket.client.emit('reset_game', this.game.id);
      },
      cardsShown(fromServer) {
        this.blocked=true
        if(!fromServer)
          this.$socket.client.emit('show_cards', this.game.id);
      },
      nameEntered(person) {
        console.log('nameEntered', person)
        this.person = person;
        this.$socket.client.emit('join_game', {game:this.game.id, person:person.name});
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
        this.people = []
        people.forEach((p) => {
          this.people.push(p)
        })
        console.log(this.people)
      },
      getGameFromPath() {
        if(window.location.pathname !== '/') {
          return window.location.pathname.slice(1);
        } else {
          return null
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
