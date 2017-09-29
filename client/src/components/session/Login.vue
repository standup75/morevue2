<template>
  <div class="component" id="login">
    <h2>Login</h2>
    <form @submit="submit">
      <div class="field">
        <label>email</label>
        <input type="text" name="email" placeholder="Enter email" v-model="email" required />
      </div>
      <div class="field">
        <label>password</label>
        <input type="password" name="password" placeholder="Enter password" v-model="password" required />
      </div>
      <div class="actions">
        <button type="submit">Login</button>
        <Loader v-if="isLoading" label="" class="loader"></Loader>
      </div>
      <router-link to="/forgot">I forgot my password</router-link>
    </form>
  </div>
</template>

<script>
  import Loader from '../Loader';

  export default {
    name: 'login',
    data() {
      return {
        password: '',
        email: '',
        isLoading: false,
      };
    },
    computed: {
      isLoggedIn() {
        return !!this.$store.state.session.user
      },
    },
    components: { Loader },
    notifications: {
      loginSuccess: {
        message: 'You\'re logged in!',
        type: 'success',
      },
      loginError: {
        message: 'Log in failed',
        type: 'error',
      },
    },
    methods: {
      submit(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        this.isLoading = true;
        this.$store.dispatch('SESSION_CREATE', {
          email: this.email,
          password: this.password,
        }).then(() => {
          this.isLoading = false
          this.$router.push('/createDoc')
        }).catch((err) => {
          console.log('err', err)
          this.isLoading = false
          this.loginError()
        })
      },
    },
  }
</script>

<style scoped>
  button {
    margin-right: 20px;
  }
  .actions {
    position: relative;
  }
  .loader {
    position: absolute;
    top: -26px;
    left: 8px;
  }
  .component a {
    font-size: 11px;
    font-weight: bold;
    color: #88d;
    letter-spacing: 1px;
    margin-bottom: 3px;
  }
</style>
