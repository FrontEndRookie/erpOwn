<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item>
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="tel" clearable
                      placeholder="请输入手机号"></el-input>
          </el-form-item>

          <!-- <el-form-item>
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="certificationBody" clearable
                      placeholder="请输入认证主体"></el-input>
          </el-form-item> -->

          <el-form-item>
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="userName" clearable
                      placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input style="width: 200px;" size="medium" v-model="certificationBody" clearable
                      placeholder="请输入企业名称"></el-input>
          </el-form-item>

          <!-- <el-form-item>
            <el-select placeholder="请选择客服人员" size="medium" v-model="customerService" clearable style="width: 200px;">
              <el-option
                v-for="item in roleOpt"
                :key="item.Value"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" icon="el-icon-search" v-auth="['651000_B']">查询</el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>

        </div>
      </el-form>
      <Table
        :tableData='tableData'
        :columns='columns'
        :operation='operation'
        :total='total'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'
        @handleClick="handleClick"
      >
      </Table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="150px">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px"
               size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;">
        <!-- <el-form-item  prop="certificationBody" label="认证主体">
          <el-input style="width: 280px;" :disabled="ruleForm.canAlter" v-model="ruleForm.certificationBody" clearable placeholder="请输入认证主体"
                    :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="customerServiceId" label="售前客服">
          <el-select placeholder="请选择客服人员" size="medium" v-model="ruleForm.customerServiceId" clearable style="width: 200px;">
            <el-option
              v-for="item in roleOpt"
              :key="item.Value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="payWay" label="结算方式">
          <el-radio-group v-model="ruleForm.payWay">
            <el-radio :label="0">付款买单</el-radio>
            <el-radio :label="1">月结</el-radio>
          </el-radio-group>
        </el-form-item>
          <el-form-item  prop="creditTerm" label="账期" >
            <el-input style="width: 125px" v-model="ruleForm.creditTerm" clearable onkeyup="value=value.replace(/[^\d]/g, '')"  placeholder="请输入账期"
                      :maxlength="3"></el-input>
            <el-select size="medium" v-model="ruleForm.unit" clearable style="width: 75px; margin-right: -5px;">
              <el-option
                v-for="item in unitOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item prop="qqInput" label="QQ">
            <el-input style="width: 270px;" v-model="ruleForm.qqInput" clearable placeholder="请输入QQ号"  maxlength="16"  onkeyup="this.value=this.value.replace(/[^\d]/g,'')" @blur="ruleForm.qqInput = $event.target.value"
                    ></el-input>
          </el-form-item>
        <!-- <el-form-item  prop="quota" label="额度">
          <el-input style="width: 270px;" v-model="ruleForm.quota" clearable placeholder="请输入额度"
                    :maxlength="7" onkeyup="value=value.replace(/[^\d]/g, '')"></el-input> 元
        </el-form-item> -->
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="submitForm('ruleForm')">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Table from '@/components/userTable'
  import {toData} from '@/util/assist'

  export default {
    data() {
      return {
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [
          {label: '用户ID', prop: 'id', show: true, width: '80'},
          {label: '用户头像', prop: 'headImgUrl', show: true, width: '80'},
          {label: '用户名称', prop: 'userName', show: true, width: '150'},
          {label:'微信手机号',prop:'wechatAppTel',show:true,width:'120'},
          {label: '性别', prop: 'sex', show: true, width: '80'},
          {label: '认证主体', prop: 'certificationBody', show: true, width: '150'},
          // {label: '结算方式', prop: 'payWay', show: true, width: '100'},
          {label: '手机号', prop: 'tel', show: true, width: '120'},
          {label: '注册时间', prop: 'createTime', show: true, width: '150'},
          // {label: '绑定售前客服', prop: 'customerService', show: true, width: '100'},
          // {label: '额度', prop: 'quota', show: true, width: '100'},
          {label:'QQ',prop:'qq',show:true,width:'150'},
          // {label: '账期', prop: 'creditTerm', show: true, width: '100'}
          {label:'用户来源',prop:'sourceText',show:true,width:'80'},
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '120',
          options: [{
            label: '编辑',
            method: 'binding',
            auth: ['651001_B'],
          }
          ]
        },
        labelPosition: 'right',
        tel: '',
        certificationBody: '',
        userName: '',
        customerService: '',
        customerServiceId: '',
        roleOpt: [],
        unitOpt: [
          {name:"月",value:1},
          {name:"天",value:0}
        ],
        dialogTitle: '密码修改',
        dialogFormVisible: false,
        rules: {
          customerServiceId: [{required: true, message: '请选择售前客服', trigger: 'change'}],
          certificationBody: [{max: 50, message: '认证主体最长50个字符', trigger: 'change'},{required: true, message: '请绑定认证主体', trigger: 'change'}],
          qqInput:[{max:16,min:6,message:'QQ长度在6到16位',trigger: 'blur'},{required:true,message:'请输入QQ号',trigger:'change'}]
        },
        creditTerm:{
          creditTerm:'',
          unit:''
        },
        ruleForm: {
          customerServiceId: '',
          certificationBody: '',
          creditTerm:'',
          unit:1,
          quota:'',
          id: '',
          payWay:'',
          qqInput:''
        }
      }
    },
    mounted() {
      this.initRoleSearch()
      this.initUserSearch()
    },
    methods: {
      //获取用户列表
      initUserSearch() {
        const vm = this
        var params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          // customerService: this.customerService,
          userName: this.userName,
          certificationBody: this.certificationBody,
          tel: this.tel
        }
        vm.$http.post(vm.$service.userSearchByPage, params).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records.map(item => {
              return {
                ...item,
                sourceText: {
                  0: '官网',
                  1: '小程序',
                }[item.source] || '未定义'
              }
            })
          }
        }).catch((e) => {
          console.log(e)
        })
      },

      //获取售前客服
      initRoleSearch() {
        const vm = this
        var params = {
          roleName: '售前客服'
        }
        params = toData(params)
        vm.$http.get(vm.$service.userRoleList + '?' + params).then(data => {
          if (data.code == 200) {
            this.roleOpt = data.data
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //查询
      searchClick() {
        this.pageSize = 10
        this.pageNum = 1
        this.initUserSearch()
      },
      //重置
      restClick() {
        this.tel = ''
        this.certificationBody = ''
        this.userName = ''
        this.customerService = ''
        this.pageSize = 10
        this.pageNum = 1
        this.initUserSearch()
      },
      handleClick(val) {
        var creditTerm= typeof (val.row.creditTerm)=='undefined'||val.row.creditTerm==null?'':JSON.parse(val.row.creditTerm)
        this.dialogFormVisible = true
        this.dialogTitle = '编辑'
        this.ruleForm.id = val.row.id
        this.customerServiceId=val.row.customerServiceId
        this.ruleForm.customerServiceId = val.row.customerService
        this.ruleForm.certificationBody = val.row.certificationBody
        this.ruleForm.canAlter = val.row.certificationBody ? true : false
        this.ruleForm.unit = creditTerm==''?1:creditTerm.unit
        this.ruleForm.quota = val.row.quota
        this.ruleForm.qqInput=val.row.qq
        this.ruleForm.payWay = val.row.payWay
        this.ruleForm.creditTerm = creditTerm==''?'':creditTerm.creditTerm

      },
      //绑定售前客服
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {
            this.creditTerm.unit=this.ruleForm.unit
            this.creditTerm.creditTerm=this.ruleForm.creditTerm
            var params = {
              id: this.ruleForm.id,
              qq:this.ruleForm.qqInput,
              customerServiceId:typeof this.ruleForm.customerServiceId=="string"&&this.ruleForm.customerServiceId!==""?this.customerServiceId:this.ruleForm.customerServiceId ,
              certificationBody: this.ruleForm.certificationBody===""?null:this.ruleForm.certificationBody,
              quota:this.ruleForm.quota,
              payWay: this.ruleForm.payWay,
              creditTerm:JSON.stringify(this.creditTerm)

            }
            this.$http.post(this.$service.userUpdateUserinfo, params).then(data => {
              if (data.code == 200) {
                this.dialogFormVisible = false
                this.initUserSearch()
                this.$message.success('操作成功')
              } else {
                this.$message.error(data.message)
              }
            })
          } else {
            setTimeout(() => {
              var isError = document.getElementsByClassName("is-error");
              if (isError[0].querySelector('input')) {
                isError[0].querySelector('input').focus()
              } else if (isError[0].querySelector('textarea')) {
                isError[0].querySelector('textarea').focus()
              }
            }, 100);
            return false;
          }
        })
      },
      handleCurrentChange(e) {
        this.pageNum = e
        this.initUserSearch()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initUserSearch()
      },
      closeDialog() {
        this.dialogFormVisible = false
      },
    },

    watch: {
      tableData(idx) {
        return idx
      }
    },
    components: {
      Table
    }

  }
</script>


<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 0;
    vertical-align: bottom;
  }

  .parimary_btn {
    background-color: #9ac143 !important;
    border-color: #9ac143 !important;

    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  }

  .icon-shouqi {
    color: #3985ca;
    margin-right: 2px;
    font-size: 14px;
    margin-left: 15px;
  }

  .shouqi {
    cursor: pointer;
    color: #3985ca;
    position: relative;
  }

  .shouqi .iconfont {
    font-size: 2px;
    position: absolute;
    height: 20px;
    line-height: 20px;
    margin-top: 7px;
    margin-left: 10px;
  }

  .wrapper,
  .content {
    width: 100%;

    /*background-color: #fff;*/
  }

  .el-table .sort-caret.ascending {
    border-bottom-color: #FFF;
  }

  .content-search-normal {
    padding: 20px;
    background: #fff;
  }

  .content-search-high {
    padding: 0 0 20px 30px;
  }

  /deep/ .el-dialog {
    min-width: 480px;
    border-radius: 6px;
  }
</style>
