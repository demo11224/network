package com.admin.service;

import com.admin.domain.entity.SysRole;
import java.util.List;
import java.util.Set;

public interface ISysRoleService {
    List<SysRole> selectRolesByUserId(Long userId);
    List<SysRole> selectRoleList(SysRole role);
    SysRole selectRoleById(Long roleId);
    Set<String> selectRolePermsByUserId(Long userId);
    int insertRole(SysRole role);
    int updateRole(SysRole role);
    int deleteRoleByIds(Long[] roleIds);
    int updateRoleStatus(SysRole role);
    boolean checkRoleKeyUnique(String roleKey);
}
