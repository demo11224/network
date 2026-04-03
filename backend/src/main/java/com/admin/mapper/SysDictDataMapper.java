package com.admin.mapper;

import com.admin.domain.entity.SysDictData;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysDictDataMapper extends BaseMapper<SysDictData> {
    List<SysDictData> selectDictDataList(SysDictData dictData);
    List<SysDictData> selectDictDataByType(@Param("dictType") String dictType);
}
