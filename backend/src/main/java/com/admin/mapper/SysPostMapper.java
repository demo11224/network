package com.admin.mapper;

import com.admin.domain.entity.SysPost;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysPostMapper extends BaseMapper<SysPost> {
    List<SysPost> selectPostList(SysPost post);
    List<Long> selectPostListByUserId(@Param("userId") Long userId);
    int checkPostCodeUnique(@Param("postCode") String postCode);
}
