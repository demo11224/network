package com.admin.security;

import com.admin.tenant.TenantContextHolder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * JWT认证过滤器
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        try {
            String token = jwtTokenUtil.getToken(request);
            if (StringUtils.isNotEmpty(token) && !jwtTokenUtil.isTokenExpired(token)) {
                Long userId = jwtTokenUtil.getUserId(token);
                Long tenantId = jwtTokenUtil.getTenantId(token);

                // 设置租户上下文
                if (tenantId != null) {
                    TenantContextHolder.setTenantId(tenantId);
                }

                if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    LoginUser loginUser = userDetailsService.loadUserById(userId);
                    if (loginUser != null) {
                        loginUser.setToken(token);
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(loginUser, null, loginUser.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
            chain.doFilter(request, response);
        } finally {
            TenantContextHolder.clear();
        }
    }
}
