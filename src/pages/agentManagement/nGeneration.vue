<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item label="供应商分类">
            <el-select
              v-model="selectResult.type"
              remote
              reserve-keyword
              style="width: 200px"
            >
              <el-option
                v-for="(item, index) in agentType"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-select
              id="agentName"
              v-model="selectResult.agentName"
              placeholder="请输入供应商名称"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 200px"
            >
              <el-option
                v-for="(item, index) in agentOpt"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统一社会信用代码">
            <el-input
              v-model="selectResult.socialCreditCode"
              onkeyup="this.value=this.value.replace(/[^a-zA-Z0-9]/g, '')"
              @blur="selectResult.socialCreditCode = $event.target.value"
              clearable
              maxlength="18"
              style="width: 200px"
              placeholder="请输入统一社会信用代码"
            ></el-input>
          </el-form-item>
          <el-form-item label="售中客服">
            <el-select
              id="sysname"
              v-model="selectResult.salesId"
              placeholder="请输入售中客服"
              clearable
              filterable
              remote
              reserve-keyword
              maxlength="10"
              style="width: 200px"
            >
              <el-option
                v-for="item in paying"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商简称">
            <el-select
              id="agentAbbe"
              v-model="selectResult.agentCode"
              placeholder="请输入供应商简称"
              clearable
              filterable
              remote
              reserve-keyword
              maxlength="10"
              style="width: 200px"
            >
              <el-option
                v-for="(item,index) in agentOptCode"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button
                @click="searchClick"
                size="medium"
                type="primary"
                v-auth="['251000_B']"
                >搜索
              </el-button>
              <el-button @click="restClick" size="medium" type="primary"
                >清空</el-button
              >
            </el-row>
          </el-form-item>
          <el-form-item style="float: right; margin-right: 0; margin-top: 5px">
            <el-row>
              <el-button
                type="warning"
                @click="newAdd"
                size="medium"
                v-auth="['251003_B']"
                >新增</el-button
              >
              <el-button
                type="primary"
                @click="exportList"
                size="medium"
                v-auth="['251004_B']"
                >导出列表</el-button
              >
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <Table
      :tableData="tableData"
       :columns='columns'
        :operation='operation'
        :agentOpt='agentOpt'
        :paying='paying'
         :total='total'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'
      ></Table>
      <el-dialog :visible.sync="addNew" title="新增供应商" @open="openthing" :before-close="handleClose">
        <el-form label-position="left">
          <el-form-item label="统一信用代码" required>
            <el-input
              v-model="addResult.socialCreditCode"
              onkeyup="this.value=this.value.replace(/[^a-zA-Z0-9]/g, '')"
              @blur="addResult.socialCreditCode = $event.target.value"
              clearable
              maxlength="18"
              style="width: 200px"
              placeholder="请输入统一社会信用代码"
            ></el-input>
             <span @click="certify" style="color:skyblue;cursor:pointer;text-decoration:underline;margin-left:5px;fontSize:15px">认证</span>
          </el-form-item>
          <el-form-item label="供应商名称" required>
           <el-input v-model="addResult.agentName" disabled style="width: 200px"> </el-input>
          </el-form-item>
          <el-form-item label="供应商名称首字母" 
              required 
             >
              <el-input  
                placeholder="请输入供应商首字母"
                style="width: 200px"
                maxlength="100"
                v-model="addResult.namePy"
                onkeyup="this.value=this.value.replace(/[^A-Z]/g, '')"
                @blur="addResult.namePy = $event.target.value"
                ></el-input>
              </el-form-item>
              <el-form-item required="true" label="结算方式" :label-width="'140px'">
                    <el-radio @change="jsfs(1,1)" v-model="addResult.settlementWay" :label="1">付款买单</el-radio>
                    <el-radio @change="jsfs(1,2)" v-model="addResult.settlementWay" :label="2">月结买单</el-radio>
                    <el-radio @change="jsfs(1,3)" v-model="addResult.settlementWay" :label="3">固定天数</el-radio>
              </el-form-item>
          <el-form-item  label="结算账期" :label-width="'140px'">
            <el-select  v-if="addResult.settlementWay===2"
                style="width: 120px"
                id="settlementDays"
                v-model="addResult.settlementDays"
                placeholder="请选择结算账期"
                clearable
                filterable
                remote
                reserve-keyword
                maxlength="3"
                >
                <el-option
                    v-for="item in settlementDaysArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
            </el-select>
              <el-input type="text" v-else-if="addResult.settlementWay===3" maxlength="3" @input="addResult.settlementDays=$utils.pureNumber(addResult.settlementDays)" show-word-limit style="width: 120px;" v-model="addResult.settlementDays"></el-input>
            <el-input v-else style="width: 120px;text-align: center" placeholder="/" disabled="true" v-model="addResult.settlementDays"></el-input>
            &emsp;天
        </el-form-item>
        <el-form-item  label="授信额度" :label-width="'140px'">
            <el-input  v-if="addResult.settlementWay===1?false:true" v-model="addResult.creditLimit" @input="addResult.creditLimit=$utils.pureNumber(addResult.creditLimit)" show-word-limit autocomplete="off" maxlength="8" style="width: 120px"></el-input>
            <el-input  v-else v-model="addResult.creditLimit" placeholder="/" disabled="true" style="width: 120px"></el-input>&emsp;元
        </el-form-item>
          <el-form-item label="供应商类型" required>
            <el-select
              v-model="addResult.type"
              placeholder="请选择供应商类型"
              remote
              reserve-keyword
              style="width: 200px"
            >
              <el-option
                v-for="(item, index) in addAgentType"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售中客服" required>
            <el-select
              id="sysname1"
              v-model="addResult.salesId"
              placeholder="请输入售中客服"
              clearable
              filterable
              remote
              reserve-keyword
              maxlength="10"
              style="width: 200px"
            >
              <el-option
                v-for="item in paying"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业执照" required>
             <el-upload
             style="margin-left:150px"
             action="#"
             auto-upload="false"
                        class="avatar-uploader"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload"
                        >
                        <img v-if="addResult.fileUrl" :src="addResult.fileUrl"  class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div v-show="addResult.fileUrl" style="position: absolute;top: 0;left: 160px; height: 20px;width: 20px;font-size: 20px;">
                        <i @click='handlePictureCardPreview' class="el-icon-zoom-in"></i>
                    </div>
                    <el-dialog :visible.sync="picDialog" :modal="false">
                        <img width="100%" :src="addResult.fileUrl" alt="">
                    </el-dialog>
          </el-form-item>
         
        </el-form>
         <span slot="footer" style="text-align:center" class="dialog-footer">
            <el-button @click="addNew = false">取 消</el-button>
            <el-button style="margin-left:40px" type="primary" @click="addNewConfirm">确 定</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Table from './component/nGenerTable.vue'
  import { toData } from '@/util/assist'

export default {
  data() {
    return {
      agentOpt: [], //供应商名称
      agentOptCode: [], //供应商简称
      paying: [], //售中客服
      flag:false,
      //供应商分类
      agentType: [
        { name: "全部", value: "" },
        { name: "报关行", value: 4 },
        { name: "磁检", value: 3 },
        { name: "刻章", value: 2 },
        { name: "其它", value: 5 },
      ],
        addAgentType: [
        { name: "报关行", value: 4 },
        { name: "磁检", value: 3 },
        { name: "刻章", value: 2 },
        { name: "其它", value: 5 },
      ],
      settlementDaysArr:[{id:'15',name:'15'},{id:'30',name:'30'},{id:'45',name:'45'},{id:'60',name:'60'}],
      //搜索框form
      selectResult: {
        agentCode:'',
        agentName: "",
        socialCreditCode: "",
        salesId:'',
        type:'',
       
      },
      pageSize: 10,
      pageNum: 1,
      total: 0,
      //新增供应商 form
      addResult:{
        settlementWay: 1,
        settlementDays: '',
        creditLimit: '',
        agentName: "",
        socialCreditCode: "",
        namePy:'',
        type:'',
        salesId:'',
        fileUrl:''
      },
      //弹框显示
      addNew: false,
      picDialog:false,
        // 列
        columns: [
          {label: '序号', prop: 'index', show: true, width: '40'},
          {label: '添加时间', prop: 'createTime', show: true, width: '120'},
          {label: '供应商分类', prop: 'type', show: true, width: '100'},
          {label: '统一社会信用代码', prop: 'socialCreditCode', show: true, width: '150'},
          {label: '供应商名称', prop: 'agentName', show: true, width: '150'},
          {label: '供应商简称', prop: 'agentCode', show: true, width: '100'},
          {label: '供应商名称首字母', prop: 'namePy', show: true, width: '160'},
          {label: '售中客服', prop: 'salesName', show: true, width: '150'},
          {label: '结算方式', prop: 'settlementWay', show: true, width: '150'},
          {label: '结算账期', prop: 'settlementDays', show: true, width: '150'},
          {label: '授信额度', prop: 'creditLimit', show: true, width: '150'},
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '120',
          options: [{
            label: '编辑',
            auth: ['251001_B'],
          },
          {
            label:'查看资质'
          }
          ]
        },
    };
  },
  mounted() {
     document.addEventListener("compositionstart",  (e) => {
        this.flag = true;
      });
      document.addEventListener("compositionend", (e)=> {
        this.flag = false;
      });
    this.setDom();
    this.getSelectData();
    this.searchClick()
  },
  methods: {
    openthing(){
      console.log(this.addResult);
    },
    //搜索框限制输入格式
    setDom() {
      const select = document.querySelector("#agentName");
      select.setAttribute("maxLength", 100);
     
      select.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            select.value = select.value.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, "");
          }, 0);
        }
      };
      const select1 = document.querySelector("#sysname");
      select1.setAttribute("maxLength", 10);
     
      select1.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            select1.value = select1.value.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, "");
          }, 0);
        }
      };
        const select2 = document.querySelector("#agentAbbe");
      select2.setAttribute("maxLength", 50);
     
      select2.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            select2.value = select2.value.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, "");
          }, 0);
        }
      };
    },
    //新增供应商输入限制
    setDialogDom(){
      const select1 = document.querySelector("#sysname1");
      select1.setAttribute("maxLength", 10);
     
      select1.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            select1.value = select1.value.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, "");
          }, 0);
        }
      };
    },
    //
    jsfs(num,type){
      if(num === 1){
                if(type === 1){
                    this.$set(this.addResult, 'settlementDays', '')
                    this.$set(this.addResult, 'creditLimit', '')
                }
                if(type === 2){
                    this.$set(this.addResult, 'settlementDays', '15')
                    this.$set(this.addResult, 'creditLimit', '')
                }
                if(type === 3){
                    this.$set(this.addResult, 'settlementDays', '')
                    this.$set(this.addResult, 'creditLimit', '')
                }
            }
    },
    //表格数据
    searchClick(){
      let request = JSON.parse(JSON.stringify(this.selectResult))
      request = {...request,pageNum:this.pageNum,pageSize:this.pageSize}
      this.$http.post(this.$service.listSupplier,request).then(res=>{
        if(res.code==200){
          console.log(res.data.records);
          this.tableData = res.data.records
          this.total = res.data.total
          this.$forceUpdate()
        }
        else{
          this.$message.error(res.message)
        }
      })
    },
    //供应商名称.售中客服数据
    getSelectData() {
      //供应商名称
      this.$http.post(this.$service.listSupplierName, "").then((res) => {
        this.agentOpt = res.data;
      });
      //供应商名称
      this.$http.post(this.$service.listSupplierCode, "").then((res) => {
        this.agentOptCode = res.data;
      });
      //售中客服
      this.$http
        .get(
          this.$service.userSearchNoAuth + "?roleName=售中客服&pageSize=50000"
        )
        .then((data) => {
          this.paying = data.data.records;
        });
    },
    //新增供应商
    newAdd() {
      this.addResult={
        settlementWay: 1,
        settlementDays: '',
        creditLimit: '',
        agentName: "",
        socialCreditCode: "",
        namePy:'',
        type:'',
        salesId:'',
        fileUrl:''
      },
      this.addNew = true;
      this.$nextTick(()=>{
        this.setDialogDom()
      })
    },
    addNewConfirm(){
      console.log(this.addResult)
      if(!this.addResult.fileUrl || !this.addResult.salesId || 
      !this.addResult.type || !this.addResult.namePy || 
      !this.addResult.socialCreditCode || !this.addResult.agentName || !this.addResult.settlementWay){
        return this.$message.warning("请填写全部信息后再进行操作")
      }
      // if(Object.values(this.addResult).some(item=>!item)){
      //   if(this.addResult.settlementDays == '' || this.addResult.creditLimit == ''){
          
      //   }else{
      //     return this.$message.warning("请填写全部信息后再进行操作")
      //   }
      // }
      this.$http.post(this.$service.saveOrUpdateAgent,this.addResult, {
        headers: {
          diffFlag: 5,
        },
      }).then(res=>{
        console.log(res)
        if(res.code==200){
          this.$message.success("新增供应商成功")
          this.addNew = false
          this.searchClick()
        }
        else {
          this.$message.error(res.message)
        }
      })
    },
    //导出列表
    exportList(){
      let request = JSON.parse(JSON.stringify(this.selectResult))
       this.$http.get(this.$service.downloadSuExecl+'?'+toData(request), {
            responseType: 'arraybuffer'
          }).then(res=>{
          // this.$http.post(this.$service.downloadExeclAgent, json,{
          //   responseType: 'arraybuffer'
          // }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '非一代管理列表' + '.xlsx') // 设置下载文件名称
            aLink.click()
            document.body.appendChild(aLink)
        })
    },
    //认证接口
    certify(){
      if(this.addResult.socialCreditCode==''){
        return this.$message.warning("请填写统一信用代码后进行操作")
      }
      this.$http.post(this.$service.getCompanyInfo,this.addResult.socialCreditCode).then(res=>{
        if(res.code==200){
          if(res.data.message=="企业名称录入错误，未找到数据"){
            this.$message.error("企业名称录入错误，未找到数据")
          }else {
            this.addResult.agentName = res.data.name
            this.addResult.namePy = res.data.namePy
            this.$message.success("认证成功")
          }
        }
        else {
          this.$message.error(res.message)
        }
      })
    },
    // 图片上传
        async beforeAvatarUpload(file) {
            // console.log(file);
            console.log(file.type);
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/pdf' || file.type === 'image/jpg' || file.type === 'application/pdf' || file.type === 'image/bmp')?true:false
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isJPG) {
            this.$message.error('上传图片/文件只能是 JPG、JPG、PDF、PNG格式!');
            return
            }
            if (!isLt10M) {
            this.$message.error('上传图片/文件大小不能超过 10MB!');
            return
            }
            const fileFormData = new FormData();
            fileFormData.append("image", file);
            try {
                const data = await this.$http.post(
                    this.$service.uploadImage,
                    fileFormData,
                    // {
                    //     params: {
                    //     attachType: 1,
                    //     orderId: this.orderId,
                    //     },
                    // }
                );
                if (data) {
                        this.addResult.fileUrl = data
                    this.$message.success("上传成功")
                } else {
                    this.$message.error(message);
                }
            } catch (error) {
            }
        },
    handlePictureCardPreview(){
      this.picDialog = true
    },
  handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
     //表格分页跳转
      handleCurrentChange(e) {
        this.pageNum = e
        this.searchClick()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.searchClick()
      },
      restClick(){
      this.selectResult={
        agentCode:'',
        agentName: "",
        socialCreditCode: "",
        salesId:'',
        type:'',
      }
      this.pageNum = 1
      this.pageSize = 10
      this.searchClick()
      }
  },
  watch: {},
  components: {
    Table
  },
};
</script>

<style scoped lang="less">
.el-form-item{
    margin-bottom: 20px !important;
  }
.content-wrapper {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow: hidden;
  background-color: #f3f6f9 !important;
}

.el-form {
  background-color: #fff;
}

.el-form--inline .el-form-item {
  margin-bottom: 0;
  vertical-align: bottom;
}

.wrapper,
.content {
  width: 100%;
  background-color: #fff;
}

.content-search-normal {
  padding: 20px !important;
  background: #fff;
}

/deep/.el-dialog {
  width: 300px;
  min-width: 450px !important;
  .el-dialog__body{
      padding:15px 30px;
    }
    .el-dialog__footer{
      text-align: center;
      padding-bottom: 15px;
    }
     .el-form{
    font-size: 20px;
     .el-form-item__label{
      width:140px;
    }
  }
}
/deep/.el-upload--text{
  img{
    width: 150px;
    height: 150px;
  }
}
  /deep/.el-table__body .el-table__row  td{
    border-right: 1px solid rgb(215, 210, 210) !important;
    border-bottom: 1px solid rgb(215, 210, 210) !important;
  }
</style>
