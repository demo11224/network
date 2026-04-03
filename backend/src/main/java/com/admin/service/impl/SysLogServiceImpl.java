package com.admin.service.impl;

import com.admin.domain.entity.SysOperLog;
import com.admin.domain.entity.SysLoginLog;
import com.admin.mapper.SysOperLogMapper;
import com.admin.mapper.SysLoginLogMapper;
import com.admin.service.ISysLogService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SysLogServiceImpl implements ISysLogService {

    @Autowired
    private SysOperLogMapper operLogMapper;

    @Autowired
    private SysLoginLogMapper loginLogMapper;

    @Override
    public List<SysOperLog> selectOperLogList(SysOperLog operLog) {
        return operLogMapper.selectOperLogList(operLog);
    }

    @Override
    public int insertOperLog(SysOperLog operLog) {
        return operLogMapper.insert(operLog);
    }

    @Override
    public int deleteOperLogByIds(Long[] operIds) {
        return operLogMapper.deleteBatchIds(Arrays.asList(operIds));
    }

    @Override
    public void cleanOperLog() {
        operLogMapper.delete(new LambdaQueryWrapper<>());
    }

    @Override
    public List<SysLoginLog> selectLoginLogList(SysLoginLog loginLog) {
        return loginLogMapper.selectLoginLogList(loginLog);
    }

    @Override
    public int insertLoginLog(SysLoginLog loginLog) {
        return loginLogMapper.insert(loginLog);
    }

    @Override
    public int deleteLoginLogByIds(Long[] infoIds) {
        return loginLogMapper.deleteBatchIds(Arrays.asList(infoIds));
    }

    @Override
    public void cleanLoginLog() {
        loginLogMapper.delete(new LambdaQueryWrapper<>());
    }
}
