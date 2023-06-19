<template>
  <div class="header-container">
    <div class="logo" :style="{ width: leftWidth ? '150px' : '60px' }">
      <div class="img-url"></div>
    </div>
    <div class="user-info">
      <dc-img
        :name="collapseBtnName"
        style="cursor: pointer"
        @click="changeNav"
      />
      <div class="user">
        <el-button @click="jumpToLED" type="text">LED大屏</el-button>
        <span style="margin-left: 20px">{{ userName }}</span>
      </div>
      <!-- <el-button
        @click="showResetPasswordDialog = true"
        type="text"
        v-if="showResetPasswordBtn"
        >密码重置</el-button
      > -->
      <el-button
        @click="toUserInfoPage()"
        type="text"
        v-if="showResetPasswordBtn"
        >个人中心</el-button
      >
      <el-button @click="outClick" type="text">退出</el-button>
    </div>
    <!-- 编辑密码弹窗 -->
    <reset-password-dialog
      ref="resetPasswordDialog"
      @closeEv="showResetPasswordDialog = false"
      v-if="showResetPasswordDialog"
    />
  </div>
</template>

<script>
import ResetPasswordDialog from "./ResetPasswordDialog.vue";
export default {
  components: {
    ResetPasswordDialog,
  },
  props: {
    leftWidth: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      userName: "",
      roleName: "",
      labelPosition: "right",
      dialogFormVisible: false,
      passwrod1: "",
      passwrod2: "",
      errorItem: "",
      tips: "",
      oldPass: "",
      newPass: "",
      newPass2: "",
      exportDio: false,
      iconTrue: true,
      exportTip: "",
      showResetPasswordDialog: false,
    };
  },
  computed: {
    collapseBtnName() {
      return this.leftWidth ? "menu_close" : "menu_open";
    },
    showResetPasswordBtn() {
      const { loginName } =
        JSON.parse(sessionStorage.getItem("userInfo")) || {};
      return loginName !== "admin";
    },
  },
  methods: {
    toUserInfoPage(){
      this.$router.push("/userManagement/personalCenter");
    },
    jumpToLED() {
      let newpage = this.$router.resolve({
        name: "ledPage",
        query: {
          ledShow: true,
        },
      });
      window.open(newpage.href, "_blank");
    },
    changeNav() {
      this.$emit("changeNav", !this.leftWidth);
    },
    outClick() {
      this.$router.push("/");
      sessionStorage.clear();
    },
  },
  mounted() {
    if (!JSON.parse(sessionStorage.getItem("userInfo"))) {
      this.$router.push("/");
      sessionStorage.clear();
      return;
    } else {
      this.userName = JSON.parse(sessionStorage.getItem("userInfo")).loginName;
      this.roleName = JSON.parse(sessionStorage.getItem("userInfo")).roleName;
    }
  },
};
</script>

<style lang="less">
.aaa .el-dialog {
  width: 300px;
  min-width: 500px;
}
.header-container {
  display: flex;
  height: 50px;
  width: 100%;
  justify-content: space-between;
  background: #0038a7;
}
.logo {
  display: flex;
  align-items: center;
  background: #0038a7;
  opacity: 1;
  transition: width 1s;
}
.logo img {
  width: 94px;
  height: 32px;
}
.logo .img-url {
  // background-image: url(../../assets/logo.png);
  margin: 0 auto;
  width: 120px;
  height: 25px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  &::after {
    color: #fff;
    font-size: 20px;
    content: "罗新国际";
  }
  
}
.user-info {
  flex: 1;
  font-size: 14px;
  padding-right: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  button {
    color: #fff;
  }
}
.user-info img {
  margin: 0 25px 0 15px;
  cursor: pointer;
}
.user-info .user {
  margin-right: 20px;
  margin-left: auto;
}
.out-user1 {
  width: 80px;
  height: 25px;
  border: 1px solid #fff;
  border-radius: 5px;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
  margin-right: 10px;
}
.el-tishi {
  height: 20px;
  background-color: #fbe9e9;
  color: #dc2424;
  line-height: 20px;
  font-size: 12px;
  vertical-align: middle;
  padding-left: 10px;
}
</style>
