package com.admin.security;

import com.admin.common.constant.Constants;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.Set;

/**
 * 自定义权限校验
 */
@Component("perm")
public class PermissionService {

    /**
     * 验证用户是否具备某权限
     */
    public boolean hasPermi(String permission) {
        if (permission == null || permission.isEmpty()) {
            return false;
        }
        LoginUser loginUser = getLoginUser();
        if (loginUser == null || CollectionUtils.isEmpty(loginUser.getPermissions())) {
            return false;
        }
        Set<String> permissions = loginUser.getPermissions();
        return permissions.contains(Constants.ALL_PERMISSION) || permissions.contains(permission);
    }

    /**
     * 验证用户是否具有以下任意一个权限
     */
    public boolean hasAnyPermi(String permissions) {
        if (permissions == null || permissions.isEmpty()) {
            return false;
        }
        LoginUser loginUser = getLoginUser();
        if (loginUser == null || CollectionUtils.isEmpty(loginUser.getPermissions())) {
            return false;
        }
        Set<String> userPerms = loginUser.getPermissions();
        if (userPerms.contains(Constants.ALL_PERMISSION)) {
            return true;
        }
        for (String perm : permissions.split(",")) {
            if (userPerms.contains(perm.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断用户是否为管理员
     */
    public boolean isAdmin() {
        LoginUser loginUser = getLoginUser();
        return loginUser != null && loginUser.getUserId().equals(Constants.SUPER_ADMIN_ID);
    }

    private LoginUser getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof LoginUser) {
            return (LoginUser) authentication.getPrincipal();
        }
        return null;
    }
}
