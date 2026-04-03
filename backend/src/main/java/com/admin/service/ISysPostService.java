package com.admin.service;

import com.admin.domain.entity.SysPost;
import java.util.List;

public interface ISysPostService {
    List<SysPost> selectPostList(SysPost post);
    SysPost selectPostById(Long postId);
    List<SysPost> selectPostAll();
    int insertPost(SysPost post);
    int updatePost(SysPost post);
    int deletePostByIds(Long[] postIds);
}
