package com.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.admin.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

/**
 * 菜单权限表 sys_menu
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_menu")
public class SysMenu extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long menuId;

    @NotBlank(message = "菜单名称不能为空")
    @Size(max = 50, message = "菜单名称长度不能超过50个字符")
    private String menuName;

    private Long parentId;

    private Integer orderNum;

    @Size(max = 200, message = "路由地址不能超过200个字符")
    private String path;

    @Size(max = 255, message = "组件路径不能超过255个字符")
    private String component;

    private String queryParam;

    private Integer isFrame;

    private Integer isCache;

    /** 菜单类型（M目录 C菜单 F按钮） */
    @NotBlank(message = "菜单类型不能为空")
    private String menuType;

    private String visible;

    private String status;

    @Size(max = 100, message = "权限标识长度不能超过100个字符")
    private String perms;

    private String icon;

    @TableField(exist = false)
    private List<SysMenu> children = new ArrayList<>();
}
