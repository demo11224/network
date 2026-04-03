package com.admin.controller;

import com.admin.common.constant.Constants;
import com.admin.common.core.domain.R;
import com.admin.domain.entity.SysMenu;
import com.admin.security.LoginUser;
import com.admin.service.ISysMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 菜单管理
 */
@RestController
@RequestMapping("/system/menu")
public class SysMenuController {

    @Autowired
    private ISysMenuService menuService;

    @PreAuthorize("@perm.hasPermi('system:menu:list')")
    @GetMapping("/list")
    public R<?> list(SysMenu menu, Authentication authentication) {
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        List<SysMenu> menus = menuService.selectMenuList(menu, loginUser.getUserId());
        return R.ok(menus);
    }

    @PreAuthorize("@perm.hasPermi('system:menu:query')")
    @GetMapping("/{menuId}")
    public R<?> getInfo(@PathVariable Long menuId) {
        return R.ok(menuService.selectMenuById(menuId));
    }

    /**
     * 获取菜单下拉树列表
     */
    @GetMapping("/treeselect")
    public R<?> treeselect(SysMenu menu, Authentication authentication) {
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        List<SysMenu> menus = menuService.selectMenuList(menu, loginUser.getUserId());
        return R.ok(menuService.buildMenuTreeSelect(menus));
    }

    /**
     * 加载对应角色菜单列表树
     */
    @GetMapping("/roleMenuTreeselect/{roleId}")
    public R<?> roleMenuTreeselect(@PathVariable Long roleId, Authentication authentication) {
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        List<SysMenu> menus = menuService.selectMenuList(new SysMenu(), loginUser.getUserId());
        Map<String, Object> result = new HashMap<>();
        result.put("checkedKeys", menuService.selectMenuListByRoleId(roleId));
        result.put("menus", menuService.buildMenuTreeSelect(menus));
        return R.ok(result);
    }

    @PreAuthorize("@perm.hasPermi('system:menu:add')")
    @PostMapping
    public R<?> add(@Validated @RequestBody SysMenu menu) {
        return R.ok(menuService.insertMenu(menu));
    }

    @PreAuthorize("@perm.hasPermi('system:menu:edit')")
    @PutMapping
    public R<?> edit(@Validated @RequestBody SysMenu menu) {
        return R.ok(menuService.updateMenu(menu));
    }

    @PreAuthorize("@perm.hasPermi('system:menu:remove')")
    @DeleteMapping("/{menuId}")
    public R<?> remove(@PathVariable Long menuId) {
        if (menuService.hasChildByMenuId(menuId)) {
            return R.fail("存在子菜单,不允许删除");
        }
        return R.ok(menuService.deleteMenuById(menuId));
    }
}
