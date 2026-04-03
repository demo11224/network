package com.admin.common.annotation;

import java.lang.annotation.*;

/**
 * 权限注解 - 用于方法级别的权限校验
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequiresPermission {
    /**
     * 权限字符串
     */
    String value() default "";
}
