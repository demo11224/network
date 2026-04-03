package com.admin.service;

import com.admin.domain.entity.SysConfig;
import java.util.List;

public interface ISysConfigService {
    List<SysConfig> selectConfigList(SysConfig config);
    SysConfig selectConfigById(Long configId);
    String selectConfigByKey(String configKey);
    int insertConfig(SysConfig config);
    int updateConfig(SysConfig config);
    int deleteConfigByIds(Long[] configIds);
}
