package com.admin.service;

import com.admin.domain.entity.SysMenu;
import com.admin.domain.entity.SysUser;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface ISysMenuService {
    List<SysMenu> selectMenuList(SysMenu menu, Long userId);
    Set<String> selectMenuPermsByUserId(Long userId);
    List<SysMenu> selectMenuTreeByUserId(Long userId);
    List<Long> selectMenuListByRoleId(Long roleId);
    SysMenu selectMenuById(Long menuId);
    int insertMenu(SysMenu menu);
    int updateMenu(SysMenu menu);
    int deleteMenuById(Long menuId);
    boolean hasChildByMenuId(Long menuId);
    List<Map<String, Object>> buildMenuTreeSelect(List<SysMenu> menus);
    List<SysMenu> buildMenuTree(List<SysMenu> menus);
    List<Map<String, Object>> buildRouterMenus(List<SysMenu> menus);
}
