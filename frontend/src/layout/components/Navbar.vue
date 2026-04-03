<template>
  <div class="navbar">
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right-menu">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="avatar-wrapper">
          <i class="el-icon-user-solid" style="margin-right: 5px;" />
          {{ name }}
          <i class="el-icon-caret-bottom" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="dashboard">
            <i class="el-icon-s-home" /> 首页
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <i class="el-icon-switch-button" /> 退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['name']),
    breadcrumbs() {
      return this.$route.matched.filter(item => item.meta && item.meta.title)
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'dashboard':
          this.$router.push({ path: '/' })
          break
        case 'logout':
          this.$store.dispatch('user/logout').then(() => {
            this.$router.push({ path: '/login' })
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    float: right;
    .avatar-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333;
    }
  }
}
</style>
