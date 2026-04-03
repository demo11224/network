package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.domain.entity.SysMenu;
import com.admin.domain.entity.SysUser;
import com.admin.security.JwtTokenUtil;
import com.admin.security.LoginUser;
import com.admin.service.ISysMenuService;
import com.admin.service.ISysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ISysMenuService menuService;

    @Autowired
    private ISysRoleService roleService;

    /**
     * 登录
     */
    @PostMapping("/login")
    public R<?> login(@RequestBody Map<String, String> loginBody) {
        String username = loginBody.get("username");
        String password = loginBody.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(loginUser);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        return R.ok(result);
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/getInfo")
    public R<?> getInfo(Authentication authentication) {
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        SysUser user = loginUser.getUser();

        Set<String> roles = roleService.selectRolePermsByUserId(user.getUserId());
        Set<String> permissions = loginUser.getPermissions();

        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("roles", roles);
        result.put("permissions", permissions);
        return R.ok(result);
    }

    /**
     * 获取路由信息
     */
    @GetMapping("/getRouters")
    public R<?> getRouters(Authentication authentication) {
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        List<SysMenu> menus = menuService.selectMenuTreeByUserId(loginUser.getUserId());
        return R.ok(menuService.buildRouterMenus(menus));
    }

    /**
     * 登出
     */
    @PostMapping("/logout")
    public R<?> logout() {
        return R.ok("退出成功");
    }
}
