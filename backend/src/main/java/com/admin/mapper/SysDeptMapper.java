package com.admin.mapper;

import com.admin.domain.entity.SysDept;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysDeptMapper extends BaseMapper<SysDept> {
    List<SysDept> selectDeptList(SysDept dept);
    SysDept selectDeptById(@Param("deptId") Long deptId);
    int checkDeptNameUnique(@Param("deptName") String deptName, @Param("parentId") Long parentId);
    int selectNormalChildrenDeptById(@Param("deptId") Long deptId);
}
