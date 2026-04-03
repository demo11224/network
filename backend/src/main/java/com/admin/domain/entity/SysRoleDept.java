package com.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * 角色和部门关联表 sys_role_dept
 */
@Data
@TableName("sys_role_dept")
public class SysRoleDept implements Serializable {
    private Long roleId;
    private Long deptId;
}
