<style src="./styles/main.css" lang="css"></style>
<template>
  <div id="app">
    <nav>
      <div class="loggedInActions" v-if="isLoggedIn">
        <div @click="logout" class="fa fa-power-off"></div>
        <router-link to="/update" class="fa fa-user"></router-link>
      </div>
      <router-link to="/login" v-if="!isLoggedIn">Login / Signup</router-link>
      <router-link to="/createDoc" v-if="isLoggedIn">Create Document</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    computed: {
      isLoggedIn() {
        return !!this.$store.state.session.user
      },
    },
    methods: {
      logout() {
        this.$store.dispatch('SESSION_DESTROY', {})
        this.$router.push('/')
      },
    },
  }
</script>

<style scoped>
  nav {
    background-color: #eee;
    padding: 20px;
  }
  nav * {
    display: inline-block;
    margin-right: 10px;
    color: #558;
    text-decoration: none;
    cursor: pointer;
  }
  nav *:hover {
    color: #88a;
  }
  .loggedInActions {
    float: right;
  }
</style>
