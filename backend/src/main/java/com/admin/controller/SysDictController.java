package com.admin.controller;

import com.admin.common.core.domain.R;
import com.admin.common.core.page.TableDataInfo;
import com.admin.domain.entity.SysDictType;
import com.admin.domain.entity.SysDictData;
import com.admin.service.ISysDictService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 字典管理
 */
@RestController
@RequestMapping("/system/dict")
public class SysDictController {

    @Autowired
    private ISysDictService dictService;

    // ========== 字典类型 ==========

    @PreAuthorize("@perm.hasPermi('system:dict:list')")
    @GetMapping("/type/list")
    public TableDataInfo<SysDictType> typeList(SysDictType dictType,
                                                @RequestParam(defaultValue = "1") int pageNum,
                                                @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysDictType> list = dictService.selectDictTypeList(dictType);
        PageInfo<SysDictType> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @PreAuthorize("@perm.hasPermi('system:dict:query')")
    @GetMapping("/type/{dictId}")
    public R<?> getType(@PathVariable Long dictId) {
        return R.ok(dictService.selectDictTypeById(dictId));
    }

    @PreAuthorize("@perm.hasPermi('system:dict:add')")
    @PostMapping("/type")
    public R<?> addType(@Validated @RequestBody SysDictType dict) {
        return R.ok(dictService.insertDictType(dict));
    }

    @PreAuthorize("@perm.hasPermi('system:dict:edit')")
    @PutMapping("/type")
    public R<?> editType(@Validated @RequestBody SysDictType dict) {
        return R.ok(dictService.updateDictType(dict));
    }

    @PreAuthorize("@perm.hasPermi('system:dict:remove')")
    @DeleteMapping("/type/{dictIds}")
    public R<?> removeType(@PathVariable Long[] dictIds) {
        return R.ok(dictService.deleteDictTypeByIds(dictIds));
    }

    // ========== 字典数据 ==========

    @PreAuthorize("@perm.hasPermi('system:dict:list')")
    @GetMapping("/data/list")
    public TableDataInfo<SysDictData> dataList(SysDictData dictData,
                                                @RequestParam(defaultValue = "1") int pageNum,
                                                @RequestParam(defaultValue = "10") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SysDictData> list = dictService.selectDictDataList(dictData);
        PageInfo<SysDictData> pageInfo = new PageInfo<>(list);
        return new TableDataInfo<>(list, pageInfo.getTotal());
    }

    @GetMapping("/data/type/{dictType}")
    public R<?> dictType(@PathVariable String dictType) {
        return R.ok(dictService.selectDictDataByType(dictType));
    }

    @PreAuthorize("@perm.hasPermi('system:dict:query')")
    @GetMapping("/data/{dictCode}")
    public R<?> getData(@PathVariable Long dictCode) {
        return R.ok(dictService.selectDictDataById(dictCode));
    }

    @PreAuthorize("@perm.hasPermi('system:dict:add')")
    @PostMapping("/data")
    public R<?> addData(@Validated @RequestBody SysDictData dict) {
        return R.ok(dictService.insertDictData(dict));
    }

    @PreAuthorize("@perm.hasPermi('system:dict:edit')")
    @PutMapping("/data")
    public R<?> editData(@Validated @RequestBody SysDictData dict) {
        return R.ok(dictService.updateDictData(dict));
    }

    @PreAuthorize("@perm.hasPermi('system:dict:remove')")
    @DeleteMapping("/data/{dictCodes}")
    public R<?> removeData(@PathVariable Long[] dictCodes) {
        return R.ok(dictService.deleteDictDataByIds(dictCodes));
    }
}
