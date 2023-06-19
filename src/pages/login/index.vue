<template>
  <div class="login_bg">
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      title="系统提示"
      :visible.sync="quitDialog"
      width="40%" center>
      <div class="dialog-text" style="text-align: center;">
        <span>已下线
        <br>账号已在其他位置登录，当前已下线</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <a class="el-button el-button--default" id="close_a" href="javascript:window.opener=null;window.open('','_self');window.close();">关闭</a> -->
        
        <el-button type="primary" @click="quitThing(true)">重新登录</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      title="系统提示"
      :visible.sync="forbiddenDialog"
      width="40%" center>
      <div class="dialog-text" style="text-align: center;">
        <span>已下线
        <br>该账号已被禁用，当前已下线</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <a class="el-button el-button--default" id="close_a" href="javascript:window.opener=null;window.open('','_self');window.close();">关闭</a> -->
        
        <el-button type="primary" @click="quitThing(true)">确定</el-button>
      </span>
    </el-dialog>
    <div class="land_logo">
      <div style="margin-left: 30px;">
        <!-- <img src="../../assets/logo.png" style="width: 157px;height: 28px;"/> -->
        <div class="land-logo-img" style="width: 157px;height: 28px;"></div>
      </div>
    </div>
    <div class="login_content" v-loading="loading">
      <div v-show="!loginWay" class="el-total form_list">
        <div class="el-login">
          账号登录
          <div class="iconTag"  @click="loginWayChange(true)">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="32" width="32">
							<path fill="#fff"
								d="M32,24.46V32H26.67l-2.19-2.19V28.24h3.76V24.48H32ZM24.46,20.7v7.54H22.9l-2.2-2.19V20.72h3.76ZM32,16.94V20.7H28.24V16.94Zm-11.3,0V20.7H16.94V16.94Zm-5.64,0V20.4L11.6,16.94ZM32,0V15.06H16.94V0ZM15.06,0V15.06H9.73L6,11.3H11.3V3.76H3.76V9.09L0,5.33V0ZM28.24,3.76H20.7V11.3h7.54ZM9.41,5.65V9.41H5.65V5.65Zm16.94,0V9.41H22.59V5.65Z" />
						</svg>
          </div>
        </div>
        <el-form :label-position="labelPosition" label-width="60px" size="medium" class="demo-form-inline QRcodeDiv">
          <el-form-item label="账号">
            <el-input v-model="form.name" type="text" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.pwd" type="password" @keyup.native.enter="onSubmit" placeholder="请输入密码" clearable></el-input>
          </el-form-item>
          <div class="error">{{errorTitle}}</div>
          <div class="list">
            <el-button @click="onSubmit" type="primary">登录</el-button>
          </div>
        </el-form>
      </div>
      <div v-show="loginWay" class="el-total form_list">
        <div class="el-login">
          {{nextType?"绑定后台账号":'企业微信扫码登录"罗新国际"'}}
          <div class="iconTag" @click="loginWayChange(false)">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="32" width="32">
							<path fill="#fff"
								d="M25.6,5.33V19.2H10.11L6.4,15.37v-10ZM28.7,0A3.3,3.3,0,0,1,32,3.3h0V21.87a3.3,3.3,0,0,1-3.3,3.3H20.58v4.56h5.7A1.14,1.14,0,1,1,26.35,32H22.84l-9.08-9.08h16V2.34H2.28v9.1L0,9.17V3.3A3.3,3.3,0,0,1,3.3,0Z" />
						</svg>
          </div>
        </div>
        <div v-if="!nextType" class="QRcodeDiv">
          <div class="QRimg" id="QRimg">

          </div>
          <!-- <div class="tigLog">

          </div>
          <div class="tigTitle">
            请使用"企业微信"客户端扫码登录
          </div> -->
        </div>
        <el-form v-if="nextType" :label-position="labelPosition" label-width="60px" size="medium" class="demo-form-inline QRcodeDiv">
          <div class="tigTitle">
            系统识别您的二维码暂未绑定后台操作账号
          </div>
          <el-form-item label="账号">
            <el-input v-model="form.name" type="text" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.pwd" type="password" @keyup.native.enter="bindAccount" placeholder="请输入密码" clearable></el-input>
          </el-form-item>
          <div class="tigTitle buttonQR" @click="loginWayChange(true)">
            重新扫码
          </div>
          <div class="error">{{errorTitle}}</div>
          <div class="list"  style="width:60%">
            <el-button style="width:100%" @click="bindAccount" type="primary">绑定并登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  const { HTTP_PATH: HTTPUrl} = process.env
  import {
    toData
  } from '@/util/assist'
  import {filterAsyncRoutes,whiteList} from "@/util/permission"
  import router,{resetRouter} from '@/router'
  import {constantRoutes,asyncRoutes} from "@/router/config"

  export default {
    data() {
      return {
        loading: true,
        userForm:{
          state:"",
          appid:"",
          code: '',
        },
        quitDialog:false,
        forbiddenDialog:false,
        userId:'', // 用户唯一标识
        wwLogin: undefined,
        loginWay: true,
        nextType: false,
        form: {
          name: '',
          pwd: '',
          yzm: ''
        },
        labelPosition: 'right',
        flag: true,
        errorTitle: ''
      }
    },
    mounted(){
      this.loading = true
      this.initCode();
      // console.log(localStorage.getItem('closeWebsocket'));
      // if(localStorage.getItem('closeWebsocket') === "true"){
      //   location.reload()
      //   console.log("--",typeof localStorage.getItem('closeWebsocket'));
      //   localStorage.setItem('closeWebsocket',false)
      // }
    },
    // 监听路有变化获取code参数值
    watch: {
      "$route.query": {
        handler(newVal, oldVal) {
          // console.info(newVal, oldVal);
          this.userForm.code = this.$route.query["code"];
          this.userForm.appid = this.$route.query["appid"];
          this.userForm.state = this.$route.query["state"];
          this.quitDialog = this.$route.query["close"];
          this.forbiddenDialog = this.$route.query["forbiddenInfo"];
          if(this.userForm.code){
            this.getStaffInfo()
          }
          // this.userForm.code && this.getStaffInfo(); //获取到code，调用后端接口换取token
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      loginWayChange(type){
        if(type){
          this.loading = true
          setTimeout(()=>{
            this.initCode()
          },100)
        }
        this.loginWay = type
        this.form = {
          name: '',
          pwd: '',
          yzm: ''
        }
        this.nextType = false
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
            redirect_uri: encodeURIComponent(HTTPUrl + "/#/login"),
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
        finally{
          this.loading = false
        }
      },
      // 企业微信扫码登录
      getStaffInfo() {
        this.loading = true
        var obj = this.userForm
        this.$http.post(this.$service.smzhLogin,obj).then(data => {
          if(data.code == 200 && data.message == "登录成功"){
            this.userInfoSaveSessionStorage(data)
          }else if(data.code == 200){
            this.nextType = true
            this.userId = data.data
            this.$message.error("扫码登录失败")
          }else{
            this.$message.error(data.message)
          }
        }).catch((err)=>{
          this.$router.push({ path: "/login" });
          this.$message.error("授权失败："+err)
        }).finally(()=>{
          this.loading = false
        })
      },
      bindAccount(){
        if (this.form.name === '' || this.form.pwd === '') {
          this.errorTitle = '账号或密码不能为空！'
          return
        }else{
          this.errorTitle = ''
        }
        var obj = {
          loginName:this.form.name,
          password:this.form.pwd,
          wxId:this.userId,
        }
        this.$http.post(this.$service.smBindAccount,obj).then(data => {
          if(data.code == 200){
            this.userInfoSaveSessionStorage(data)
          }else{
            this.$message.error(data.message)
          }
        }).catch(()=>{
          
        })
      },
      userInfoSaveSessionStorage(data){
        let vm = this
        sessionStorage.setItem('userInfo', JSON.stringify(data.data.sysUser))
        sessionStorage.setItem('userId', data.data.sysUser.id)
        sessionStorage.setItem('tokenId', data.data.tokenId)
        sessionStorage.setItem('noAuthCodes', JSON.stringify(data.data.noAuthCodes))
        sessionStorage.setItem('authFields', JSON.stringify(data.data.authFields))
        var url = vm.$route.query.redirect
        const sysUser = data.data.sysUser
        // 又是一个临时处理权限
        ;(() => {
          /******权限******/
          const noAuthCodes = JSON.parse(sessionStorage.getItem('noAuthCodes')) || []
          let currentRoutes = []
          currentRoutes = filterAsyncRoutes(asyncRoutes,noAuthCodes)
          router.options.routes = constantRoutes.concat([...currentRoutes])  // menu
          resetRouter()  
          router.addRoutes([...currentRoutes])
        })()

        let routeName =''
        const allRoutes = this.$router.options.routes
        const findRoute = (routes) => {
          let result = null
          routes.find(item => {
            if (!item.hidden) {
              if (item.children) {
                const child = findRoute(item.children)
                result = child
                return child && !child.hidden
              } else {
                result = item
                return !item.hidden
              }
            }
          })
          return result
        }
        const nextRoute = findRoute(allRoutes)
        if (nextRoute) {
          routeName = nextRoute.name
        } else {
          this.$message.error('当前账号未配置权限，请联系管理员')
        }
        if (url) {
          if (decodeURIComponent(url).includes('redirect=')) {
            vm.$router.push({ name: routeName })
          } else {
            vm.$router.push(url)
          }
        } else {
          vm.$router.push({ name: routeName })
        }
      },
      // 退出
      quitThing(type){
        sessionStorage.clear()
        // 重新登录
        if(type){
          this.$router.push("/")
          this.forbiddenDialog = false
        }else{ // 关闭当前窗口
          var userAgent = navigator.userAgent;
          if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
              window.location.href="about:blank";
              window.close();
          } else {
              window.opener = null;
              window.open("", "_self");
              window.close();
          }
        }
      },
      onSubmit() {
        const vm = this
        if (vm.form.name === '' || vm.form.pwd === '') {
          vm.errorTitle = '账号或密码不能为空！'
          vm.flag = false
          return
        }else{
          vm.errorTitle = ''
        }
        this.flag = true
        var data = {
          loginName: vm.form.name,
          password: vm.form.pwd
        }
        data = toData(data)
        vm.$http.get(this.$service.login + '?' + data).then(data => {
          if (data.code == 200) {
            this.userInfoSaveSessionStorage(data)
          } else {
            this.$message.error(data.message)
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .el-login{
    position: relative;
    .iconTag{
      cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
    }
  }
  /deep/ .el-dialog__header{
    background: #2273CE;
    .el-dialog__title{
      font-size:24px;
      font-weight: bold;
      line-height: 60px;
      color: #FFF;
    }
  }
  .dialog-text{
    font-size:24px;
    line-height: 30px;
    padding: 20px 0   ;
  }
  .dialog-footer{
    display: flex;
    justify-content: space-around;
    padding: 0 30px;
    .el-button{
      width: 140px;
    }
  }
  .login_bg {
    width: 100%;
    height: calc(100vh);
    min-width: 1200px;
    background-size: cover;
    background-image: url(../../assets/login_bg.png);
    position: relative;
  }

  .land_logo {
    background-color: #2273CE;
    height: 64px;
    display: flex;
    align-items: center;
  }
  .login_content {
    width: 386px;
    min-height: 360px;
    position: absolute;
    top: 50%;
    margin-top: -200px;
    background-color: #FFF;
    right: 12%;
    // border-radius: 10px;
  }

  .land-logo-img{
    // background-image: url(../../assets/logo.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    &::after {
      color: #fff;
      font-size: 20px;
      content: "罗新国际";
    }
  }

  .el-login {
    font-size: 20px;
    color: #FFF;
    text-align: center;
    font-weight: 500;
    padding: 35px 0;
    background-color: #2273CE;
  }

  .el-form {
    width: 320px;
    margin: 0 auto;
    margin-top: 40px;
  }

  .el-button {
    width: 100%;
  }

  .el-tishi {
    width: 320px;
    height: 29px;
    background-color: #FBE9E9;
    margin-bottom: 6px;
    color: #DC2424;
    line-height: 29px;
    font-size: 14px;
  }

  .form_list .list-item {
    margin: 0 33px;
  }
  .form_list .QRcodeDiv{
    margin: 20px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    .QRimg{
      width: auto;
      height: auto;
    }
    .tigTitle{
      width: 100%;
      line-height: 50px;
      font-size: 16px;
      text-align: center;
    }
    .buttonQR{
      cursor: pointer;
    }
  }
  .form_list .list-item .list {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 20px;
  }

  .form_list .list-item .list img {
    position: absolute;
    left: 10px;
    width: 24px;
    height: 24px;
  }

  .form_list .list-item .list .input {
    border: 1px solid #DCDCDC;
    height: 40px;
    padding-left: 44px;
    padding-right: 10px;
    font-size: 15px;
    width: 100%;
    border: 1px solid rgba(205, 205, 205, 1);
    border-radius: 5px;
  }

  .form_list .list .btn {
    width: 100%;
    height: 40px;
    background-color: #2273CE;
    color: #FFF;
    font-size: 15px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
  }

  .hd {
    visibility: hidden;
  }

  .error {
    color: #F00;
    font-size: 14px;
    margin-top: -15px;
    height: 20px;
    margin-bottom: 20px;
  }
</style>
