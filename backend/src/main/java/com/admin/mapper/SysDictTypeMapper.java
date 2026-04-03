package com.admin.mapper;

import com.admin.domain.entity.SysDictType;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

public interface SysDictTypeMapper extends BaseMapper<SysDictType> {
    List<SysDictType> selectDictTypeList(SysDictType dictType);
}
