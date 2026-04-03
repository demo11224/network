package com.admin.service.impl;

import com.admin.common.constant.Constants;
import com.admin.domain.entity.SysMenu;
import com.admin.mapper.SysMenuMapper;
import com.admin.service.ISysMenuService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysMenuServiceImpl implements ISysMenuService {

    @Autowired
    private SysMenuMapper menuMapper;

    @Override
    public List<SysMenu> selectMenuList(SysMenu menu, Long userId) {
        if (userId != null && userId.equals(Constants.SUPER_ADMIN_ID)) {
            return menuMapper.selectMenuList(menu);
        } else {
            menu.getParams().put("userId", userId);
            return menuMapper.selectMenuListByUserId(menu);
        }
    }

    @Override
    public Set<String> selectMenuPermsByUserId(Long userId) {
        List<String> perms = menuMapper.selectMenuPermsByUserId(userId);
        Set<String> permsSet = new HashSet<>();
        for (String perm : perms) {
            if (StringUtils.isNotEmpty(perm)) {
                permsSet.addAll(Arrays.asList(perm.trim().split(",")));
            }
        }
        return permsSet;
    }

    @Override
    public List<SysMenu> selectMenuTreeByUserId(Long userId) {
        List<SysMenu> menus;
        if (userId != null && userId.equals(Constants.SUPER_ADMIN_ID)) {
            menus = menuMapper.selectMenuTreeAll();
        } else {
            menus = menuMapper.selectMenuTreeByUserId(userId);
        }
        return buildMenuTree(menus);
    }

    @Override
    public List<Long> selectMenuListByRoleId(Long roleId) {
        return menuMapper.selectMenuListByRoleId(roleId);
    }

    @Override
    public SysMenu selectMenuById(Long menuId) {
        return menuMapper.selectMenuById(menuId);
    }

    @Override
    public int insertMenu(SysMenu menu) {
        return menuMapper.insert(menu);
    }

    @Override
    public int updateMenu(SysMenu menu) {
        return menuMapper.updateById(menu);
    }

    @Override
    public int deleteMenuById(Long menuId) {
        return menuMapper.deleteById(menuId);
    }

    @Override
    public boolean hasChildByMenuId(Long menuId) {
        Long count = menuMapper.selectCount(new LambdaQueryWrapper<SysMenu>().eq(SysMenu::getParentId, menuId));
        return count != null && count > 0;
    }

    @Override
    public List<Map<String, Object>> buildMenuTreeSelect(List<SysMenu> menus) {
        List<SysMenu> menuTrees = buildMenuTree(menus);
        return menuTrees.stream().map(this::menuToTreeSelect).collect(Collectors.toList());
    }

    @Override
    public List<SysMenu> buildMenuTree(List<SysMenu> menus) {
        List<SysMenu> returnList = new ArrayList<>();
        List<Long> menuIds = menus.stream().map(SysMenu::getMenuId).collect(Collectors.toList());
        for (SysMenu menu : menus) {
            if (!menuIds.contains(menu.getParentId())) {
                recursionFn(menus, menu);
                returnList.add(menu);
            }
        }
        if (returnList.isEmpty()) {
            returnList = menus;
        }
        return returnList;
    }

    @Override
    public List<Map<String, Object>> buildRouterMenus(List<SysMenu> menus) {
        List<Map<String, Object>> routers = new ArrayList<>();
        for (SysMenu menu : menus) {
            Map<String, Object> router = new LinkedHashMap<>();
            router.put("name", getRouteName(menu));
            router.put("path", getRouterPath(menu));
            router.put("hidden", "1".equals(menu.getVisible()));
            router.put("component", getComponent(menu));

            Map<String, Object> meta = new LinkedHashMap<>();
            meta.put("title", menu.getMenuName());
            meta.put("icon", menu.getIcon());
            meta.put("noCache", menu.getIsCache() != null && menu.getIsCache() == 1);
            router.put("meta", meta);

            List<SysMenu> children = menu.getChildren();
            if (children != null && !children.isEmpty() && Constants.TYPE_DIR.equals(menu.getMenuType())) {
                router.put("alwaysShow", true);
                router.put("redirect", "noRedirect");
                router.put("children", buildRouterMenus(children));
            } else if (isMenuFrame(menu)) {
                router.put("meta", null);
                List<Map<String, Object>> childrenList = new ArrayList<>();
                Map<String, Object> childRouter = new LinkedHashMap<>();
                childRouter.put("path", menu.getPath());
                childRouter.put("component", menu.getComponent());
                childRouter.put("name", StringUtils.capitalize(menu.getPath()));
                childRouter.put("meta", meta);
                childrenList.add(childRouter);
                router.put("children", childrenList);
            } else if (menu.getParentId().intValue() == 0 && isInnerLink(menu)) {
                router.put("meta", meta);
                router.put("path", "/");
                List<Map<String, Object>> childrenList = new ArrayList<>();
                Map<String, Object> childRouter = new LinkedHashMap<>();
                childRouter.put("path", menu.getPath());
                childRouter.put("component", Constants.INNER_LINK);
                childRouter.put("name", StringUtils.capitalize(menu.getPath()));
                childRouter.put("meta", meta);
                childrenList.add(childRouter);
                router.put("children", childrenList);
            }
            routers.add(router);
        }
        return routers;
    }

    private String getRouteName(SysMenu menu) {
        String routerName = StringUtils.capitalize(menu.getPath());
        if (isMenuFrame(menu)) {
            routerName = "";
        }
        return routerName;
    }

    private String getRouterPath(SysMenu menu) {
        String routerPath = menu.getPath();
        if (menu.getParentId().intValue() != 0 && isInnerLink(menu)) {
            routerPath = routerPath.replaceAll("^https?://", "");
        }
        if (0 == menu.getParentId().intValue() && Constants.TYPE_DIR.equals(menu.getMenuType()) && !isMenuFrame(menu)) {
            routerPath = "/" + menu.getPath();
        } else if (isMenuFrame(menu)) {
            routerPath = "/";
        }
        return routerPath;
    }

    private String getComponent(SysMenu menu) {
        String component = Constants.LAYOUT;
        if (StringUtils.isNotEmpty(menu.getComponent()) && !isMenuFrame(menu)) {
            component = menu.getComponent();
        } else if (StringUtils.isEmpty(menu.getComponent()) && menu.getParentId().intValue() != 0 && isInnerLink(menu)) {
            component = Constants.INNER_LINK;
        } else if (StringUtils.isEmpty(menu.getComponent()) && isParentView(menu)) {
            component = Constants.PARENT_VIEW;
        }
        return component;
    }

    private boolean isMenuFrame(SysMenu menu) {
        return menu.getParentId().intValue() == 0 && Constants.TYPE_MENU.equals(menu.getMenuType()) && menu.getIsFrame() != null && menu.getIsFrame().equals(Constants.NO_FRAME);
    }

    private boolean isInnerLink(SysMenu menu) {
        return menu.getIsFrame() != null && menu.getIsFrame().equals(Constants.NO_FRAME) && menu.getPath() != null && menu.getPath().startsWith("http");
    }

    private boolean isParentView(SysMenu menu) {
        return menu.getParentId().intValue() != 0 && Constants.TYPE_DIR.equals(menu.getMenuType());
    }

    private void recursionFn(List<SysMenu> list, SysMenu t) {
        List<SysMenu> childList = getChildList(list, t);
        t.setChildren(childList);
        for (SysMenu child : childList) {
            if (hasChild(list, child)) {
                recursionFn(list, child);
            }
        }
    }

    private List<SysMenu> getChildList(List<SysMenu> list, SysMenu t) {
        return list.stream().filter(n -> n.getParentId().equals(t.getMenuId())).collect(Collectors.toList());
    }

    private boolean hasChild(List<SysMenu> list, SysMenu t) {
        return getChildList(list, t).size() > 0;
    }

    private Map<String, Object> menuToTreeSelect(SysMenu menu) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", menu.getMenuId());
        map.put("label", menu.getMenuName());
        if (menu.getChildren() != null && !menu.getChildren().isEmpty()) {
            map.put("children", menu.getChildren().stream().map(this::menuToTreeSelect).collect(Collectors.toList()));
        }
        return map;
    }
}
