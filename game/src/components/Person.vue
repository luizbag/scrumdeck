<template>
  <div>
    <div class="row">
      <div class="col">
        <label for="name" class="form-label">What's your name?</label>
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

    name: 'Person',
    methods: {
      save () {
        var person = {
          name: this.name
        }
        this.$emit('name_entered', person)
      }
    },
    data () {
      return {
        name: ''
      }
    },
    emits: ['name_entered']
  }
</script>

<style lang="css" scoped>
</style>