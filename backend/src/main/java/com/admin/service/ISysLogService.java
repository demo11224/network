package com.admin.service;

import com.admin.domain.entity.SysOperLog;
import com.admin.domain.entity.SysLoginLog;
import java.util.List;

public interface ISysLogService {
    List<SysOperLog> selectOperLogList(SysOperLog operLog);
    int insertOperLog(SysOperLog operLog);
    int deleteOperLogByIds(Long[] operIds);
    void cleanOperLog();

    List<SysLoginLog> selectLoginLogList(SysLoginLog loginLog);
    int insertLoginLog(SysLoginLog loginLog);
    int deleteLoginLogByIds(Long[] infoIds);
    void cleanLoginLog();
}
