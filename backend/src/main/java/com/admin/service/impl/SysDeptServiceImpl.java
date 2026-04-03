package com.admin.service.impl;

import com.admin.domain.entity.SysDept;
import com.admin.mapper.SysDeptMapper;
import com.admin.service.ISysDeptService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysDeptServiceImpl implements ISysDeptService {

    @Autowired
    private SysDeptMapper deptMapper;

    @Override
    public List<SysDept> selectDeptList(SysDept dept) {
        return deptMapper.selectDeptList(dept);
    }

    @Override
    public SysDept selectDeptById(Long deptId) {
        return deptMapper.selectDeptById(deptId);
    }

    @Override
    public List<Map<String, Object>> buildDeptTreeSelect(List<SysDept> depts) {
        List<SysDept> deptTrees = buildDeptTree(depts);
        return deptTrees.stream().map(this::deptToTreeSelect).collect(Collectors.toList());
    }

    @Override
    public int insertDept(SysDept dept) {
        SysDept parent = deptMapper.selectDeptById(dept.getParentId());
        if (parent != null) {
            dept.setAncestors(parent.getAncestors() + "," + dept.getParentId());
        } else {
            dept.setAncestors("0");
        }
        return deptMapper.insert(dept);
    }

    @Override
    public int updateDept(SysDept dept) {
        return deptMapper.updateById(dept);
    }

    @Override
    public int deleteDeptById(Long deptId) {
        return deptMapper.deleteById(deptId);
    }

    @Override
    public boolean hasChildByDeptId(Long deptId) {
        Long count = deptMapper.selectCount(new LambdaQueryWrapper<SysDept>().eq(SysDept::getParentId, deptId).eq(SysDept::getDelFlag, 0));
        return count != null && count > 0;
    }

    @Override
    public boolean checkDeptNameUnique(String deptName, Long parentId) {
        return deptMapper.checkDeptNameUnique(deptName, parentId) == 0;
    }

    private List<SysDept> buildDeptTree(List<SysDept> depts) {
        List<SysDept> returnList = new ArrayList<>();
        List<Long> deptIds = depts.stream().map(SysDept::getDeptId).collect(Collectors.toList());
        for (SysDept dept : depts) {
            if (!deptIds.contains(dept.getParentId())) {
                recursionFn(depts, dept);
                returnList.add(dept);
            }
        }
        if (returnList.isEmpty()) {
            returnList = depts;
        }
        return returnList;
    }

    private void recursionFn(List<SysDept> list, SysDept t) {
        List<SysDept> childList = list.stream().filter(n -> n.getParentId().equals(t.getDeptId())).collect(Collectors.toList());
        t.setChildren(childList);
        for (SysDept child : childList) {
            recursionFn(list, child);
        }
    }

    private Map<String, Object> deptToTreeSelect(SysDept dept) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", dept.getDeptId());
        map.put("label", dept.getDeptName());
        if (dept.getChildren() != null && !dept.getChildren().isEmpty()) {
            map.put("children", dept.getChildren().stream().map(this::deptToTreeSelect).collect(Collectors.toList()));
        }
        return map;
    }
}
