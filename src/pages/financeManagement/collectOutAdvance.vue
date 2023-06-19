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
           <el-form-item label="收款人名称:">
            <el-input
              clearable
              maxlength="30"
              v-model="selectResult.payeeName"
              placeholder="请输入付款人名称"
            ></el-input>
          </el-form-item>
           <el-form-item label="付款账户信息:">
            <el-select
             id="getAccountInfo1"
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
         
         
          <el-form-item label="实付类型:">
            <el-select v-model="selectResult.paidType" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="付款时间:" label-width="80px">
            <el-date-picker
              style="width: 150px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startPayDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="起始日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.endPayDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div style="text-align: center; margin-bottom: 20px">
        <el-button @click="searchClick" size="mini" type="primary"
          v-auth:none="['108400_B']"
          >查询</el-button
        >
        <el-button @click="restClick" size="mini" type="primary"
          v-auth:none="['108400_B']"
          >清空</el-button
        >
      </div>

      <div style="text-align: right; margin-bottom: 5px">
        <el-button @click="editAccount(1)" size="mini" type="primary"
          v-auth="['108401_B']"
          >新增预付</el-button
        >
        <el-button @click="exportList" size="mini" type="primary"
          >导出列表</el-button
        >
      </div>

      <el-dialog
        :title="buttonType == 1 ? '实付新增' : '编辑实付'"
        :visible.sync="dialogFormVisible"
        :width="'900px'"
      >
        <!-- 模态框 -->
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <div
            style="
              display: flex;
              margin-top: 10px;
              justify-content: space-around;
              margin-left: 10px;
            "
          >
            <el-form-item label="收款人名称" prop="payeeName" required>
              <el-input
                v-model.trim="ruleForm.payeeName"
                clearable
                placeholder="请输入收款人名称"
                maxlength="30"
                style="width:217px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="付款账户信息"
              prop="userInfo"
              required
              label-width="120px"
            >
              <el-select
                v-model="ruleForm.userInfo"
                id="getAccountInfo"
                placeholder="请输入付款账户信息"
                clearable
                filterable
                remote
                reserve-keyword
                style="width: 230px"
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
            <el-form-item label="付款金额" prop="payAmount" required>
              <el-input
                placeholder="请输入收款金额"
                clearable
                maxlength="13"
                v-model="ruleForm.payAmount"
                onKeyUp="this.value= this.value.match(/^\d{0,10}(\.\d{0,2})?/)? this.value.match(/^\d{0,10}(\.\d{0,2})?/)[0] : ''"
                @blur="ruleForm.payAmount = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="付款方式" prop="paymentMethod" required>
              <el-select v-model="ruleForm.paymentMethod" clearable>
                <el-option label="银行转账" :value="1"></el-option>
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
            <el-form-item label="币种" prop="currency" required>
              <el-select v-model="ruleForm.currency" clearable>
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
                <!-- <el-option label="CNY" :value="1"></el-option>
                <el-option label="HKD" :value="2"></el-option>
                <el-option label="USD" :value="3"></el-option>
                <el-option label="EUR" :value="4"></el-option>
                <el-option label="GBP" :value="5"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="付款时间" prop="payDate" required>
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="ruleForm.payDate"
                type="date"
                placeholder="选择付款时间"
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
            <el-form-item label="汇率" prop="exchangeRate" required>
              <el-input
                placeholder="请输入汇率"
                clearable
                v-model="ruleForm.exchangeRate"
                onKeyUp="this.value= this.value.match(/^\d{0,4}(\.\d{0,2})?/)? this.value.match(/^\d{0,4}(\.\d{0,2})?/)[0] : ''"
                @blur="ruleForm.exchangeRate = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="会计凭证号" prop="accountVoucherNo" required>
              <el-input
                clearable
                maxlength="10"
                v-model="ruleForm.accountVoucherNo"
                placeholder="请输入会计凭证号"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item
            label="实付类型"
            prop="paidType"
            style="margin-left: 45px"
            required
          >
            <el-radio-group v-model="ruleForm.paidType">
              <el-radio :label="1">预付</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <div style="padding-bottom: 10px">
            <el-button type="primary" @click="consure" :disabled="disableButton">确认实付</el-button>
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
          prop="payDate"
          label="付款时间"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="payeeName"
          label="收款人名称"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="exchangeRate"
          label="汇率"
          min-width="40"
        ></el-table-column>
        <el-table-column prop="payAmount" label="付款金额" min-width="40">
          <template slot-scope="scope">
            <div>
              {{ currencyArr[scope.row.currency] }}{{ scope.row.payAmount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="writeOffRemainAmount"
          label="核销剩余金额"
          min-width="40"
        >
          <template slot-scope="scope">
            <div>
              {{ currencyArr[scope.row.currency]
              }}{{ scope.row.writeOffRemainAmount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="paidType" label="实付类型" min-width="40">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.paidType == 1
                  ? "预付"
                  : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountName"
          label="付款人名称"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="accountBank"
          label="付款人开户行"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="bankAccount"
          label="付款人账号"
          min-width="40"
        ></el-table-column>
        <el-table-column label="操作" min-width="40">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editAccount(2, scope.row)"
              size="small"
              v-auth="['108402_B']"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div style="margin-top: 5px; margin-left: 15px">
          <el-button @click="getSum(false)" size="mini" type="primary"
            >数据统计</el-button
          >
          <div style="margin-top: 15px" v-show="statistDataShow">
            <span>实收总金额统计:</span>
            <div style="margin-top: 10px" v-for="(item,index) in statistAllData" :key="index">
              <span style="width:150px;display:inline-block;">{{currencyArrC[item.currency]}}实收:{{currencyArr[item.currency]+" "+(item.payAmount && item.payAmount.toLocaleString('en-US'))}}</span>
              <span style="margin-left: 10px"> 核销剩余金额:{{currencyArr[item.currency]+" "+(item.writeOffRemainAmount && item.writeOffRemainAmount.toLocaleString('en-US'))}}</span>
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
      disableButton:false,
      //数据统计数据
      statistAllData:[],
      // 下拉列表
      userInfo: [],
      // table选中数据
      selectData: [],
      currencyOptions: this.$store.getters.getCurrencyAddValCode, // 币种键值对
      selectResult: {
        accountVoucherNo: "",
        payeeName: "",
        userInfo: "",
        paidType: '1',
        startPayDate: "",
        endPayDate: "",
      },
      tableData: [],
      currencyArr: {},
      currencyArrC: {},
      pageSize: 10,
      pageNum: 1,
      total: "",
      accountBank: "",
      payeeName: "",
      payeeAccount: "",
      // 控制数据统计显示与隐藏
      statistDataShow: false,
      dialogFormVisible: false,
      // 新增|编辑
      buttonType: 1,
      id: "",
      ruleForm: {
        payeeName: "",
        userInfo: "",
        payAmount: "",
        paymentMethod: "",
        currency: "",
        payDate: "",
        exchangeRate: "",
        accountVoucherNo: "",
        paidType: 1,
      },
     rules: {
        payeeName: [
          { required: true, message: "请输入收款人名称", trigger: ["blur","change"] },
        ],
        userInfo: [
          { required: true, message: "请输入付款账户信息", trigger: "change" },
        ],
        payAmount: [
          { required: true, message: "请输入付款金额", trigger: ["blur","change"] },
        ],
        paymentMethod: [
          { required: true, message: "请输入付款方式", trigger: "change" },
        ],
        currency: [{ required: true, message: "请选择币种", trigger: "change" }],
        payDate: [
          { required: true, message: "请选择付款时间", trigger: "change" },
        ],
        exchangeRate: [
          { required: true, message: "请输入汇率", trigger: ["blur","change"] },
        ],
        accountVoucherNo:[
           { required: true, message: "请输入会计凭证号", trigger: ["blur","change"]},
        ],
        paidType: [
          { required: true, message: "请选择实付类型", trigger: "blur" },
        ],
      },
      options: [
        {
          value: "1",
          label: "预付",
        }
      ],
      // 控制航班日期输入限制
      pickerOptionsStartOne: {
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endPayDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startPayDate;
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
    const select1 = document.querySelector('#getAccountInfo1')
    select1.setAttribute('maxLength',30)
    this.initUserInfo();
    this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      this.statistDataShow = false
      if (this.selectResult.userInfo.length > 0) {
        var arr = this.selectResult.userInfo.split("-");
        this.accountBank = arr[0];
        this.accountName = arr[1];
        this.bankAccount = arr[2];
      } else {
        this.accountBank = "";
        this.accountName = "";
        this.bankAccount = "";
      }

      var params = {
        accountVoucherNo: this.selectResult.accountVoucherNo,
      
        bankAccount: this.bankAccount,
        accountBank: this.accountBank,
        accountName: this.accountName,

        payeeName: this.selectResult.payeeName,
        startPayDate: this.selectResult.startPayDate,
        endPayDate: this.selectResult.endPayDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        paidType: this.selectResult.paidType,

      };
      this.$http
        .post(this.$service.outAdvanceSearch, params)
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
        payeeName: "",
        userInfo: "",
        paidType: '1',
        startPayDate: "",
        endPayDate: "",
      };
      this.accountBank = "";
      this.accountName = "";
      this.bankAccount = "";
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
      if(this.statistDataShow){
        this.getSum(true)
      }
    },
    //导出列表
    exportList() {
      let request = Object.assign({},this.selectResult,{prIds:this.selectData.map(item=>item.id)})
       if (this.selectResult.userInfo.length > 0) {
        var arr = this.selectResult.userInfo.split("-");
        this.accountBank = arr[0];
        this.accountName = arr[1];
        this.bankAccount = arr[2];
      } else {
        this.accountBank = "";
        this.accountName = "";
        this.bankAccount = "";
      }
      request.accountBank = this.accountBank
      request.accountName = this.accountName
      request.bankAccount = this.bankAccount
      delete request.userInfo
    
      this.$http.post(this.$service.outAdvanceExport,request,{responseType: 'arraybuffer'}).then(data=>{
        // console.log(data)
          const aLink = document.createElement("a");
            let blob = new Blob([data], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '预付列表' + '.xlsx')
            aLink.click()
            document.body.appendChild(aLink)
      })
    },
    editAccount(type, msg) {
      // 新增|编辑
      if (type == 1) {
        this.buttonType = 1;
        this.ruleForm.payeeName = "";
        this.ruleForm.userInfo = "";
        this.ruleForm.payAmount = "";
        this.ruleForm.paymentMethod = "";
        this.ruleForm.currency = "";
        this.ruleForm.payDate = "";
        this.ruleForm.exchangeRate = "";
        this.ruleForm.accountVoucherNo = "";
        this.dialogFormVisible = true;
       
         
      } else {
        // 已核销
       if (msg.payAmount != msg.writeOffRemainAmount) {
          this.$message.warning("该记录已核销，不能编辑");
          return;
        }
        {
          this.id = msg.id;
          this.dialogFormVisible = true;
          this.buttonType = 2;
          this.ruleForm.payeeName = msg.payeeName;
          this.ruleForm.userInfo =
            msg.accountBank + "-" + msg.accountName + "-" + msg.bankAccount;
          this.ruleForm.payAmount = msg.payAmount;
          this.ruleForm.paymentMethod = msg.paymentMethod;
          this.ruleForm.currency = msg.currency;
          this.ruleForm.payDate = msg.payDate;
          this.ruleForm.exchangeRate = msg.exchangeRate;
          this.ruleForm.accountVoucherNo = msg.accountVoucherNo;
          this.ruleForm.paidType = msg.paidType;
        }
      }
       this.$nextTick(()=>{
            const select = document.querySelector('#getAccountInfo')
            select.setAttribute('maxLength',30)
        })
    },
    // 模态框确认
    consure() {

      // console.log(this.ruleForm)
      // 新增
      if (this.buttonType == 1) {
        if (
          !this.ruleForm.payeeName  ||
          !this.ruleForm.userInfo  ||
          !this.ruleForm.payAmount  ||
          !this.ruleForm.paymentMethod  ||
          !this.ruleForm.currency  ||
          !this.ruleForm.payDate  ||
          !this.ruleForm.exchangeRate || 
          !this.ruleForm.accountVoucherNo
        ) {
          this.$message.warning(
            "请完成所有信息填写后进行操作"
          );
          return;
        } else {
          this.disableButton = true
          var arr = this.ruleForm.userInfo.split("-");
          this.accountBank = arr[0];
          this.accountName = arr[1];
          this.bankAccount = arr[2];
          const params = {
            accountName:this.accountName,
            bankAccount:this.bankAccount,
            payeeName: this.ruleForm.payeeName,
            accountBank: this.accountBank,
            payAmount: this.ruleForm.payAmount,
            paymentMethod: this.ruleForm.paymentMethod,
            currency: this.ruleForm.currency,
            payDate: this.ruleForm.payDate,
            exchangeRate: this.ruleForm.exchangeRate,
            accountVoucherNo: this.ruleForm.accountVoucherNo,
            paidType: this.ruleForm.paidType,
          };
          this.$http.post(this.$service.addOutAdvance, params).then((res) => {
          this.disableButton = false
            
            if (res.code == 200) {
              this.$message.success("新增成功");
              this.accountBank = "";
              this.accountName = "";
              this.bankAccount = "";
              this.initData();
              this.dialogFormVisible = false;
            } else {
              this.$message.error(res.message);
            }
          });
        }
      } else {
        if (
          !this.ruleForm.payeeName  ||
          !this.ruleForm.userInfo  ||
          !this.ruleForm.payAmount  ||
          !this.ruleForm.paymentMethod  ||
          !this.ruleForm.currency  ||
          !this.ruleForm.payDate  ||
          !this.ruleForm.exchangeRate || 
          !this.ruleForm.accountVoucherNo
        ) {
          this.$message.warning(
            "请完成所有信息填写后进行操作"
          );
          return;
        } else {
          this.disableButton = true

          var arr = this.ruleForm.userInfo.split("-");
          this.accountBank = arr[0];
          this.accountName = arr[1];
          this.bankAccount = arr[2];
          const params = {
           accountName:this.accountName,
            bankAccount:this.bankAccount,
            payeeName: this.ruleForm.payeeName,
            accountBank: this.accountBank,
            payAmount: this.ruleForm.payAmount,
            paymentMethod: this.ruleForm.paymentMethod,
            currency: this.ruleForm.currency,
            payDate: this.ruleForm.payDate,
            exchangeRate: this.ruleForm.exchangeRate,
            accountVoucherNo: this.ruleForm.accountVoucherNo,
            paidType: this.ruleForm.paidType,
            id: this.id,
          };
          this.$http.post(this.$service.editOutAdvance, params).then((res) => {
          this.disableButton = false
            if (res.code == 200) {
              this.$message.success("编辑成功");
              this.accountBank = "";
              this.accountName = "";
              this.bankAccount = "";
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
    getSum(onlyChangeData) {
      if(!onlyChangeData){
          this.statistDataShow = !this.statistDataShow;
          if(!this.statistDataShow) return
      }
      let request = Object.assign({},this.selectResult,{prIds:this.selectData.map(item=>item.id)})
       if (this.selectResult.userInfo.length > 0) {
        var arr = this.selectResult.userInfo.split("-");
        this.accountBank = arr[0];
        this.accountName = arr[1];
        this.bankAccount = arr[2];
      } else {
        this.accountBank = "";
        this.accountName = "";
        this.bankAccount = "";
      }
      request.accountBank = this.accountBank
      request.accountName = this.accountName
      request.bankAccount = this.bankAccount
      delete request.userInfo
      this.$http.post(this.$service.outAdvanceCount,request).then(data=>{
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
  padding: 10px 0;
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