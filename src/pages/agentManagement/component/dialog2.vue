<template>
    <div>
        <el-dialog title="| 历史" :visible="diaogType == 2?true:false" width="700px" @close='changeDialogVisible(1,"histroy")' :modal='false' :close-on-click-modal="false">
            <el-table :data="historyArr" style="width: 100%">
                <el-table-column prop="createTime" label="操作时间" width="200"></el-table-column>
                <el-table-column prop="operatorName" label="操作者" width="100"></el-table-column>
                <el-table-column prop="operation" label="操作" width="150"></el-table-column>
                <el-table-column prop="remarks" label="说明" width="150"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog class="dialogErr" title="我的精品航线" @open="dialogOpen" :modal-append-to-body='false' :close-on-press-escape="false" @close='changeDialogVisible(1)' :modal="false" :visible="diaogType=='1'?true:false">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="banner位置" prop="position">
                    <el-input
                    :rows="2"
                    :disabled="true"
                    placeholder="请输入内容"
                    v-model="form.position"
                    style="width: 70%;height:40px"></el-input>
                </el-form-item>
                <el-form-item label="banner名称" prop="bannerName">
                    <el-input
                    :rows="2"
                    :disabled="true"
                    maxlength="20"
                    show-word-limit
                    placeholder="请输入内容"
                    v-model="form.showName"
                    style="width: 70%;height:40px">
                    </el-input>
                </el-form-item>
                <el-form-item label="banner航线" prop="bannerLine">
                    <el-input
                    :rows="2"
                    maxlength="20"
                    :disabled="true"
                    show-word-limit
                    placeholder="请输入内容"
                    v-model="form.showAirline"
                    style="width: 70%;height:40px">
                    </el-input>
                </el-form-item>
                <el-form-item label="图片上传" prop="uploadImage">
                    <el-upload
                        :disabled="true"
                        class="avatar-uploader"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="form.showFile" :src="form.showFile"  class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisibles"  :modal="false">
                        <img width="100%" :src="form.showFile" alt="">
                    </el-dialog>
                    <div v-show="form.showFile" style="position: absolute;top: 0;left: 250px; height: 20px;width: 20px;font-size: 20px;">
                        <i  @click='handlePictureCardPreview' class="el-icon-zoom-in"></i>
                    </div>
                </el-form-item>
                <el-form-item label="详情页面">
                    <div id="htmlHistory" class="htmlHistory">

                    </div>
                </el-form-item>
                <el-form-item label="航线特色"  prop="feature">
                    <el-input
                    :rows="2"
                    :disabled="true"
                    placeholder="请输入内容"
                    v-model="form.showLabel"
                    style="width: 70%;height:40px">
                    </el-input>
                </el-form-item>
                <el-form-item label="开始日期" prop="startDate">
                    <el-input
                    :rows="2"
                    :disabled="true"
                    placeholder="请输入内容"
                    v-model="form.startDate"
                    style="width: 70%;height:40px">
                    </el-input>
                </el-form-item>
                <el-form-item label="结束日期" prop="endDate">
                    <el-input
                    :rows="2"
                    :disabled="true"
                    placeholder="请输入内容"
                    v-model="form.endDate"
                    style="width: 70%;height:40px">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="changeDialogVisible(1)">取 消</el-button>
                <el-button type="primary" @click="changeDialogVisible(1,'save')">确 定</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
  props: ["historyArr",'indexObj','dialogVisible'],
  data() {
    return {
      visible:false,
      otherId:null,
      bqArr:['直飞','天天航班','全年固定包板','可做整板BUP'],
      bqbox:true,
      bqxz:'',
      xzbqarr:[],
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
      activeName: "first",
      form: {
        position: "",
        showName: "",
        showAirline: "",
        showFile:'',
        showUrl:'',
        showRemark:'',
        startDate:'',
        endDate:'',
      },
      styleArr1: [
        { value: 0, label: "E" },
        { value: 1, label: "D" },
        { value: 2, label: "C" },
        { value: 3, label: "B" },
        { value: 4, label: "A" },
        { value: 5, label: "/" },
      ],
      styleArr2: [
        { value: 0, label: "可下单，订单冻结需审批" },
        { value: 1, label: "可下单，不做限制" },
        { value: 2, label: "不可下单，" },
      ],
      styleArr3: [
        { value: 0, label: "/" },
        { value: 1, label: "付款买单" },
        { value: 2, label: "不做限制" },
      ],
      styleArr4: [
        { value: 0, label: "1" },
        { value: 1, label: "2" },
        { value: 2, label: "3" },
        { value: 3, label: "4" },
        { value: 4, label: "5" },
        { value: 5, label: "6" },
      ],
      rules: {
          position: [
            { required: true, message: '请输入位置', trigger: 'blur' },
          ],
          bannerName: [
            { required: true, message: '请输入banner名称', trigger: 'blur' }
          ],
          bannerLine: [
            { required: true, message: '请输入banner航线', trigger: 'blur' }
          ],
          uploadImage: [
            { required: true, message: '请选择上传图片', trigger: 'blur' }
          ],
          feature: [
            { required: true, message: '请输入航线特色', trigger: 'blur' }
          ],
          startDate: [
            { required: true, message: '请输入开始日期', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '请输入结束日期', trigger: 'blur' }
          ]
        }
    };
  },
  computed: {
    isEdit2() {
      return this.$store.state.dogShowZ; //需要监听的数据
    },
    isEdit() {
      return this.$store.state.userManageType; //需要监听的数据
    },
  },
  watch: {
    isEdit(newVal, oldVal) {
      this.diaogType = newVal;
      this.showBody(newVal)
    },
    isEdit2(newVal, oldVal) {
      this.dogShow = newVal;
    },
    // indexObj:{
    //   handler(newObj,oldObj){
    //     this.changeObj(newObj,oldObj)
    //   },
    //   // immediate: true,
    //   deep:true
    // }
  },
  methods: {
    showBody(newVal){
      if(newVal == 1){
        this.form = this.indexObj
      }
    },
    //关闭时间选择弹窗
    handleClose(type) {
      if(type == 1) {
        this.$store.commit("changeDogShow", 0); //mutations
      }else if(type == 2) {
        // this.$store.commit("changeDogShow", 0); //mutations
      }
    },
    //开启时间选择弹窗
    changeDialogS(type) {
      if (type == 1) {
        this.$store.commit("changeDogShow", 1); //mutations
      }
    },
    calendarChang(newda, oldda) {
      var newData = new Date();
      var valueTime =
        newData.getFullYear() +
        "-" +
        (newData.getMonth() + 1) +
        "-" +
        newData.getDate();
      var aa = new Date(newda);
      var cc =
        aa.getFullYear() + "-" + (aa.getMonth() + 1) + "-" + aa.getDate();
      var bb = new Date(oldda);
      var dd =
        bb.getFullYear() + "-" + (bb.getMonth() + 1) + "-" + bb.getDate();
      console.log(valueTime, cc, dd);
      if (aa < newData) {
        setTimeout(() => {
          this.valueTime = valueTime;
        });
      } else {
        // setTimeout(()=>{
        //   this.valueTime = cc
        // })
      }
    },
    /*4.用正则表达式实现html解码*/
				htmlDecodeByRegExp:function (str){  
						var s = "";
						if(str.length == 0) return "";
						s = str.replace(/&amp;/g,"&");
						s = s.replace(/&lt;/g,"<");
						s = s.replace(/&gt;/g,">");
						s = s.replace(/&nbsp;/g," ");
						s = s.replace(/&#39;/g,"\'");
						s = s.replace(/&quot;/g,"\"");
						return s;  
				},
    // 富文本渲染
    dialogOpen(){
      // console.log("富文本渲染"+this.form.showRemark);
      if(this.form.showRemark){
        var data = this.htmlDecodeByRegExp(this.form.showRemark)
						setTimeout(() => {
							var set = document.getElementById('htmlHistory')
							set.innerHTML = data
						}, 0);
					}else{
            setTimeout(() => {
							var set = document.getElementById('htmlHistory')
							set.innerHTML = ''
						}, 0);
          }
    },
    
    // 保存更改
    changeDialogVisible(type, save) {
      this.$store.commit("changeUserManageType", 0);
      if(save=='save'){
        var num = 0
        if(this.form.position == ''){
          num = 1
        }
        if(this.form.showName == ''){
          num = 1
        }
        if(this.form.showAirline == ''){
          num = 1
        }
        if(this.form.showFile == ''){
          num = 1
        }
        if(this.form.showRemark == ''){
          num = 1
        }
        if(this.form.startDate == ''){
          num = 1
        }
        if(this.form.endDate == ''){
          num = 1
        }
        if(num == 1){
          return this.$message.error('请完整输入内容')
        }
      }
      if(save == 'histroy'){
        // this.$store.commit('changeUserManageType',0) //mutations
        this.$emit("clearHistroy", 'histroy')
      }
    },
    initEditor2(){
      if(this.initEditorzz){
        this.editor.setHtml(this.jpObj.showRemark)
      }else{
        this.initEditor()
      }
    },
    async initEditor() {
      await this.$nextTick()
      console.log('// 创建工具栏');
      const editorConfig = {};
      editorConfig.customPaste = (editor, event) => {
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
      var editor = createEditor({
        selector: "#editor-container",
        config: editorConfig,
        mode: "default", // 或 'simple' 参考下文
      });
      this.editor = editor
      // 创建工具栏
      var toolbar = createToolbar({
        editor,
        selector: "#toolbar-container",
        config: toolbarConfig,
        mode: "default", // 或 'simple' 参考下文
      });
      this.initEditorzz = true
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogVisibles = true;
    },
    colseDia(num,type){
      if((num == 8) && type){
        console.log(this.jpObj,'对象');
        // this.$emit('colseDias',obj)
      }else if((num == 8) && !type){
        this.$emit('colseDias','')
      }
    },
    // 图片上传
    async beforeAvatarUpload(file) {
      // console.log(file);
      console.log(file.type);
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/pdf" ||
        file.type === "image/jpg" ||
        file.type === "application/pdf" ||
        file.type === "image/bmp"
          ? true
          : false;
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传图片/文件只能是 JPG、JPG、PDF、PNG格式!");
        return;
      }
      if (!isLt10M) {
        this.$message.error("上传图片/文件大小不能超过 10MB!");
        return;
      }
      const fileFormData = new FormData();
      fileFormData.append("image", file);
      this.loading = true;
      try {
        const data = await this.$http.post(
          this.$service.uploadImage,
          fileFormData
          // {
          //     params: {
          //     attachType: 1,
          //     orderId: this.orderId,
          //     },
          // }
        );
        if (data) {
          // this.images.push(data);
          // console.log(data);
          if (this.dialogVisible == 1) {
            this.from1.fileUrl = data;
            // console.log(this.from1);
          }
          if (this.dialogVisible == 5) {
            this.from5.fileUrl = data;
            // console.log(this.from5);
          }
          if (this.dialogVisible == 8) {
            this.jpObj.showFile = data;
            // console.log(this.from5);
          }
          this.$message.success("上传成功");
        } else {
          this.$message.error(message);
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>
<style  lang="less" scoped>
.boxboby {
  display: flex;
  flex-direction: column;
  width: 100%;
  .lineL {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 0;
    height: 26px;
  }
}
.redTip {
  display: inline-block;
  width: 16px;
  font-size: 16px;
  color: red;
}
.tittleTip {
  font-weight: 500;
}
.comButton {
  cursor: pointer;
  border: 1px solid black;
  border-radius: 2px;
  width: 40px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: rgb(0, 128, 255);
}
el-select {
}
input {
  width: 100px;
  height: 20px;
  border: 1px solid rgb(155, 155, 155);
  text-align: center;
  margin-right: 16px;
}
.is-selected {
  color: #f3f6f9;
  background: #1989fa;
}
.is-selecteds {
  cursor: not-allowed;
}
/deep/ .current {
  height: 50px;
}
/deep/ .el-calendar-day {
  height: 50px;
  padding: 0;
}
/deep/ .el-dialog {
  min-width: 480px;
  border-radius: 6px;
}
.mcspan {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
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
  #htmlHistory{
    margin-left: 78px;
    width: 80%;
    min-height:40px;
    height: auto;
    border: 1px solid #e5e5e5!important;
  }
  #box-body-content h1,#htmlHistory h1{
					font-size: 2em;
					font-weight: bold;
			}
			#box-body-content h2,#htmlHistory h2{
					font-size: 1.5em;
					font-weight: bold;
					line-height: 40px;
			}
			#box-body-content h3,#htmlHistory h3{
					font-size: 1.17em;
					font-weight: bold;
			}
			#box-body-content h4,#htmlHistory h4{
					font-size: 1em;
					font-weight: bold;
			}
			#box-body-content h5,#htmlHistory h5{
					font-size: 0.83em;
					font-weight: bold;
			}
			#box-body-content span,#htmlHistory span{
					font-size: 1em;
					line-height: 1.5;
					line-height: 40px;
			}
			#box-body-content p,#htmlHistory p{
					font-size: 1em;
					line-height: 1.5;
					line-height: 20px;
			}
			#box-body-content em,#htmlHistory em{
					font-size: 1em;
					line-height: 1.5;
					line-height: 20px;
					font-style:oblique
			}
			#box-body-content strong,#htmlHistory strong{
					font-size: 1em;
					line-height: 1.5;
					line-height: 20px;
					font-weight: bold;
			}
			#box-body-content u,#htmlHistory u{
					font-size: 1em;
					line-height: 1.5;
					line-height: 20px;
					text-decoration: underline
			}
			#box-body-content s,#htmlHistory s{
					font-size: 1em;
					line-height: 1.5;
					line-height: 20px;
					text-decoration: line-through
			}
			#box-body-content a,#htmlHistory a{
					font-size: 1em;
					line-height: 1.5;
					line-height: 20px;
					color: #0000EE;
			}
</style>