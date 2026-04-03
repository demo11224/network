<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input v-model="queryParams.roleKey" placeholder="请输入权限字符" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="角色状态" clearable size="small">
          <el-option label="正常" value="0" /><el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:role:add']">新增</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:role:remove']">删除</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="roleId" width="80" align="center" />
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="权限字符" prop="roleKey" />
      <el-table-column label="显示顺序" prop="roleSort" width="80" align="center" />
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:role:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:role:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="total>0" :total="total" :page-sizes="[10,20,50]" :page-size="queryParams.pageSize" :current-page="queryParams.pageNum" layout="total, sizes, prev, pager, next, jumper" @size-change="s=>{queryParams.pageSize=s;getList()}" @current-change="p=>{queryParams.pageNum=p;getList()}" />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName"><el-input v-model="form.roleName" placeholder="请输入角色名称" /></el-form-item>
        <el-form-item label="权限字符" prop="roleKey"><el-input v-model="form.roleKey" placeholder="请输入权限字符" /></el-form-item>
        <el-form-item label="角色顺序" prop="roleSort"><el-input-number v-model="form.roleSort" :min="0" /></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status"><el-radio label="0">正常</el-radio><el-radio label="1">停用</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree :data="menuOptions" show-checkbox ref="menu" node-key="id" :default-checked-keys="menuCheckedKeys" :props="{ label: 'label', children: 'children' }" />
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" placeholder="请输入内容" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="submitForm">确 定</el-button><el-button @click="cancel">取 消</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, addRole, updateRole, delRole, changeRoleStatus } from '@/api/system/role'
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/system/menu'

export default {
  name: 'Role',
  data() {
    return {
      loading: true, ids: [], multiple: true, showSearch: true, total: 0, roleList: [], title: '', open: false,
      menuOptions: [], menuCheckedKeys: [],
      queryParams: { pageNum: 1, pageSize: 10, roleName: undefined, roleKey: undefined, status: undefined },
      form: {},
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
        roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
      }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listRole(this.queryParams).then(res => { this.roleList = res.rows; this.total = res.total; this.loading = false }) },
    getMenuTreeselect() { menuTreeselect().then(res => { this.menuOptions = res.data }) },
    getRoleMenuTreeselect(roleId) { return roleMenuTreeselect(roleId).then(res => { this.menuOptions = res.data.menus; return res }) },
    handleQuery() { this.queryParams.pageNum = 1; this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleSelectionChange(s) { this.ids = s.map(i => i.roleId); this.multiple = !s.length },
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要' + text + '"' + row.roleName + '"角色吗？').then(() => changeRoleStatus(row.roleId, row.status)).then(() => this.$message.success(text + '成功')).catch(() => { row.status = row.status === '0' ? '1' : '0' })
    },
    handleAdd() { this.reset(); this.getMenuTreeselect(); this.open = true; this.title = '添加角色' },
    handleUpdate(row) {
      this.reset()
      const roleId = row.roleId || this.ids[0]
      this.getRoleMenuTreeselect(roleId).then(res => {
        this.form = Object.assign({}, row)
        this.menuCheckedKeys = res.data.checkedKeys
        this.open = true; this.title = '修改角色'
        this.$nextTick(() => { this.menuCheckedKeys.forEach(k => { const node = this.$refs.menu.getNode(k); if (node && node.isLeaf) this.$refs.menu.setChecked(k, true) }) })
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.menuIds = this.getMenuAllCheckedKeys()
          if (this.form.roleId !== undefined) {
            updateRole(this.form).then(() => { this.$message.success('修改成功'); this.open = false; this.getList() })
          } else {
            addRole(this.form).then(() => { this.$message.success('新增成功'); this.open = false; this.getList() })
          }
        }
      })
    },
    handleDelete(row) {
      const roleIds = row.roleId ? [row.roleId] : this.ids
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？').then(() => delRole(roleIds.join(','))).then(() => { this.getList(); this.$message.success('删除成功') })
    },
    getMenuAllCheckedKeys() { const c = this.$refs.menu.getCheckedKeys(); const h = this.$refs.menu.getHalfCheckedKeys(); return c.concat(h) },
    reset() { this.menuCheckedKeys = []; this.form = { roleId: undefined, roleName: undefined, roleKey: undefined, roleSort: 0, status: '0', menuIds: [], remark: undefined }; if (this.$refs.form) this.$refs.form.resetFields() },
    cancel() { this.open = false; this.reset() }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}</style>
