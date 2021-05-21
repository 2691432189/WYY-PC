<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  beforCreate () {
    window.localStorage.removeItem('aplayer-setting')
    console.log(1111)
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app{
  margin: 0 auto;
  background-color: #ccc;
  min-width: 1470px;
  max-width: 1536px;
}

</style>
