package com.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.admin.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 租户表 sys_tenant
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_tenant")
public class SysTenant extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long tenantId;
    private String tenantName;
    private String contactName;
    private String contactPhone;
    private String status;
    private String domain;
    private Long packageId;
    private Integer accountCount;
    private String expireTime;
}
