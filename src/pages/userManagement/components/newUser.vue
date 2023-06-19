<template>
  <el-dialog
    title="新建用户"
    :visible.sync="dialogVisible"
    width="fit-content"
    :before-close="handleClose"
  >
    <el-form>
      <el-form-item label="企业名称" label-width="80px">
        <el-select
          v-model="newUser.companyId"
          :remote-method="companyMethod"
          remote
          filterable
          clearable
          style="width:300px"
        >
          <el-option
            v-for="item in companyList"
            :key="item.comId"
            :label="item.cname"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" label-width="80px">
        <el-input
          v-model="newUser.phone"
          style="width:300px"
          @input="targetUser = ''"
        >
          <el-button slot="append" @click="getUserMes"
            >{{ targetUser ? "已" : "" }}获取用户</el-button
          >
        </el-input>
      </el-form-item>
      <el-form-item label="当前用户" label-width="80px">
        <el-input v-model="targetUser" style="width:300px" disabled></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmNewUser">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    userType: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      dialogVisible: false,
      companyList: [],
      newUser: {
        companyId: "",
        phone: "",
        portalUserId: "",
        type: ""
      },
      targetUser: ""
    };
  },
  created() {
    this.newUser.type = this.userType;
    this.dialogVisible = true;
    this.init();
  },
  methods: {
    init() {
      this.getOldUserList();
    },
    getOldUserList(cname) {
      this.$http
        .post(this.$service.palletOldUser, { pageNum: 1, pageSize: 20, cname })
        .then(res => {
          if (res.code == 200) {
            this.companyList = res.data.records;
          }
        });
    },
    companyMethod(e) {
      this.getOldUserList(e);
    },
    checkMobile(str) {
      var re = /^1\d{10}$/;
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    getUserMes() {
      if (this.targetUser) return this.$message.warning("当前已获取用户");
      if (!this.checkMobile(this.newUser.phone)) {
        return this.$message.warning("当前手机号非法");
      }
      this.$http
        .post(
          this.$service.palletSelectByPhone + "?phone=" + this.newUser.phone
        )
        .then(res => {
          if (res.code == 200 ) {
            if( res.data ){
                this.newUser.portalUserId = res.data.id;
                this.targetUser = res.data.nickName;
                this.$message.success("获取用户信息成功");
            } else {
                this.targetUser = '未注册用户'
                this.$message.success("获取用户信息成功，当前用户为未注册用户");
            }
            
          } else {
            return this.$message.error(res.message);
          }
        });
    },
    confirmNewUser() {
        if(!this.newUser.companyId){
        return this.$message.warning("请选择企业名称");
      }
      if (!this.targetUser) {
        return this.$message.warning("请先获取用户");
      }
      
      this.$http.post(this.$service.palletSave, this.newUser).then(res => {
        if (res.code == 200) {
          this.$message.success("新建成功");
          this.dialogVisible = false;
        }
      });
    }
  },
  watch: {
    dialogVisible(nv) {
      if (!nv) {
        this.$parent.showNewUser = false;
      }
    }
  }
};
</script>
<style lang="less" scoped></style>
