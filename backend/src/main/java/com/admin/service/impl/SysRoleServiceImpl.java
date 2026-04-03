package com.admin.service.impl;

import com.admin.domain.entity.SysRole;
import com.admin.domain.entity.SysRoleMenu;
import com.admin.domain.entity.SysRoleDept;
import com.admin.mapper.SysRoleMapper;
import com.admin.mapper.SysRoleMenuMapper;
import com.admin.mapper.SysRoleDeptMapper;
import com.admin.service.ISysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SysRoleServiceImpl implements ISysRoleService {

    @Autowired
    private SysRoleMapper roleMapper;

    @Autowired
    private SysRoleMenuMapper roleMenuMapper;

    @Autowired
    private SysRoleDeptMapper roleDeptMapper;

    @Override
    public List<SysRole> selectRolesByUserId(Long userId) {
        return roleMapper.selectRolesByUserId(userId);
    }

    @Override
    public List<SysRole> selectRoleList(SysRole role) {
        return roleMapper.selectRoleList(role);
    }

    @Override
    public SysRole selectRoleById(Long roleId) {
        return roleMapper.selectRoleById(roleId);
    }

    @Override
    public Set<String> selectRolePermsByUserId(Long userId) {
        List<SysRole> roles = roleMapper.selectRolesByUserId(userId);
        Set<String> perms = new HashSet<>();
        for (SysRole role : roles) {
            if (role.getRoleKey() != null) {
                perms.add(role.getRoleKey());
            }
        }
        return perms;
    }

    @Override
    @Transactional
    public int insertRole(SysRole role) {
        int rows = roleMapper.insert(role);
        insertRoleMenu(role);
        return rows;
    }

    @Override
    @Transactional
    public int updateRole(SysRole role) {
        roleMenuMapper.deleteByRoleId(role.getRoleId());
        insertRoleMenu(role);
        return roleMapper.updateById(role);
    }

    @Override
    @Transactional
    public int deleteRoleByIds(Long[] roleIds) {
        for (Long roleId : roleIds) {
            roleMenuMapper.deleteByRoleId(roleId);
            roleDeptMapper.deleteByRoleId(roleId);
        }
        return roleMapper.deleteBatchIds(Arrays.asList(roleIds));
    }

    @Override
    public int updateRoleStatus(SysRole role) {
        return roleMapper.updateById(role);
    }

    @Override
    public boolean checkRoleKeyUnique(String roleKey) {
        return roleMapper.checkRoleKeyUnique(roleKey) == 0;
    }

    private void insertRoleMenu(SysRole role) {
        if (role.getMenuIds() != null && role.getMenuIds().length > 0) {
            List<SysRoleMenu> list = new ArrayList<>();
            for (Long menuId : role.getMenuIds()) {
                SysRoleMenu rm = new SysRoleMenu();
                rm.setRoleId(role.getRoleId());
                rm.setMenuId(menuId);
                list.add(rm);
            }
            roleMenuMapper.batchInsert(list);
        }
    }
}
