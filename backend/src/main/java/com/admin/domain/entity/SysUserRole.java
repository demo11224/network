package com.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * 用户和角色关联表 sys_user_role
 */
@Data
@TableName("sys_user_role")
public class SysUserRole implements Serializable {
    private Long userId;
    private Long roleId;
}
