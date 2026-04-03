package com.admin.mapper;

import com.admin.domain.entity.SysUserPost;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysUserPostMapper extends BaseMapper<SysUserPost> {
    int batchInsert(@Param("list") List<SysUserPost> list);
    int deleteByUserId(@Param("userId") Long userId);
}
