<template>
  <el-dialog :visible.sync="newInquiryDial" width="550px" title="新建询盘">
    <el-form :model="inquiryForm" :rules="rules" ref="newForm" label-width="90px">
      <el-form-item label="询盘分类" required  required prop="type">
        <el-radio v-model="inquiryForm.type" :label="1">出口空运</el-radio>
      </el-form-item>
      <el-form-item label="起运区域" required prop="startAreas">
        <el-select
          v-model="inquiryForm.startAreas"
          placeholder="请选择起运区域"
          clearable
          remote
          multiple 
          reserve-keyword
          style="width: 170px"
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
      <el-form-item label="目的港" required prop="pod">
        <el-select
          v-model="inquiryForm.pod"
          id="pod"
          :remote-method="podMethod"
          placeholder="请输入目的港"
          clearable
          filterable
          remote
          reserve-keyword
          style="width: 170px"
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
      <el-form-item label="目标价">
        <el-input
          v-model="inquiryForm.expectPrice"
          maxlength="20"
          style="width: 170px;"
        ></el-input>
      </el-form-item>

      <el-form-item label="询盘内容" required prop="content">
        <el-input
          v-model="inquiryForm.content"
          maxlength="500"
          type="textarea"
          placeholder="为了提交报价效率,内容请填写清楚目的港,件数,毛重,体积,品名,大概出货日期,货源地以及对航班的要求,越详细越好,欢迎加上成交目标价格"
          :autosize="{ minRows: 4 }"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="newInquiryFoot">
      <el-button class="cancelButton" @click="newInquiryDial = false">
        取 消
      </el-button>
      <el-button type="primary" class="primaryButton" @click="confirmNewInquiry">
        提 交
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      newInquiryDial: false,
      inquiryForm: {
        type: 1,
        expectPrice: "",
        content: "",
        startAreas:[],
        pod:''
      },
      polArea: [
        {
          //起运区域
          label: "华东",
          value: "华东"
        },
        {
          label: "华南",
          value: "华南"
        },
        {
          label: "华中/华北",
          value: "华中华北"
        }
      ],
      podOpt: [],
       rules: {
          content: [
            { required: true, message: '请输入询盘内容', trigger: ['blur','change'] }
          ],
          startAreas: [
            { required: true, message: '请选择起运区域', trigger: ['blur','change'] }
          ],
           pod: [
            { required: true, message: '请选择目的港', trigger: ['blur','change'] }
          ],
        }
    };
  },
  created() {
    this.initAirportSearchByPage();
  },
  mounted() {
    this.newInquiryDial = true;
  },
  methods: {
    ...mapActions('chatRoom',['createNewChat']),
    podMethod(keyWord) {
      this.initAirportSearchByPage(keyWord);
    },
    initAirportSearchByPage(keyWord) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then(data => {
          if (data.code == 200) {
            this.podOpt = data.data.records;
          }
        });
    },
    confirmNewInquiry(){
      let startAreas = this.inquiryForm.startAreas.join()
      let request = {...this.inquiryForm,startAreas}
        this.$refs.newForm.validate((valid) => {
          if (valid) {
            this.$http.post(this.$service.addNewCwo ,request).then(res=>{
                if(res.code == 200) {
                    this.newInquiryDial = false
                    const length = res.data.cwoWsVOList && res.data.cwoWsVOList.length
                    if(length ==0){
                      return this.$message.error('对接人是当前用户，新建询盘失败')
                    }
                    this.$message.success('新建成功')
                    this.createNewChat({
                        "time": 4,
                        "memType": 1,
                        "pageNum": 1,
                        "pageSize": length,
                        "searchType": 2
                    })
                }
            })
          } else {
            this.$message.warning("请填写全部内容")
            return false;
          }
        });
    }
  },
  watch:{
    newInquiryDial(nv){
        if(!nv){
            this.$parent.createInquiryDial = false
        }
    }
  }
};
</script>

<style lang="less" scoped>
.newInquiryFoot{
    text-align: center;
    padding: 15px 0;
}
</style>
