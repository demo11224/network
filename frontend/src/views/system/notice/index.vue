<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="公告标题" prop="noticeTitle"><el-input v-model="queryParams.noticeTitle" placeholder="请输入公告标题" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="操作人员" prop="createBy"><el-input v-model="queryParams.createBy" placeholder="请输入操作人员" clearable size="small" @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable size="small"><el-option label="通知" value="1" /><el-option label="公告" value="2" /></el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:notice:add']">新增</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:notice:remove']">删除</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="noticeId" width="80" />
      <el-table-column label="公告标题" align="center" prop="noticeTitle" :show-overflow-tooltip="true" />
      <el-table-column label="公告类型" align="center" width="80"><template slot-scope="scope"><el-tag :type="scope.row.noticeType==='1'?'warning':'success'" size="small">{{ scope.row.noticeType==='1'?'通知':'公告' }}</el-tag></template></el-table-column>
      <el-table-column label="状态" align="center" width="80"><template slot-scope="scope"><el-tag :type="scope.row.status==='0'?'success':'danger'" size="small">{{ scope.row.status==='0'?'正常':'关闭' }}</el-tag></template></el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:notice:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:notice:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total>0" :total="total" :page-sizes="[10,20,50]" :page-size="queryParams.pageSize" :current-page="queryParams.pageNum" layout="total, sizes, prev, pager, next, jumper" @size-change="s=>{queryParams.pageSize=s;getList()}" @current-change="p=>{queryParams.pageNum=p;getList()}" />

    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12"><el-form-item label="公告标题" prop="noticeTitle"><el-input v-model="form.noticeTitle" placeholder="请输入公告标题" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="公告类型" prop="noticeType"><el-select v-model="form.noticeType" placeholder="请选择"><el-option label="通知" value="1" /><el-option label="公告" value="2" /></el-select></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="24"><el-form-item label="内容"><el-input v-model="form.noticeContent" type="textarea" :rows="6" placeholder="请输入内容" /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio label="0">正常</el-radio><el-radio label="1">关闭</el-radio></el-radio-group></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="submitForm">确 定</el-button><el-button @click="cancel">取 消</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { listNotice, getNotice, addNotice, updateNotice, delNotice } from '@/api/system/notice'

export default {
  name: 'Notice',
  data() {
    return {
      loading: true, ids: [], multiple: true, showSearch: true, total: 0, noticeList: [], title: '', open: false,
      queryParams: { pageNum: 1, pageSize: 10, noticeTitle: undefined, createBy: undefined, noticeType: undefined },
      form: {},
      rules: {
        noticeTitle: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
        noticeType: [{ required: true, message: '公告类型不能为空', trigger: 'change' }]
      }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listNotice(this.queryParams).then(res => { this.noticeList = res.rows; this.total = res.total; this.loading = false }) },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleSelectionChange(s) { this.ids = s.map(i => i.noticeId); this.multiple = !s.length },
    handleAdd() { this.reset(); this.open = true; this.title = '添加公告' },
    handleUpdate(row) { this.reset(); getNotice(row.noticeId).then(res => { this.form = res.data; this.open = true; this.title = '修改公告' }) },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.noticeId) { updateNotice(this.form).then(() => { this.$message.success('修改成功'); this.open = false; this.getList() }) }
          else { addNotice(this.form).then(() => { this.$message.success('新增成功'); this.open = false; this.getList() }) }
        }
      })
    },
    handleDelete(row) {
      const noticeIds = row.noticeId ? [row.noticeId] : this.ids
      this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？').then(() => delNotice(noticeIds.join(','))).then(() => { this.getList(); this.$message.success('删除成功') })
    },
    reset() { this.form = { noticeId: undefined, noticeTitle: undefined, noticeType: undefined, noticeContent: undefined, status: '0' }; if (this.$refs.form) this.$refs.form.resetFields() },
    cancel() { this.open = false; this.reset() }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}</style>
