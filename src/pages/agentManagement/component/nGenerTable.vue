<template>
<div>
     <el-table
      stripe
      ref="multipleTable"
      @sort-change="handleSort"
      @selection-change="handleSelect"
      :data="tableData"
      style="width: 100%;"
      >
      <template slot="empty">
        <img class="data-pic" src="../../../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      >
      <!-- <el-table-column
        v-if="checkbox"
        type="selection"
        width="55">
      </el-table-column> -->
      <!--列-->
      <el-table-column
        v-for="(column, index) in columns"
        v-if="column.show"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="center"
        >
        <template slot-scope="scope">
              <div v-if="column.label=='序号'">{{scope.$index+1}}</div>
              <div v-else-if="column.label=='供应商分类'">{{agentTypeWord[Number(scope.row.type)]}}</div>
              <div v-else-if="column.label=='结算方式'">{{payWayArr[Number(scope.row.settlementWay)]}}</div>
              <!-- <div v-else-if="column.label=='添加时间'">{{scope.row.createTime}}</div> -->
              <div v-else>{{scope.row[column.prop]}}</div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        fixed="right"
        v-if="operation.show"
        :label="operation.label"
        :min-width="operation.width"
        :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          <!-- <a v-for="(item, index) in operation.options" :key="index">
            <span @click="edit(index+1,scope.row)">{{item.label}}</span>
          </a> -->
          <el-button
            type="text"
            v-for="(item, index) in operation.options"
            :key="index"
            @click="edit(index+1,scope.row)"
            :disabled="$utils.authCheckDisabled(item.auth)">{{item.label}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="total > 10">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrent"
        @size-change="handleSize"
        style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
      </el-pagination>
      </div>
      <el-dialog
      title="编辑供应商"
      :visible.sync="editDial">
        <img v-if="dialType==2" :src="picSrc" alt="" style="width:100%;height:100%">
        <el-form label-position="left" v-if="dialType==1">
          <el-form-item label="统一信用代码" required>
            <el-input
             disabled
              v-model="editResult.socialCreditCode"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商名称" required>
             <el-input
             disabled
              v-model="editResult.agentName"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商名称首字母" 
              required 
             >
              <el-input  
                placeholder="请输入供应商首字母"
                style="width: 200px"
                maxlength="100"
                v-model="editResult.namePy"
                onkeyup="this.value=this.value.replace(/[^A-Z]/g, '')"
                @blur="editResult.namePy = $event.target.value"
                ></el-input>
              </el-form-item>
              <el-form-item required="true" label="结算方式" :label-width="'140px'">
                    <el-radio @change="jsfs(1,1)" v-model="editResult.settlementWay" :label="1">付款买单</el-radio>
                    <el-radio @change="jsfs(1,2)" v-model="editResult.settlementWay" :label="2">月结买单</el-radio>
                    <el-radio @change="jsfs(1,3)" v-model="editResult.settlementWay" :label="3">固定天数</el-radio>
              </el-form-item>
          <el-form-item label="结算账期" :label-width="'140px'">
            <el-select  v-if="editResult.settlementWay===2"
                style="width: 120px"
                id="settlementDays"
                v-model="editResult.settlementDays"
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
              <el-input type="text" v-else-if="editResult.settlementWay===3" maxlength="3" @input="editResult.settlementDays=$utils.pureNumber(editResult.settlementDays)" show-word-limit style="width: 120px;" v-model="editResult.settlementDays"></el-input>
            <el-input v-else style="width: 120px;text-align: center" placeholder="/" disabled="true" v-model="editResult.settlementDays"></el-input>
            &emsp;天
        </el-form-item>
        <el-form-item label="授信额度" :label-width="'140px'">
            <el-input  v-if="editResult.settlementWay===1?false:true" v-model="editResult.creditLimit" @input="editResult.creditLimit=$utils.pureNumber(editResult.creditLimit)" show-word-limit autocomplete="off" maxlength="8" style="width: 120px"></el-input>
            <el-input  v-else v-model="editResult.creditLimit" placeholder="/" disabled="true" style="width: 120px"></el-input>&emsp;元
        </el-form-item>
          <el-form-item label="供应商类型" required>
            <el-select
              v-model="editResult.type"
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
          <el-form-item label="售中客服" required>
            <el-select
              id="sysname2"
              v-model="editResult.salesId"
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
          <el-form-item label="营业执照" >
             <el-upload
             style="margin-left:150px"
                        class="avatar-uploader"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload"

                        >
                        <img v-if="editResult.fileUrl" :src="editResult.fileUrl"  class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div v-show="editResult.fileUrl" style="position: absolute;top: 0;left: 160px; height: 20px;width: 20px;font-size: 20px;">
                        <i @click='picDialog=true' class="el-icon-zoom-in"></i>
                    </div>
                    <el-dialog :visible.sync="picDialog" :modal="false">
                        <img width="100%" :src="editResult.fileUrl" alt="">
                    </el-dialog>
          </el-form-item>
          
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDial = false">取 消</el-button>
            <el-button type="primary" @click="editConfirm">确 定</el-button>
          </span>
      </el-dialog>
</div>
</template>

<script>
export default {
  components:{},
  props: {
      agentOpt:{
          type:Array,
          default:()=>[]
      },
      paying:{
          type:Object,
          default:()=>{}
      },
    // 表格数据源
    tableData: {
      type: Array,
      default: () => []
    },
    // 表格的字段展示
    columns: {
      type: Array,
      default: () => []
    },
    // 表格操作
    operation: {
      type: Object,
      default: () => {}
    },
    // 总条数
    total: {
      type: Number,
      default: () => 0
    },
    
    // 当前页
    currentPage: {
      type: Number,
      default: () => 0
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: () => 0
    }
  },
  data(){
    return {
       settlementDaysArr:[{id:'15',name:'15'},{id:'30',name:'30'},{id:'45',name:'45'},{id:'60',name:'60'}],
        dialType:'',
        editDial:false,
        editId:'',
        picSrc:'',
        editResult:{
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
        payWayArr: ['','付款买单','月结买单','固定天数'],
        picDialog:false,
        agentType: [
        { name: "报关行", value: 4 },
        { name: "磁检", value: 3 },
        { name: "刻章", value: 2 },
        { name: "其它", value: 5 },
      ],
      // agentTypeWord:{ 4: "报关行", 3: "磁检",2:"刻章",5: "其它"},
      agentTypeWord:['全部','','刻章','磁检','报关行','其它',],
    }
  },
  watch:{},
  computed:{},
  methods:{
    //打开编辑弹框
      edit(type,data){
          this.dialType = type
          if(type==1){
            this.editResult.agentName=data.agentName,
            this.editResult.socialCreditCode=data.socialCreditCode,
            this.editResult.namePy=data.namePy,
            this.editResult.type=data.type,
            this.editResult.salesId=this.paying.find(item=>item.name ==data.salesName) && this.paying.find(item=>item.name ==data.salesName).id,
            this.editResult.fileUrl=data.fileUrl
            this.editResult.settlementWay=data.settlementWay
            this.editResult.settlementDays=data.settlementDays
            this.editResult.creditLimit=data.creditLimit
            this.editId = data.id
            this.editDial = true
          }else {
            this.picSrc = data.fileUrl
            if(!this.picSrc){
             return this.$message.warning("营业执照未维护")
            }
            this.editDial = true
          }
      },
      //编辑-确认
      editConfirm(){
        console.log(this.editResult.namePy,this.editResult.type,this.editResult.salesId)
        if(!this.editResult.namePy || !this.editResult.type ||!this.editResult.salesId ||!this.editResult.settlementWay){
          return this.$message.warning("请输入必填信息后进行操作")
        }
        let request = JSON.parse(JSON.stringify(this.editResult))
        request.id = this.editId
        this.$http.post(this.$service.saveOrUpdateAgent,request, {
          headers: {
            diffFlag: 4,
          },
        }).then(res=>{
          if(res.code==200){
            this.$message.success("编辑成功")
            this.editDial = false
            this.$emit('currentChange', 1)
          }
          else {
            this.$message.error(res.message)
          }
        })
      },
        // 页码跳转
    handleCurrent (val) {
      // this.rowSelect()
      this.$emit('currentChange', val)
    },
    // 展示条数
    handleSize (val) {
      this.$emit('sizeChange', val)
    },
     jsfs(num,type){
      if(num === 1){
                if(type === 1){
                    this.$set(this.editResult, 'settlementDays', '')
                    this.$set(this.editResult, 'creditLimit', "")
                }
                if(type === 2){
                    this.$set(this.editResult, 'settlementDays', '15')
                    this.$set(this.editResult, 'creditLimit', '')
                }
                if(type === 3){
                    this.$set(this.editResult, 'settlementDays', '')
                    this.$set(this.editResult, 'creditLimit', '')
                }
            }
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
                        this.editResult.fileUrl = data
                    this.$message.success("上传成功")
                } else {
                    this.$message.error(message);
                }
            } catch (error) {
            }
        },
  },
  created(){},
  mounted(){}
}
</script>

<style scoped lang='less'>
/deep/ .el-table__body tr:hover>td {
  background-color: #CCC !important;
}
</style>