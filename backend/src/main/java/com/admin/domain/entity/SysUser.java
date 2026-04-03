package com.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.admin.common.core.domain.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

/**
 * 用户表 sys_user
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_user")
public class SysUser extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long userId;

    private Long tenantId;

    private Long deptId;

    @NotBlank(message = "用户账号不能为空")
    @Size(max = 30, message = "用户账号长度不能超过30个字符")
    private String userName;

    @Size(max = 30, message = "用户昵称长度不能超过30个字符")
    private String nickName;

    private String email;

    private String phonenumber;

    private String sex;

    private String avatar;

    @JsonIgnore
    private String password;

    private String status;

    private String loginIp;

    private Date loginDate;

    @TableField(exist = false)
    private SysDept dept;

    @TableField(exist = false)
    private List<SysRole> roles;

    @TableField(exist = false)
    private Long[] roleIds;

    @TableField(exist = false)
    private Long[] postIds;

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }
}
