<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view /> -->
    <recognizer />
  </div>
</template>

<script>
import Recognizer from "./views/Recognizer.vue";
export default {
  name: "App",
  components: {
    Recognizer,
  },
};
</script>
<style lang="scss"></style>
