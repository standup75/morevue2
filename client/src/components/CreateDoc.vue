<template>
  <div class="todos">
    <div class="input-field">
      <input v-model="message" placeholder="New Todo">
      <button @click="save()">Save Todo</button>
    </div>
    <div v-for="todo in todos" class="todo">
      <input v-model="todo.message">
      <button @click="save(todo)">Update</button>
      <button @click="remove(todo)">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'createdoc',
  data() {
    return {
      message: '',
    }
  },
  computed: {
    todos() {
      return this.$store.state.todo.all;
    },
  },
  methods: {
    save(todo = { message: this.message }) {
      this.$store.dispatch('TODO_ADD', { todo })
      this.message = ''
    },
    remove(todo) {
      this.$store.dispatch('TODO_REMOVE', { todo })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  input {
    padding: 10px;
    width: 300px;
    margin-top: 3px;
  }
  button {
    margin-left: 5px;
  }
  .todos {
    padding: 10px;
  }
  .todo {
    margin-bottom: 5px;
  }
  .input-field {
    margin-bottom: 10px;
  }
  .todo, .input-field {
    overflow: hidden;
    > * {
      float: left;
      display: block;
    }
  }
</style>
