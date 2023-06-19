<template>
  <div class="chat-input" v-if="!$parent.chatRevoke">
    <!-- 表情 -->
    <div
      style="
              width: 282px;
              position: absolute;
              bottom: 190px;
              z-index: 999;
              border: 1px solid silver;
              background-color: #fff;
              border-radius: 3px;
              box-shadow: 0 2px 10px #0000001f;
            "
      v-if="emojiList"
    >
      <ul>
        <li
          class="emojiItem"
          @click="chooseEmoji(item)"
          v-for="(item, index) in emojiArray"
          :key="index"
          style="
                  display: inline-block;
                  cursor: pointer;
                  width: 30px;
                  height: 30px;
                  font-size: 20px;
                  padding: 5px;
                  line-height: 30px;
                  border-radius: 5px;
                "
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 快捷语句 -->
    <div
      style="
              width: 282px;
              position: absolute;
              bottom: 190px;
              z-index: 999;
              border: 1px solid silver;
              background-color: #fff;
              border-radius: 3px;
              box-shadow: 0 2px 10px #0000001f;
              max-height:300px;
              overflow-y:auto;
            "
      v-if="quickWordList"
    >
      <ul>
        <li
          @click="sendQuickMessage(item.quickMes)"
          class="quickWordItem"
          v-for="(item, index) in quickAllLanguage"
          :key="index"
          :title="item.quickMes"
          style="
                  cursor: pointer;
                  font-size: 17px;
                  padding: 5px;
                  border-radius: 5px;
                "
        >
          <div class="quickWord">
            {{ item.quickMes }}
          </div>
        </li>
      </ul>
    </div>
    <div style="padding-top: 10px">
      <img
        id="emojiDoor"
        @click="
          emojiList = !emojiList;
          quickWordList = false;
        "
        src="@/assets/inquiry/chatEmoLogo.png"
        title="表情"
        alt=""
        style="
                margin-left: 10px;
                width: 25px;
                height: 25px;
                cursor: pointer;
              "
      />
      <img
        src="@/assets/inquiry/chatPictLogo.png"
        @click="loadFile"
        alt=""
        title="发送图片"
        style="
                margin-left: 10px;
                width: 25px;
                height: 25px;
                cursor: pointer;
              "
      />
      <img
        src="@/assets/inquiry/fileLogo.png"
        v-if="!getFile"
        @click="sendFile"
        title="发送文件"
        style="
                margin-left: 10px;
                width: 25px;
                height: 25px;
                cursor: pointer;
              "
        alt=""
      />
      <img
        id="quickWordDoor"
        src="@/assets/inquiry/quickWordDoor.svg"
        alt=""
        title="快捷回复"
        @click="
          quickAllLanguage.length > 0 ? (quickWordList = !quickWordList) : '';
          emojiList = false;
        "
        :style="{
          cursor: quickAllLanguage.length > 0 ? 'pointer' : 'not-Allowed'
        }"
        style="
                margin-left: 10px;
                width: 25px;
                height: 25px;
              "
      />
      <!-- <el-button
        :disabled="wsDisable"
        size="mini"
        type="primary"
        style="float:right;margin-right:15px;background:#5c96ff"
        @click="transferOrder"
        >转单</el-button
      > -->
    </div>
    <div class="inputBox">
      <div
        style="
                width: 100%;
                margin-top: 10px;
                font-size: 18px;
                word-break: break-all;
                height: 100px;
                overflow-y: auto;
              "
        id="editor"
        ref="editor"
        contenteditable="true"
        @paste.prevent="handlePasteContent($event)"
        @keyup="handleKeyUp($event)"
        @keydown="handleKeyDown($event)"
        @blur="blurEditor"
      ></div>
      <div
        style="
                position: absolute;
                left: 10px;
                top: 8px;
                font-size: 14px;
                color: silver;
              "
        v-if="showPlacehoder"
      >
        请输入内容(按enter发送消息,ctrl+enter换行)
      </div>
      <div style="text-align: right">
        <el-button
          type="primary"
          size="mini"
          class="sendButton"
          @click="sendMessage"
          :disabled="wsDisable"
          >发送</el-button
        >
      </div>
    </div>
    <!-- 转单 -->
    <el-dialog :visible.sync="showInviteDial">
      <div style="padding:8px 0">
        <div style="margin-bottom:5px">
          <el-input
            maxlength="10"
            class="inviteChoose"
            suffix-icon="el-icon-search"
            v-model.trim="dialInput"
          ></el-input>
        </div>
        <div style="max-height:300px;overflow-y:auto">
          <div
            v-for="(item, index) in airlinPerpleComputed"
            style="display:flex;align-items:center;margin:4px 0;"
            :key="index"
          >
            <span
              @click="chooseAirLine(item)"
              :style="{
                border: item.disabled
                  ? '1px solid gray'
                  : item.checked
                  ? '1px solid #49f154'
                  : '1px solid rgb(2, 167, 240)'
              }"
              style="text-align:center;display:inline-block;width:20px;height:20px;border-radius:50%"
            >
              <i
                class="el-icon-check"
                :style="{
                  color:
                    item.checked && !item.disabled
                      ? '#49f154'
                      : item.disabled
                      ? 'gray'
                      : ''
                }"
                style="fontSize:18px;margin-right:10px"
                v-if="item.checked"
              ></i>
            </span>
            <img
              src="@/assets/inquiry/headLogo.svg"
              style="width:22px;height:22px;margin-left:10px;margin-right:5px"
              alt=""
            />
            {{ item.nameWithArea
            }}{{
              item.isLeaveStatus == 2 && item.id != serviceId ? "(休假中)" : ""
            }}
          </div>
        </div>
        <div style="text-align:right;margin-top:8px">
          <el-button size="mini" @click="showInviteDial = false"
            >取消</el-button
          >
          <el-button @click="confirmInvite" size="mini" type="primary"
            >转单({{
              airManger.filter(item => item.checked && !item.disabled).length
            }})</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    quickAllLanguage: {
      type: Array,
      default: () => {}
    }
  },
  created() {},
  data() {
    return {
      // 转单弹窗
      airManger: [], // 航线人员数据
      showInviteDial: false, //  弹框显示
      //
      getFile: false, // 是否上传文件
      quickWordList: false, // 快捷语句显示
      emojiList: false, // 表情显示
      emojiArray: [
        "😀",
        "😄",
        "😅",
        "🤣",
        "😂",
        "😉",
        "😊",
        "😍",
        "😘",
        "😜",
        "😝",
        "😏",
        "😒",
        "🙄",
        "😔",
        "😴",
        "😷",
        "🤮",
        "🥵",
        "😎",
        "😮",
        "😰",
        "😭",
        "😱",
        "😩",
        "😡",
        "💀",
        "👽",
        "🤓",
        "🥳",
        "😺",
        "😹",
        "😻",
        "🤚",
        "💩",
        "👍",
        "👎",
        "👏",
        "🙏",
        "💪"
      ],
      msgList: [],
      showPlacehoder:true
    };
  },
  mounted() {
    window.addEventListener("beforeunload", e => {
      sessionStorage.setItem("reflash", true);
      this.blurEditor();
    });
    document.addEventListener("click", val => {
      if (val.target.id == "emojiDoor" || val.target.id == "quickWordDoor") {
        return;
      }
      // console.log(val)
      this.quickWordList = false;
      this.emojiList = false;
    });
  },
  methods: {
    //输入框选择表情
    chooseEmoji(val) {
      document.getElementById("editor").innerHTML += val;
      this.emojiList = false;
      var range2 = window.getSelection();
      range2.selectAllChildren(document.getElementById("editor"));
      range2.collapseToEnd();
      const oEditor = this.$refs.editor;
      this.getInputResult(oEditor.childNodes);
    },
    //输入框上传图片
    async loadFile() {
      const files = await this.$utils.loadFile({
        accept: ".jpg,.jpeg,.png"
      });
      const file = files[0];
      let pictureType = [
        "png",
        "jpg",
        "jpeg",
        "bmp",
        "gif",
        "webp",
        "psd",
        "svg",
        "tiff"
      ];
      if (pictureType.every(item => file.type.indexOf(item) == -1)) {
        return this.$message.error("上传图片失败");
      }
      if (file.size / 1024 / 1024 >= 10) {
        return this.$message.error("上传图片不能超过10MB");
      }
      const uploadRes = await this.uploadImg(file);
      if (!uploadRes || !uploadRes.fileUrl) {
        this.$message.error("图片上传失败,请重新上传");
        return;
      }
      // console.log(uploadRes);
      var range2 = window.getSelection();
      range2.selectAllChildren(document.getElementById("editor"));
      range2.collapseToEnd();
      //前端处理 - 获取url
      this.inputInsertImg(file, uploadRes.fileUrl);
    },
    //上传图片至后端
    async uploadImg(file) {
      const formData = new FormData();
      formData.append("file", file);
      //后续调接口
      return await this.$http.post(this.$service.chatRoomUpload, formData);
    },
    //上传文件
    async sendFile() {
      this.fileName = "";
      var range = window.getSelection();
      range.selectAllChildren(document.getElementById("editor"));
      range.collapseToEnd();
      const accepts = [
        ".docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls",
        "application/vnd.ms-excel",
        ".xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "doc",
        "application/msword",
        "pdf",
        "application/pdf"
      ];
      const files = await this.$utils.loadFile({
        accept: accepts.join(",")
      });
      if (files[0].size / 1024 / 1024 >= 10) {
        return this.$message.error("上传文件不能超过10MB");
      }
      // console.log(files[0])
      let fileType = {
        xls: "application/vnd.ms-excel",
        xlsx:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        docx:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        doc: "application/msword",
        pdf: "application/pdf"
      };

      let srcx = "";
      if (files[0].type == fileType.xls || files[0].type == fileType.xlsx) {
        srcx = require("@/assets/inquiry/excelIcon.svg");
      } else if (
        files[0].type == fileType.docx ||
        files[0].type == fileType.doc
      ) {
        srcx = require("@/assets/inquiry/wordIcon.svg");
      } else if (files[0].type == fileType.pdf) {
        srcx = require("@/assets/inquiry/pdfIcon.svg");
      } else {
        return this.$message.error("请上传规定类型文件");
      }
      const fileFormData = new FormData();
      fileFormData.append("file", files[0]);
      try {
        const data = await this.$http.post(
          this.$service.chatRoomUpload,
          fileFormData
        );
        if (data.code) {
          return this.$message.error(data.message);
        }
        if (data) {
          this.fileName = data.fileName;
          this.fileUrl = data.fileUrl;
          this.fileSize = data.fileSize;
          this.$message.success("上传成功");
          let doc = document.createElement("iframe");
          doc.style.display = "inline-block";
          doc.style.border = "1px solid #fff";
          doc.style.width = "110px";
          //   doc.style['max-width'] = '150px'
          doc.style.height = "90px";
          doc.srcdoc = `  <!DOCTYPE html>
                                                <html lang="en" style="height:100%">
                                                <head>
                                                    <title></title>
                                                    <meta charset="UTF-8">
                                                    <style>
                                                    </style>
                                                </head>
                                                <body style="margin:0">
                                                <div id="ifRameImg" style="text-align:center">
                                                  <img style="width:70px;height:70px;" src="${srcx}"/>
                                                </div>
                                                <div style="text-align:center;overflow:hidden;font-size:12px;white-space:nowrap;text-overflow:ellipsis">${files[0].name}</div>
                                                </body>
                                                </html>`;
          this.cursorInsert(doc);
          const oEditor = this.$refs.editor;
          this.getInputResult(oEditor.childNodes);
          var range2 = window.getSelection();
          range2.selectAllChildren(document.getElementById("editor"));
          range2.collapseToEnd();
        } else {
          this.$message.error(message);
        }
      } catch (error) {}
    },
    //输入框复制文字处理
    handlePasteContent(event) {
      //判断复制的是否是文字
      const pasteData = this.handlePasteWord(event.clipboardData);
      if (pasteData) return;
      //黏贴图片
      this.handlePasteImage(event.clipboardData);
    },

    handleKeyUp(event) {
      this.showPlacehoder = false;
      // console.log(event.target.childNodes,123)
      const resultWord = event.target.childNodes;
      this.getInputResult(resultWord);
      if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault();
      } else if (event.keyCode === 13) {
        if (!this.wsDisable) {
          this.sendMessage();
        }
      } else if (event.keyCode === 32) {
        event.preventDefault();
      }
    },

    handleKeyDown(event) {
      if (event.ctrlKey && event.keyCode === 13) {
        // 禁止换行默认行为
        //替换成空格 需加不打印字符
        document.execCommand("insertHTML", false, "<br>&zwnj;");
        event.preventDefault();
      } else if (event.keyCode === 13) {
        event.preventDefault();
      } else if (event.keyCode === 32) {
        document.execCommand("insertHTML", false, "&nbsp;");
        event.preventDefault();
      }
    },

    // 去格式粘贴 文本
    handlePasteWord(clipboardData) {
      const text = clipboardData.getData("text/plain");

      setTimeout(() => {
        const resultWord = document.getElementById("editor").childNodes;
        this.getInputResult(resultWord);
      });

      if (text) {
        const textNode = document.createTextNode(text);
        this.cursorInsert(textNode);
        return true;
      }
      return false;
    },
    async inputInsertImg(img, dataSrc) {
      let blob = new Blob([img]);
      const oImage = await this.getImageObject(blob, dataSrc);
      this.cursorInsert(oImage);
      // 光标处插入 image 后,获取整体输入内容
      const oEditor = this.$refs.editor;
      this.getInputResult(oEditor.childNodes);
    },
    // 粘贴图片
    async handlePasteImage(clipboardData) {
      // console.log(clipboardData.files);
      const img = this.getPasteImage(clipboardData.files);
      // console.log(img);
      //后端处理 调接口返回src
      if (!img) return;
      // console.log(img)
      const uploadRes = await this.uploadImg(img);
      if (!uploadRes) {
        this.$message.error("图片上传失败,请重新上传");
        return;
      }
      // console.log(uploadRes);

      //前端处理 - 获取url
      this.inputInsertImg(img, uploadRes.fileUrl);
    },
    blurEditor() {
      this.$chat.addChatDraft({
        chatId: this.activeIndex,
        nodes: this.$refs.editor.childNodes,
        msgs: this.msgList,
        files: [
          {
            fileUrl: this.fileUrl,
            fileName: this.fileName,
            fileSize: this.fileSize,
            getFile: this.getFile
          }
        ]
      });
    },
    // 获取一个 image object
    getImageObject(uploadRes, dataSrc) {
      console.log(uploadRes);
      //设置图片宽高
      const oImage = new Image(50, 50);
      //本地获取图片src
      oImage.src = URL.createObjectURL(uploadRes);
      oImage.style.cursor = "pointer";
      oImage.style["vertical-align"] = "baseline";
      oImage.title = "点击查看大图";
      oImage.dataset.src = dataSrc;
      //图片点击事件
      oImage.onclick = () => {
        this.$utils.previewImage({ url: oImage.src });
      };
      // console.log(uploadRes);
      return oImage;
    },
    //图片处理
    getPasteImage(clipboardDataFiles) {
      if (!clipboardDataFiles.length) {
        // console.log("没有要粘贴的文件");
        return null;
      }
      // 防止复制多张图片
      const clipboardDataFileList = Array.from(clipboardDataFiles || []);
      let imgResult = "";
      clipboardDataFileList.forEach(file => {
        if (!file.type.match(/image\//i)) {
          return;
        }
        imgResult = file;
      });
      return imgResult;
    },

    //获取输入框输入结果
    getInputResult(editorChildNodes) {
      // console.log(editorChildNodes);
      let totalNum = 0;
      const oldMsgList = JSON.parse(JSON.stringify(this.msgList));
      this.msgList = []; // 重置
      this.getFile = false;
       if(document.getElementById('editor').innerHTML.includes('<br><br>')){
         document.getElementById('editor').innerHTML = document.getElementById('editor').innerHTML.replace(/<br><br>/g,'')
          var range2 = window.getSelection();
          range2.selectAllChildren(document.getElementById("editor"));
          range2.collapseToEnd();
        }
      if (editorChildNodes.length == "0") {
        document.getElementById('editor').innerHTML = ''
        this.showPlacehoder = true;
        return;
      } else {
        this.showPlacehoder = false;
      }

      for (let i = 0; i < editorChildNodes.length; i++) {
        //判断元素节点 - 回车
        if (
          editorChildNodes[i].nodeType === 1 &&
          editorChildNodes[i].nodeName === "BR"
        ) {
          const ifWord = this.msgList[this.msgList.length - 1];
          if (ifWord && ifWord.type === "text") {
            ifWord.src += "\n";
          }
        } else if (
          editorChildNodes[i].nodeType === 1 &&
          editorChildNodes[i].nodeName == "IFRAME"
        ) {
          this.getFile = true;
          totalNum += 1;
        } else if (
          //文本节点 -正常输入内容
          editorChildNodes[i].nodeType === 3 &&
          editorChildNodes[i].nodeValue
        ) {
          const ifWord = this.msgList[this.msgList.length - 1];
          if (ifWord && ifWord.type === "text") {
            ifWord.src += editorChildNodes[i].nodeValue;
            // console.log(editorChildNodes[i].nodeValue.length)
            if (editorChildNodes[i].nodeValue == "") {
            } else {
              totalNum += editorChildNodes[i].nodeValue.length;
            }
          } else {
            totalNum += editorChildNodes[i].nodeValue.length;
            this.msgList.push({
              type: "text",
              src: editorChildNodes[i].nodeValue
            });
          }
        } else if (
          //图片判断
          editorChildNodes[i].nodeType === 1 &&
          editorChildNodes[i].nodeName === "IMG"
        ) {
          totalNum += 1;
          this.msgList.push({
            type: "image",
            src: editorChildNodes[i].dataset.src
          });
        }
      }
      //  console.log(this.msgList);
      if (totalNum > 500) {
        let num = totalNum - 500;
        let all = this.$refs.editor.innerHTML.length;
        this.$refs.editor.innerHTML = this.$refs.editor.innerHTML.substring(
          0,
          all - num
        );
        //  console.log(document.getElementById('editor'))
        //设置光标在文本末尾
        var range = window.getSelection();
        range.selectAllChildren(document.getElementById("editor"));
        range.collapseToEnd();
      }
      // console.log(this.msgList,totalNum)
      if (!this.msgList.length && !oldMsgList.length) {
        return;
      }
      // this.$emit("change", [...this.msgList]);
    },

    // 光标处插入节点
    cursorInsert(node) {
      const selObj = window.getSelection();
      const range = selObj.getRangeAt(0); //获取当前光标位置
      // 光标处插入节点
      range.insertNode(node);
      // range.appendChild('&zwnj')
      // 取消insert node 后的选中状态，将光标恢复到 insert node 后面
      this.$nextTick(() => {
        range.collapse(false);
      });
    },

    // 清除 输入框
    clean() {
      this.$refs.editor.innerHTML = "";
      this.showPlacehoder = true;
      this.msgList = [];
    },

    //输入框消息发送
    sendMessage() {
      if (this.msgList.length == 0 && !this.getFile) {
        return this.$message.warning("请输入内容后发送");
      }
      if (
        document
          .getElementById("editor")
          .innerHTML.replace(/[\n]/g, "")
          .replace(/&nbsp;/g, "")
          .replace(/\s+/g, "")
          .replace(/<br>/g, "")
          .replace(/[\u200C]/g, "").length == 0
      ) {
        return this.$message.warning("不能发送空白信息");
      }
      if (this.$parent.ifVocation) {
        this.$confirm(
          "您当前不处于坐席接待,您无法接收客户的任何消息,请勿造成客户困扰",
          "",
          {
            confirmButtonText: "仍要发送",
            cancelButtonText: "取消",
            center: true
          }
        )
          .then(() => {
            this.sendMessageCommon();
          })
          .catch(() => {});
      } else {
        this.sendMessageCommon();
      }
    },
    //发送消息公共部分
    sendMessageCommon(data) {
      let request = {
        content: data?[data]:this.msgList,
        cwoId: this.activeIndex
      };
      if (this.getFile) {
        this.sendFileMessage();
      }
      if (this.msgList.length == 0 && !data) {
        return;
      }
      this.$http.post(this.$service.sendCwoMes, request).then(async res => {
        if (res.code == 200) {
          this.clean();
          try {
            await this.$chat.delChatDraftById(this.activeIndex);
          } catch (error) {
            console.error(error);
          }
          this.$parent.getNewData();
        }
      });
    },
    //输入框文件发送
    sendFileMessage() {
      let request = {
        content: [],
        cwoId: this.activeIndex,
        fileUrl: this.fileUrl,
        fileName: this.fileName,
        fileSize: this.fileSize
      };
      this.$http.post(this.$service.sendCwoMes, request).then(async res => {
        if (res.code == 200) {
          this.getFile = false;
          this.clean();
          try {
            await this.$chat.delChatDraftById(this.activeIndex);
          } catch (error) {
            console.error(error);
          }
          this.$parent.getNewData();
        }
      });
    },
    //打开转单弹框
    async transferOrder() {
      let res = await this.$http.post(
        this.$service.selectUserListByRoleName + "?roleName=航线负责人"
      );
      if (res.code != 200) {
        return;
      }

      this.airManger = res.data;
      this.airManger.forEach(item => (item.checked = false));
      this.showInviteDial = true;
      this.dialInput = "";
      // console.log(this.airManger,this.serviceId)
      this.airManger.forEach(
        item => (item.checked = false && (item.disabled = false))
      );
      this.airManger.forEach(item => {
        if (item.id == this.serviceId) {
          item.disabled = true;
          item.checked = true;
        }
        // if (item.isLeaveStatus == 2) {
        //   item.disabled = true;
        // }
      });
    },
    //转单确认
    confirmInvite() {
      let res = this.airManger.filter(item => item.checked && !item.disabled);
      if (res.length == "0") {
        return this.$message.warning(`至少选择一人进行转单`);
      }
      let request = {};
      request.transferId = res[0].id;
      request.cwoId = this.activeIndex;
      this.$http
        .post(this.$service.transferInquiry, request)
        .then(async res => {
          if (res.code == 200) {
            this.$message.success("转单成功");
            this.showInviteDial = false;
            let idx = this.leftOrderMes.findIndex(
              item => item.id == this.activeIndex
            );
            this.spliceOrderMes(idx, 1);
            try {
              this.clean();
              await this.$chat.delChatDraftById(this.activeIndex);
            } catch (error) {
              console.error(error);
            }
            if (this.leftOrderMes.length == 0) {
              this.singleSearch = false;
              this.getChatRoomLeftData(true);
              return;
            }

            this.setChatRoomTitleBox(this.leftOrderMes[0]);
            this.changeChatRoom(this.leftOrderMes[0]);
          }
        });
    },
    //选择转单人员
    chooseAirLine(val) {
      if (val.disabled) {
        return;
      }
      if (
        !val.checked &&
        this.airManger.filter(item => item.checked && !item.disabled).length ==
          1
      ) {
        return this.$message.warning("转单最多1人");
      }
      this.airManger.forEach((item, index) => {
        if (item.nameWithArea == val.nameWithArea) {
          item.checked = !item.checked;
          this.$forceUpdate();
        }
      });
    },
    //选择转单人员 输入限制
    setInputLimit(val) {
      this.dialInput = val.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
    },

    //聊天室发送快捷信息
    sendQuickMessage(val) {
      document.getElementById("editor").innerHTML += val;
      var range2 = window.getSelection();
      range2.selectAllChildren(document.getElementById("editor"));
      range2.collapseToEnd();
      const oEditor = this.$refs.editor;
      this.getInputResult(oEditor.childNodes);
    }
  },
  computed: {
    ...mapState({
      wsDisable: state => state.chatRoom.wsDisable,
      activeIndex: state => state.chatRoom.activeIndex
    }),
    airlinPerpleComputed() {
      let res = this.airManger.filter(item =>
        item.nameWithArea.includes(this.dialInput)
      );
      return res;
    }
  }
};
</script>
<style scoped lang="less">
.emojiItem {
  &:hover {
    background-color: #f3f3f3;
  }
}
.quickWordItem {
  .quickWord {
    white-space: nowrap;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:hover {
    background-color: #f3f3f3;
  }
}
.chat-input {
  height: 21vh;
  border: 1px solid #dcdfe6;
  border-top: 0;
  // border-radius: 5px;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
  .inputBox {
    width: 100%;
    position: relative;
    div:nth-of-type(1) {
      padding: 4px;
      width: 470px;
      min-height: 100px;
      outline: none;
      //   padding-top: 35px;
    }
  }
  .sendButton {
    width: 80px;
    height: 35px;
    margin-right: 15px;
    background-color: #5c96ff !important;
    border: #5c96ff !important;
  }
}
</style>
