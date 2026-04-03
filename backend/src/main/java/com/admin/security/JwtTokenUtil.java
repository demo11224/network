package com.admin.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * JWT工具类
 */
@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.header}")
    private String header;

    @Value("${jwt.prefix}")
    private String prefix;

    private static final String CLAIM_KEY_USER_ID = "user_id";
    private static final String CLAIM_KEY_USERNAME = "username";
    private static final String CLAIM_KEY_TENANT_ID = "tenant_id";
    private static final String CLAIM_KEY_UUID = "uuid";

    /**
     * 生成令牌
     */
    public String generateToken(LoginUser loginUser) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(CLAIM_KEY_USER_ID, loginUser.getUserId());
        claims.put(CLAIM_KEY_USERNAME, loginUser.getUsername());
        claims.put(CLAIM_KEY_TENANT_ID, loginUser.getTenantId());
        claims.put(CLAIM_KEY_UUID, UUID.randomUUID().toString());
        return createToken(claims);
    }

    private String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * 从请求中获取token
     */
    public String getToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(header);
        if (StringUtils.isNotEmpty(bearerToken) && bearerToken.startsWith(prefix)) {
            return bearerToken.substring(prefix.length());
        }
        return null;
    }

    /**
     * 从令牌中获取用户ID
     */
    public Long getUserId(String token) {
        Claims claims = parseToken(token);
        return claims.get(CLAIM_KEY_USER_ID, Long.class);
    }

    /**
     * 从令牌中获取用户名
     */
    public String getUsername(String token) {
        Claims claims = parseToken(token);
        return claims.get(CLAIM_KEY_USERNAME, String.class);
    }

    /**
     * 从令牌中获取租户ID
     */
    public Long getTenantId(String token) {
        Claims claims = parseToken(token);
        return claims.get(CLAIM_KEY_TENANT_ID, Long.class);
    }

    /**
     * 解析令牌
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 验证令牌是否过期
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = parseToken(token);
            Date expirationDate = claims.getExpiration();
            return expirationDate.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
