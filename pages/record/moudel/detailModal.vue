<template>
  <div>
    <el-dialog
      custom-class="up-dialog"
      :before-close="handleClose"
      title="详情"
      :visible.sync="visible"
      width="55%"
    >
      <div class="invoice-check_right">
        <div class="invoice-check_right_title">{{ checkDetail.typeName }}</div>
        <!-- 头部 -->
        <div class="invoice-check-table_thead border-r border-l border-t">
          <!-- 购买方 -->
          <div class="invoice-check-table_thead_purchaser">
            <div class="title border-r">购买方</div>
            <div class="info">
              <div>
                <span> <em>名</em><em>称：</em> </span>
                <i>{{ checkDetail.purchaserName }}</i>
              </div>
              <div>
                <span>
                  <em>纳</em><em>税</em><em>人</em><em>识</em><em>别</em
                  ><em>号：</em>
                </span>
                <i>{{ checkDetail.purchaserTaxpayerNumber }}</i>
              </div>
              <div>
                <span>
                  <em>开</em><em>户</em><em>行</em><em>及</em><em>账</em
                  ><em>号：</em>
                </span>
                <i>{{ checkDetail.purchaserBank }}</i>
              </div>
              <div>
                <span>
                  <em>地</em><em>址</em><em>、</em><em>电</em><em>话：</em>
                </span>
                <i>{{ checkDetail.purchaserAddress }}</i>
              </div>
            </div>
          </div>
          <!-- 密码区 -->
          <div class="invoice-check_table_receive">
            <div class="title border-r border-l">密码区</div>
            <!-- <div class="info">
              <div><span>联系电话：</span><i>1763166164</i></div>
              <div><span>电子邮箱：</span><i>1537299563@qq.com</i></div>
            </div> -->
          </div>
        </div>
        <!-- 明细 -->
        <div class="invoice-check-table_tbody">
          <el-table
            :data="checkDetail.items"
            border
            style="width: 100%; font-size: 12px"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column
              prop="name"
              label="货物或应税劳务、服务名称"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="model" label="规格型号" align="center">
            </el-table-column>
            <el-table-column prop="unit" label="单位" align="center">
            </el-table-column>
            <el-table-column prop="number" label="数量" align="center">
            </el-table-column>
            <el-table-column prop="price" label="单价（含税）" align="center">
            </el-table-column>
            <el-table-column prop="sum" label="金额（含税）" align="center">
              <template slot-scope="{ row }">
                <div>{{ row.sum.toFixed(2) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="税率" align="center">
              <template slot-scope="{ row }">
                <div>{{ row.taxRate * 100 }}%</div>
              </template>
            </el-table-column>
            <el-table-column prop="tax" label="税额" align="center">
              <template slot-scope="{ row }">
                <div>{{ row.tax.toFixed(2) }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 合计 -->
        <div class="invoice-check-table_summary border-r border-l border-b">
          <el-row>
            <el-col :span="4">
              <div class="text">加税合计（大写）</div>
            </el-col>
            <el-col :span="8">
              <div class="text">{{ DX(allAmount) }}</div>
            </el-col>
            <el-col :span="4">
              <div class="text">（小写）</div>
            </el-col>
            <el-col :span="8">
              <div class="text">￥{{ allAmount }}</div>
            </el-col>
          </el-row>
        </div>

        <div class="invoice-check-table_tfoot border-r border-l border-b">
          <!-- 销售方 -->
          <div class="invoice-check-table_thead_seller">
            <div class="title border-r">销售方</div>
            <div class="info">
              <div>
                <span> <em>企</em><em>业</em><em>名</em><em>称：</em> </span>
                <i>{{ checkDetail.salesName }}</i>
              </div>
              <div>
                <span>
                  <em>纳</em><em>税</em><em>人</em><em>识</em><em>别</em
                  ><em>号：</em>
                </span>
                <i>{{ checkDetail.salesTaxpayerNumber }}</i>
              </div>
              <div>
                <span>
                  <em>开</em><em>户</em><em>行</em><em>及</em><em>账</em
                  ><em>号：</em>
                </span>
                <i>{{ checkDetail.salesBank }}</i>
              </div>
              <div>
                <span>
                  <em>地</em> <em>址</em> <em>、</em> <em>电</em>
                  <em>话：</em>
                </span>
                <i>{{ checkDetail.salesAddress }}</i>
              </div>
            </div>
          </div>
          <!-- 备注 -->
          <div class="invoice-check_table_remark">
            <div class="title border-r border-l">备注</div>
            <div class="remark">{{ checkDetail.remark }}</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['visible', 'checkDetail'],
  data() {
    return {}
  },
  watch: {},
  mounted() {},
  computed: {
    allAmount() {
      let num = 0
      if (this.checkDetail.items) {
        for (let item of this.checkDetail.items) {
          num += Number(item.sum) + Number(item.tax)
        }
      }
      return num.toFixed(2)
    },
  },
  methods: {
    //表格合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index == 5 || index == 7) {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return (prev + curr).toFixed(2)
              } else {
                return prev.toFixed(2)
              }
            }, 0)
          }
        }
      })
      return sums
    },
    // 数字转大写
    DX(n) {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法'
      var unit = n > 0 ? '千百拾亿千百拾万千百拾元角分' : '',
        str = ''
      n += '00'
      var p = n.indexOf('.')
      if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2)
      unit = unit.substr(unit.length - n.length)
      for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
      return str
        .replace(/零(千|百|拾|角)/g, '零')
        .replace(/(零)+/g, '零')
        .replace(/零(万|亿|元)/g, '$1')
        .replace(/(亿)万|壹(拾)/g, '$1$2')
        .replace(/^元零?|零分/g, '')
        .replace(/元$/g, '元整')
    },
    // 确认
    handleSubmit() {
      this.$emit('update:visible', false)
    },
    //关闭
    handleClose() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
<style lang="scss">
.invoice-check_right {
  width: 100%;
  font-size: 12px;
  .border-r {
    border-right: 1px solid #cf7c2d;
  }
  .border-l {
    border-left: 1px solid #cf7c2d;
  }
  .border-t {
    border-top: 1px solid #cf7c2d;
  }
  .border-b {
    border-bottom: 1px solid #cf7c2d;
  }
  .invoice-check_right_title {
    font-size: 20px;
    color: #cf7c2d;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
  }
  //头部
  .invoice-check-table_thead {
    width: 100%;
    height: 100px;
    display: flex;
    .invoice-check-table_thead_purchaser {
      display: flex;
      width: 50%;
      .title {
        height: 100%;
        width: 20px;
        color: #cf7c2d;
        display: flex;
        align-items: center;
        text-align: center;
      }
      .info {
        line-height: 25px;
        div {
          display: flex;
          span {
            width: 90px;
            text-align: right;
            padding-left: 5px;
            color: #cf7c2d;
            display: flex;
            justify-content: space-between;
            em {
              font-style: normal;
            }
          }
          i {
            font-style: normal;
            color: #666;
          }
        }
      }
    }
    .invoice-check_table_receive {
      display: flex;
      width: 50%;
      .title {
        height: 100%;
        width: 20px;
        color: #cf7c2d;
        display: flex;
        align-items: center;
        text-align: center;
      }
      .info {
        // line-height: 25px;
        // div {
        //   span {
        //     // width: 90px;
        //     // text-align: right;
        //     padding-left: 5px;
        //     color: #cf7c2d;
        //   }
        //   i {
        //     font-style: normal;
        //     color: #666;
        //   }
        // }
      }
    }
  }
  .invoice-check-table_tbody {
    width: 100%;
    .el-table td,
    .el-table th.is-leaf,
    .el-table--border,
    .el-table--group {
      border-color: #cf7c2d;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: #cf7c2d;
    }
    .el-table thead {
      color: #cf7c2d;
    }
    .el-table__header-wrapper tbody td,
    .el-table__footer-wrapper tbody td {
      background: #fff;
    }
    th {
      padding: 0 !important;
      height: 48px;
      line-height: 48px;
    }
    td {
      padding: 0 !important;
      height: 48px;
      line-height: 48px;
    }
  }
  //合计
  .invoice-check-table_summary {
    height: 32px;
    line-height: 32px;
    .text {
      text-align: center;
      color: #cf7c2d;
    }
  }
  .invoice-check-table_tfoot {
    width: 100%;
    height: 100px;
    display: flex;
    .invoice-check-table_thead_seller {
      display: flex;
      width: 50%;
      .title {
        height: 100%;
        width: 20px;
        color: #cf7c2d;
        display: flex;
        align-items: center;
        text-align: center;
      }
      .info {
        line-height: 25px;
        div {
          display: flex;
          span {
            width: 90px;
            text-align: right;
            padding-left: 5px;
            color: #cf7c2d;
            display: flex;
            justify-content: space-between;
            em {
              font-style: normal;
            }
          }
          i {
            font-style: normal;
            color: #666;
          }
        }
      }
    }
    .invoice-check_table_remark {
      display: flex;
      width: 50%;
      .title {
        height: 100%;
        width: 20px;
        color: #cf7c2d;
        display: flex;
        align-items: center;
        text-align: center;
      }
      .remark {
        width: 100%;
        padding: 0 5px;
        line-height: 25px;
        color: #666;
      }
    }
  }
}
</style>
