<template>
  <div id="people" class="row">
    <div class="col" v-for="person in people" :key="person.name">
      <div class="card">
        <div class="card-body text-center">
          <h5 class="card-title">{{person.name}} <i v-show="person.selected" class="bi bi-check-circle"></i></h5>
          <p v-if="show_cards" class="card-text">{{person.selected}}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button :disabled="!isEverybodyReady()" class="btn btn-secondary" @click="showCards()">Show Cards</button>&nbsp;
        <button class="btn btn-dark" @click="reset()">Reset</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    name: 'People',
    props: {
      people: Array
    },

    methods: {
      showCards () {
        this.show_cards = true
        this.$emit('cards_shown')
      },
      reset() {
        this.show_cards = false
        this.people.forEach((person) => {
          person.selected = null
        })
        this.$emit('reset')
      },
      isEverybodyReady() {
        return this.people.every((person) => { return person.selected ? true : false })
      }
    },

    data () {
      return {
        show_cards: true,
      }
    }
  }
</script>

<style lang="css" scoped>
</style>