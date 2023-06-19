<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="fit-content">
    <el-form
      ref="ruleForm"
      :model="formResult"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item label="分公司:" required prop="orgMes">
        <el-select
          v-model="formResult.orgMes"
          placeholder="请选择分公司"
          :disabled="dialType != 1"
          clearable
        >
          <el-option
            v-for="(item, index) in fgsList"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}-${item.name}`"
            :disabled="item.isAddPaymentInfo"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址:" required prop="address">
        <el-input
          v-model="formResult.address"
          placeholder="请输入地址"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="公司开户名:" required prop="name">
        <el-input
          v-model="formResult.name"
          placeholder="请输入开户名"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="公司英文名:" required prop="englishName">
        <el-input
          v-model="formResult.englishName"
          placeholder="请输入公司英文名"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="开户行:" required prop="bank">
        <el-input
          v-model="formResult.bank"
          placeholder="请输入开户行"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="人民币账号:" prop="chineseAccount">
        <el-input
          v-model="formResult.chineseAccount"
          placeholder="请输入人民币账号"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="美金账号:" prop="americaAccount">
        <el-input
          v-model="formResult.americaAccount"
          placeholder="请输入美金账号"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="PAYEE’S BANK:"
        :required="eRequired"
        prop="payeeBank"
      >
        <el-input
          v-model="formResult.payeeBank"
          placeholder="请输入开户行"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="SWIFT ADDRESS:"
        :required="eRequired"
        prop="swiftAddress"
      >
        <el-input
          v-model="formResult.swiftAddress"
          placeholder="请输入SWIFT ADDRESS"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="PAYEE’S NAME:"
        :required="eRequired"
        prop="payeeName"
      >
        <el-input
          v-model="formResult.payeeName"
          placeholder="请输入开户名"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="PAYEE’S A/C:" :required="eRequired" prop="payeeAc">
        <el-input
          v-model="formResult.payeeAc"
          placeholder="请输入账号"
          maxlength="50"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmForm">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialType: {
      type: Number,
      default: 1
    },
    fgsList: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.dialogVisible = true;
  },
  mounted() {},
  data() {
    return {
      title: "",
      dialogVisible: false,
      formResult: {
        orgMes: "",
        address: "",
        name: "",
        englishName: "",
        bank: "",
        chineseAccount: "",
        americaAccount: "",
        payeeBank: "",
        swiftAddress: "",
        payeeName: "",
        payeeAc: ""
      },
      eRequired: false,
      requestMethod: "addPayment",
      rules: {
        orgMes: [
          { required: true, message: "请选择分公司", trigger: "change" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        name: [
          { required: true, message: "请输入公司开户名", trigger: "blur" }
        ],
        englishName: [
          { required: true, message: "请输入公司英文名", trigger: "blur" }
        ],
        bank: [{ required: true, message: "请输入开户行", trigger: "blur" }],
        chineseAccount:[{
            validator: this.formExams,
            trigger: "blur"
        }],
        americaAccount:[{
            validator: this.formExams,
            trigger: "blur"
        }],
        payeeBank: [
          {
            validator: this.formExam,
            trigger: "blur"
          }
        ],
        swiftAddress: [
          { validator: this.formExam, trigger: "blur" }
        ],
        payeeName: [
          { validator: this.formExam, trigger: "blur" }
        ],
        payeeAc: [{ validator: this.formExam, trigger: "blur" }]
      }
    };
  },
  methods: {
    formExam(rule, value, callback){
        let { payeeBank, swiftAddress, payeeName, payeeAc } = this.formResult;
        if (payeeBank || swiftAddress || payeeName || payeeAc){
            if( !payeeBank || !swiftAddress || !payeeName || !payeeAc ){
                callback('请填写全部英文信息')
            }else {
          callback();
        }
        }else {
          callback();
        }
    },
    formExams(rule, value, callback){
        let { chineseAccount, americaAccount} = this.formResult;
        if (!chineseAccount && !americaAccount ){
            callback('人民币账号和美金账号请至少填写一项')
        }else {
          callback();
        }
    },
    confirmForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
            let request = { ...this.formResult };
            if (request.orgMes) {
                let res = request.orgMes.split("-");
                request.orgId = res[0];
                request.orgName = res[1];
                delete request.orgMes
            }
            this.$http[this.requestWay](this.$service[this.requestMethod], request).then(res => {
                if (res.code == 200) {
                    this.$message.success(this.dialType == 1?'新增':'编辑'+'付款信息成功')
                    this.$parent.searchClick()
                    if(this.dialType == 1){
                        this.$parent.getFgsList()
                    }
                    this.dialogVisible = false
                } 
            });
        } else {
          console.log("error submit!!");
        //   return false;
        }
      });
    }
  },
  watch: {
    dialType: {
      handler(nv) {
        if (nv == 1) {
          this.title = "新增收款信息";
          this.requestMethod = "addPayment";
          this.requestWay = 'post'
        } else {
          this.title = "编辑收款信息";
          this.requestMethod = "editPayment";
          this.requestWay = 'put'

        }
      },
      immediate: true
    },
    dialogVisible(nv) {
      if (!nv) {
        this.$parent.showDial = false;
      }
    },
    formResult: {
      handler(nv) {
        let { payeeBank, swiftAddress, payeeName, payeeAc } = nv;
        if (payeeBank || swiftAddress || payeeName || payeeAc) {
          this.eRequired = true;
        } else {
          this.eRequired = false;
        }
        if( (payeeBank && swiftAddress && payeeName && payeeAc) ||  (!payeeBank && !swiftAddress && !payeeName && !payeeAc)){
            this.$refs.ruleForm.clearValidate();
        }
      },
      deep: true
    }
  }
};
</script>
<style scoped lang="less">
.el-input {
  width: 220px;
}
/deep/.el-dialog {
  padding: 0 40px 20px 0;
}
</style>
