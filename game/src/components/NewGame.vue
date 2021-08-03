<template>
  <div>
    <div class="row">
      <div class="col">
        <label for="name" class="form-label">Game Name</label>
        <input type="text" class="form-control" id="name" v-model="name"/>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button @click="save()" class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    name: 'NewGame',

    data () {
      return {
        name: ''
      }
    },
    emits: ['new_game'],
    methods: {
      save () {
        this.$emit('new_game', this.name);
      }
    }
  }
</script>

<style lang="css" scoped>
</style>