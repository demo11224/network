<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
          <el-option label="正常" value="0" /><el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:menu:add']">新增</el-button></el-col>
    </el-row>
    <el-table v-loading="loading" :data="menuList" row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="menuName" label="菜单名称" width="200" />
      <el-table-column prop="icon" label="图标" align="center" width="80">
        <template slot-scope="scope"><i :class="scope.row.icon" /></template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center" width="60" />
      <el-table-column prop="perms" label="权限标识" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'" size="small">{{ scope.row.status === '0' ? '正常' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:menu:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)" v-hasPermi="['system:menu:add']">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:menu:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-cascader v-model="form.parentId" :options="menuOptions" :props="{ checkStrictly: true, value: 'id', label: 'label', emitPath: false }" clearable placeholder="选择上级菜单" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="菜单名称" prop="menuName"><el-input v-model="form.menuName" placeholder="请输入菜单名称" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="显示排序" prop="orderNum"><el-input-number v-model="form.orderNum" :min="0" /></el-form-item></el-col>
        </el-row>
        <el-row v-if="form.menuType !== 'F'">
          <el-col :span="12"><el-form-item label="路由地址" prop="path"><el-input v-model="form.path" placeholder="请输入路由地址" /></el-form-item></el-col>
          <el-col :span="12" v-if="form.menuType === 'C'"><el-form-item label="组件路径" prop="component"><el-input v-model="form.component" placeholder="请输入组件路径" /></el-form-item></el-col>
        </el-row>
        <el-row v-if="form.menuType !== 'M'">
          <el-col :span="12"><el-form-item label="权限标识"><el-input v-model="form.perms" placeholder="请输入权限标识" /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示状态" v-if="form.menuType !== 'F'">
              <el-radio-group v-model="form.visible"><el-radio label="0">显示</el-radio><el-radio label="1">隐藏</el-radio></el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.status"><el-radio label="0">正常</el-radio><el-radio label="1">停用</el-radio></el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="submitForm">确 定</el-button><el-button @click="cancel">取 消</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, addMenu, updateMenu, delMenu, treeselect } from '@/api/system/menu'

export default {
  name: 'Menu',
  data() {
    return {
      loading: true, showSearch: true, menuList: [], title: '', open: false, menuOptions: [],
      queryParams: { menuName: undefined, status: undefined },
      form: {},
      rules: {
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
        menuType: [{ required: true, message: '菜单类型不能为空', trigger: 'change' }]
      }
    }
  },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; listMenu(this.queryParams).then(res => { this.menuList = this.handleTree(res.data, 'menuId'); this.loading = false }) },
    getTreeselect() { treeselect().then(res => { this.menuOptions = [{ id: 0, label: '主类目', children: res.data }] }) },
    handleQuery() { this.getList() },
    resetQuery() { this.$refs.queryForm.resetFields(); this.handleQuery() },
    handleAdd(row) { this.reset(); this.getTreeselect(); if (row && row.menuId) { this.form.parentId = row.menuId } else { this.form.parentId = 0 }; this.open = true; this.title = '添加菜单' },
    handleUpdate(row) { this.reset(); this.getTreeselect(); getMenu(row.menuId).then(res => { this.form = res.data; this.open = true; this.title = '修改菜单' }) },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.menuId !== undefined) { updateMenu(this.form).then(() => { this.$message.success('修改成功'); this.open = false; this.getList() }) }
          else { addMenu(this.form).then(() => { this.$message.success('新增成功'); this.open = false; this.getList() }) }
        }
      })
    },
    handleDelete(row) { this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项？').then(() => delMenu(row.menuId)).then(() => { this.getList(); this.$message.success('删除成功') }) },
    reset() { this.form = { menuId: undefined, parentId: 0, menuName: undefined, icon: undefined, menuType: 'M', orderNum: undefined, isFrame: 1, isCache: 0, visible: '0', status: '0', path: undefined, component: undefined, perms: undefined }; if (this.$refs.form) this.$refs.form.resetFields() },
    cancel() { this.open = false; this.reset() },
    handleTree(data, id, parentId, children) {
      const config = { id: id || 'id', parentId: parentId || 'parentId', childrenList: children || 'children' }
      const childrenListMap = {}, nodeIds = {}, tree = []
      for (const d of data) { const pid = d[config.parentId]; if (!childrenListMap[pid]) childrenListMap[pid] = []; nodeIds[d[config.id]] = d; childrenListMap[pid].push(d) }
      for (const d of data) { if (!nodeIds[d[config.parentId]]) tree.push(d) }
      for (const t of tree) this.adaptToChildrenList(t, childrenListMap, config)
      return tree
    },
    adaptToChildrenList(o, childrenListMap, config) {
      if (childrenListMap[o[config.id]] !== null) {
        o[config.childrenList] = childrenListMap[o[config.id]]
        if (o[config.childrenList]) { for (const c of o[config.childrenList]) this.adaptToChildrenList(c, childrenListMap, config) }
      }
    }
  }
}
</script>

<style scoped>.app-container{padding:20px;background:#fff}.mb8{margin-bottom:8px}</style>
