package com.admin.service;

import com.admin.domain.entity.SysDept;
import java.util.List;
import java.util.Map;

public interface ISysDeptService {
    List<SysDept> selectDeptList(SysDept dept);
    SysDept selectDeptById(Long deptId);
    List<Map<String, Object>> buildDeptTreeSelect(List<SysDept> depts);
    int insertDept(SysDept dept);
    int updateDept(SysDept dept);
    int deleteDeptById(Long deptId);
    boolean hasChildByDeptId(Long deptId);
    boolean checkDeptNameUnique(String deptName, Long parentId);
}
