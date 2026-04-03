package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.common.core.page.TableDataInfo;
import com.admin.domain.entity.SysRole;
import com.admin.service.ISysRoleService;
import com.admin.service.ISysMenuService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 角色管理
 */
@RestController
@RequestMapping("/system/role")
public class SysRoleController {

    @Autowired
    private ISysRoleService roleService;

    @Autowired
    private ISysMenuService menuService;

    @PreAuthorize("@perm.hasPermi('system:role:list')")
    @GetMapping("/list")
    public TableDataInfo<SysRole> list(SysRole role,
                                       @RequestParam(defaultValue = "1") int pageNum,
                                       @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysRole> list = roleService.selectRoleList(role);
        PageInfo<SysRole> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @PreAuthorize("@perm.hasPermi('system:role:query')")
    @GetMapping("/{roleId}")
    public R<?> getInfo(@PathVariable Long roleId) {
        return R.ok(roleService.selectRoleById(roleId));
    }

    @PreAuthorize("@perm.hasPermi('system:role:add')")
    @PostMapping
    public R<?> add(@Validated @RequestBody SysRole role) {
        if (!roleService.checkRoleKeyUnique(role.getRoleKey())) {
            return R.fail("新增角色'" + role.getRoleName() + "'失败，角色权限已存在");
        }
        return R.ok(roleService.insertRole(role));
    }

    @PreAuthorize("@perm.hasPermi('system:role:edit')")
    @PutMapping
    public R<?> edit(@Validated @RequestBody SysRole role) {
        return R.ok(roleService.updateRole(role));
    }

    @PreAuthorize("@perm.hasPermi('system:role:remove')")
    @DeleteMapping("/{roleIds}")
    public R<?> remove(@PathVariable Long[] roleIds) {
        return R.ok(roleService.deleteRoleByIds(roleIds));
    }

    @PreAuthorize("@perm.hasPermi('system:role:edit')")
    @PutMapping("/changeStatus")
    public R<?> changeStatus(@RequestBody SysRole role) {
        return R.ok(roleService.updateRoleStatus(role));
    }
}
