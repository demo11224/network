<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="系统模块" prop="title"><el-input v-model="queryParams.title" placeholder="请输入系统模块" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="操作人员" prop="operName"><el-input v-model="queryParams.operName" placeholder="请输入操作人员" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="操作状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="操作状态" clearable size="small"><el-option label="成功" value="0" /><el-option label="失败" value="1" /></el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:operlog:remove']">删除</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleClean" v-hasPermi="['system:operlog:remove']">清空</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志编号" align="center" prop="operId" width="80" />
      <el-table-column label="系统模块" align="center" prop="title" />
      <el-table-column label="操作类型" align="center" width="80"><template slot-scope="scope">{{ operTypeMap[scope.row.businessType] || '其他' }}</template></el-table-column>
      <el-table-column label="操作人员" align="center" prop="operName" width="100" />
      <el-table-column label="操作地址" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="操作状态" align="center" width="80"><template slot-scope="scope"><el-tag :type="scope.row.status===0?'success':'danger'" size="small">{{ scope.row.status===0?'成功':'失败' }}</el-tag></template></el-table-column>
      <el-table-column label="操作时间" align="center" prop="operTime" width="160" />
    </el-table>
    <el-pagination v-show="total>0" :total="total" :page-sizes="[10,20,50]" :page-size="queryParams.pageSize" :current-page="queryParams.pageNum" layout="total, sizes, prev, pager, next, jumper" @size-change="s=>{queryParams.pageSize=s;getList()}" @current-change="p=>{queryParams.pageNum=p;getList()}" />
  </div>
</template>

<script>
import { listOperLog, delOperLog, cleanOperLog } from '@/api/system/log'

export default {
  name: 'OperLog',
  data() {
    return {
      loading: true, ids: [], multiple: true, showSearch: true, total: 0, list: [],
      operTypeMap: { 1: '新增', 2: '修改', 3: '删除', 4: '授权', 5: '导出', 6: '导入', 7: '强退', 8: '生成代码', 9: '清空数据' },
      queryParams: { pageNum: 1, pageSize: 10, title: undefined, operName: undefined, status: undefined }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listOperLog(this.queryParams).then(res => { this.list = res.rows; this.total = res.total; this.loading = false }) },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleSelectionChange(s) { this.ids = s.map(i => i.operId); this.multiple = !s.length },
    handleDelete() { this.$confirm('是否确认删除选中的数据项？').then(() => delOperLog(this.ids.join(','))).then(() => { this.getList(); this.$message.success('删除成功') }) },
    handleClean() { this.$confirm('是否确认清空所有操作日志数据项？').then(() => cleanOperLog()).then(() => { this.getList(); this.$message.success('清空成功') }) }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}</style>
