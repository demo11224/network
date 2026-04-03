package com.admin.service;

import com.admin.domain.entity.SysUser;
import java.util.List;

public interface ISysUserService {
    SysUser selectUserByUserName(String userName);
    SysUser selectUserById(Long userId);
    List<SysUser> selectUserList(SysUser user);
    int insertUser(SysUser user);
    int updateUser(SysUser user);
    int deleteUserByIds(Long[] userIds);
    int resetPwd(SysUser user);
    int updateUserStatus(SysUser user);
    boolean checkUserNameUnique(String userName);
}
