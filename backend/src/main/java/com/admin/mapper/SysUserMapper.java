package com.admin.mapper;

import com.admin.domain.entity.SysUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysUserMapper extends BaseMapper<SysUser> {
    SysUser selectUserByUserName(@Param("userName") String userName);
    SysUser selectUserById(@Param("userId") Long userId);
    List<SysUser> selectUserList(SysUser user);
    int checkUserNameUnique(@Param("userName") String userName);
}
