<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="登录地址" prop="ipaddr"><el-input v-model="queryParams.ipaddr" placeholder="请输入登录地址" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="用户名称" prop="userName"><el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="登录状态" clearable size="small"><el-option label="成功" value="0" /><el-option label="失败" value="1" /></el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:loginlog:remove']">删除</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleClean" v-hasPermi="['system:loginlog:remove']">清空</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="访问编号" align="center" prop="infoId" width="80" />
      <el-table-column label="用户名称" align="center" prop="userName" />
      <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column label="浏览器" align="center" prop="browser" />
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column label="登录状态" align="center" width="80"><template slot-scope="scope"><el-tag :type="scope.row.status===0?'success':'danger'" size="small">{{ scope.row.status===0?'成功':'失败' }}</el-tag></template></el-table-column>
      <el-table-column label="提示消息" align="center" prop="msg" :show-overflow-tooltip="true" />
      <el-table-column label="登录时间" align="center" prop="loginTime" width="160" />
    </el-table>
    <el-pagination v-show="total>0" :total="total" :page-sizes="[10,20,50]" :page-size="queryParams.pageSize" :current-page="queryParams.pageNum" layout="total, sizes, prev, pager, next, jumper" @size-change="s=>{queryParams.pageSize=s;getList()}" @current-change="p=>{queryParams.pageNum=p;getList()}" />
  </div>
</template>

<script>
import { listLoginLog, delLoginLog, cleanLoginLog } from '@/api/system/log'

export default {
  name: 'LoginLog',
  data() {
    return {
      loading: true, ids: [], multiple: true, showSearch: true, total: 0, list: [],
      queryParams: { pageNum: 1, pageSize: 10, ipaddr: undefined, userName: undefined, status: undefined }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listLoginLog(this.queryParams).then(res => { this.list = res.rows; this.total = res.total; this.loading = false }) },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleSelectionChange(s) { this.ids = s.map(i => i.infoId); this.multiple = !s.length },
    handleDelete() { this.$confirm('是否确认删除选中的数据项？').then(() => delLoginLog(this.ids.join(','))).then(() => { this.getList(); this.$message.success('删除成功') }) },
    handleClean() { this.$confirm('是否确认清空所有登录日志数据项？').then(() => cleanLoginLog()).then(() => { this.getList(); this.$message.success('清空成功') }) }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}</style>
