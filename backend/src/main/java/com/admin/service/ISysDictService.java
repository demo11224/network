package com.admin.service;

import com.admin.domain.entity.SysDictType;
import com.admin.domain.entity.SysDictData;
import java.util.List;

public interface ISysDictService {
    List<SysDictType> selectDictTypeList(SysDictType dictType);
    SysDictType selectDictTypeById(Long dictId);
    int insertDictType(SysDictType dictType);
    int updateDictType(SysDictType dictType);
    int deleteDictTypeByIds(Long[] dictIds);

    List<SysDictData> selectDictDataList(SysDictData dictData);
    List<SysDictData> selectDictDataByType(String dictType);
    SysDictData selectDictDataById(Long dictCode);
    int insertDictData(SysDictData dictData);
    int updateDictData(SysDictData dictData);
    int deleteDictDataByIds(Long[] dictCodes);
}
