package com.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * 角色和菜单关联表 sys_role_menu
 */
@Data
@TableName("sys_role_menu")
public class SysRoleMenu implements Serializable {
    private Long roleId;
    private Long menuId;
}
