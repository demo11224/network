package com.admin.mapper;

import com.admin.domain.entity.SysLoginLog;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

public interface SysLoginLogMapper extends BaseMapper<SysLoginLog> {
    List<SysLoginLog> selectLoginLogList(SysLoginLog loginLog);
}
