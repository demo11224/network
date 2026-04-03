package com.admin.mapper;

import com.admin.domain.entity.SysNotice;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

public interface SysNoticeMapper extends BaseMapper<SysNotice> {
    List<SysNotice> selectNoticeList(SysNotice notice);
}
