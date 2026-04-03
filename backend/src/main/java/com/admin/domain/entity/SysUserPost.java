package com.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * 用户和岗位关联表 sys_user_post
 */
@Data
@TableName("sys_user_post")
public class SysUserPost implements Serializable {
    private Long userId;
    private Long postId;
}
