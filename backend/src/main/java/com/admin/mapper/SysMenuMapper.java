package com.admin.mapper;

import com.admin.domain.entity.SysMenu;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysMenuMapper extends BaseMapper<SysMenu> {
    List<String> selectMenuPermsByUserId(@Param("userId") Long userId);
    List<SysMenu> selectMenuList(SysMenu menu);
    List<SysMenu> selectMenuListByUserId(SysMenu menu);
    List<SysMenu> selectMenuTreeAll();
    List<SysMenu> selectMenuTreeByUserId(@Param("userId") Long userId);
    List<Long> selectMenuListByRoleId(@Param("roleId") Long roleId);
    SysMenu selectMenuById(@Param("menuId") Long menuId);
    int checkMenuNameUnique(@Param("menuName") String menuName, @Param("parentId") Long parentId);
}
