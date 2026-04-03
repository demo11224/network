package com.admin.common.core.page;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

/**
 * 分页数据
 */
@Data
public class TableDataInfo<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private long total;
    private List<T> rows;
    private int code;
    private String msg;

    public TableDataInfo() {
    }

    public TableDataInfo(List<T> list, long total) {
        this.rows = list;
        this.total = total;
        this.code = 200;
        this.msg = "查询成功";
    }
}
