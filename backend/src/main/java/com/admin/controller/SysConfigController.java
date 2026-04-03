package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.common.core.page.TableDataInfo;
import com.admin.domain.entity.SysConfig;
import com.admin.service.ISysConfigService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 参数配置
 */
@RestController
@RequestMapping("/system/config")
public class SysConfigController {

    @Autowired
    private ISysConfigService configService;

    @PreAuthorize("@perm.hasPermi('system:config:list')")
    @GetMapping("/list")
    public TableDataInfo<SysConfig> list(SysConfig config,
                                          @RequestParam(defaultValue = "1") int pageNum,
                                          @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysConfig> list = configService.selectConfigList(config);
        PageInfo<SysConfig> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @PreAuthorize("@perm.hasPermi('system:config:query')")
    @GetMapping("/{configId}")
    public R<?> getInfo(@PathVariable Long configId) {
        return R.ok(configService.selectConfigById(configId));
    }

    @GetMapping("/configKey/{configKey}")
    public R<?> getConfigKey(@PathVariable String configKey) {
        return R.ok(configService.selectConfigByKey(configKey));
    }

    @PreAuthorize("@perm.hasPermi('system:config:add')")
    @PostMapping
    public R<?> add(@Validated @RequestBody SysConfig config) {
        return R.ok(configService.insertConfig(config));
    }

    @PreAuthorize("@perm.hasPermi('system:config:edit')")
    @PutMapping
    public R<?> edit(@Validated @RequestBody SysConfig config) {
        return R.ok(configService.updateConfig(config));
    }

    @PreAuthorize("@perm.hasPermi('system:config:remove')")
    @DeleteMapping("/{configIds}")
    public R<?> remove(@PathVariable Long[] configIds) {
        return R.ok(configService.deleteConfigByIds(configIds));
    }
}
