<template>
  <div class="component component-loader">
    <div class="fa fa-spin fa-circle-o-notch"></div>
    <label>{{label}}</label>
  </div>
</template>

<script>
  export default {
    name: 'loader',
    props: {
      label: { default: 'Loading...' },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .component-loader {
    color: #fff;
    text-shadow: 0 0 2px #000;
    font-size: 50px;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  label {
    font-size: 17px;
    vertical-align: middle;
  }
  .fa-cog {
    transform: rotate(0deg);
    animation-name: rotate;
    animation-timing-function: linear;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }

  @keyframes rotate {
    100% { transform: rotate(-360deg); }
  }
</style>
