package com.admin.security;

import com.admin.domain.entity.SysUser;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

/**
 * 登录用户身份权限
 */
@Data
public class LoginUser implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long userId;
    private Long tenantId;
    private Long deptId;
    private String token;
    private SysUser user;
    private Set<String> permissions;

    public LoginUser() {
    }

    public LoginUser(SysUser user, Set<String> permissions) {
        this.userId = user.getUserId();
        this.tenantId = user.getTenantId();
        this.deptId = user.getDeptId();
        this.user = user;
        this.permissions = permissions;
    }

    @JsonIgnore
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUserName();
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }
}
