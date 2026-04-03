<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #67C6C0;">
            <i class="el-icon-user" />
          </div>
          <div class="stat-info">
            <div class="stat-title">人员总数</div>
            <div class="stat-value">0</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #5B8FF9;">
            <i class="el-icon-suitcase" />
          </div>
          <div class="stat-info">
            <div class="stat-title">各类证件</div>
            <div class="stat-value">0</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #F56C6C;">
            <i class="el-icon-monitor" />
          </div>
          <div class="stat-info">
            <div class="stat-title">设备数量</div>
            <div class="stat-value">0</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #67C23A;">
            <i class="el-icon-flag" />
          </div>
          <div class="stat-info">
            <div class="stat-title">业绩项目</div>
            <div class="stat-value">0</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <div slot="header"><span>证件类型分布</span><span style="float:right;color:#999;font-size:12px;">点击可下钻</span></div>
          <div class="chart-placeholder">暂无数据</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header"><span>设备类型分布</span></div>
          <div class="chart-placeholder">暂无数据</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <div slot="header"><span>各项目业绩统计</span></div>
          <div class="chart-placeholder">暂无数据</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header"><span>月度新增资源趋势</span></div>
          <div class="chart-placeholder">暂无数据</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
}
.stat-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    i {
      font-size: 28px;
      color: #fff;
    }
  }
  .stat-info {
    .stat-title {
      font-size: 14px;
      color: #999;
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
  }
}
.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
</style>
