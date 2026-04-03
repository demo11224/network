-- ==========================================
-- 后台管理系统 数据库初始化脚本
-- ==========================================

CREATE DATABASE IF NOT EXISTS `admin_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `admin_system`;

-- ----------------------------
-- 1. 租户表
-- ----------------------------
DROP TABLE IF EXISTS sys_tenant;
CREATE TABLE sys_tenant (
  tenant_id     BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '租户ID',
  tenant_name   VARCHAR(50)  NOT NULL                COMMENT '租户名称',
  contact_name  VARCHAR(50)  DEFAULT NULL             COMMENT '联系人',
  contact_phone VARCHAR(20)  DEFAULT NULL             COMMENT '联系电话',
  status        CHAR(1)      DEFAULT '0'              COMMENT '状态（0正常 1停用）',
  domain        VARCHAR(200) DEFAULT NULL             COMMENT '绑定域名',
  package_id    BIGINT(20)   DEFAULT NULL             COMMENT '套餐ID',
  account_count INT          DEFAULT -1               COMMENT '账号数量（-1不限制）',
  expire_time   VARCHAR(30)  DEFAULT NULL             COMMENT '过期时间',
  del_flag      INT          DEFAULT 0                COMMENT '删除标志（0存在 1删除）',
  create_by     VARCHAR(64)  DEFAULT ''               COMMENT '创建者',
  create_time   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by     VARCHAR(64)  DEFAULT ''               COMMENT '更新者',
  update_time   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark        VARCHAR(500) DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (tenant_id)
) ENGINE=InnoDB AUTO_INCREMENT=2 COMMENT = '租户表';

INSERT INTO sys_tenant VALUES(1, '默认租户', '管理员', '15888888888', '0', NULL, NULL, -1, NULL, 0, 'admin', NOW(), '', NOW(), '默认租户');

-- ----------------------------
-- 2. 部门表
-- ----------------------------
DROP TABLE IF EXISTS sys_dept;
CREATE TABLE sys_dept (
  dept_id    BIGINT(20)  NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  tenant_id  BIGINT(20)  DEFAULT 1               COMMENT '租户ID',
  parent_id  BIGINT(20)  DEFAULT 0               COMMENT '父部门ID',
  ancestors  VARCHAR(500) DEFAULT ''              COMMENT '祖级列表',
  dept_name  VARCHAR(30) NOT NULL                 COMMENT '部门名称',
  order_num  INT         DEFAULT 0                COMMENT '显示顺序',
  leader     VARCHAR(20) DEFAULT NULL             COMMENT '负责人',
  phone      VARCHAR(11) DEFAULT NULL             COMMENT '联系电话',
  email      VARCHAR(50) DEFAULT NULL             COMMENT '邮箱',
  status     CHAR(1)     DEFAULT '0'              COMMENT '状态（0正常 1停用）',
  del_flag   INT         DEFAULT 0                COMMENT '删除标志',
  create_by  VARCHAR(64) DEFAULT ''               COMMENT '创建者',
  create_time DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by  VARCHAR(64) DEFAULT ''               COMMENT '更新者',
  update_time DATETIME   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (dept_id)
) ENGINE=InnoDB AUTO_INCREMENT=200 COMMENT = '部门表';

INSERT INTO sys_dept VALUES(100, 1, 0,   '0',     '总公司', 0, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(101, 1, 100, '0,100', '深圳总公司', 1, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(102, 1, 100, '0,100', '长沙分公司', 2, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(103, 1, 101, '0,100,101', '研发部门', 1, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(104, 1, 101, '0,100,101', '市场部门', 2, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(105, 1, 101, '0,100,101', '测试部门', 3, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(106, 1, 101, '0,100,101', '财务部门', 4, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(107, 1, 101, '0,100,101', '运维部门', 5, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(108, 1, 102, '0,100,102', '市场部门', 1, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());
INSERT INTO sys_dept VALUES(109, 1, 102, '0,100,102', '财务部门', 2, '管理员', '15888888888', 'admin@example.com', '0', 0, 'admin', NOW(), '', NOW());

-- ----------------------------
-- 3. 用户表
-- ----------------------------
DROP TABLE IF EXISTS sys_user;
CREATE TABLE sys_user (
  user_id     BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  tenant_id   BIGINT(20)   DEFAULT 1               COMMENT '租户ID',
  dept_id     BIGINT(20)   DEFAULT NULL             COMMENT '部门ID',
  user_name   VARCHAR(30)  NOT NULL                 COMMENT '用户账号',
  nick_name   VARCHAR(30)  NOT NULL                 COMMENT '用户昵称',
  email       VARCHAR(50)  DEFAULT ''               COMMENT '邮箱',
  phonenumber VARCHAR(11)  DEFAULT ''               COMMENT '手机号码',
  sex         CHAR(1)      DEFAULT '0'              COMMENT '性别（0男 1女 2未知）',
  avatar      VARCHAR(100) DEFAULT ''               COMMENT '头像地址',
  password    VARCHAR(100) NOT NULL                  COMMENT '密码',
  status      CHAR(1)      DEFAULT '0'              COMMENT '状态（0正常 1停用）',
  del_flag    INT          DEFAULT 0                COMMENT '删除标志',
  login_ip    VARCHAR(128) DEFAULT ''               COMMENT '最后登录IP',
  login_date  DATETIME     DEFAULT NULL             COMMENT '最后登录时间',
  create_by   VARCHAR(64)  DEFAULT ''               COMMENT '创建者',
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by   VARCHAR(64)  DEFAULT ''               COMMENT '更新者',
  update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark      VARCHAR(500) DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (user_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT = '用户信息表';

-- 默认密码: admin123 (BCrypt加密)
INSERT INTO sys_user VALUES(1, 1, 103, 'admin', '超级管理员', 'admin@example.com', '15888888888', '0', '', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', 0, '127.0.0.1', NOW(), 'admin', NOW(), '', NOW(), '管理员');
INSERT INTO sys_user VALUES(2, 1, 105, 'test',  '测试用户',   'test@example.com',  '15666666666', '0', '', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', 0, '127.0.0.1', NOW(), 'admin', NOW(), '', NOW(), '测试员');

-- ----------------------------
-- 4. 岗位表
-- ----------------------------
DROP TABLE IF EXISTS sys_post;
CREATE TABLE sys_post (
  post_id    BIGINT(20)  NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  tenant_id  BIGINT(20)  DEFAULT 1               COMMENT '租户ID',
  post_code  VARCHAR(64) NOT NULL                 COMMENT '岗位编码',
  post_name  VARCHAR(50) NOT NULL                 COMMENT '岗位名称',
  post_sort  INT         NOT NULL                 COMMENT '显示顺序',
  status     CHAR(1)     NOT NULL                 COMMENT '状态（0正常 1停用）',
  del_flag   INT         DEFAULT 0                COMMENT '删除标志',
  create_by  VARCHAR(64) DEFAULT ''               COMMENT '创建者',
  create_time DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by  VARCHAR(64) DEFAULT ''               COMMENT '更新者',
  update_time DATETIME   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark     VARCHAR(500) DEFAULT NULL            COMMENT '备注',
  PRIMARY KEY (post_id)
) ENGINE=InnoDB AUTO_INCREMENT=10 COMMENT = '岗位信息表';

INSERT INTO sys_post VALUES(1, 1, 'ceo',  '董事长',    1, '0', 0, 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_post VALUES(2, 1, 'se',   '项目经理',  2, '0', 0, 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_post VALUES(3, 1, 'hr',   '人力资源',  3, '0', 0, 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_post VALUES(4, 1, 'user', '普通员工',  4, '0', 0, 'admin', NOW(), '', NOW(), '');

-- ----------------------------
-- 5. 角色表
-- ----------------------------
DROP TABLE IF EXISTS sys_role;
CREATE TABLE sys_role (
  role_id    BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  tenant_id  BIGINT(20)   DEFAULT 1               COMMENT '租户ID',
  role_name  VARCHAR(30)  NOT NULL                 COMMENT '角色名称',
  role_key   VARCHAR(100) NOT NULL                 COMMENT '角色权限字符串',
  role_sort  INT          NOT NULL                 COMMENT '显示顺序',
  data_scope CHAR(1)      DEFAULT '1'              COMMENT '数据范围',
  status     CHAR(1)      NOT NULL                 COMMENT '状态（0正常 1停用）',
  del_flag   INT          DEFAULT 0                COMMENT '删除标志',
  create_by  VARCHAR(64)  DEFAULT ''               COMMENT '创建者',
  create_time DATETIME    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by  VARCHAR(64)  DEFAULT ''               COMMENT '更新者',
  update_time DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark     VARCHAR(500) DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (role_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT = '角色信息表';

INSERT INTO sys_role VALUES(1, 1, '超级管理员', 'admin',  1, '1', '0', 0, 'admin', NOW(), '', NOW(), '超级管理员');
INSERT INTO sys_role VALUES(2, 1, '普通角色',   'common', 2, '2', '0', 0, 'admin', NOW(), '', NOW(), '普通角色');

-- ----------------------------
-- 6. 菜单权限表
-- ----------------------------
DROP TABLE IF EXISTS sys_menu;
CREATE TABLE sys_menu (
  menu_id     BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  menu_name   VARCHAR(50)  NOT NULL                 COMMENT '菜单名称',
  parent_id   BIGINT(20)   DEFAULT 0                COMMENT '父菜单ID',
  order_num   INT          DEFAULT 0                COMMENT '显示顺序',
  path        VARCHAR(200) DEFAULT ''               COMMENT '路由地址',
  component   VARCHAR(255) DEFAULT NULL             COMMENT '组件路径',
  query_param VARCHAR(255) DEFAULT NULL             COMMENT '路由参数',
  is_frame    INT          DEFAULT 1                COMMENT '是否为外链（0是 1否）',
  is_cache    INT          DEFAULT 0                COMMENT '是否缓存（0缓存 1不缓存）',
  menu_type   CHAR(1)      DEFAULT ''               COMMENT '菜单类型（M目录 C菜单 F按钮）',
  visible     CHAR(1)      DEFAULT '0'              COMMENT '菜单状态（0显示 1隐藏）',
  status      CHAR(1)      DEFAULT '0'              COMMENT '菜单状态（0正常 1停用）',
  perms       VARCHAR(100) DEFAULT NULL             COMMENT '权限标识',
  icon        VARCHAR(100) DEFAULT '#'              COMMENT '菜单图标',
  create_by   VARCHAR(64)  DEFAULT ''               COMMENT '创建者',
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by   VARCHAR(64)  DEFAULT ''               COMMENT '更新者',
  update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark      VARCHAR(500) DEFAULT ''               COMMENT '备注',
  PRIMARY KEY (menu_id)
) ENGINE=InnoDB AUTO_INCREMENT=2000 COMMENT = '菜单权限表';

-- 一级菜单
INSERT INTO sys_menu VALUES(1, '系统管理', 0, 1, 'system',    NULL, '', 1, 0, 'M', '0', '0', '', 'system',   'admin', NOW(), '', NOW(), '系统管理目录');

-- 二级菜单 - 系统管理
INSERT INTO sys_menu VALUES(100, '用户管理', 1, 1,  'user',    'system/user/index',    '', 1, 0, 'C', '0', '0', 'system:user:list',    'user',     'admin', NOW(), '', NOW(), '用户管理菜单');
INSERT INTO sys_menu VALUES(101, '角色管理', 1, 2,  'role',    'system/role/index',    '', 1, 0, 'C', '0', '0', 'system:role:list',    'peoples',  'admin', NOW(), '', NOW(), '角色管理菜单');
INSERT INTO sys_menu VALUES(102, '菜单管理', 1, 3,  'menu',    'system/menu/index',    '', 1, 0, 'C', '0', '0', 'system:menu:list',    'tree-table', 'admin', NOW(), '', NOW(), '菜单管理菜单');
INSERT INTO sys_menu VALUES(103, '部门管理', 1, 4,  'dept',    'system/dept/index',    '', 1, 0, 'C', '0', '0', 'system:dept:list',    'tree',     'admin', NOW(), '', NOW(), '部门管理菜单');
INSERT INTO sys_menu VALUES(104, '岗位管理', 1, 5,  'post',    'system/post/index',    '', 1, 0, 'C', '0', '0', 'system:post:list',    'post',     'admin', NOW(), '', NOW(), '岗位管理菜单');
INSERT INTO sys_menu VALUES(105, '字典管理', 1, 6,  'dict',    'system/dict/index',    '', 1, 0, 'C', '0', '0', 'system:dict:list',    'dict',     'admin', NOW(), '', NOW(), '字典管理菜单');
INSERT INTO sys_menu VALUES(106, '参数设置', 1, 7,  'config',  'system/config/index',  '', 1, 0, 'C', '0', '0', 'system:config:list',  'edit',     'admin', NOW(), '', NOW(), '参数设置菜单');
INSERT INTO sys_menu VALUES(107, '通知公告', 1, 8,  'notice',  'system/notice/index',  '', 1, 0, 'C', '0', '0', 'system:notice:list',  'message',  'admin', NOW(), '', NOW(), '通知公告菜单');
INSERT INTO sys_menu VALUES(108, '日志管理', 1, 9,  'log',     '',                     '', 1, 0, 'M', '0', '0', '',                    'log',      'admin', NOW(), '', NOW(), '日志管理菜单');

-- 三级菜单 - 日志管理
INSERT INTO sys_menu VALUES(500, '操作日志', 108, 1, 'operlog',  'system/log/operlog',  '', 1, 0, 'C', '0', '0', 'system:operlog:list',  'form',  'admin', NOW(), '', NOW(), '操作日志菜单');
INSERT INTO sys_menu VALUES(501, '登录日志', 108, 2, 'loginlog', 'system/log/loginlog', '', 1, 0, 'C', '0', '0', 'system:loginlog:list', 'logininfor', 'admin', NOW(), '', NOW(), '登录日志菜单');

-- 用户管理按钮
INSERT INTO sys_menu VALUES(1000, '用户查询', 100, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:user:query',    '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1001, '用户新增', 100, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:user:add',      '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1002, '用户修改', 100, 3, '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit',     '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1003, '用户删除', 100, 4, '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1004, '用户导出', 100, 5, '', '', '', 1, 0, 'F', '0', '0', 'system:user:export',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1005, '用户导入', 100, 6, '', '', '', 1, 0, 'F', '0', '0', 'system:user:import',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1006, '重置密码', 100, 7, '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd', '#', 'admin', NOW(), '', NOW(), '');

-- 角色管理按钮
INSERT INTO sys_menu VALUES(1007, '角色查询', 101, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:role:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1008, '角色新增', 101, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:role:add',    '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1009, '角色修改', 101, 3, '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1010, '角色删除', 101, 4, '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove', '#', 'admin', NOW(), '', NOW(), '');

-- 菜单管理按钮
INSERT INTO sys_menu VALUES(1011, '菜单查询', 102, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:menu:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1012, '菜单新增', 102, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add',    '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1013, '菜单修改', 102, 3, '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1014, '菜单删除', 102, 4, '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove', '#', 'admin', NOW(), '', NOW(), '');

-- 部门管理按钮
INSERT INTO sys_menu VALUES(1015, '部门查询', 103, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1016, '部门新增', 103, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add',    '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1017, '部门修改', 103, 3, '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1018, '部门删除', 103, 4, '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove', '#', 'admin', NOW(), '', NOW(), '');

-- 岗位管理按钮
INSERT INTO sys_menu VALUES(1019, '岗位查询', 104, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:post:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1020, '岗位新增', 104, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:post:add',    '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1021, '岗位修改', 104, 3, '', '', '', 1, 0, 'F', '0', '0', 'system:post:edit',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1022, '岗位删除', 104, 4, '', '', '', 1, 0, 'F', '0', '0', 'system:post:remove', '#', 'admin', NOW(), '', NOW(), '');

-- 字典管理按钮
INSERT INTO sys_menu VALUES(1023, '字典查询', 105, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:dict:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1024, '字典新增', 105, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:dict:add',    '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1025, '字典修改', 105, 3, '', '', '', 1, 0, 'F', '0', '0', 'system:dict:edit',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1026, '字典删除', 105, 4, '', '', '', 1, 0, 'F', '0', '0', 'system:dict:remove', '#', 'admin', NOW(), '', NOW(), '');

-- 参数设置按钮
INSERT INTO sys_menu VALUES(1027, '参数查询', 106, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:config:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1028, '参数新增', 106, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:config:add',    '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1029, '参数修改', 106, 3, '', '', '', 1, 0, 'F', '0', '0', 'system:config:edit',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1030, '参数删除', 106, 4, '', '', '', 1, 0, 'F', '0', '0', 'system:config:remove', '#', 'admin', NOW(), '', NOW(), '');

-- 通知公告按钮
INSERT INTO sys_menu VALUES(1031, '公告查询', 107, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:notice:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1032, '公告新增', 107, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:notice:add',    '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1033, '公告修改', 107, 3, '', '', '', 1, 0, 'F', '0', '0', 'system:notice:edit',   '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1034, '公告删除', 107, 4, '', '', '', 1, 0, 'F', '0', '0', 'system:notice:remove', '#', 'admin', NOW(), '', NOW(), '');

-- 操作日志按钮
INSERT INTO sys_menu VALUES(1035, '操作查询', 500, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:operlog:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1036, '操作删除', 500, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:operlog:remove', '#', 'admin', NOW(), '', NOW(), '');

-- 登录日志按钮
INSERT INTO sys_menu VALUES(1037, '登录查询', 501, 1, '', '', '', 1, 0, 'F', '0', '0', 'system:loginlog:query',  '#', 'admin', NOW(), '', NOW(), '');
INSERT INTO sys_menu VALUES(1038, '登录删除', 501, 2, '', '', '', 1, 0, 'F', '0', '0', 'system:loginlog:remove', '#', 'admin', NOW(), '', NOW(), '');

-- ----------------------------
-- 7. 用户和角色关联表
-- ----------------------------
DROP TABLE IF EXISTS sys_user_role;
CREATE TABLE sys_user_role (
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  role_id BIGINT(20) NOT NULL COMMENT '角色ID',
  PRIMARY KEY(user_id, role_id)
) ENGINE=InnoDB COMMENT = '用户和角色关联表';

INSERT INTO sys_user_role VALUES(1, 1);
INSERT INTO sys_user_role VALUES(2, 2);

-- ----------------------------
-- 8. 角色和菜单关联表
-- ----------------------------
DROP TABLE IF EXISTS sys_role_menu;
CREATE TABLE sys_role_menu (
  role_id BIGINT(20) NOT NULL COMMENT '角色ID',
  menu_id BIGINT(20) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY(role_id, menu_id)
) ENGINE=InnoDB COMMENT = '角色和菜单关联表';

-- 超级管理员拥有所有菜单权限（通过代码控制）
-- 普通角色分配部分菜单
INSERT INTO sys_role_menu VALUES(2, 1);
INSERT INTO sys_role_menu VALUES(2, 100);
INSERT INTO sys_role_menu VALUES(2, 101);
INSERT INTO sys_role_menu VALUES(2, 102);
INSERT INTO sys_role_menu VALUES(2, 103);
INSERT INTO sys_role_menu VALUES(2, 104);
INSERT INTO sys_role_menu VALUES(2, 1000);
INSERT INTO sys_role_menu VALUES(2, 1007);
INSERT INTO sys_role_menu VALUES(2, 1011);
INSERT INTO sys_role_menu VALUES(2, 1015);
INSERT INTO sys_role_menu VALUES(2, 1019);

-- ----------------------------
-- 9. 角色和部门关联表
-- ----------------------------
DROP TABLE IF EXISTS sys_role_dept;
CREATE TABLE sys_role_dept (
  role_id BIGINT(20) NOT NULL COMMENT '角色ID',
  dept_id BIGINT(20) NOT NULL COMMENT '部门ID',
  PRIMARY KEY(role_id, dept_id)
) ENGINE=InnoDB COMMENT = '角色和部门关联表';

-- ----------------------------
-- 10. 用户与岗位关联表
-- ----------------------------
DROP TABLE IF EXISTS sys_user_post;
CREATE TABLE sys_user_post (
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  post_id BIGINT(20) NOT NULL COMMENT '岗位ID',
  PRIMARY KEY(user_id, post_id)
) ENGINE=InnoDB COMMENT = '用户与岗位关联表';

INSERT INTO sys_user_post VALUES(1, 1);
INSERT INTO sys_user_post VALUES(2, 4);

-- ----------------------------
-- 11. 字典类型表
-- ----------------------------
DROP TABLE IF EXISTS sys_dict_type;
CREATE TABLE sys_dict_type (
  dict_id     BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '字典ID',
  dict_name   VARCHAR(100) NOT NULL                 COMMENT '字典名称',
  dict_type   VARCHAR(100) NOT NULL UNIQUE           COMMENT '字典类型',
  status      CHAR(1)      DEFAULT '0'              COMMENT '状态（0正常 1停用）',
  create_by   VARCHAR(64)  DEFAULT ''               COMMENT '创建者',
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by   VARCHAR(64)  DEFAULT ''               COMMENT '更新者',
  update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark      VARCHAR(500) DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (dict_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT = '字典类型表';

INSERT INTO sys_dict_type VALUES(1, '用户性别', 'sys_user_sex',       '0', 'admin', NOW(), '', NOW(), '用户性别列表');
INSERT INTO sys_dict_type VALUES(2, '菜单状态', 'sys_show_hide',      '0', 'admin', NOW(), '', NOW(), '菜单状态列表');
INSERT INTO sys_dict_type VALUES(3, '系统开关', 'sys_normal_disable', '0', 'admin', NOW(), '', NOW(), '系统开关列表');
INSERT INTO sys_dict_type VALUES(4, '系统是否', 'sys_yes_no',         '0', 'admin', NOW(), '', NOW(), '系统是否列表');
INSERT INTO sys_dict_type VALUES(5, '通知类型', 'sys_notice_type',    '0', 'admin', NOW(), '', NOW(), '通知类型列表');
INSERT INTO sys_dict_type VALUES(6, '通知状态', 'sys_notice_status',  '0', 'admin', NOW(), '', NOW(), '通知状态列表');
INSERT INTO sys_dict_type VALUES(7, '操作类型', 'sys_oper_type',      '0', 'admin', NOW(), '', NOW(), '操作类型列表');
INSERT INTO sys_dict_type VALUES(8, '系统状态', 'sys_common_status',  '0', 'admin', NOW(), '', NOW(), '登录状态列表');

-- ----------------------------
-- 12. 字典数据表
-- ----------------------------
DROP TABLE IF EXISTS sys_dict_data;
CREATE TABLE sys_dict_data (
  dict_code   BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '字典编码',
  dict_sort   INT          DEFAULT 0                COMMENT '字典排序',
  dict_label  VARCHAR(100) NOT NULL                 COMMENT '字典标签',
  dict_value  VARCHAR(100) NOT NULL                 COMMENT '字典键值',
  dict_type   VARCHAR(100) NOT NULL                 COMMENT '字典类型',
  css_class   VARCHAR(100) DEFAULT NULL             COMMENT '样式属性',
  list_class  VARCHAR(100) DEFAULT NULL             COMMENT '表格回显样式',
  is_default  CHAR(1)      DEFAULT 'N'              COMMENT '是否默认（Y是 N否）',
  status      CHAR(1)      DEFAULT '0'              COMMENT '状态（0正常 1停用）',
  create_by   VARCHAR(64)  DEFAULT ''               COMMENT '创建者',
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by   VARCHAR(64)  DEFAULT ''               COMMENT '更新者',
  update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark      VARCHAR(500) DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (dict_code)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT = '字典数据表';

INSERT INTO sys_dict_data VALUES(1,  1, '男',   '0', 'sys_user_sex',       '', '',        'Y', '0', 'admin', NOW(), '', NOW(), '性别男');
INSERT INTO sys_dict_data VALUES(2,  2, '女',   '1', 'sys_user_sex',       '', '',        'N', '0', 'admin', NOW(), '', NOW(), '性别女');
INSERT INTO sys_dict_data VALUES(3,  3, '未知', '2', 'sys_user_sex',       '', '',        'N', '0', 'admin', NOW(), '', NOW(), '性别未知');
INSERT INTO sys_dict_data VALUES(4,  1, '显示', '0', 'sys_show_hide',      '', 'primary', 'Y', '0', 'admin', NOW(), '', NOW(), '显示菜单');
INSERT INTO sys_dict_data VALUES(5,  2, '隐藏', '1', 'sys_show_hide',      '', 'danger',  'N', '0', 'admin', NOW(), '', NOW(), '隐藏菜单');
INSERT INTO sys_dict_data VALUES(6,  1, '正常', '0', 'sys_normal_disable', '', 'primary', 'Y', '0', 'admin', NOW(), '', NOW(), '正常状态');
INSERT INTO sys_dict_data VALUES(7,  2, '停用', '1', 'sys_normal_disable', '', 'danger',  'N', '0', 'admin', NOW(), '', NOW(), '停用状态');
INSERT INTO sys_dict_data VALUES(8,  1, '是',   'Y', 'sys_yes_no',         '', 'primary', 'Y', '0', 'admin', NOW(), '', NOW(), '系统默认是');
INSERT INTO sys_dict_data VALUES(9,  2, '否',   'N', 'sys_yes_no',         '', 'danger',  'N', '0', 'admin', NOW(), '', NOW(), '系统默认否');
INSERT INTO sys_dict_data VALUES(10, 1, '通知', '1', 'sys_notice_type',    '', 'warning', 'Y', '0', 'admin', NOW(), '', NOW(), '通知');
INSERT INTO sys_dict_data VALUES(11, 2, '公告', '2', 'sys_notice_type',    '', 'success', 'N', '0', 'admin', NOW(), '', NOW(), '公告');
INSERT INTO sys_dict_data VALUES(12, 1, '正常', '0', 'sys_notice_status',  '', 'primary', 'Y', '0', 'admin', NOW(), '', NOW(), '正常状态');
INSERT INTO sys_dict_data VALUES(13, 2, '关闭', '1', 'sys_notice_status',  '', 'danger',  'N', '0', 'admin', NOW(), '', NOW(), '关闭状态');
INSERT INTO sys_dict_data VALUES(14, 1, '新增', '1', 'sys_oper_type',      '', 'info',    'N', '0', 'admin', NOW(), '', NOW(), '新增操作');
INSERT INTO sys_dict_data VALUES(15, 2, '修改', '2', 'sys_oper_type',      '', 'info',    'N', '0', 'admin', NOW(), '', NOW(), '修改操作');
INSERT INTO sys_dict_data VALUES(16, 3, '删除', '3', 'sys_oper_type',      '', 'danger',  'N', '0', 'admin', NOW(), '', NOW(), '删除操作');
INSERT INTO sys_dict_data VALUES(17, 1, '成功', '0', 'sys_common_status',  '', 'primary', 'N', '0', 'admin', NOW(), '', NOW(), '正常状态');
INSERT INTO sys_dict_data VALUES(18, 2, '失败', '1', 'sys_common_status',  '', 'danger',  'N', '0', 'admin', NOW(), '', NOW(), '停用状态');

-- ----------------------------
-- 13. 参数配置表
-- ----------------------------
DROP TABLE IF EXISTS sys_config;
CREATE TABLE sys_config (
  config_id    BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '参数ID',
  config_name  VARCHAR(100) NOT NULL                 COMMENT '参数名称',
  config_key   VARCHAR(100) NOT NULL                 COMMENT '参数键名',
  config_value VARCHAR(500) NOT NULL                 COMMENT '参数键值',
  config_type  CHAR(1)      DEFAULT 'N'              COMMENT '系统内置（Y是 N否）',
  create_by    VARCHAR(64)  DEFAULT ''               COMMENT '创建者',
  create_time  DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by    VARCHAR(64)  DEFAULT ''               COMMENT '更新者',
  update_time  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark       VARCHAR(500) DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (config_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT = '参数配置表';

INSERT INTO sys_config VALUES(1, '主框架页-默认皮肤样式名称', 'sys.index.skinName',     'skin-blue',  'Y', 'admin', NOW(), '', NOW(), '蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow');
INSERT INTO sys_config VALUES(2, '用户管理-账号初始密码',     'sys.user.initPassword', '123456',     'Y', 'admin', NOW(), '', NOW(), '初始化密码 123456');
INSERT INTO sys_config VALUES(3, '主框架页-侧边栏主题',       'sys.index.sideTheme',   'theme-dark', 'Y', 'admin', NOW(), '', NOW(), '深色主题theme-dark，浅色主题theme-light');

-- ----------------------------
-- 14. 通知公告表
-- ----------------------------
DROP TABLE IF EXISTS sys_notice;
CREATE TABLE sys_notice (
  notice_id      BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  tenant_id      BIGINT(20)   DEFAULT 1               COMMENT '租户ID',
  notice_title   VARCHAR(50)  NOT NULL                 COMMENT '公告标题',
  notice_type    CHAR(1)      NOT NULL                 COMMENT '公告类型（1通知 2公告）',
  notice_content LONGBLOB     DEFAULT NULL             COMMENT '公告内容',
  status         CHAR(1)      DEFAULT '0'              COMMENT '公告状态（0正常 1关闭）',
  del_flag       INT          DEFAULT 0                COMMENT '删除标志',
  create_by      VARCHAR(64)  DEFAULT ''               COMMENT '创建者',
  create_time    DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_by      VARCHAR(64)  DEFAULT ''               COMMENT '更新者',
  update_time    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  remark         VARCHAR(255) DEFAULT NULL             COMMENT '备注',
  PRIMARY KEY (notice_id)
) ENGINE=InnoDB AUTO_INCREMENT=10 COMMENT = '通知公告表';

INSERT INTO sys_notice VALUES(1, 1, '系统上线通知', '2', '系统已正式上线运行', '0', 0, 'admin', NOW(), '', NOW(), '管理员');
INSERT INTO sys_notice VALUES(2, 1, '系统维护通知', '1', '系统将于周末进行维护升级', '0', 0, 'admin', NOW(), '', NOW(), '管理员');

-- ----------------------------
-- 15. 操作日志记录表
-- ----------------------------
DROP TABLE IF EXISTS sys_oper_log;
CREATE TABLE sys_oper_log (
  oper_id        BIGINT(20)    NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  tenant_id      BIGINT(20)    DEFAULT 1               COMMENT '租户ID',
  title          VARCHAR(50)   DEFAULT ''               COMMENT '模块标题',
  business_type  INT           DEFAULT 0                COMMENT '业务类型',
  method         VARCHAR(100)  DEFAULT ''               COMMENT '方法名称',
  request_method VARCHAR(10)   DEFAULT ''               COMMENT '请求方式',
  operator_type  INT           DEFAULT 0                COMMENT '操作类别',
  oper_name      VARCHAR(50)   DEFAULT ''               COMMENT '操作人员',
  dept_name      VARCHAR(50)   DEFAULT ''               COMMENT '部门名称',
  oper_url       VARCHAR(255)  DEFAULT ''               COMMENT '请求URL',
  oper_ip        VARCHAR(128)  DEFAULT ''               COMMENT '主机地址',
  oper_location  VARCHAR(255)  DEFAULT ''               COMMENT '操作地点',
  oper_param     VARCHAR(2000) DEFAULT ''               COMMENT '请求参数',
  json_result    VARCHAR(2000) DEFAULT ''               COMMENT '返回参数',
  status         INT           DEFAULT 0                COMMENT '操作状态（0正常 1异常）',
  error_msg      VARCHAR(2000) DEFAULT ''               COMMENT '错误消息',
  oper_time      DATETIME      DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (oper_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT = '操作日志记录';

-- ----------------------------
-- 16. 登录日志表
-- ----------------------------
DROP TABLE IF EXISTS sys_login_log;
CREATE TABLE sys_login_log (
  info_id        BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '访问ID',
  tenant_id      BIGINT(20)   DEFAULT 1               COMMENT '租户ID',
  user_name      VARCHAR(50)  DEFAULT ''               COMMENT '用户账号',
  ipaddr         VARCHAR(128) DEFAULT ''               COMMENT '登录IP地址',
  login_location VARCHAR(255) DEFAULT ''               COMMENT '登录地点',
  browser        VARCHAR(50)  DEFAULT ''               COMMENT '浏览器类型',
  os             VARCHAR(50)  DEFAULT ''               COMMENT '操作系统',
  status         INT          DEFAULT 0                COMMENT '登录状态（0成功 1失败）',
  msg            VARCHAR(255) DEFAULT ''               COMMENT '提示消息',
  login_time     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '访问时间',
  PRIMARY KEY (info_id)
) ENGINE=InnoDB AUTO_INCREMENT=100 COMMENT = '系统访问记录';
