<template>
  <div class="container">
    <Header></Header>
    <div :class="showHeader ? 'content' : 'contents'">
      <Aside></Aside>
      <div class="main">
        <div class="main-title">
          <div class="main-title_top">
            <b>查验记录</b>
          </div>
        </div>
        <div class="main-content">
          <SearchArea
            :items="searchItems"
            @search="search"
            @event="event"
            @reset="reset"
          />
          <el-table
            :data="checkRecords"
            :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
              fontSize: '12px',
            }"
            style="margin-top: 20px"
            v-loading="loadingData"
            element-loading-text="数据正在加载中..."
          >
            <template slot="empty">
              <p>{{ tableText }}</p>
            </template>
            <el-table-column prop="addTime" label="查验时间"></el-table-column>
            <el-table-column prop="code" label="发票代码"></el-table-column>
            <el-table-column prop="number" label="发票号码"></el-table-column>
            <el-table-column prop="makeDate" label="开票日期"></el-table-column>
            <el-table-column label="税额">
              <template slot-scope="{ row }">
                <div>￥{{ row.tax.toFixed(2) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="税价合计">
              <template slot-scope="{ row }">
                <div>￥{{ row.price.toFixed(2) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="typeName" label="票种"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  @click="openDetail(scope.row)"
                  size="mini"
                  >详情</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            @fatherSize="fatherSize"
            @fatherCurrent="fatherCurrent"
            :size="pagination.size"
            :total-elements="pagination.total"
            class="paging"
          ></Pagination>
          <div style="clear: both"></div>
        </div>
      </div>
    </div>
    <DetailModal
      :visible.sync="detailModal"
      :checkDetail="checkDetail"
    ></DetailModal>
  </div>
</template>

<script>
import Record from './record'

export default Record
</script>
