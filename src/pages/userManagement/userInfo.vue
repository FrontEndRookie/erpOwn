<template>
  <div class="bodyUserInfo">
    <div style="margin-top:20px;height:20px"></div>
    <table class="tableClass">
      <tr>
        <th>登录账号</th>
        <th>{{userInfoObj.loginName}}</th>
      </tr>
      <tr>
        <th>姓名</th>
        <th>{{userInfoObj.name}}</th>
      </tr>
      <tr>
        <th>手机号</th>
        <th>{{userInfoObj.tel}}</th>
      </tr>
      <tr>
        <th>QQ号</th>
        <th>{{userInfoObj.qq}}</th>
      </tr>
      <tr>
        <th>角色</th>
        <th>{{userInfoObj.roles?userInfoObj.roles:""}}</th>
      </tr>
      <tr>
        <th>部门</th>
        <th>{{userInfoObj.departments?userInfoObj.departments:""}}</th>
      </tr>
    </table>
    <div class="buttons">
      <el-button type="primary" @click="changePassword()">密码重置</el-button>
      <el-button type="primary" @click="showDialogThing()">换绑企业微信</el-button>
    </div>
    <el-dialog
      title="密码重置"
      :visible.sync="showDialog1"
      width="30%"
      @close="resetForm('passForm')">
      <div class="dialogBody">
        <el-form :model="passForm" status-icon :rules="passRules" ref="passForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="原密码" prop="oldPass">
            <el-input type="password" placeholder="请输入原密码" v-model="passForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="设置密码" prop="newPass">
            <el-input ref="input1" placeholder="请设置密码(8-20位字母+数字)" @change="inputBlur('input2')" id="input1" type="password" v-model="passForm.newPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="效验密码" prop="repetitionPass">
            <el-input ref="input2" placeholder="请输入效验密码" @change="inputBlur('input1')" id="input2" type="password" v-model="passForm.repetitionPass" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('passForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('passForm')">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="扫码换绑当前账户企业微信"
      :visible.sync="showDialog2"
      width="30%"
      :before-close="handleClose">
      <div class="dialogBody">
        <div id="QRimg" class="QRimg"></div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog2 = false">取 消</el-button>
        <el-button type="primary" @click="showDialog2 = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
  import {
    toData
  } from '@/util/assist'
  const { HTTP_PATH: HTTPUrl} = process.env
  export default {
    data() {
      var validatePass1 = (rule, value, callback) =>{
        if (!value) {
          return callback(new Error('密码不能为空'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) =>{
        // console.log(value," - ",this.passForm.repetitionPass,this.passForm);
        if (!value) {
          return callback(new Error('密码不能为空'));
        }
        setTimeout(()=>{
          if(!this.verifyStr(value)){
            return callback(new Error('请输入8-20位密码(数字+字母组合)'));
          }else if(this.passForm.repetitionPass && this.passForm.repetitionPass != value){
            return callback(new Error('两次密码不一致'));
          }else {
            callback();
          }
        },100)
      };
      var validatePass3 = (rule, value, callback) =>{
        // console.log(value," - ",this.passForm.newPass,this.passForm);
        if (!value) {
          return callback(new Error('密码不能为空'));
        }
        setTimeout(()=>{
          if(!this.verifyStr(value)){
            return callback(new Error('请输入8-20位密码(数字+字母组合)'));
          }else if(this.passForm.newPass && this.passForm.newPass != value){
            return callback(new Error('两次密码不一致'));
          }else {
            callback();
          }
        },100)
      };
      return {
        showDialog1:false,
        showDialog2:false,
        passForm:{
          oldPass:'',
          newPass:'',
          repetitionPass:'',
        },
        userForm:{
          state:"",
          appid:"",
          code: '',
        },
        passRules:{
          oldPass:[{validator: validatePass1,trigger: 'blur',required: true}],
          newPass:[{validator: validatePass2,trigger: 'blur',required: true}],
          repetitionPass:[{validator: validatePass3,trigger: 'blur',required: true}],
        },
        userInfoObj:{},
      }
    },
    mounted(){
      // this.initCode();
      this.userInfoObj = JSON.parse(sessionStorage.getItem("userInfo"))
      this.$http.get(this.$service.userSelfInfo+"?id="+this.userInfoObj.id).then(data => {
        if(data.code == 200){
          this.$set(this.userInfoObj,"departments",data.data.departments)
          this.$set(this.userInfoObj,"roles",data.data.roles)
        }else{
          this.$message.error("获取用户信息失败，请联系管理员")
        }
      })
      // console.log(this.userInfoObj);
    },
    // 监听路有变化获取code参数值
    watch: {
      "$route.query": {
        handler(newVal, oldVal) {
          // console.info(newVal, oldVal);
          this.userForm.code = this.$route.query["code"];
          this.userForm.appid = this.$route.query["appid"];
          this.userForm.state = this.$route.query["state"];
          if(this.userForm.code){
            this.getStaffInfo()
          }
          // this.userForm.code && this.getStaffInfo(); //获取到code，调用后端接口换取token
        },
        deep: true,
        immediate: true,
      },
    },
    computed:{
      roleName(){
        var obj = {1:"nan",2:"nv",3:"niu"}
        return obj[1]+','+obj[3]
      },
      departmentName(){
        var obj = {1:"guowao",2:"guonei",3:"waixing"}
        return obj[1]+','+obj[3]
      },
    },
    methods: {
      // 验证密码是否保函数字，字母。
			verifyStr(str) {
        var regpass = /^[0-9A-Za-z]{8,20}$/
				var regNumber = /\d+/ //验证0-9的任意数字最少出现1次。
				var regString = /[a-zA-Z]+/ //验证大小写26个字母任意字母最少出现1次。
        if(regpass.test(str)){

        }else{
          return false
        }
				if (regNumber.test(str)) {
					// console.log("包含数字");
				} else {
					// console.log("不包含数字");
					return false
				}
				if (regString.test(str)) {
					// console.log("包含字母");
				} else {
					// console.log("不包含字母");
					return false
				}
				return true
			},
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {
              id:this.userInfoObj.id,
              oldPassword:this.passForm.oldPass,
              newPassword:this.passForm.newPass
            }
            this.$http.post(this.$service.userResetPassword,obj).then(data => {
              if(data.code == 200){
                this.$message.success(data.message)
                this.showDialog1 = false
              }else{
                this.$message.error(data.message)
              }
            }).catch(()=>{
              console.log("异常抛出");
            }).finally(()=>{
              // this.loading = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.showDialog1 = false
      },
      inputBlur(idName){
        var input = this.$refs[idName]
        // console.log(input.value);
        if(input.value){
          this.$refs[idName].focus()
          this.$refs[idName].blur()
        }
      },
      showDialogThing(){
        this.showDialog2 = true
        setTimeout(() => {
          this.initCode()
        }, 100);
      },
      changePassword(){
        this.showDialog1 = true
      },
      initCode(){
        try{
          if(HTTPUrl.indexOf("lxErp")>-1){
            var appid = "wwf3b50050acc0fed3"
            var agentid = "1000011"
          }else{
            var appid = "wwf3b50050acc0fed3"
            var agentid = "1000012"
          }
          new WwLogin({
            id: "QRimg",
            // [appid] 企业微信的CorpID，在企业微信管理端查看
            appid: appid,
            // [agentid] 授权方的网页应用ID，在具体的网页应用中查看
            agentid: agentid,
            // [redirect_uri] 重定向地址，需要进行UrlEncode
            // redirect_uri: encodeURIComponent("https://xxxx.com/#/login"),
            redirect_uri: encodeURIComponent(HTTPUrl+"/#/userManagement/personalCenter"),
            // redirect_uri: encodeURIComponent(location.origin+"/#/login"),
            // [state] 用于保持请求和回调的状态，授权请求后原样带回给企业。
            // 该参数可用于防止csrf攻击（跨站请求伪造攻击），建议企业带上该参数，可设置为简单的随机数加session进行校验
            state: Date.now() + appid,	//这里可使用上面appid
            // [href] 自定义样式链接，企业可根据实际需求覆盖默认样式
            // href: "https://xxxx.com/wxCode/wxQrcode.css",
            href: "",
          });
        }
        catch(err){
          console.log("异常抛出："+ "err");
        }
      },
      // 企业微信扫码登录
      getStaffInfo() {
        var obj = this.userForm
        this.$set(obj,"id",this.userInfoObj.id)
        this.showDialog2 = false
        this.$http.post(this.$service.userChangeQW,obj).then(data => {
          if(data.code == 200){
            this.$message.success("企业微信换绑成功,下次登录请使用最新授权的二维码扫描登录")
          }else{
            this.$message.error(data.message)
          }
        }).catch(()=>{
          this.$router.push({ path: "/userManagement/personalCenter" });
          this.$message.error("授权失败："+err)
        }).finally(()=>{
          this.$router.push({ path: "/userManagement/personalCenter"});
        })
      },
    }
  }
</script>

<style scoped lang="less">
.bodyUserInfo{
  background: #fff;
  width: 100%;
  height: 100%;
  .tableClass{
    margin: 20px auto;
    border-collapse:collapse;
    border-top:1px #333 solid ;
    border-left:1px #333 solid ;
    tr{
      th{
        font-size: 14px;
        min-width: 400px;
        min-height: 40px;
        line-height: 40px;
        text-align: center;
        border-bottom:1px #333 solid ;
        border-right:1px #333 solid ;
      }
    }
  }
  .dialogBody{
    width: 100%;
    min-height: 80px;
    margin: 20px 0;
    .QRimg{
      margin: 0 auto;
      width: 300px;
      height: auto;
    }
  }
  .buttons{
    width: 50%;
    display: flex;
    justify-content: space-around;
    margin: 30px auto;
  }
}
</style>
