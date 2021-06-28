<template>
  <div class="container">
    <Header></Header>
    <div :class="showHeader ? 'content' : 'contents'">
      <Aside></Aside>
      <div class="main">
        <div class="main-title">
          <div><b>发票查验</b></div>
        </div>
        <el-divider></el-divider>
        <div class="main-content">
          <div class="invoice-check">
            <div class="invoice-check_left">
              <p>扫码查验</p>
              <el-input v-model="input3" size="small">
                <i slot="suffix" class="el-input__icon el-icon-date"></i>
              </el-input>
              <p>手工查验</p>
              <div class="invoice-check_input">
                发票代码：
                <el-input
                  placeholder="请输入10位或12位发票代码"
                  v-model="input3"
                  size="small"
                ></el-input>
              </div>
              <div class="invoice-check_input">
                发票号码：
                <el-input
                  placeholder="请输入8位发票号码"
                  v-model="input3"
                  size="small"
                ></el-input>
              </div>
              <div class="invoice-check_input">
                发票日期：
                <el-date-picker
                  v-model="value1"
                  type="date"
                  placeholder="发票日期"
                  size="small"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="invoice-check_right">
              <!-- 头部 -->
              <div class="invoice-check-table_thead border-r border-l border-t">
                <!-- 购买方 -->
                <div class="invoice-check-table_thead_purchaser">
                  <div class="title border-r">购买方</div>
                  <div class="info">
                    <div><span>名称：</span><i>啦啦啦啦啦</i></div>
                    <div><span>纳税人识别号：</span><i>15896347856</i></div>
                    <div>
                      <span>开户行及账号：</span><i>啦啦啦1456932587</i>
                    </div>
                    <div>
                      <span>地址、电话：</span><i>啦啦啦啦啦啦17631366164</i>
                    </div>
                  </div>
                </div>
                <!-- 接受方 -->
                <div class="invoice-check_table_receive">
                  <div class="title border-r border-l">接收信息</div>
                  <div class="info">
                    <div><span>联系电话：</span><i>1763166164</i></div>
                    <div><span>电子邮箱：</span><i>1537299563@qq.com</i></div>
                  </div>
                </div>
              </div>
              <!-- 明细 -->
              <div class="invoice-check-table_tbody">
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%; font-size: 12px"
                >
                  <el-table-column
                    prop="date"
                    label="货物或应税劳务、服务名称"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column prop="name" label="规格型号" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="单位" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="数量" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="单价（含税）"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="金额（含税）"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column prop="address" label="税率" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="税额" align="center">
                  </el-table-column>
                </el-table>
              </div>
              <!-- 合计 -->
              <div class="invoice-check-table_summary border-r border-l border-b">
                
              </div>
              
              <div class="invoice-check-table_tfoot border-r border-l border-b">
                <!-- 销售方 -->
                <div class="invoice-check-table_thead_seller">
                  <div class="title border-r">销售方</div>
                  <div class="info">
                    <div><span>企业名称：</span><i>啦啦啦啦啦</i></div>
                    <div><span>纳税人识别号：</span><i>15896347856</i></div>
                    <div>
                      <span>开户行及账号：</span><i>啦啦啦1456932587</i>
                    </div>
                    <div>
                      <span>地址、电话：</span><i>啦啦啦啦啦啦17631366164</i>
                    </div>
                  </div>
                </div>
                <!-- 备注 -->
                <div class="invoice-check_table_remark">
                  <div class="title border-r border-l">备注</div>
                  <div class="remark">
                    阿联啦啊啦啦啦阿联啦啊啦啦啦阿联啦啊啦啦啦阿联啦啊啦啦啦阿联啦啊啦啦啦阿联啦啊啦啦啦
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-footer">
          <p>操作说明</p>
          <p>
            1、使用扫码查验需要连接扫描枪。您可自行购买通用二维码扫描枪，连接并确认可用后使用该功能。
          </p>
          <p>
            2、您也可使用手机微信进行查验，请扫描登录该账号，进行查验后，亦可在本功能查验下载数据。
          </p>
          <p>
            3、针对部分由于二维码不清晰，扫描失败的发票，您可采用手工查验的方式进行处理。
          </p>
          <p class="main-footer_title">注意事项</p>
          <p>1、每次发票查验扣款15点（0.15元/次）。</p>
          <p>
            2、本查验结果来源于各地方国税与地税官方查验网站，查验结果不作为鉴别假票、虚开、非法开具发票的法律依据。
          </p>
          <p>
            3、发票查验最终结果以当地主管税务机关的鉴定为准。如您怀疑所查验的发票为假发票，请与当地税务机关联系或拨打举报电话：区号+12366。
          </p>
          <p>4、部分地区税务机关代开发票可能存在滞后情况，敬请原谅。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header/index.vue'
import Aside from '../../components/Aside/index.vue'

export default {
  name: '',
  components: {
    Header,
    Aside,
  },
  data() {
    return {
      showHeader: '',
      tableData: [],
    }
  },
  head() {
    return {
      title: '发票查验 - EasyAPI发票查验',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: '发票管理发票查验',
        },
        { hid: 'keyword', name: 'keyword', content: '发票管理发票查验' },
      ],
    }
  },
  methods: {},
  mounted() {
    this.showHeader = this.comsys.showHeader
  },
}
</script>

<style lang="scss">
.invoice-check {
  font-size: 14px;
  display: flex;
  .invoice-check_left {
    width: 40%;
    p {
      margin: 15px 0;
      font-size: 16px;
      color: #000;
      font-weight: 550;
    }
    .el-input {
      width: 390px;
    }
    .invoice-check_input {
      margin: 15px 0;
      padding-left: 15px;
      .el-input {
        width: 300px;
      }
    }
  }
  .invoice-check_right {
    width: 60%;
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
          width: 5%;
          color: #cf7c2d;
          display: flex;
          align-items: center;
          text-align: center;
        }
        .info {
          line-height: 25px;
          div {
            span {
              width: 90px;
              text-align: right;
              padding-left: 5px;
              color: #cf7c2d;
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
          width: 5%;
          color: #cf7c2d;
          display: flex;
          align-items: center;
          text-align: center;
        }
        .info {
          line-height: 25px;
          div {
            span {
              // width: 90px;
              // text-align: right;
              padding-left: 5px;
              color: #cf7c2d;
            }
            i {
              font-style: normal;
              color: #666;
            }
          }
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
    .invoice-check-table_summary{
      height: 32px;
      line-height: 32px;
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
          width: 5%;
          color: #cf7c2d;
          display: flex;
          align-items: center;
          text-align: center;
        }
        .info {
          line-height: 25px;
          div {
            span {
              width: 90px;
              text-align: right;
              padding-left: 5px;
              color: #cf7c2d;
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
          width: 5%;
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
}
.main-footer {
  padding-left: 15px;
  margin-top: 100px;
  font-size: 14px;
  color: #666;
  .main-footer_title {
    margin-top: 20px;
  }
  p {
    line-height: 30px;
  }
}
</style>
