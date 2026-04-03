package com.admin.service.impl;

import com.admin.domain.entity.SysConfig;
import com.admin.mapper.SysConfigMapper;
import com.admin.service.ISysConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SysConfigServiceImpl implements ISysConfigService {

    @Autowired
    private SysConfigMapper configMapper;

    @Override
    public List<SysConfig> selectConfigList(SysConfig config) {
        return configMapper.selectConfigList(config);
    }

    @Override
    public SysConfig selectConfigById(Long configId) {
        return configMapper.selectById(configId);
    }

    @Override
    public String selectConfigByKey(String configKey) {
        SysConfig config = configMapper.selectConfigByKey(configKey);
        return config != null ? config.getConfigValue() : "";
    }

    @Override
    public int insertConfig(SysConfig config) {
        return configMapper.insert(config);
    }

    @Override
    public int updateConfig(SysConfig config) {
        return configMapper.updateById(config);
    }

    @Override
    public int deleteConfigByIds(Long[] configIds) {
        return configMapper.deleteBatchIds(Arrays.asList(configIds));
    }
}
