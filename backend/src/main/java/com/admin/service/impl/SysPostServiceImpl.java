package com.admin.service.impl;

import com.admin.domain.entity.SysPost;
import com.admin.mapper.SysPostMapper;
import com.admin.service.ISysPostService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SysPostServiceImpl implements ISysPostService {

    @Autowired
    private SysPostMapper postMapper;

    @Override
    public List<SysPost> selectPostList(SysPost post) {
        return postMapper.selectPostList(post);
    }

    @Override
    public SysPost selectPostById(Long postId) {
        return postMapper.selectById(postId);
    }

    @Override
    public List<SysPost> selectPostAll() {
        return postMapper.selectList(new LambdaQueryWrapper<SysPost>().eq(SysPost::getStatus, "0").eq(SysPost::getDelFlag, 0).orderByAsc(SysPost::getPostSort));
    }

    @Override
    public int insertPost(SysPost post) {
        return postMapper.insert(post);
    }

    @Override
    public int updatePost(SysPost post) {
        return postMapper.updateById(post);
    }

    @Override
    public int deletePostByIds(Long[] postIds) {
        return postMapper.deleteBatchIds(Arrays.asList(postIds));
    }
}
