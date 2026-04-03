<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
          <el-option label="正常" value="0" /><el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dept:add']">新增</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="deptList" row-key="deptId" :tree-props="{children:'children',hasChildren:'hasChildren'}">
      <el-table-column prop="deptName" label="部门名称" width="260" />
      <el-table-column prop="orderNum" label="排序" width="200" align="center" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope"><el-tag :type="scope.row.status==='0'?'success':'danger'" size="small">{{ scope.row.status==='0'?'正常':'停用' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:add']">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dept:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <el-cascader v-model="form.parentId" :options="deptOptions" :props="{checkStrictly:true,value:'id',label:'label',emitPath:false}" clearable placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="部门名称" prop="deptName"><el-input v-model="form.deptName" placeholder="请输入部门名称" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="显示排序" prop="orderNum"><el-input-number v-model="form.orderNum" :min="0" /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="负责人" prop="leader"><el-input v-model="form.leader" placeholder="请输入负责人" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="联系电话" prop="phone"><el-input v-model="form.phone" placeholder="请输入联系电话" /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="邮箱" prop="email"><el-input v-model="form.email" placeholder="请输入邮箱" /></el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio label="0">正常</el-radio><el-radio label="1">停用</el-radio></el-radio-group></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="submitForm">确 定</el-button><el-button @click="cancel">取 消</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, addDept, updateDept, delDept, treeselect } from '@/api/system/dept'

export default {
  name: 'Dept',
  data() {
    return {
      loading: true, showSearch: true, deptList: [], deptOptions: [], title: '', open: false,
      queryParams: { deptName: undefined, status: undefined },
      form: {},
      rules: {
        parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }]
      }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listDept(this.queryParams).then(res => { this.deptList = this.handleTree(res.data, 'deptId'); this.loading = false }) },
    getTreeselect() { treeselect().then(res => { this.deptOptions = res.data }) },
    handleQuery() { this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleAdd(row) { this.reset(); this.getTreeselect(); if (row && row.deptId) this.form.parentId = row.deptId; this.open = true; this.title = '添加部门' },
    handleUpdate(row) { this.reset(); this.getTreeselect(); getDept(row.deptId).then(res => { this.form = res.data; this.open = true; this.title = '修改部门' }) },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.deptId) { updateDept(this.form).then(() => { this.$message.success('修改成功'); this.open = false; this.getList() }) }
          else { addDept(this.form).then(() => { this.$message.success('新增成功'); this.open = false; this.getList() }) }
        }
      })
    },
    handleDelete(row) { this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(() => delDept(row.deptId)).then(() => { this.getList(); this.$message.success('删除成功') }) },
    reset() { this.form = { deptId: undefined, parentId: undefined, deptName: undefined, orderNum: undefined, leader: undefined, phone: undefined, email: undefined, status: '0' }; if (this.$refs.form) this.$refs.form.resetFields() },
    cancel() { this.open = false; this.reset() },
    handleTree(data, id, parentId, children) {
      const config = { id: id || 'id', parentId: parentId || 'parentId', childrenList: children || 'children' }
      const childrenListMap = {}, nodeIds = {}, tree = []
      for (const d of data) { const pid = d[config.parentId]; if (!childrenListMap[pid]) childrenListMap[pid] = []; nodeIds[d[config.id]] = d; childrenListMap[pid].push(d) }
      for (const d of data) { if (!nodeIds[d[config.parentId]]) tree.push(d) }
      for (const t of tree) this.adaptToChildrenList(t, childrenListMap, config)
      return tree
    },
    adaptToChildrenList(o, childrenListMap, config) { if (childrenListMap[o[config.id]]) { o[config.childrenList] = childrenListMap[o[config.id]]; for (const c of o[config.childrenList]) this.adaptToChildrenList(c, childrenListMap, config) } }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}</style>
