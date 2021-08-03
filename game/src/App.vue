<template>
  <div id="app" class="container">
    <div class="row">
      <h1 v-if="!game">New Game</h1>
      <h1 v-else>{{ game.name }}</h1>
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
  import { uuid } from 'vue-uuid'

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
        console.log('Connected');
      }
    },
    data() {
      return {
        game: null,
        blocked: false,
        person: null,
        people: [{
          name: 'Luiz',
          selected: 5,
        },
        {
          name: 'Fernando',
          selected: 8,
        },
        {
          name: 'Hugo',
          selected: 3,
        }]
      }
    },
    methods: {
      selected (person) {
        console.log(person)
        this.people.forEach((p) => {
          if(p.name === person.name)
            p.selected = person.selected
        })
      },
      reset () {
        this.blocked=false
      },
      cardsShown() {
        this.blocked=true
      },
      nameEntered(person) {
        this.person = person;
      },
      newGame(name) {
        console.log(name)
        this.game = {
          name: name,
          uuid: this.$uuid.v5()
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
