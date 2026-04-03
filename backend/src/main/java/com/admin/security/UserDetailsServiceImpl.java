package com.admin.security;

import com.admin.common.constant.Constants;
import com.admin.domain.entity.SysUser;
import com.admin.mapper.SysMenuMapper;
import com.admin.mapper.SysRoleMapper;
import com.admin.mapper.SysUserMapper;
import com.admin.tenant.TenantContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 用户验证处理
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private SysUserMapper userMapper;

    @Autowired
    private SysMenuMapper menuMapper;

    @Autowired
    private SysRoleMapper roleMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SysUser user = userMapper.selectUserByUserName(username);
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }
        if (Constants.DISABLE.equals(user.getStatus())) {
            throw new RuntimeException("用户已被停用: " + username);
        }
        return createLoginUser(user);
    }

    public LoginUser loadUserById(Long userId) {
        SysUser user = userMapper.selectUserById(userId);
        if (user == null) {
            return null;
        }
        return createLoginUser(user);
    }

    private LoginUser createLoginUser(SysUser user) {
        Set<String> permissions = getMenuPermission(user);
        return new LoginUser(user, permissions);
    }

    /**
     * 获取菜单权限
     */
    private Set<String> getMenuPermission(SysUser user) {
        Set<String> perms = new HashSet<>();
        if (user.getUserId().equals(Constants.SUPER_ADMIN_ID)) {
            perms.add(Constants.ALL_PERMISSION);
        } else {
            List<String> permsList = menuMapper.selectMenuPermsByUserId(user.getUserId());
            for (String perm : permsList) {
                if (perm != null && !perm.trim().isEmpty()) {
                    perms.add(perm.trim());
                }
            }
        }
        return perms;
    }
}
