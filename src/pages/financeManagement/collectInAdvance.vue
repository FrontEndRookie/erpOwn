<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" :model="selectResult" class="demo-form-inline">
        <div class="content-search">
          <el-form-item label="会计凭证号:">
            <el-input
              clearable
              maxlength="10"
              style="width: 180px"
              v-model="selectResult.accountVoucherNo"
              placeholder="请输入会计凭证号"
            ></el-input>
          </el-form-item>
          <el-form-item label="付款人名称:">
            <el-input
              clearable
              maxlength="30"
              v-model="selectResult.payer"
              placeholder="请输入付款人名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="收款账户信息:">
            <el-select
              id="getAccountInfo"
              v-model="selectResult.userInfo"
              placeholder="请输入收款账户信息"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 260px"
            >
              <el-option
                v-for="item in userInfo"
                :key="item.id"
                :label="`${item.accountBank}-${item.userName}-${item.bankAccount}`"
                :value="`${item.accountBank}-${item.userName}-${item.bankAccount}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实收类型:">
            <el-select v-model="selectResult.receiptType" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款时间:" label-width="80px">
            <el-date-picker
              style="width: 150px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startReceiptDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.endReceiptDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div style="text-align: center; margin-bottom: 20px">
        <el-button @click="searchClick" size="mini" type="primary"
          v-auth="['108000_B']"
          >查询</el-button
        >
        <el-button @click="restClick" size="mini" type="primary"
          >清空</el-button
        >
      </div>

      <div style="text-align: right; margin-bottom: 5px">
        <el-button @click="editAccount(1)" size="mini" type="primary"
          v-auth="['108001_B']"
          >新增预收</el-button
        >
        <el-button @click="exportList" size="mini" type="primary"
          >导出列表</el-button
        >
      </div>

      <el-dialog
        :title="buttonType == 1 ? '新增预收' : '编辑实收'"
        :visible.sync="dialogFormVisible"
        :width="'900px'"
      >
        <!-- 模态框 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <div
            style="
              display: flex;
              margin-top: 10px;
              justify-content: space-around;
              margin-left: 20px;
            "
          >
            <el-form-item label="付款人名称" prop="payer">
              <el-input
                v-model.trim="ruleForm.payer"
                clearable
                placeholder="请输入付款人名称"
                maxlength="30"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="收款账户信息"
              prop="userInfo"
              label-width="120px"
            >
              <el-select
                v-model="ruleForm.userInfo"
                placeholder="请输入收款账户信息"
                clearable
                filterable
                remote
                reserve-keyword
                style="width: 260px"
              >
                <el-option
                  v-for="item in userInfo"
                  :key="item.id"
                  :label="`${item.accountBank}-${item.userName}-${item.bankAccount}`"
                  :value="`${item.accountBank}-${item.userName}-${item.bankAccount}`"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div
            style="
              display: flex;
              margin-top: 10px;
              justify-content: space-around;
            "
          >
            <el-form-item label="收款金额" prop="amount">
              <el-input
                placeholder="请输入收款金额"
                clearable
                maxlength="10"
                v-model="ruleForm.amount"
                onKeyUp="this.value= this.value.match(/^\d+(\.\d{0,2})?/)? this.value.match(/^\d+(\.\d{0,2})?/)[0] : ''"
                @blur="ruleForm.amount = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="收款方式" prop="receiptWay">
              <el-select v-model="ruleForm.receiptWay">
                <el-option label="银行转账" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div
            style="
              display: flex;
              margin-top: 10px;
              justify-content: space-around;
            "
          >
            <el-form-item label="币种" prop="currency">
              <el-select v-model="ruleForm.currency">
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款时间" prop="receiptDate">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="ruleForm.receiptDate"
                type="date"
                placeholder="选择收款时间"
                :picker-options="$store.getters.tomorrowDisabledDatePickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <div
            style="
              display: flex;
              margin-top: 10px;
              justify-content: space-around;
            "
          >
            <el-form-item label="汇率" prop="exchangeRate">
              <el-input
                placeholder="请输入汇率"
                clearable
                v-model="ruleForm.exchangeRate"
                onKeyUp="this.value= this.value.match(/^\d{0,4}(\.\d{0,2})?/)? this.value.match(/^\d{0,4}(\.\d{0,2})?/)[0] : ''"
                @blur="ruleForm.exchangeRate = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="会计凭证号" prop="accountVoucherNo" >
              <el-input
                clearable
                maxlength="10"
                v-model="ruleForm.accountVoucherNo"
                placeholder="请输入会计凭证号"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item
            label="实收类型"
            prop="receiptType"
            style="margin-left: 45px"
          >
            <el-radio-group v-model="ruleForm.receiptType">
              <el-radio :label="0">预收</el-radio>
              <el-radio :label="1">额外收入</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <div style="padding-bottom: 10px">
            <el-button type="primary" @click="consure">确认实收</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </div>
        </div>
      </el-dialog>
      <el-table
        :data="tableData"
        border
        stripe
        header
        class="finance-talbe"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="accountVoucherNo"
          label="会计凭证号"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="receiptDate"
          label="收款时间"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="payer"
          label="付款人名称"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="exchangeRate"
          label="汇率"
          min-width="40"
        ></el-table-column>
        <el-table-column prop="amount" label="收款金额" min-width="40">
          <template slot-scope="scope">
            <div>
              {{ currencyArr[scope.row.currency] }}{{ scope.row.amount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="writeOffLeft"
          label="核销剩余金额"
          min-width="40"
        >
          <template slot-scope="scope">
            <div>
              {{ currencyArr[scope.row.currency]
              }}{{ scope.row.writeOffLeft }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="receiptType" label="实收类型" min-width="40">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.receiptType == 0
                  ? "预收"
                  : scope.row.receiptType == 1
                  ? "额外收入"
                  : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="payeeName"
          label="收款人名称"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="payeeBank"
          label="收款人开户行"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="payeeAccount"
          label="收款人账号"
          min-width="40"
        ></el-table-column>
        <el-table-column label="操作" min-width="40">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editAccount(2, scope.row)"
              size="small"
              v-auth="['108002_B']"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div style="margin-top: 5px; margin-left: 15px">
          <el-button @click="getSum" size="mini" type="primary"
            >数据统计</el-button
          >
          <div style="margin-top: 15px" v-show="statistDataShow">
            <span>实收总金额统计:</span>
            <div style="margin-top: 10px" v-for="(item,index) in statistAllData" :key="index">
              <span>{{currencyArrC[item.currency]}}实收:{{currencyArr[item.currency]+" "+item.amount.toLocaleString('en-US')}}</span>
              <span style="margin-left: 10px"> 核销剩余金额:{{currencyArr[item.currency]+" "+item.writeOffLeft.toLocaleString('en-US')}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //数据统计数据
      statistAllData:[],
      // 下拉列表
      userInfo: [],
      // table选中数据
      selectData: [],
      selectResult: {
        accountVoucherNo: "",
        payer: "",
        userInfo: "",
        receiptType: '',
        startReceiptDate: "",
        endReceiptDate: "",
      },
      tableData: [],
      currencyArr: {},
      currencyArrC: {},
      currencyOptions: this.$store.getters.getCurrencyAddValCode, // 币种键值对
      pageSize: 10,
      pageNum: 1,
      total: "",
      payeeBank: "",
      payeeName: "",
      payeeAccount: "",
      // 控制数据统计显示与隐藏
      statistDataShow: false,
      dialogFormVisible: false,
      // 新增|编辑
      buttonType: 1,
      id: "",
      ruleForm: {
        payer: "",
        userInfo: "",
        amount: "",
        receiptWay: "",
        currency: "",
        receiptDate: "",
        exchangeRate: "",
        accountVoucherNo: "",
        receiptType: 0,
      },
      rules: {
        payer: [
          { required: true, message: "请输入付款人名称", trigger: "blur" },
        ],
        userInfo: [
          { required: true, message: "请输入收款账户信息", trigger: "blur" },
        ],
        amount: [
          { required: true, message: "请输入收款金额", trigger: "blur" },
        ],
        receiptWay: [
          { required: true, message: "请输入收款方式", trigger: "blur" },
        ],
        currency: [{ required: true, message: "请选择币种", trigger: "blur" }],
        receiptDate: [
          { required: true, message: "请选择收款时间", trigger: "blur" },
        ],
        exchangeRate: [
          { required: true, message: "请输入汇率", trigger: "blur" },
        ],
        receiptType: [
          { required: true, message: "请选择实收类型", trigger: "blur" },
        ],
        accountVoucherNo:[
          { required: true, message: "请输入会计凭证号", trigger: "blur" },
        ]
      },
      options: [
        {
          value: '',
          label: "全部",
        },
        {
          value: "0",
          label: "预收",
        },
        {
          value: "1",
          label: "额外收入",
        },
      ],
      // 控制航班日期输入限制
      pickerOptionsStartOne: {
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endReceiptDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startReceiptDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        },
      },
    };
  },
  mounted() {
    var array = this.$store.getters.getCurrencyIdObjArr
    this.currencyArr = array[1] // ["¥", "HK$", "$", "€", "￡"],
    this.currencyArrC = array[2] // ['人民币','港币','美金','欧元','英镑']
    this.initUserInfo();
    this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      if (this.selectResult.userInfo.length > 0) {
        var arr = this.selectResult.userInfo.split("-");
        this.payeeBank = arr[0];
        this.payeeName = arr[1];
        this.payeeAccount = arr[2];
      } else {
        this.payeeBank = "";
        this.payeeName = "";
        this.payeeAccount = "";
      }

      var params = {
        accountVoucherNo: this.selectResult.accountVoucherNo,
        endReceiptDate: this.selectResult.endReceiptDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        payeeAccount: this.payeeAccount,
        payeeBank: this.payeeBank,
        receiptType: this.selectResult.receiptType,
        payeeName: this.payeeName,
        payer: this.selectResult.payer,
        startReceiptDate: this.selectResult.startReceiptDate,
      };
      this.$http
        .post(this.$service.searchByPageInAdvance, params)
        .then((data) => {
          this.tableData = data.data.records;
          this.total = data.data.total;
        });
    },
    initUserInfo() {
      const keyWord = "";
      this.$http
        .get(this.$service.searchByAccount + "?account=" + keyWord)
        .then((data) => {
          this.userInfo = data.data;
        });
    },
    //  清空
    restClick() {
      this.selectResult = {
        accountVoucherNo: "",
        payer: "",
        userInfo: "",
        receiptType: null,
        startReceiptDate: "",
        endReceiptDate: "",
      };
      this.payeeBank = "";
      this.payeeName = "";
      this.payeeAccount = "";
      this.pageNum = 1;
      this.pageSize = 10;
      this.initData();
    },
    searchClick() {
      this.pageNum = 1;
      this.initData();
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.initData();
    },
    handleSizeChange(e) {
      this.pageNum = 1;
      this.pageSize = e;
      this.initData();
    },
    handleSelectionChange(val) {
      this.selectData = val;
    },
    //导出列表
    exportList() {
      let request = Object.assign({},this.selectResult,{queryType:0})
       if (this.selectResult.userInfo.length > 0) {
        var arr = this.selectResult.userInfo.split("-");
        this.payeeBank = arr[0];
        this.payeeName = arr[1];
        this.payeeAccount = arr[2];
      } else {
        this.payeeBank = "";
        this.payeeName = "";
        this.payeeAccount = "";
      }
      request.payeeBank = this.payeeBank
      request.payeeName = this.payeeName
      request.payeeAccount = this.payeeAccount
      delete request.userInfo
      let JSON = {
        advanceReceiptPageDTO:request,
        adrIds:this.selectData.length>0 ? this.selectData.map(item=>item.id) : [],
      }
      this.$http.post(this.$service.inAdvanceExportExcel,JSON,{responseType: 'arraybuffer'}).then(data=>{
        // console.log(data)
          const aLink = document.createElement("a");
            let blob = new Blob([data], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '预收列表' + '.xlsx')
            aLink.click()
            document.body.appendChild(aLink)
      })
    },
    editAccount(type, msg) {
      // 新增|编辑
      if (type == 1) {
        this.buttonType = 1;
        this.ruleForm.payer = "";
        this.ruleForm.userInfo = "";
        this.ruleForm.amount = "";
        this.ruleForm.receiptWay = "";
        this.ruleForm.currency = "";
        this.ruleForm.receiptDate = "";
        this.ruleForm.exchangeRate = "";
        this.ruleForm.accountVoucherNo = "";
        this.dialogFormVisible = true;
      } else {
        // 已核销
       if (msg.amount != msg.writeOffLeft) {
          this.$message.warning("该记录已核销，不能编辑");
          return;
        }
        {
          this.id = msg.id;
          this.dialogFormVisible = true;
          this.buttonType = 2;
          this.ruleForm.payer = msg.payer;
          this.ruleForm.userInfo =
            msg.payeeBank + "-" + msg.payeeName + "-" + msg.payeeAccount;
          this.ruleForm.amount = msg.amount;
          this.ruleForm.receiptWay = msg.receiptWay;
          this.ruleForm.currency = msg.currency;
          this.ruleForm.receiptDate = msg.receiptDate;
          this.ruleForm.exchangeRate = msg.exchangeRate;
          this.ruleForm.accountVoucherNo = msg.accountVoucherNo;
          this.ruleForm.receiptType = msg.receiptType;
        }
      }
    },
    // 模态框确认
    consure() {
      // 新增
      if (this.buttonType == 1) {
        if (
          this.ruleForm.payer === "" ||
          this.ruleForm.userInfo === "" ||
          this.ruleForm.amount === "" ||
          this.ruleForm.receiptWay === "" ||
          this.ruleForm.currency === "" ||
          this.ruleForm.receiptDate === "" ||
          this.ruleForm.exchangeRate === "" ||
          this.ruleForm.accountVoucherNo === ""
        ) {
          this.$message.warning(
            "付款人名称、收款账户信息、收款金额、收款方式、币种、收款时间、汇率、会计凭证号等不能为空"
          );
          return;
        } else {
          var arr = this.ruleForm.userInfo.split("-");
          this.payeeBank = arr[0];
          this.payeeName = arr[1];
          this.payeeAccount = arr[2];
          const params = {
            payer: this.ruleForm.payer,
            payeeBank: this.payeeBank,
            payeeName: this.payeeName,
            payeeAccount: this.payeeAccount,
            amount: this.ruleForm.amount,
            receiptWay: this.ruleForm.receiptWay,
            currency: this.ruleForm.currency,
            receiptDate: this.ruleForm.receiptDate,
            exchangeRate: this.ruleForm.exchangeRate,
            accountVoucherNo: this.ruleForm.accountVoucherNo,
            receiptType: this.ruleForm.receiptType,
          };
          this.$http.post(this.$service.newAddInAdvance, params).then((res) => {
            if (res.code == 200) {
              this.$message.success("新增成功");
              this.payeeBank = "";
              this.payeeName = "";
              this.payeeAccount = "";
              this.initData();
              this.dialogFormVisible = false;
            } else {
              this.$message.error(res.message);
            }
          });
        }
      } else {
        if (
          this.ruleForm.payer === "" ||
          this.ruleForm.userInfo === "" ||
          this.ruleForm.amount === "" ||
          this.ruleForm.receiptWay === "" ||
          this.ruleForm.currency === "" ||
          this.ruleForm.receiptDate === "" ||
          this.ruleForm.exchangeRate === "" ||
          this.ruleForm.accountVoucherNo === ""
        ) {
          this.$message.warning(
            "付款人名称、收款账户信息、收款金额、收款方式、币种、收款时间、汇率、会计凭证号等不能为空"
          );
          return;
        } else {
          var arr = this.ruleForm.userInfo.split("-");
          this.payeeBank = arr[0];
          this.payeeName = arr[1];
          this.payeeAccount = arr[2];
          const params = {
            payer: this.ruleForm.payer,
            payeeBank: this.payeeBank,
            payeeName: this.payeeName,
            payeeAccount: this.payeeAccount,
            amount: this.ruleForm.amount,
            receiptWay: this.ruleForm.receiptWay,
            currency: this.ruleForm.currency,
            receiptDate: this.ruleForm.receiptDate,
            exchangeRate: this.ruleForm.exchangeRate,
            accountVoucherNo: this.ruleForm.accountVoucherNo,
            receiptType: this.ruleForm.receiptType,
            id: this.id,
          };
          this.$http.post(this.$service.editInAdvance, params).then((res) => {
            if (res.code == 200) {
              this.$message.success("编辑成功");
              this.payeeBank = "";
              this.payeeName = "";
              this.payeeAccount = "";
              this.initData();
              this.dialogFormVisible = false;
            } else {
              this.$message.error(res.message);
            }
          });
        }
      }
    },
    //数据统计
    getSum() {
      this.statistDataShow = !this.statistDataShow;

      let request = {
        overPageCheck:this.selectData.length>0 ? false : true,
        adrIds:this.selectData.length>0 ? this.selectData.map(item=>item.id) : [],
        advanceReceiptPageDTO:Object.assign({},this.selectResult,{queryType:0})
      }
       if (this.selectResult.userInfo.length > 0) {
        var arr = this.selectResult.userInfo.split("-");
        this.payeeBank = arr[0];
        this.payeeName = arr[1];
        this.payeeAccount = arr[2];
      } else {
        this.payeeBank = "";
        this.payeeName = "";
        this.payeeAccount = "";
      }
      request.advanceReceiptPageDTO.payeeBank = this.payeeBank
      request.advanceReceiptPageDTO.payeeName = this.payeeName
      request.advanceReceiptPageDTO.payeeAccount = this.payeeAccount
      delete request.advanceReceiptPageDTO.userInfo
      this.$http.post(this.$service.inAdvanceSum,request).then(data=>{
        if(data.code == 200) {
            this.statistAllData = data.data
        }
        else {
          this.statistAllData = [{}]
          this.$message.error(data.message)
        }
      })


    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-table{
  max-height: 550px;
  overflow:auto ;
 .el-table__body-wrapper {
  max-height: 480px;
  overflow-y: auto;
}
}
.content {
  background: #fff;
  margin: 20px 20px 0 20px;
}
.content-search {
  padding: 20px 20px 0 20px !important;
}
.el-button--primary {
  width: 100px;
  // text-align: center;
}
.footer {
  text-align: center;
}
/deep/.el-table {
  th {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
  td {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
}
</style>