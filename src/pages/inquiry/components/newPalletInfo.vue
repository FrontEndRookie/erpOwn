<template>
  <el-dialog
    v-dialog-drag
    :visible.sync="palletShow"
    width="550px"
    style="padding-bottom: 25px"
  >
    <div slot="title" class="dialog-title">
      <span>货盘信息</span>
      <span class="rightNotice" v-if="!dataAlready">请提取该工单货盘信息</span>
    </div>

    <el-form
      :disabled="ifLeader || ifSelf"
      style="
        display: flex;
        margin-top: 15px;
        flex-wrap: wrap;
        align-items: center;
      "
      label-position="left"
    >
      <el-form-item label="起始区域" label-width="80px">
        <el-select
        style="line-height:30px;width:250px"
          v-model="platInfo.startArea"
          id="pol"
          size="small"
          placeholder="请输入起始区域"
          disabled
        >
           <el-option
              v-for="item in polArea"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="目的港" required label-width="80px">
        <el-select
          v-model="platInfo.pod"
          id="pod"
          size="small"
          v-input-limit="{type:[2],length:3}"
          placeholder="目的港"
          :remote-method="podMethod"
          disabled
          remote
          style="line-height:30px;width:250px"
        >
          <el-option
            v-for="(item, index) in podOpt"
            :key="item.threeLetterCode"
            :value="item.threeLetterCode"
          >
            <span>{{ item.threeLetterCode }}</span>
            <span style="margin-left: 5px">{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        
        label="件数"
        label-width="60px"
        style="width: 220px"
      >
        <el-input
          style="width: 150px"
          size="medium"
          v-input-limit="{type:[1],length:8}"
          @blur="platInfo.piece = $event.target.value"
          v-model="platInfo.piece"
        >
          <template slot="append">PCS</template>
        </el-input>
      </el-form-item>
      <el-form-item
        
        label="毛重"
        label-width="60px"
        style="width: 220px;margin-left:5px"
      >
        <el-input
          style="width: 150px"
          size="medium"
          v-model.number="platInfo.weight"
          v-input-limit="{type:[1],length:8}"
          @blur="platInfo.weight = $event.target.value"
        >
          <template slot="append">KG</template>
        </el-input>
      </el-form-item>
      <el-form-item
        
        label="体积"
        label-width="60px"
        style="width: 220px"
      >
        <el-input
          style="width: 150px"
          size="medium"
          v-model="platInfo.cbm"
           v-input-limit="{limitMinus:false,floatLimit:[6,2]}"
          @blur="platInfo.cbm = $event.target.value"
          maxlength="9"
        >
          <template slot="append">CBM</template>
        </el-input>
      </el-form-item>
      <el-form-item label="比重" label-width="50px" style="width: 200px;margin-left:14px">
        <el-input
          style="width: 150px"
          size="medium"
          v-model="platInfo.vwr"
          disabled
        >
        </el-input>
      </el-form-item>
    
      <el-form-item
        label="货好时间"
        label-width="80px"
        style="width: 250px"
      >
        <el-date-picker
          v-model="platInfo.cargoReadyDate"
          :picker-options="pickerOptions"
          style="width: 250px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择货好时间"
        >
        </el-date-picker>
      </el-form-item>
        <el-form-item label="备注" label-width="80px" style="width: 400px">
        <el-input
          v-model="platInfo.remark"
          type="textarea"
          maxlength="50"
          style="width: 250px"
          placeholder="请输入备注"
        >
        </el-input>
      </el-form-item>
       
    </el-form>
    <el-form :disabled="ifLeader || ifSelf">
     <el-form-item label="报价" label-width="80px" style="width: 230px" required disabled="false">
        <el-input
          v-model="platInfo.expectPrice"
          maxlength="50"
           v-input-limit="{limitMinus:false,floatLimit:[8,2]}"
          placeholder="请输入价格"
          style="width: 250px"
          @blur="platInfo.expectPrice = $event.target.value"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        style="margin: 0 auto; padding-bottom: 20px;width:100%;text-align:center"
      >
        <el-button type="info" size="medium" @click="palletShow = false"
          >取消</el-button
        >
         <el-button type="primary" size="medium" @click="!ifSelf?configMessage():$message.warning('当前为询盘发起人，无法操作货盘信息')"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: ['cwoId','palletObj','palletPod'],
  data() {
    return {
      palletShow: false,
      platInfo: {
        startArea: "",
        pod: "",
        piece: "",
        weight: "",
        cbm: "",
        vwr: "",
        cargoReadyDate: "",
        remark: "",
        expectPrice:''
      },
      dataAlready: false,
      pickerOptions: {
        disabledDate(time) {
          //选择今天以及今天之后的日期
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择
        },
      },
      podOpt: [],
       polArea:[{ //起运区域
        label:'华东',value:'华东'
      },{
        label:'华南',value:'华南'
      },{
        label:'华中/华北',value:'华中华北'
      },
      ],
    };
  },
  created() {},
  mounted() {
    this.initAirportSearchByPage();
  },
  methods: {
   
    //确认提交
    configMessage() {
      let { pod, expectPrice } = this.platInfo;
      if ([pod, expectPrice].some((item) => !item)) {
        return this.$message.warning("请输入所有必填信息");
      }
      let request = Object.assign({},this.platInfo)
      request.cwoId = this.cwoId
      request.id = this.$parent.chatRoomTitleBox.palletId
      request.vwr = (request.weight && request.cbm)?Math.round(request.weight / request.cbm):''
      request.cwoId = Number(request.cwoId)
      request.cbm = request.cbm?Number(request.cbm):''
      request.piece = request.piece?Number(request.piece):''
      request.weight = request.weight?Number(request.weight):''
      let api = this.dataAlready?this.$service.updatePallet : this.$service.addNewPallet
      let requestType = this.dataAlready?'put':'post'
      this.$http[requestType](api,request).then(res=>{
      if(res.code==200){
        this.$message.success("提交货盘信息成功")
        this.$emit("confirmPallet",[this.cwoId,request])
        this.palletShow=false
      }
      
      })
    },
    //聊天室右侧运价查询 起始港目的港数据
    podMethod(keyWord) {
      this.initAirportSearchByPage(keyWord, "目的港");
    },
    //起始港三字码
    initAirportSearchByPage(keyWord, type) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then((data) => {
          if (data.code == 200) {
              this.podOpt = data.data.records;
          }
        });
    },
  },
    computed: {
    ...mapState({
      chatRoomTitleBox:state=>state.chatRoom.chatRoomTitleBox,
    }),
    ...mapGetters("chatRoom", {ifSelf:'ifSelf',ifLeader:'ifLeader'}),
  },
  watch: {
    palletPod(nv,ov){
      this.platInfo.pod = nv
    },
    palletObj:{
      handler(nv,ov){
        if(!nv){
           this.platInfo = {
              startArea: this.chatRoomTitleBox.startArea,
              pod: this.palletPod,
              piece: "",
              weight: "",
              cbm: "",
              vwr: "",
              cargoReadyDate: "",
              remark: "",
              expectPrice:''
            };
          this.dataAlready = false
        } else {
          console.log(this.chatRoomTitleBox)
          let {pod,piece,weight,cbm,vwr,cargoReadyDate,remark,expectPrice} = nv
          this.platInfo= {
            startArea: this.chatRoomTitleBox.startArea,
            pod: pod,
            piece: piece,
            weight: weight,
            cbm: cbm,
            vwr: vwr,
            cargoReadyDate: cargoReadyDate,
            remark: remark?remark:'暂无',
            expectPrice:expectPrice
          },
          this.dataAlready = true
        }
      },
      deep:true,
    },
    palletShow(nv, ov) {
      if (!nv) {
        this.platInfo = {
          startArea: '',
          pod: this.palletPod,
          piece: "",
          weight: "",
          cbm: "",
          vwr: "",
          cargoReadyDate: "",
          remark: "",
          expectPrice:''
        };
      }
      this.platInfo.startArea = this.chatRoomTitleBox.startArea
    },
    "platInfo.weight"() {
      if (this.platInfo.weight && this.platInfo.cbm) {
        this.platInfo.vwr = `1:${Math.round(
          this.platInfo.weight / this.platInfo.cbm
        )}`;
      } else {
        this.platInfo.vwr = "";
      }
    },
    "platInfo.cbm"() {
      if (this.platInfo.weight && this.platInfo.cbm) {
        this.platInfo.vwr = `1:${Math.round(
          this.platInfo.weight / this.platInfo.cbm
        )}`;
      } else {
        this.platInfo.vwr = "";
      }
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-input .el-input__inner {
  border-radius: 0 !important;
}
/deep/.el-dialog__header {
  border: 0;
  font-size: 21px;
  text-align: center;
  color: #333333;
  padding-top: 20px;
  font-weight: 600;
  .rightNotice {
    position: absolute;
    font-size: 15px;
    font-weight: 500;
    color: #f59c8b;
    right: 50px;
  }
}
</style>