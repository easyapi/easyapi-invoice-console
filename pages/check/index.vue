<template>
  <div class="container">
    <Header></Header>
    <div :class="showHeader ? 'content' : 'contents'">
      <Aside></Aside>
      <div class="main">
        <div class="main-title">
          <div class="main-title_top">
            <b>发票查验</b>
          </div>
        </div>
        <div class="main-content">
          <div class="invoice-check">
            <div class="invoice-check_left">
              <p>扫码查验</p>
              <el-input
                v-model="qrCode"
                size="small"
                @keyup.enter.native="checkInvoiceQrCode"
              >
                <i
                  slot="suffix"
                  class="el-input__icon iconfont icon-saomiaoqiang"
                ></i>
              </el-input>
              <p>图片查验</p>
              <el-upload
                @click.native="getTokenAandKey"
                class="avatar-uploader"
                action="https://upload.qiniup.com/"
                :show-file-list="false"
                :data="{ key: qnKey, token: qnToken }"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
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
                {{ invoiceDetail.typeName || '增值税电子发票' }}
              </div>
              <!-- 头部 -->
              <div class="invoice-check-table_thead border-r border-l border-t">
                <!-- 购买方 -->
                <div class="invoice-check-table_thead_purchaser">
                  <div class="title border-r">购买方</div>
                  <div class="info">
                    <div>
                      <span> <em>名</em><em>称：</em> </span>
                      <i>{{ invoiceDetail.purchaserName }}</i>
                    </div>
                    <div>
                      <span>
                        <em>纳</em><em>税</em><em>人</em><em>识</em><em>别</em
                        ><em>号：</em>
                      </span>
                      <i>{{ invoiceDetail.purchaserTaxpayerNumber }}</i>
                    </div>
                    <div>
                      <span>
                        <em>开</em><em>户</em><em>行</em><em>及</em><em>账</em
                        ><em>号：</em>
                      </span>
                      <i>{{ invoiceDetail.purchaserBank }}</i>
                    </div>
                    <div>
                      <span>
                        <em>地</em><em>址</em><em>、</em><em>电</em
                        ><em>话：</em>
                      </span>
                      <i>{{ invoiceDetail.purchaserAddress }}</i>
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
                      <span>
                        <em>企</em><em>业</em><em>名</em><em>称：</em>
                      </span>
                      <i>{{ invoiceDetail.salesName }}</i>
                    </div>
                    <div>
                      <span>
                        <em>纳</em><em>税</em><em>人</em><em>识</em><em>别</em
                        ><em>号：</em>
                      </span>
                      <i>{{ invoiceDetail.salesTaxpayerNumber }}</i>
                    </div>
                    <div>
                      <span>
                        <em>开</em><em>户</em><em>行</em><em>及</em><em>账</em
                        ><em>号：</em>
                      </span>
                      <i>{{ invoiceDetail.salesBank }}</i>
                    </div>
                    <div>
                      <span>
                        <em>地</em> <em>址</em> <em>、</em> <em>电</em>
                        <em>话：</em>
                      </span>
                      <i>{{ invoiceDetail.salesAddress }}</i>
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
  </div>
</template>

<script>
import Check from './check'

export default Check
</script>
