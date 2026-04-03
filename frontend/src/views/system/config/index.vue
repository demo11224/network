<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="参数名称" prop="configName"><el-input v-model="queryParams.configName" placeholder="请输入参数名称" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="参数键名" prop="configKey"><el-input v-model="queryParams.configKey" placeholder="请输入参数键名" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="系统内置" prop="configType">
        <el-select v-model="queryParams.configType" placeholder="系统内置" clearable size="small"><el-option label="是" value="Y" /><el-option label="否" value="N" /></el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:config:add']">新增</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:config:remove']">删除</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="参数ID" align="center" prop="configId" width="80" />
      <el-table-column label="参数名称" align="center" prop="configName" :show-overflow-tooltip="true" />
      <el-table-column label="参数键名" align="center" prop="configKey" :show-overflow-tooltip="true" />
      <el-table-column label="参数键值" align="center" prop="configValue" />
      <el-table-column label="系统内置" align="center" width="80"><template slot-scope="scope"><el-tag :type="scope.row.configType==='Y'?'primary':'info'" size="small">{{ scope.row.configType==='Y'?'是':'否' }}</el-tag></template></el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:config:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:config:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total>0" :total="total" :page-sizes="[10,20,50]" :page-size="queryParams.pageSize" :current-page="queryParams.pageNum" layout="total, sizes, prev, pager, next, jumper" @size-change="s=>{queryParams.pageSize=s;getList()}" @current-change="p=>{queryParams.pageNum=p;getList()}" />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="configName"><el-input v-model="form.configName" placeholder="请输入参数名称" /></el-form-item>
        <el-form-item label="参数键名" prop="configKey"><el-input v-model="form.configKey" placeholder="请输入参数键名" /></el-form-item>
        <el-form-item label="参数键值" prop="configValue"><el-input v-model="form.configValue" placeholder="请输入参数键值" /></el-form-item>
        <el-form-item label="系统内置" prop="configType"><el-radio-group v-model="form.configType"><el-radio label="Y">是</el-radio><el-radio label="N">否</el-radio></el-radio-group></el-form-item>
        <el-form-item label="备注" prop="remark"><el-input v-model="form.remark" type="textarea" placeholder="请输入内容" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="submitForm">确 定</el-button><el-button @click="cancel">取 消</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { listConfig, getConfig, addConfig, updateConfig, delConfig } from '@/api/system/config'

export default {
  name: 'Config',
  data() {
    return {
      loading: true, ids: [], multiple: true, showSearch: true, total: 0, configList: [], title: '', open: false,
      queryParams: { pageNum: 1, pageSize: 10, configName: undefined, configKey: undefined, configType: undefined },
      form: {},
      rules: {
        configName: [{ required: true, message: '参数名称不能为空', trigger: 'blur' }],
        configKey: [{ required: true, message: '参数键名不能为空', trigger: 'blur' }],
        configValue: [{ required: true, message: '参数键值不能为空', trigger: 'blur' }]
      }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listConfig(this.queryParams).then(res => { this.configList = res.rows; this.total = res.total; this.loading = false }) },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleSelectionChange(s) { this.ids = s.map(i => i.configId); this.multiple = !s.length },
    handleAdd() { this.reset(); this.open = true; this.title = '添加参数' },
    handleUpdate(row) { this.reset(); getConfig(row.configId).then(res => { this.form = res.data; this.open = true; this.title = '修改参数' }) },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.configId) { updateConfig(this.form).then(() => { this.$message.success('修改成功'); this.open = false; this.getList() }) }
          else { addConfig(this.form).then(() => { this.$message.success('新增成功'); this.open = false; this.getList() }) }
        }
      })
    },
    handleDelete(row) {
      const configIds = row.configId ? [row.configId] : this.ids
      this.$confirm('是否确认删除参数编号为"' + configIds + '"的数据项？').then(() => delConfig(configIds.join(','))).then(() => { this.getList(); this.$message.success('删除成功') })
    },
    reset() { this.form = { configId: undefined, configName: undefined, configKey: undefined, configValue: undefined, configType: 'Y', remark: undefined }; if (this.$refs.form) this.$refs.form.resetFields() },
    cancel() { this.open = false; this.reset() }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}</style>
