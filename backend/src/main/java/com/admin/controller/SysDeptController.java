package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.domain.entity.SysDept;
import com.admin.service.ISysDeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 部门管理
 */
@RestController
@RequestMapping("/system/dept")
public class SysDeptController {

    @Autowired
    private ISysDeptService deptService;

    @PreAuthorize("@perm.hasPermi('system:dept:list')")
    @GetMapping("/list")
    public R<?> list(SysDept dept) {
        List<SysDept> list = deptService.selectDeptList(dept);
        return R.ok(list);
    }

    @PreAuthorize("@perm.hasPermi('system:dept:list')")
    @GetMapping("/list/exclude/{deptId}")
    public R<?> excludeChild(@PathVariable Long deptId) {
        List<SysDept> depts = deptService.selectDeptList(new SysDept());
        depts.removeIf(d -> d.getDeptId().equals(deptId) ||
                (d.getAncestors() != null && (d.getAncestors().contains("," + deptId + ",") || d.getAncestors().endsWith("," + deptId))));
        return R.ok(depts);
    }

    @PreAuthorize("@perm.hasPermi('system:dept:query')")
    @GetMapping("/{deptId}")
    public R<?> getInfo(@PathVariable Long deptId) {
        return R.ok(deptService.selectDeptById(deptId));
    }

    /**
     * 获取部门下拉树列表
     */
    @GetMapping("/treeselect")
    public R<?> treeselect(SysDept dept) {
        List<SysDept> depts = deptService.selectDeptList(dept);
        return R.ok(deptService.buildDeptTreeSelect(depts));
    }

    @PreAuthorize("@perm.hasPermi('system:dept:add')")
    @PostMapping
    public R<?> add(@Validated @RequestBody SysDept dept) {
        if (!deptService.checkDeptNameUnique(dept.getDeptName(), dept.getParentId())) {
            return R.fail("新增部门'" + dept.getDeptName() + "'失败，部门名称已存在");
        }
        return R.ok(deptService.insertDept(dept));
    }

    @PreAuthorize("@perm.hasPermi('system:dept:edit')")
    @PutMapping
    public R<?> edit(@Validated @RequestBody SysDept dept) {
        return R.ok(deptService.updateDept(dept));
    }

    @PreAuthorize("@perm.hasPermi('system:dept:remove')")
    @DeleteMapping("/{deptId}")
    public R<?> remove(@PathVariable Long deptId) {
        if (deptService.hasChildByDeptId(deptId)) {
            return R.fail("存在下级部门,不允许删除");
        }
        return R.ok(deptService.deleteDeptById(deptId));
    }
}
