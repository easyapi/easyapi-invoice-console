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
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                size="small"
                class="demo-ruleForm"
              >
                <el-form-item label="发票类型：">
                  <el-radio-group
                    v-model="invoiceType"
                    @change="invoiceTypeChange"
                  >
                    <el-radio :label="1">专用发票</el-radio>
                    <el-radio :label="2">普通发票</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="发票代码：" prop="code">
                  <el-input
                    placeholder="请输入10位或12位发票代码"
                    v-model="ruleForm.code"
                  ></el-input>
                </el-form-item>
                <el-form-item label="发票号码：" prop="number">
                  <el-input
                    placeholder="请输入8位发票号码"
                    v-model="ruleForm.number"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="效验码："
                  prop="checkCode"
                  v-if="invoiceType == 2"
                >
                  <el-input
                    placeholder="请输入效验码后六位"
                    v-model="ruleForm.checkCode"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="开具金额："
                  prop="price"
                  v-if="invoiceType == 1"
                >
                  <el-input
                    placeholder="请输入金额"
                    v-model="ruleForm.price"
                  ></el-input>
                </el-form-item>
                <el-form-item label="发票日期：" prop="makeDate">
                  <el-date-picker
                    v-model="ruleForm.makeDate"
                    type="date"
                    placeholder="发票日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="invoice-check_right">
              <div class="invoice-check_right_title">
                增值税电子{{ invoiceType == 1 ? '专用' : '普通' }}发票
              </div>
              <!-- 头部 -->
              <div class="invoice-check-table_thead border-r border-l border-t">
                <!-- 购买方 -->
                <div class="invoice-check-table_thead_purchaser">
                  <div class="title border-r">购买方</div>
                  <div class="info">
                    <div>
                      <span>名称：</span
                      ><i>{{ invoiceDetail.purchaserName }}</i>
                    </div>
                    <div>
                      <span>纳税人识别号：</span
                      ><i>{{ invoiceDetail.purchaserTaxpayerNumber }}</i>
                    </div>
                    <div>
                      <span>开户行及账号：</span
                      ><i>{{ invoiceDetail.purchaserBank }}</i>
                    </div>
                    <div>
                      <span>地址、电话：</span
                      ><i>{{ invoiceDetail.purchaserAddress }}</i>
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
                  :data="invoiceDetail.items"
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
                  <el-table-column
                    prop="price"
                    label="单价（含税）"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="sum"
                    label="金额（含税）"
                    align="center"
                  >
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
              <div
                class="invoice-check-table_summary border-r border-l border-b"
              >
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
                      <span>企业名称：</span
                      ><i>{{ invoiceDetail.salesName }}</i>
                    </div>
                    <div>
                      <span>纳税人识别号：</span
                      ><i>{{ invoiceDetail.salesTaxpayerNumber }}</i>
                    </div>
                    <div>
                      <span>开户行及账号：</span
                      ><i>{{ invoiceDetail.salesBank }}</i>
                    </div>
                    <div>
                      <span>地址、电话：</span
                      ><i>{{ invoiceDetail.salesAddress }}</i>
                    </div>
                  </div>
                </div>
                <!-- 备注 -->
                <div class="invoice-check_table_remark">
                  <div class="title border-r border-l">备注</div>
                  <div class="remark">{{ invoiceDetail.remark }}</div>
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
import { checkInvoice } from '../../api/check'
export default {
  name: '',
  components: {
    Header,
    Aside,
  },
  data() {
    var validateCode = (rule, value, callback) => {
      if (value.length != 10 && value.length != 12) {
        callback(new Error('请输入10位或12位发票代码'))
      } else {
        callback()
      }
    }
    var validateNumber = (rule, value, callback) => {
      if (value.length != 8) {
        callback(new Error('请输入8位发票号码'))
      } else {
        callback()
      }
    }
    var validateCheckCode = (rule, value, callback) => {
      if (value.length != 6) {
        callback(new Error('请输入效验码后六位'))
      } else {
        callback()
      }
    }
    return {
      showHeader: '',
      invoiceDetail: {
        items: [],
      },
      invoiceType: 1,
      ruleForm: {
        code: '',
        number: '',
        makeDate: '',
        checkCode: '',
        price: '',
      },
      rules: {
        code: [
          { required: true, message: '请输入发票代码', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' },
        ],
        number: [
          { required: true, message: '请输入发票号码', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' },
        ],
        makeDate: [
          { required: true, message: '请选择发票日期', trigger: 'blur' },
        ],
        checkCode: [
          { required: true, message: '请输入效验码', trigger: 'blur' },
          { validator: validateCheckCode, trigger: 'blur' },
        ],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }],
      },
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
  mounted() {
    this.showHeader = this.comsys.showHeader
  },
  computed: {
    allAmount() {
      let num = 0
      for (let item of this.invoiceDetail.items) {
        num += Number(item.sum) + Number(item.tax)
      }
      return num.toFixed(2)
    },
  },
  methods: {
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
                return (prev).toFixed(2)
              }
            }, 0)
          }
        }
      })
      return sums
    },
    invoiceTypeChange() {
      this.ruleForm.code = ''
      this.ruleForm.number = ''
      this.ruleForm.makeDate = ''
      this.ruleForm.checkCode = ''
      this.ruleForm.price = ''
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
    // 查询
    search() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            ...this.ruleForm,
            appKey: '53Z9oTH5KpIy2SC2',
            appSecret: 'tfmjloheqcricbic',
          }
          // 032002100404 08370904  3200202130 08108805
          checkInvoice(params, this).then((res) => {
            if (res.data.code === 1) {
              this.invoiceDetail = res.data.content
            }
          })
        }
      })
    },
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
    .demo-ruleForm {
      .el-input {
        width: 290px;
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
