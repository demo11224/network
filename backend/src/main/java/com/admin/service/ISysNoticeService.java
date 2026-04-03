package com.admin.service;

import com.admin.domain.entity.SysNotice;
import java.util.List;

public interface ISysNoticeService {
    List<SysNotice> selectNoticeList(SysNotice notice);
    SysNotice selectNoticeById(Long noticeId);
    int insertNotice(SysNotice notice);
    int updateNotice(SysNotice notice);
    int deleteNoticeByIds(Long[] noticeIds);
}
