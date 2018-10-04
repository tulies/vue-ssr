<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <!-- <Todo></Todo> -->
    <router-link :to="{name: 'app'}">app</router-link>
    <router-link to='/login'>login</router-link>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from './layout/header'
import Footer from './layout/footer'
// import Todo from './views/todo/todo'
export default {
  metaInfo: {
    title: 'app title'
  },
  components: {
    Header,
    Footer
    // Todo
  },
  mounted () {
    // console.log(this.$store.sstate.count)
  }
}
</script>
<style lang="stylus" scoped>
#app
  position absolute
  left 0
  right 0
  top 0
  bottom 0
#cover
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  background-color #999
  z-index -1
  opacity .4
</style>

