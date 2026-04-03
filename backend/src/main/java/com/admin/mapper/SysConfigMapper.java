package com.admin.mapper;

import com.admin.domain.entity.SysConfig;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysConfigMapper extends BaseMapper<SysConfig> {
    List<SysConfig> selectConfigList(SysConfig config);
    SysConfig selectConfigByKey(@Param("configKey") String configKey);
    int checkConfigKeyUnique(@Param("configKey") String configKey);
}
