<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import AppMain from './components/AppMain'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    AppMain
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
}
.sidebar-container {
  width: $sideBarWidth;
  min-width: $sideBarWidth;
  height: 100%;
  background-color: $sideBarBg;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.28s;
}
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f0f2f5;
}
</style>
