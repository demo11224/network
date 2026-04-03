package com.admin.mapper;

import com.admin.domain.entity.SysTenant;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

public interface SysTenantMapper extends BaseMapper<SysTenant> {
    List<SysTenant> selectTenantList(SysTenant tenant);
}
