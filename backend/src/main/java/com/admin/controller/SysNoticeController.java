package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.common.core.page.TableDataInfo;
import com.admin.domain.entity.SysNotice;
import com.admin.service.ISysNoticeService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 通知公告
 */
@RestController
@RequestMapping("/system/notice")
public class SysNoticeController {

    @Autowired
    private ISysNoticeService noticeService;

    @PreAuthorize("@perm.hasPermi('system:notice:list')")
    @GetMapping("/list")
    public TableDataInfo<SysNotice> list(SysNotice notice,
                                          @RequestParam(defaultValue = "1") int pageNum,
                                          @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysNotice> list = noticeService.selectNoticeList(notice);
        PageInfo<SysNotice> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @PreAuthorize("@perm.hasPermi('system:notice:query')")
    @GetMapping("/{noticeId}")
    public R<?> getInfo(@PathVariable Long noticeId) {
        return R.ok(noticeService.selectNoticeById(noticeId));
    }

    @PreAuthorize("@perm.hasPermi('system:notice:add')")
    @PostMapping
    public R<?> add(@Validated @RequestBody SysNotice notice) {
        return R.ok(noticeService.insertNotice(notice));
    }

    @PreAuthorize("@perm.hasPermi('system:notice:edit')")
    @PutMapping
    public R<?> edit(@Validated @RequestBody SysNotice notice) {
        return R.ok(noticeService.updateNotice(notice));
    }

    @PreAuthorize("@perm.hasPermi('system:notice:remove')")
    @DeleteMapping("/{noticeIds}")
    public R<?> remove(@PathVariable Long[] noticeIds) {
        return R.ok(noticeService.deleteNoticeByIds(noticeIds));
    }
}
