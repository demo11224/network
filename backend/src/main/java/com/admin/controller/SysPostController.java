package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.common.core.page.TableDataInfo;
import com.admin.domain.entity.SysPost;
import com.admin.service.ISysPostService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 岗位管理
 */
@RestController
@RequestMapping("/system/post")
public class SysPostController {

    @Autowired
    private ISysPostService postService;

    @PreAuthorize("@perm.hasPermi('system:post:list')")
    @GetMapping("/list")
    public TableDataInfo<SysPost> list(SysPost post,
                                       @RequestParam(defaultValue = "1") int pageNum,
                                       @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysPost> list = postService.selectPostList(post);
        PageInfo<SysPost> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @PreAuthorize("@perm.hasPermi('system:post:query')")
    @GetMapping("/{postId}")
    public R<?> getInfo(@PathVariable Long postId) {
        return R.ok(postService.selectPostById(postId));
    }

    @PreAuthorize("@perm.hasPermi('system:post:add')")
    @PostMapping
    public R<?> add(@Validated @RequestBody SysPost post) {
        return R.ok(postService.insertPost(post));
    }

    @PreAuthorize("@perm.hasPermi('system:post:edit')")
    @PutMapping
    public R<?> edit(@Validated @RequestBody SysPost post) {
        return R.ok(postService.updatePost(post));
    }

    @PreAuthorize("@perm.hasPermi('system:post:remove')")
    @DeleteMapping("/{postIds}")
    public R<?> remove(@PathVariable Long[] postIds) {
        return R.ok(postService.deletePostByIds(postIds));
    }
}
