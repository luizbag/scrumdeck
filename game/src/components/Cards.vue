<template>
  <div id="cards" class="row">
    <h3>Hi, {{ person.name }}. Pick your card!</h3>
    <div class="col" v-for="choice in available_choices" :key="choice">
      <button v-bind:disabled="blocked" @click="selected(choice)" type="button" class="btn btn-primary">{{ choice }}</button>
    </div>
  </div>
</template>

<script>
  export default {

    name: 'component_name',
    props: {
      blocked: Boolean,
      person: Object
    },

    methods: {
      selected (choice) {
        var p = {
          name: this.person.name,
          selected: choice
        }
        this.$emit('selected', p)
      }
    },

    data () {
      return {
        available_choices: [1,2,3,5,8,13,21,34,55,89,'?', 'coffee'],
      }
    }
  }
</script>

<style lang="css" scoped>
</style>