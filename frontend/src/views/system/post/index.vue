<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="岗位编码" prop="postCode"><el-input v-model="queryParams.postCode" placeholder="请输入岗位编码" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="岗位名称" prop="postName"><el-input v-model="queryParams.postName" placeholder="请输入岗位名称" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable size="small"><el-option label="正常" value="0" /><el-option label="停用" value="1" /></el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:post:add']">新增</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:post:remove']">删除</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="岗位编号" align="center" prop="postId" width="80" />
      <el-table-column label="岗位编码" align="center" prop="postCode" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <el-table-column label="显示顺序" align="center" prop="postSort" width="80" />
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope"><el-tag :type="scope.row.status==='0'?'success':'danger'" size="small">{{ scope.row.status==='0'?'正常':'停用' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total>0" :total="total" :page-sizes="[10,20,50]" :page-size="queryParams.pageSize" :current-page="queryParams.pageNum" layout="total, sizes, prev, pager, next, jumper" @size-change="s=>{queryParams.pageSize=s;getList()}" @current-change="p=>{queryParams.pageNum=p;getList()}" />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName"><el-input v-model="form.postName" placeholder="请输入岗位名称" /></el-form-item>
        <el-form-item label="岗位编码" prop="postCode"><el-input v-model="form.postCode" placeholder="请输入岗位编码" /></el-form-item>
        <el-form-item label="岗位顺序" prop="postSort"><el-input-number v-model="form.postSort" :min="0" /></el-form-item>
        <el-form-item label="岗位状态" prop="status"><el-radio-group v-model="form.status"><el-radio label="0">正常</el-radio><el-radio label="1">停用</el-radio></el-radio-group></el-form-item>
        <el-form-item label="备注" prop="remark"><el-input v-model="form.remark" type="textarea" placeholder="请输入内容" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="submitForm">确 定</el-button><el-button @click="cancel">取 消</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { listPost, getPost, addPost, updatePost, delPost } from '@/api/system/post'

export default {
  name: 'Post',
  data() {
    return {
      loading: true, ids: [], multiple: true, showSearch: true, total: 0, postList: [], title: '', open: false,
      queryParams: { pageNum: 1, pageSize: 10, postCode: undefined, postName: undefined, status: undefined },
      form: {},
      rules: {
        postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
        postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
        postSort: [{ required: true, message: '岗位顺序不能为空', trigger: 'blur' }]
      }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listPost(this.queryParams).then(res => { this.postList = res.rows; this.total = res.total; this.loading = false }) },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleSelectionChange(s) { this.ids = s.map(i => i.postId); this.multiple = !s.length },
    handleAdd() { this.reset(); this.open = true; this.title = '添加岗位' },
    handleUpdate(row) { this.reset(); getPost(row.postId).then(res => { this.form = res.data; this.open = true; this.title = '修改岗位' }) },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.postId) { updatePost(this.form).then(() => { this.$message.success('修改成功'); this.open = false; this.getList() }) }
          else { addPost(this.form).then(() => { this.$message.success('新增成功'); this.open = false; this.getList() }) }
        }
      })
    },
    handleDelete(row) {
      const postIds = row.postId ? [row.postId] : this.ids
      this.$confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？').then(() => delPost(postIds.join(','))).then(() => { this.getList(); this.$message.success('删除成功') })
    },
    reset() { this.form = { postId: undefined, postCode: undefined, postName: undefined, postSort: 0, status: '0', remark: undefined }; if (this.$refs.form) this.$refs.form.resetFields() },
    cancel() { this.open = false; this.reset() }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}</style>
