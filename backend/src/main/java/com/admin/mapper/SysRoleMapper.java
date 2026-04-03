package com.admin.mapper;

import com.admin.domain.entity.SysRole;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysRoleMapper extends BaseMapper<SysRole> {
    List<SysRole> selectRolesByUserId(@Param("userId") Long userId);
    List<SysRole> selectRoleList(SysRole role);
    SysRole selectRoleById(@Param("roleId") Long roleId);
    int checkRoleKeyUnique(@Param("roleKey") String roleKey);
}
