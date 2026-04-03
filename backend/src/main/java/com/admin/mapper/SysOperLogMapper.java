package com.admin.mapper;

import com.admin.domain.entity.SysOperLog;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

public interface SysOperLogMapper extends BaseMapper<SysOperLog> {
    List<SysOperLog> selectOperLogList(SysOperLog operLog);
}
