package com.admin.service.impl;

import com.admin.domain.entity.SysUser;
import com.admin.domain.entity.SysUserRole;
import com.admin.domain.entity.SysUserPost;
import com.admin.mapper.SysUserMapper;
import com.admin.mapper.SysUserRoleMapper;
import com.admin.mapper.SysUserPostMapper;
import com.admin.service.ISysUserService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class SysUserServiceImpl implements ISysUserService {

    @Autowired
    private SysUserMapper userMapper;

    @Autowired
    private SysUserRoleMapper userRoleMapper;

    @Autowired
    private SysUserPostMapper userPostMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public SysUser selectUserByUserName(String userName) {
        return userMapper.selectUserByUserName(userName);
    }

    @Override
    public SysUser selectUserById(Long userId) {
        return userMapper.selectUserById(userId);
    }

    @Override
    public List<SysUser> selectUserList(SysUser user) {
        return userMapper.selectUserList(user);
    }

    @Override
    @Transactional
    public int insertUser(SysUser user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        int rows = userMapper.insert(user);
        insertUserRole(user);
        insertUserPost(user);
        return rows;
    }

    @Override
    @Transactional
    public int updateUser(SysUser user) {
        Long userId = user.getUserId();
        // 删除旧关联
        userRoleMapper.deleteByUserId(userId);
        userPostMapper.deleteByUserId(userId);
        // 新增关联
        insertUserRole(user);
        insertUserPost(user);
        return userMapper.updateById(user);
    }

    @Override
    @Transactional
    public int deleteUserByIds(Long[] userIds) {
        for (Long userId : userIds) {
            userRoleMapper.deleteByUserId(userId);
            userPostMapper.deleteByUserId(userId);
        }
        return userMapper.deleteBatchIds(Arrays.asList(userIds));
    }

    @Override
    public int resetPwd(SysUser user) {
        SysUser updateUser = new SysUser();
        updateUser.setUserId(user.getUserId());
        updateUser.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.updateById(updateUser);
    }

    @Override
    public int updateUserStatus(SysUser user) {
        SysUser updateUser = new SysUser();
        updateUser.setUserId(user.getUserId());
        updateUser.setStatus(user.getStatus());
        return userMapper.updateById(updateUser);
    }

    @Override
    public boolean checkUserNameUnique(String userName) {
        return userMapper.checkUserNameUnique(userName) == 0;
    }

    private void insertUserRole(SysUser user) {
        if (user.getRoleIds() != null && user.getRoleIds().length > 0) {
            List<SysUserRole> list = new ArrayList<>();
            for (Long roleId : user.getRoleIds()) {
                SysUserRole ur = new SysUserRole();
                ur.setUserId(user.getUserId());
                ur.setRoleId(roleId);
                list.add(ur);
            }
            userRoleMapper.batchInsert(list);
        }
    }

    private void insertUserPost(SysUser user) {
        if (user.getPostIds() != null && user.getPostIds().length > 0) {
            List<SysUserPost> list = new ArrayList<>();
            for (Long postId : user.getPostIds()) {
                SysUserPost up = new SysUserPost();
                up.setUserId(user.getUserId());
                up.setPostId(postId);
                list.add(up);
            }
            userPostMapper.batchInsert(list);
        }
    }
}
