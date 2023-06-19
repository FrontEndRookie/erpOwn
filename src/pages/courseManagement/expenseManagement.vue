<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item label="费用名称">
            <el-input style="width: 200px;" size="medium" :maxlength="inputMax" v-model="expenseName" clearable
                      placeholder="请输入费用名称"></el-input>
          </el-form-item>
          <el-form-item label="费用类型">
            <el-select placeholder="费用类型" size="medium" v-model="expenseType" clearable style="width: 130px;">
              <el-option v-for="item in expenseDict" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" v-auth="['351000_B']">搜索</el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>
          <el-form-item style="float: right;margin-right: 0">
            <el-row>
              <el-button @click="newAdd" size="medium" v-auth="['351001_B']">新增</el-button>
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
        @handleClick='handleClick'>
      </Table>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="200px">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px"
               size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;">
        <el-form-item prop="expenseName" label="费用名称">
          <el-input style="width: 280px;" v-model="ruleForm.expenseName" clearable placeholder="请输入费用名称"
                    :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="expenseType" label="费用类型">
          <el-radio-group v-model="ruleForm.expenseType">
            <el-radio :label="0">国内段</el-radio>
            <el-radio :label="1">国外段</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="sortNo" label="排序">
          <el-input style="width: 280px;" onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="ruleForm.sortNo"
                    clearable placeholder="请输入费用排序"
                    :maxlength="inputMax"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
                     @click="dialogComfirm('ruleForm')">确定
          </el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Table from '@/components/Table'
  import {
    toData
  } from '@/util/assist'

  export default {
    data() {
      var sortNo = (rule, value, callback) => {
        if (value < 0 || value > 10000) {
          callback(new Error('排序在0-10000之间'));
        } else {
          callback();
        }
      };
      return {
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [
          {
            label: '费用名称',
            prop: 'expenseName',
            show: true,
            width: '160'
          },
          {
            label: '费用类型',
            prop: 'expenseType',
            show: true,
            width: '160'
          },
          {
            label: '排序',
            prop: 'sortNo',
            show: true,
            width: '160'
          },
          {
            label: '添加时间',
            prop: 'createTime',
            show: true,
            width: '160'
          }
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '160',
          options: [{
            label: '编辑',
            method: 'edit',
            auth: ['351002_B'],
          },
            {
              label: '删除',
              method: 'del',
              auth: ['351003_B'],
            },
          ]
        },
        expenseId: '',
        ruleForm: {
          expenseName: '',
          expenseType: '',
          sortNo: ''
        },
        rules: {
          expenseName: [{required: true, message: '请输入费用名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ],
          expenseType: [{required: true, message: '请输入费用类型', trigger: 'blur'}],
          sortNo: [{required: true, message: '请输入费用排序', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}]
        },
        labelPosition: 'right',
        expenseDict: [{
          name: '全部',
          value: '2'
        },
          {
            name: '国内段',
            value: '0'
          },
          {
            name: '国外段',
            value: '1'
          },
        ],
        expenseName: '',
        expenseType: '',
        dialogTitle: '',
        dialogFormVisible: false,
      }
    },
    mounted() {
      this.initAgentSearch()
    },
    methods: {
      //获取代理列表
      initAgentSearch() {
        this.$http.get(this.$service.expenseList + '?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize + '&expenseName=' + this.expenseName + '&expenseType=' + this.expenseType ).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },

      //查询
      searchClick() {
        this.pageSize = 10
        this.pageNum = 1
        this.initAgentSearch()
      },
      //清空
      restClick() {
        this.expenseName = ''
        this.expenseType = ''
        this.pageSize = 10
        this.pageNum = 1
        this.initAgentSearch()
      },

      //新增
      newAdd() {
        this.dialogFormVisible = true
        this.dialogTitle = '新增费用'
        this.ruleForm = {
          expenseName: '',
          expenseType: '',
          sortNo:'',
        }
        if (this.$refs["ruleForm"]) {
          this.$refs["ruleForm"].resetFields();
        }
      },
      dialogComfirm(ruleForm) {
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {
            if (this.dialogTitle == '新增费用') {
              this.$http.post(this.$service.expenseSave, this.ruleForm).then(data => {
                if (data.code == 200) {
                  this.$message.success('新增成功')
                  this.initAgentSearch()
                  this.dialogFormVisible = false
                } else {
                  this.$message.error(data.message)
                }
              })
            } else if (this.dialogTitle == '编辑费用') {
              var data = {
                expenseName: this.ruleForm.expenseName,
                expenseType: this.ruleForm.expenseType,
                sortNo: this.ruleForm.sortNo,
                id: this.expenseId
              }
              this.$http.put(this.$service.expenseUpdate, data).then(data => {
                if (data.code == 200) {
                  this.$message.success('编辑成功')
                  this.initAgentSearch()
                  this.dialogFormVisible = false
                } else {
                  this.$message.error(data.message)
                }
              })
            }
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
      //操作
      handleClick(scope) {
        if (scope.method == 'edit') {
          this.dialogTitle = '编辑费用'
          if (this.$refs["ruleForm"]) {
            this.$refs["ruleForm"].resetFields();
          }
          this.dialogFormVisible = true
          this.ruleForm.expenseName = scope.row.expenseName
          this.ruleForm.expenseType = scope.row.expenseType
          this.ruleForm.sortNo = scope.row.sortNo
          this.expenseId = scope.row.id
        } else if (scope.method == 'del') {
          this.$confirm("确定删除这条数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.put(this.$service.expenseDelete + '?id=' + scope.row.id).then(data => {
              if (data.code == 200) {
                this.initAgentSearch()
                this.$message.success('删除成功')
              } else {
                this.$message.error(data.message)
              }
            })
          }).catch(() => {
            console.log('取消')
          })
        }
      },

      handleCurrentChange(e) {
        this.pageNum = e
        this.initAgentSearch()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initAgentSearch()
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.expenseId = ''
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

<style>
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
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

  .wrapper, .content {
    width: 100%;
    background-color: #fff;
  }

  .content-search-normal {
    padding: 20px !important;
    background: #fff;
  }

  .el-dialog {
    width: 300px;
    min-width: 500px !important;
  }
</style>
