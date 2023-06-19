<template>
  <el-dialog
    class="special-release-dialog"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    z-index="1000"
    @closed="$emit('closeEv')"
  >
    <template #title>
      <span class="el-dialog__title">编辑</span>
      <!-- <span style="color: #f59a23">特价信息有效展示期3天</span> -->
    </template>
    <el-form :model="jpObj">
          <el-form-item label="精品航线位置" label-width="120px" :required="true">
            <div class="dialog-box">
              <div class="dialog-box-item" v-for="(item,index) in tableDataArr" :key="index">
                <img :src="item.showFile?item.showFile:imgArr[index]" alt="">
                <el-radio :disabled="jpObj.status==-1" @change="changeToP(jpObj.position,jpObj.date,jpObj.id)" class="radiosss" v-model="jpObj.position" :label="index+1">{{''}}</el-radio>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="精品航线标题" label-width="120px" :required="true">
            <el-input
            maxlength="20"
                      show-word-limit
            placeholder="请输入内容"
            v-model="jpObj.showName"
            style="width: 70%;height:40px">
            </el-input>
          </el-form-item>
          <el-form-item label="航线" label-width="120px" :required="true">
            <el-input
            maxlength="20"
                      show-word-limit
            placeholder="请输入内容"
            v-model="jpObj.showAirline"
            style="width: 70%;height:40px">
            </el-input>
          </el-form-item>
          <el-form-item label="航线特色" label-width="120px" :required="true">
            <div class="dialog-box2">
              <div style="width: 87%;height:auto;border: 1px #DCDFE6 solid;min-height: 34px;position: relative;" class="dialog-box2-item bqbox-view">
                <span v-for="(item,index) in xzbqarr" :key="index" class="bqspan">&nbsp;
                  {{item}}
                  <i v-if="(indexNumber>0 && indexNumber!=5)?false:true" class="el-icon-circle-close buttonele" @click.stop="elebq(index)"></i>
                </span>
                <div v-if="(indexNumber>0 && indexNumber!=5)?false:true" v-show="xzbqarr.length != 4" class="errWarm" style="position: absolute;">&nbsp;请输入四组标签</div>
              </div>
              <div v-if="(indexNumber>0 && indexNumber!=5)?false:true" class="dialog-box2-item">
                <el-button :disabled="xzbqarr.length == 4" @click.stop="dialoginit = true">添加标签</el-button>
                <i class="el-icon-arrow-up" v-show="bqbox" style="font-size: 20px;font-weight: bold;" @click="bqbox = false"></i>
                <i class="el-icon-arrow-down" v-show="!bqbox" style="font-size: 20px;font-weight: bold;" @click="bqbox = true"></i>
                <span class="span">收起标签</span>
              </div>
              <el-dialog title="自定义标签" :visible.sync="dialoginit" width="300px" :modal="false">
                <el-form >
                  <el-form-item label="" >
                  <el-input v-model="bqxz" autocomplete="off" maxlength="10" show-word-limit></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button  @click="dialoginit = false">取 消</el-button>
                  <el-button type="primary" @click="dialoginitbq">确 定</el-button>
                </div>
              </el-dialog>
              <div v-show="bqbox" class="dialog-box2-item dialog-box3-item">
                <div v-for="(item,index) in bqArr" :key="index+'bao'">
                  <el-button :disabled="xzbqarr.length == 4" :class="xzbqarr.indexOf(item)>-1?'disButton':''" @click="bqxuanzhong(index)">{{item}}</el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label-width="120px" label="选择展示周期" :required="true">
            <el-select :disabled="jpObj.status==-1" @change="changeToP(jpObj.position,jpObj.date,jpObj.id)" v-model="jpObj.date" size="" style="width: 70%;height:40px" placeholder="请选择">
              <el-option
                v-for="item in timeArray"
                :key="item.id"
                :label="item.nowWeekChain"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片上传"  label-width="120px" :required="true">
            <span>仅仅支持JPG,PNG, JPEG,BMP格式,文件小于10M</span>
            <el-upload
              :disabled="(indexNumber>0 && indexNumber!=5)"
              class="avatar-uploader"
              :on-preview="handlePictureCardPreview"
              :before-upload="beforeAvatarUpload">
              <img v-if="jpObj.showFile" :src="jpObj.showFile"  class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisibles"  :modal="false">
              <img width="100%" :src="jpObj.showFile" alt="">
            </el-dialog>
            <div v-show="jpObj.showFile" style="position: absolute;top: 31px;left: 280px; height: 20px;width: 20px;font-size: 20px;cursor: pointer;">
              <i  @click.stop='handlePictureCardPreview' class="el-icon-zoom-in"></i>
              <i  @click.stop="deleteImg" class="el-icon-circle-close"></i>
            </div>
          </el-form-item>
          <el-form-item label="图库" label-width="120px">
            <div class="dialog-box dialog-box2 dialog-box3" style="cursor: pointer">
              <div @click="radiossClick(index)" class="dialog-box-item" v-for="(item,index) in 6" :key="index">
                <img :src="imgArr[index]" alt="">
                <div v-if="index == radiossIndex" class="radioss">
                  <i class="el-icon-check"></i>
                </div>
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item class="el-from-linglei" style="margin-bottom: 0px;height:24px;line-height: 24px;" label="详情信息" label-width="120px">
          </el-form-item> -->
          <!-- 编辑框 -->
        <el-form-item label="详情信息" label-width="120px" prop="discountInfo" class="discount-info">
          <input type="text" v-model="jpObj.showRemark" style="display: none" />
          <div id="toolbar-container" style="max-width: 800px;"></div>
          <div
            id="editor-container"
            style="
              max-width: 800px;
              height: 400px;
              border-top: 1px solid #e5e5e5;
              line-height: normal;
            "
          ></div>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer footerss">
          <el-button @click="$emit('closeEv')">取 消</el-button>
          <el-button type="primary" @click="colseDia()">确 定</el-button>
          <!-- <span @click.stop="dialog2Show=true"  class="span">效果预览</span> -->
        </div>
        <el-dialog title="提示" width="400px" :modal="false" :show-close="false" :close-on-press-escape="false" :visible.sync="showTwo" >
            <div style="margin:20px">
                {{position+(numberzz == 9?'该位置已存在航线':'目前已有精品航线，确认替换？')}}
            </div>
            <div slot="footer" style="padding:0;">
                <el-button @click="colseDia2(false)">取 消</el-button>
                <el-button type="primary" @click="colseDia2(true)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" width="400px" :modal="false" :show-close="false" :close-on-press-escape="false" :visible.sync="show3" >
            <div style="margin:20px">
              {{messageShow}}
            </div>
            <div slot="footer" style="padding:0;">
                <el-button @click="colseDia3(false)">取 消</el-button>
                <el-button type="primary" @click="colseDia3(true)">确 定</el-button>
            </div>
        </el-dialog>
  </el-dialog>
</template>

<script>
import {
  JUSTIFY_LEFT_SVG,
  INDENT_RIGHT_SVG,
  MORE_SVG,
} from "@/assets/svg/wangEditor.js";
const { createEditor, createToolbar, t } = window.wangEditor;
export default {
  // 特价发布弹窗
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    jpObjz:{
        type: Object,
      default: () => ({}),
    },
    tableDataArr:{
        type: Object,
      default: () => ({}),
    },
    timeArray:{
        type: Object,
      default: () => ({}),
    },
    numberzz:{
      type:Number,
    }
  },
  async created() {
    this.visible = true;
    await this.$nextTick();
    this.initEditor();
    this.chageArr()
  },
  data() {
    return {
      messageShow:'',
      show3:false,
      position:null,
      visible: false,
      otherId:null,    
      applicantId:null,    
      bqArr:['直飞','天天航班','全年固定包板','可做整板BUP'],
      bqbox:true,
      bqxz:'',
      timeArray:[],
      xzbqarr:[],
      showTwo:false,
      dialoginit:false,
      radiossIndex:null,
      dialogVisibles: false,
      dogShow: "",
      diaogType: "",
      radio: 1,
      jpObj:{},
      tableDataArr:[{},{},{},{},{},{}],
      imgArr:['/image/userBannerImage/1.jpg','/image/userBannerImage/2.jpg','/image/userBannerImage/3.jpg',
		'/image/userBannerImage/4.jpg','/image/userBannerImage/5.jpg','/image/userBannerImage/6.jpg',],
      coordinateArr:[{id:1,name:'(1,1)'},{id:2,name:'(1,2)'},{id:3,name:'(1,3)'},{id:4,name:'(2,1)'},{id:5,name:'(2,2)'},{id:6,name:'(2,3)'}],
    };
  },
  computed: {
    // computedFormRef() {
    //   return this.$refs.form;
    // },
  },
  methods: {
    chageArr(){
        this.timeArrays = JSON.parse(JSON.stringify(this.timeArray))
        this.xzbqarr = this.jpObj.showLabel?this.jpObj.showLabel.split('||'):this.jpObj.showLabel
        this.changeToP(this.jpObj.position,this.jpObj.date,this.jpObj.id)
    },
    forArr(num,name){
        if(num == 1){
        for (let i = 0; i < this.coordinateArr.length; i++) {
            if(this.coordinateArr[i].name == name){
            return this.coordinateArr[i].id
            }
        }
        }else{
        for (let i = 0; i < this.coordinateArr.length; i++) {
            if(this.coordinateArr[i].id == name){
            return this.coordinateArr[i].name
            }
        }
        }
    },
    forTime(num,name){
        if(num == 1){
        for (let i = 0; i < this.timeArrays.length; i++) {
            if(this.timeArrays[i].nowWeeekEnglish.split(' ')[1] == name){
            return i
            }
        }
        }else if(num == 2){
            var endate = this.timeArrays[name].nowWeeekEnglish.split(' ')[1]
            return endate
        }else if(num == 3){
            var sdate = this.timeArrays[name].nowWeeekEnglish.split(' ')[0]
            return sdate
        }
    },
    //删除标签
    elebq(index){
      this.xzbqarr.splice(index,1)
      this.jpObj.showLable = this.xzbqarr
    },
    //选中标签
    bqxuanzhong(index){
      if(this.xzbqarr.indexOf(this.bqArr[index]) == -1){
        this.xzbqarr.push(this.bqArr[index])
      }else{
        this.xzbqarr.splice(this.xzbqarr.indexOf(this.bqArr[index]),1)
      }
      this.jpObj.showLable = this.xzbqarr
    },
    //添加标签
    dialoginitbq(){
        if(this.xzbqarr.indexOf(this.bqxz)>-1){
            this.$message.error('标签重复，请重新输入')
            this.dialoginit = false
            this.bqxz = ''
        }else{
            this.xzbqarr.push(this.bqxz)
            this.dialoginit = false
            this.bqxz = ''
            this.jpObj.showLable = this.xzbqarr
        }
    },
    saveObj(){
        var obj = {}
        this.$set(obj,'showLabelforSave',this.xzbqarr)
        var endDate = this.forTime(2,this.jpObj.date)
        this.$set(obj,'endDate',endDate)
        var startDate = this.forTime(3,this.jpObj.date)
        this.$set(obj,'startDate',startDate)
        var showRemark = this.htmlEncodeByRegExp(this.jpObj.showRemark)
        this.$set(obj,'showRemark',showRemark)
        obj.status = this.jpObj.status
        obj.id = this.jpObj.id
        obj.showAirline = this.jpObj.showAirline
        obj.showFile = this.jpObj.showFile
        obj.showName = this.jpObj.showName
        obj.position = this.forArr(2,this.jpObj.position)
        if(this.otherId != null){
            obj.otherId = this.otherId
        }
        var number = 0

        if(obj.showLabelforSave.length != 4){
            return this.$message.error('请输入四个标签')
        }
        if(obj.endDate == null||obj.endDate == undefined||obj.endDate == ''){
            number = 1
        }
        if(obj.showAirline == null||obj.showAirline == undefined||obj.showAirline == ''){
            number = 1
        }
        if(obj.showFile == null||obj.showFile == undefined||obj.showFile == ''){
            number = 1
        }
        if(obj.showName == null||obj.showName == undefined||obj.showName == ''){
            number = 1
        }
        
        if(number === 1){
            return this.$message.error('请输入必填项')
        }
        this.$emit('colseDiaThing',obj)
        this.$emit('closeEv')
    },
    colseDia(){
        if(this.otherId != null){
            if(this.numberzz == 9){
              return this.$message.warning('该位置已存在航线')
            }else if(this.numberzz == 8){
              if(this.jpObjz.date == this.jpObj.date){
                  this.messageShow = this.position+'目前已有精品，本次申请会使此位置的航线与'+this.position+'替换，确认提交？'
                  this.show3 = true
              }else{
                if(this.jpObjz.applicantId == this.applicantId){
                  this.messageShow = this.position+'目前已有精品，本次申请出现航线冲突，会导致被替换的位置航线数据丢失，确认提交？'
                  this.show3 = true
                }else{
                  this.messageShow = this.position+'目前已有精品，本次申请会使此位置的航线退回到“审核不通过”，确认提交？'
                  this.show3 = true
                }
              }
            }
        }else{
          if(this.numberzz == 9){
            this.changeToP(this.jpObj.position,this.jpObj.date,this.jpObj.id,true)
          }else{
            this.saveObj()
          }
        }
    },
    colseDia2(type){
        if(type){
            this.showTwo = false
        }else{
            this.jpObj.position = this.jpObjz.position
            this.otherId = null
            this.position = null
            this.applicantId = null
            this.showTwo = false
        }
    },
    colseDia3(type){
        if(type){
            this.saveObj()
            this.show3 = false
        }else{
            // this.jpObj.position = this.jpObjz.position
            // this.otherId = null
            // this.position = null 
            this.show3 = false
        }
    },
    async changeToP(imgIndex,timeIndex,id,type){
      var endDate = this.forTime(2,Number(timeIndex))
      var position = this.forArr(2,Number(imgIndex))
      var obj = {'endDate':endDate,'position':position,'id':id,}
      var data =  await this.$http.post(this.$service.goodRouterPTtoPT,obj)
      if(data.code == 200){
        if(data.data != null){
          if(type){
            return this.$message.warning('该位置已存在航线')
          }else{
            this.showTwo = true
            this.otherId = data.data.id
            this.applicantId = data.data.applicantId
            this.position = data.data.position
          }
        }else{
          this.otherId = null
          this.position = null
          this.applicantId = null
          if(type){
            this.saveObj()
          }
        }
      }else{
        this.$message.error(data.message)
      }
    },
    // 选择图片
    radiossClick(index){
      if(this.radiossIndex == index){
        this.radiossIndex = null
        this.$set(this.jpObj, 'showFile', '')
      }else{
        this.radiossIndex = index
        var arrayImg = ['/image/userBannerImage/1.jpg','/image/userBannerImage/2.jpg','/image/userBannerImage/3.jpg',
                '/image/userBannerImage/4.jpg','/image/userBannerImage/5.jpg','/image/userBannerImage/6.jpg',]
        this.$set(this.jpObj, 'showFile', arrayImg[Number(index)])
      }
    },
    // 删除图片
    deleteImg(){
      this.jpObj.showFile = ''
    },
    /*3.用正则表达式实现html转码*/
    htmlEncodeByRegExp(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/\s/g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    return s;
    },
    initEditor() {
      this.jpObj = JSON.parse(JSON.stringify(this.jpObjz))
      const editorConfig = {};
      editorConfig.customPaste = (editor, event) => {
        // const html = event.clipboardData.getData('text/html') // 获取粘贴的 html
        // const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
        // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）
        // console.log('html', html)
        // console.log('text', text)
        // console.log('rtf', rtf)
        // const content = html || text || rtf
        // editor.insertText(content)
        // event.preventDefault();
        // return false;
        return true;
      };
      editorConfig.placeholder = "请输入内容或右击粘贴为纯文本";
      editorConfig.onChange = (editor) => {
        // 当编辑器选区、内容变化时，即触发
        const html = editor.getHtml();
        const text = editor.getText();
        this.jpObj.showRemark = text ? html : "";
      };
      editorConfig.onCreated = (editor) => {
        if (this.jpObj.showRemark) {
          editor.setHtml(this.jpObj.showRemark);
        }
      };
      // 工具栏配置
      const toolbarConfig = {
        toolbarKeys: [
          "headerSelect",
          "blockquote",
          "|",
          "bold",
          "underline",
          "italic",
          {
            key: "group-more-style", // 以 group 开头
            title: t("editor.more"),
            iconSvg: MORE_SVG,
            menuKeys: ["through", "clearStyle"],
          },
          "color",
          "bgColor",
          "|",
          "fontSize",
          "lineHeight",
          "|",
          {
            key: "group-justify", // 以 group 开头
            title: t("editor.justify"),
            iconSvg: JUSTIFY_LEFT_SVG,
            menuKeys: [
              "justifyLeft",
              "justifyRight",
              "justifyCenter",
              "justifyJustify",
            ],
          },
          {
            key: "group-indent", // 以 group 开头
            title: t("editor.indent"),
            iconSvg: INDENT_RIGHT_SVG,
            menuKeys: ["indent", "delIndent"],
          },
          "|",
          "insertLink",
          "divider",
          "|",
          "redo",
          "undo",
          "|",
          "fullScreen",
        ],
      };

      // 创建编辑器
      const editor = createEditor({
        selector: "#editor-container",
        config: editorConfig,
        mode: "default", // 或 'simple' 参考下文
      });
      // 创建工具栏
      const toolbar = createToolbar({
        editor,
        selector: "#toolbar-container",
        config: toolbarConfig,
        mode: "default", // 或 'simple' 参考下文
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-dialog{
  width: 850px !important;
}
.avatar-uploader{
    margin-left: 96px;
}
 .avatar-uploader .el-upload {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
    z-index: 0;
  }
  .avatar-uploader-icon{
      width: 100%;
    height: 100%;
  }
  /deep/ .dialogErr .el-dialog__body .el-form-item__error{
    left: 40%;
  }
.dialog-box{
    display: flex;
    flex-wrap:wrap;
    flex-direction: row;
    width: 80%;
    height: 200px;
    justify-content:space-around;
}
.dialog-box-item{
    width: 150px ;
    height: 80px;
    position: relative;
    margin-bottom: 15px;
}
.dialog-box-item .radiosss .el-radio__label{
    display: none;
}
.dialog-box-item img{
    width: 100%;
    height: 100%;
}
.dialog-box-item .radiosss{
    position: absolute;
    bottom: 2px;
    right: 2px;
}
.dialog-box2{
    display: flex;
    width: 80%;
    height: auto;
    flex-direction: column;
}
.dialog-box2-item{
    display: flex;
    width: 100%;
    height: 40px;
    flex-direction: row;
    align-items: center;
    margin: 10px 0;
    
}
.dialog-box2-item button{
    margin: 0;
    border: 0;
    min-width: 100px;
    width: auto;
    height: 30px;
    font-size: 14px;
    line-height: 7px;
    text-align: center;
    color: #FFFFFF;
    background-color: rgba(22, 155, 213, 1);
    margin-right: 20px;
    cursor: pointer;
    border-radius: 3px;
}
.dialog-box2-item .span{
    font-size: 14px;
    color: #333333;
}
.dialog-box3-item{
    flex-wrap:wrap;
    width: 100%;
    height: 80px;
    /* height: auto; */
}
.dialog-box3-item button{
    margin: 0 10px 10px 10px;
}
.button-white{
    background: #FFFFFF !important;
    color: #333333 !important;
    border: 1px #000000 solid !important;
}

.dialog-box3{
    display: flex;
    flex-direction: row;
    /* width: 100% !important; */
    flex-wrap: wrap;
    height: 200px;
}
.dialog-box3 .dialog-box-item{
    width: 150px;
    height: 80px;
}
.dialog-box3 .dialog-box-item .radioss{
    position: absolute;
    width: 149px;
    height: 79px;
    top: -4px;
    left: -4px;
    border: #D9001B 4px solid;
}
.dialog-box3 .dialog-box-item .radioss i{
    position: absolute;
    display: block;
    width: 20px;
    height: 20px;
    right: -1px;
    bottom: 0;
    background-color: #D9001B;
    color: #000000;
    font-size: 20px;
    font-weight: 1000;
}
.footerss{
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.footerss .span{
    display: block;
    font-size: 12px;
    color: rgb(2, 167, 240);
    position: absolute;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
}
.footerss .span1{
    right: 110px;
}
.bqbox-view{
    display: -webkit-flex;
    display: flex;
    flex-wrap:wrap;
    width: 100%;
    height: auto;
    flex-direction: row;
    align-items: center;
    
    margin: 10px 0;
}
.bqbox-view .bqspan{
    display: block;
    height: 20px;
    /* min-width: 70px; */
    width: auto;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    margin: 5px;
    position: relative;
    /* border: 1px #8c939d solid; */
    border-radius: 2px;
    background: #81d3f8;
    color: #FFFFFF;
}
.bqbox-view .bqspan .buttonele{
    display: inline-block;
    width: 18px;
    height: 18px;
    font-size: 16px;
    min-width:18px !important;
    padding-left: 10px;
    padding-right: 4px;
    padding-top: 2px;
    cursor: pointer;
}
.bqbox-view .bqspan .buttonele:hover{
    color: #D9001B;
}
.errWarm{
    font-size: 14px;
    width: 120px;
    height: 40px;
    line-height: 40px;
    top: 0;
    right: -120px;
    color: #D9001B;
}
.disButton{
    background: #ecf5ff !important;
}
.discount-info {
  /deep/ h1[data-slate-node="element"],
  /deep/ h2[data-slate-node="element"],
  /deep/ h3[data-slate-node="element"],
  /deep/ h4[data-slate-node="element"],
  /deep/ h5[data-slate-node="element"] {
    font-weight: bold;
  }
  /deep/ h1[data-slate-node="element"] {
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
  }
  /deep/ h2[data-slate-node="element"] {
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
  }
  /deep/ h3[data-slate-node="element"] {
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
  /deep/ h4[data-slate-node="element"] {
    font-size: 1em;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
  }
  /deep/ h5[data-slate-node="element"] {
    font-size: 0.83em;
    margin-block-start: 1.67em;
    margin-block-end: 1.67em;
  }
  /deep/ p[data-slate-node="element"] {
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
  /deep/ strong {
    font-weight: bold;
  }
  /deep/ i {
    font-style: italic;
  }
  /deep/ u {
    text-decoration: underline;
  }
  /deep/ em {
    font-style: italic;
  }
  /deep/ s {
    text-decoration: line-through;
  }
  /deep/ sup {
    vertical-align: super;
    font-size: smaller;
  }
  /deep/ sub {
    vertical-align: sub;
    font-size: smaller;
  }
  /deep/ a[data-slate-node="element"] {
    text-decoration: underline;
  }
  /deep/ ul[data-slate-node="element"] {
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
  /deep/ ol[data-slate-node="element"] {
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
  /deep/.el-form-item__content {
    border: 1px solid #e5e5e5;
  }
}
</style>