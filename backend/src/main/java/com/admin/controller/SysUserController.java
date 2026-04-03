package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.common.core.page.TableDataInfo;
import com.admin.domain.entity.SysUser;
import com.admin.domain.entity.SysRole;
import com.admin.domain.entity.SysPost;
import com.admin.mapper.SysPostMapper;
import com.admin.mapper.SysRoleMapper;
import com.admin.service.ISysUserService;
import com.admin.service.ISysRoleService;
import com.admin.service.ISysPostService;
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
 * 用户管理
 */
@RestController
@RequestMapping("/system/user")
public class SysUserController {

    @Autowired
    private ISysUserService userService;

    @Autowired
    private ISysRoleService roleService;

    @Autowired
    private ISysPostService postService;

    @PreAuthorize("@perm.hasPermi('system:user:list')")
    @GetMapping("/list")
    public TableDataInfo<SysUser> list(SysUser user,
                                       @RequestParam(defaultValue = "1") int pageNum,
                                       @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysUser> list = userService.selectUserList(user);
        PageInfo<SysUser> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @PreAuthorize("@perm.hasPermi('system:user:query')")
    @GetMapping("/{userId}")
    public R<?> getInfo(@PathVariable Long userId) {
        Map<String, Object> result = new HashMap<>();
        List<SysRole> roles = roleService.selectRoleList(new SysRole());
        List<SysPost> posts = postService.selectPostAll();
        result.put("data", userService.selectUserById(userId));
        result.put("roles", roles);
        result.put("posts", posts);
        return R.ok(result);
    }

    @PreAuthorize("@perm.hasPermi('system:user:add')")
    @PostMapping
    public R<?> add(@Validated @RequestBody SysUser user) {
        if (!userService.checkUserNameUnique(user.getUserName())) {
            return R.fail("新增用户'" + user.getUserName() + "'失败，登录账号已存在");
        }
        return R.ok(userService.insertUser(user));
    }

    @PreAuthorize("@perm.hasPermi('system:user:edit')")
    @PutMapping
    public R<?> edit(@Validated @RequestBody SysUser user) {
        return R.ok(userService.updateUser(user));
    }

    @PreAuthorize("@perm.hasPermi('system:user:remove')")
    @DeleteMapping("/{userIds}")
    public R<?> remove(@PathVariable Long[] userIds) {
        return R.ok(userService.deleteUserByIds(userIds));
    }

    @PreAuthorize("@perm.hasPermi('system:user:resetPwd')")
    @PutMapping("/resetPwd")
    public R<?> resetPwd(@RequestBody SysUser user) {
        return R.ok(userService.resetPwd(user));
    }

    @PreAuthorize("@perm.hasPermi('system:user:edit')")
    @PutMapping("/changeStatus")
    public R<?> changeStatus(@RequestBody SysUser user) {
        return R.ok(userService.updateUserStatus(user));
    }
}
