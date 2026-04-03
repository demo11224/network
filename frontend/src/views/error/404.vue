<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">404</h1>
        <h2>抱歉，页面不存在!</h2>
        <el-button type="primary" @click="$router.push({path:'/'})">返回首页</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default { name: 'Page404' }
</script>

<style scoped>
.errPage-container { padding: 100px; text-align: center; }
.text-jumbo { font-size: 60px; font-weight: 700; color: #409EFF; }
</style>
