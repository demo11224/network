package com.admin.mapper;

import com.admin.domain.entity.SysRoleDept;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysRoleDeptMapper extends BaseMapper<SysRoleDept> {
    int batchInsert(@Param("list") List<SysRoleDept> list);
    int deleteByRoleId(@Param("roleId") Long roleId);
}
