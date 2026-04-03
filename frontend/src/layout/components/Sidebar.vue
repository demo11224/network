<template>
  <div class="sidebar-wrapper">
    <div class="logo-container">
      <h1 class="sidebar-title">管理系统</h1>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="'#304156'"
        :text-color="'#bfcbd9'"
        :active-text-color="'#409EFF'"
        :unique-opened="true"
        mode="vertical"
        router
      >
        <sidebar-item
          v-for="route in sidebarRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebarRoutes']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  height: 100%;
  .logo-container {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #2b2f3a;
    .sidebar-title {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }
  }
}
</style>
