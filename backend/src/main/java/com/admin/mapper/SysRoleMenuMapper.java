package com.admin.mapper;

import com.admin.domain.entity.SysRoleMenu;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysRoleMenuMapper extends BaseMapper<SysRoleMenu> {
    int batchInsert(@Param("list") List<SysRoleMenu> list);
    int deleteByRoleId(@Param("roleId") Long roleId);
}
