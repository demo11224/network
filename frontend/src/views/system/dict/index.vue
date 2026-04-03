<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="字典名称" prop="dictName"><el-input v-model="queryParams.dictName" placeholder="请输入字典名称" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="字典类型" prop="dictType"><el-input v-model="queryParams.dictType" placeholder="请输入字典类型" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="字典状态" clearable size="small"><el-option label="正常" value="0" /><el-option label="停用" value="1" /></el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dict:add']">新增</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:dict:remove']">删除</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编号" align="center" prop="dictId" width="80" />
      <el-table-column label="字典名称" align="center" prop="dictName" />
      <el-table-column label="字典类型" align="center"><template slot-scope="scope"><router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type"><span>{{ scope.row.dictType }}</span></router-link></template></el-table-column>
      <el-table-column label="状态" align="center" width="80"><template slot-scope="scope"><el-tag :type="scope.row.status==='0'?'success':'danger'" size="small">{{ scope.row.status==='0'?'正常':'停用' }}</el-tag></template></el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dict:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dict:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total>0" :total="total" :page-sizes="[10,20,50]" :page-size="queryParams.pageSize" :current-page="queryParams.pageNum" layout="total, sizes, prev, pager, next, jumper" @size-change="s=>{queryParams.pageSize=s;getList()}" @current-change="p=>{queryParams.pageNum=p;getList()}" />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName"><el-input v-model="form.dictName" placeholder="请输入字典名称" /></el-form-item>
        <el-form-item label="字典类型" prop="dictType"><el-input v-model="form.dictType" placeholder="请输入字典类型" /></el-form-item>
        <el-form-item label="状态" prop="status"><el-radio-group v-model="form.status"><el-radio label="0">正常</el-radio><el-radio label="1">停用</el-radio></el-radio-group></el-form-item>
        <el-form-item label="备注" prop="remark"><el-input v-model="form.remark" type="textarea" placeholder="请输入内容" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="submitForm">确 定</el-button><el-button @click="cancel">取 消</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { listType, getType, addType, updateType, delType } from '@/api/system/dict'

export default {
  name: 'Dict',
  data() {
    return {
      loading: true, ids: [], multiple: true, showSearch: true, total: 0, typeList: [], title: '', open: false,
      queryParams: { pageNum: 1, pageSize: 10, dictName: undefined, dictType: undefined, status: undefined },
      form: {},
      rules: { dictName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }], dictType: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }] }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listType(this.queryParams).then(res => { this.typeList = res.rows; this.total = res.total; this.loading = false }) },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleSelectionChange(s) { this.ids = s.map(i => i.dictId); this.multiple = !s.length },
    handleAdd() { this.reset(); this.open = true; this.title = '添加字典类型' },
    handleUpdate(row) { this.reset(); getType(row.dictId).then(res => { this.form = res.data; this.open = true; this.title = '修改字典类型' }) },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.dictId) { updateType(this.form).then(() => { this.$message.success('修改成功'); this.open = false; this.getList() }) }
          else { addType(this.form).then(() => { this.$message.success('新增成功'); this.open = false; this.getList() }) }
        }
      })
    },
    handleDelete(row) {
      const dictIds = row.dictId ? [row.dictId] : this.ids
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？').then(() => delType(dictIds.join(','))).then(() => { this.getList(); this.$message.success('删除成功') })
    },
    reset() { this.form = { dictId: undefined, dictName: undefined, dictType: undefined, status: '0', remark: undefined }; if (this.$refs.form) this.$refs.form.resetFields() },
    cancel() { this.open = false; this.reset() }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}.link-type{color:#409EFF;text-decoration:none}</style>
