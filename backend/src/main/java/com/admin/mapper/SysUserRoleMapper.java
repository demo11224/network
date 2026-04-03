package com.admin.mapper;

import com.admin.domain.entity.SysUserRole;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysUserRoleMapper extends BaseMapper<SysUserRole> {
    int batchInsert(@Param("list") List<SysUserRole> list);
    int deleteByUserId(@Param("userId") Long userId);
}
