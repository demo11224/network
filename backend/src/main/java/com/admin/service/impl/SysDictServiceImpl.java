package com.admin.service.impl;

import com.admin.domain.entity.SysDictType;
import com.admin.domain.entity.SysDictData;
import com.admin.mapper.SysDictTypeMapper;
import com.admin.mapper.SysDictDataMapper;
import com.admin.service.ISysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SysDictServiceImpl implements ISysDictService {

    @Autowired
    private SysDictTypeMapper dictTypeMapper;

    @Autowired
    private SysDictDataMapper dictDataMapper;

    @Override
    public List<SysDictType> selectDictTypeList(SysDictType dictType) {
        return dictTypeMapper.selectDictTypeList(dictType);
    }

    @Override
    public SysDictType selectDictTypeById(Long dictId) {
        return dictTypeMapper.selectById(dictId);
    }

    @Override
    public int insertDictType(SysDictType dictType) {
        return dictTypeMapper.insert(dictType);
    }

    @Override
    public int updateDictType(SysDictType dictType) {
        return dictTypeMapper.updateById(dictType);
    }

    @Override
    public int deleteDictTypeByIds(Long[] dictIds) {
        return dictTypeMapper.deleteBatchIds(Arrays.asList(dictIds));
    }

    @Override
    public List<SysDictData> selectDictDataList(SysDictData dictData) {
        return dictDataMapper.selectDictDataList(dictData);
    }

    @Override
    public List<SysDictData> selectDictDataByType(String dictType) {
        return dictDataMapper.selectDictDataByType(dictType);
    }

    @Override
    public SysDictData selectDictDataById(Long dictCode) {
        return dictDataMapper.selectById(dictCode);
    }

    @Override
    public int insertDictData(SysDictData dictData) {
        return dictDataMapper.insert(dictData);
    }

    @Override
    public int updateDictData(SysDictData dictData) {
        return dictDataMapper.updateById(dictData);
    }

    @Override
    public int deleteDictDataByIds(Long[] dictCodes) {
        return dictDataMapper.deleteBatchIds(Arrays.asList(dictCodes));
    }
}
