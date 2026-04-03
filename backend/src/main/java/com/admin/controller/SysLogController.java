package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.common.core.page.TableDataInfo;
import com.admin.domain.entity.SysOperLog;
import com.admin.domain.entity.SysLoginLog;
import com.admin.service.ISysLogService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 日志管理
 */
@RestController
@RequestMapping("/system/log")
public class SysLogController {

    @Autowired
    private ISysLogService logService;

    // ========== 操作日志 ==========

    @PreAuthorize("@perm.hasPermi('system:operlog:list')")
    @GetMapping("/oper/list")
    public TableDataInfo<SysOperLog> operList(SysOperLog operLog,
                                               @RequestParam(defaultValue = "1") int pageNum,
                                               @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysOperLog> list = logService.selectOperLogList(operLog);
        PageInfo<SysOperLog> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @PreAuthorize("@perm.hasPermi('system:operlog:remove')")
    @DeleteMapping("/oper/{operIds}")
    public R<?> removeOper(@PathVariable Long[] operIds) {
        return R.ok(logService.deleteOperLogByIds(operIds));
    }

    @PreAuthorize("@perm.hasPermi('system:operlog:remove')")
    @DeleteMapping("/oper/clean")
    public R<?> cleanOper() {
        logService.cleanOperLog();
        return R.ok();
    }

    // ========== 登录日志 ==========

    @PreAuthorize("@perm.hasPermi('system:loginlog:list')")
    @GetMapping("/login/list")
    public TableDataInfo<SysLoginLog> loginList(SysLoginLog loginLog,
                                                 @RequestParam(defaultValue = "1") int pageNum,
                                                 @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysLoginLog> list = logService.selectLoginLogList(loginLog);
        PageInfo<SysLoginLog> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @PreAuthorize("@perm.hasPermi('system:loginlog:remove')")
    @DeleteMapping("/login/{infoIds}")
    public R<?> removeLogin(@PathVariable Long[] infoIds) {
        return R.ok(logService.deleteLoginLogByIds(infoIds));
    }

    @PreAuthorize("@perm.hasPermi('system:loginlog:remove')")
    @DeleteMapping("/login/clean")
    public R<?> cleanLogin() {
        logService.cleanLoginLog();
        return R.ok();
    }
}
