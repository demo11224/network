package com.admin.tenant;

import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.expression.LongValue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * 多租户处理器
 */
@Component
public class TenantHandler implements TenantLineHandler {

    @Value("${tenant.enable:true}")
    private boolean tenantEnabled;

    @Value("#{'${tenant.ignore-tables:}'.split(',')}")
    private List<String> ignoreTables;

    /** 不需要租户字段的表 */
    private static final List<String> DEFAULT_IGNORE_TABLES = Arrays.asList(
            "sys_tenant", "sys_menu", "sys_dict_type", "sys_dict_data", "sys_config"
    );

    @Override
    public Expression getTenantId() {
        Long tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            return new LongValue(0);
        }
        return new LongValue(tenantId);
    }

    @Override
    public String getTenantIdColumn() {
        return "tenant_id";
    }

    @Override
    public boolean ignoreTable(String tableName) {
        if (!tenantEnabled) {
            return true;
        }
        if (TenantContextHolder.getTenantId() == null) {
            return true;
        }
        return DEFAULT_IGNORE_TABLES.contains(tableName) ||
               (ignoreTables != null && ignoreTables.contains(tableName));
    }
}
