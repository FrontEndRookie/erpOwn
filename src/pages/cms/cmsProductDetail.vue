<template>
  <dc-page
    class="CMS-product-detail"
    :showSearchForm="false"
    :showMainTable="false"
  >
    <main class="detail-content dc-custom-shadow">
      <el-form
        ref="form"
        :model="form"
        :rules="computedRules"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model.trim="form.title"
            placeholder="请输入正文标题"
            type="text"
            maxlength="50"
            show-word-limit
            clearable
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="发布源" prop="publishSource">
          <el-input
            v-model.trim="form.publishSource"
            placeholder="请输入正文发布源"
            type="text"
            maxlength="50"
            show-word-limit
            clearable
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择">
            <el-option
              v-for="item in categoryOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="description">
          <el-input
            v-model.trim="form.description"
            placeholder="请输入关键字"
            type="text"
            maxlength="50"
            show-word-limit
            clearable
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image" style="margin-bottom: 35px;">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleAvatarSuccess"
          >
            <img v-if="form.image" :src="form.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频" style="margin-bottom: 35px;">
         <file-upload type="video" :defaultUrl="form.linkUrl" @uploadSuccess="getVideoUrl"></file-upload>
        </el-form-item>
        <el-form-item label="正文内容" prop="content" class="dc-custom-editor">
          <input type="text" v-model="form.content" style="display: none" />
          <div id="toolbar-container"></div>
          <div
            id="editor-container"
            style="height: 500px;
              border-top: 1px solid #e5e5e5;
              line-height: normal;
            "
          ></div>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model.trim="form.remarks"
            placeholder="请输入备注"
            type="textarea"
            maxlength="100"
            :autosize="{ minRows: 4 }"
            show-word-limit
            clearable
            style="width: 500px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            active-text="展示"
            inactive-text="隐藏"
            :active-value="0"
            :inactive-value="1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="置顶" prop="top">
          <el-switch
            v-model="form.top"
            active-color="#13ce66"
            active-text="置顶"
            inactive-text="不置顶"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              $utils.previewFbaProduct({
                content: form.content,
                title: form.title
              })
            "
            >预览</el-button
          >
          <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
      </el-form>
    </main>
  </dc-page>
</template>

<script>
import {
  JUSTIFY_LEFT_SVG,
  INDENT_RIGHT_SVG,
  MORE_SVG
} from "@/assets/svg/wangEditor.js";
import fileUpload from '../../components/global/fileUpload.vue';
const { createEditor, createToolbar, t } = window.wangEditor;
export default {
  components: { fileUpload },
  name: "CMSProductDetail",
  created() {
    this.init();
  },
  data() {
    return {
      form: {
        title: "",
        id: "",
        categoryId: "",
        publishSource: "",
        description: "",
        content: "",
        remarks: "",
        status: 0,
        top: '',
        image: "",
        linkUrl:''
      },
      categoryOpt: [
        { label: "集团新闻", value: 1 },
        { label: "品牌宣传", value: 2 },
        { label: "业务指导", value: 3 },
        { label: "行业资讯", value: 4 },
        { label: "现场实景", value: 5 },
        { label: "货代知识", value: 6 }
      ],
      specialLines: [],
      agentList: [],
      imageUrl: ""
    };
  },
  computed: {
    formData() {
      let {
        title,
        id,
        publishSource,
        description,
        content,
        remarks,
        status,
        top,
        image,
        categoryId,
        linkUrl
      } = this.form;
      return {
        title,
        id,
        publishSource,
        description,
        content,
        remarks,
        status,
        top,
        image,
        categoryId,
        linkUrl
      };
    },
    computedFormRef() {
      return this.$refs.form;
    },
    productId() {
      return this.$route.query.id;
    },
    computedRules() {
      return {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        publishSource: [
          {
            required: true,
            message: "请输入发布源",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入关键字",
            trigger: "blur"
          }
        ],
        image: [
          {
            required: true,
            message: "请选择图片",
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: "内容不能为空",
            trigger: "blur"
          }
        ],
        categoryId: [
          {
            required: true,
            message: "请选择分类",
            trigger: "change"
          }
        ]
      };
    }
  },
  methods: {
    getVideoUrl(url){
      this.form.linkUrl = url
    },
    async handleAvatarSuccess(file) {
      const fileFormData = new FormData();
      fileFormData.append("image", file.raw);
      const {
        data: { code, message }
      } = await this.$api.cmsUploadImg(fileFormData);
      if (code == 200) {
        this.form.image = message;
      }
    },
    async init() {
      let id = this.$route.query.id;
      if (id) {
        await this.getTargetCms(id);
      }
      await this.initEditor();
    },
    async getTargetCms(id) {
      try {
        const {
          data: { data }
        } = await this.$api.cmsGetById(id);
        this.form = {
          ...data,
          content: this.$utils.htmlDecodeByRegExp(data.content)
        };
      } catch (error) {
        console.log(error);
      }
    },
    async initEditor() {
      await this.$nextTick();
      const _this = this;
      const editorConfig = {
        MENU_CONF: {
          uploadImage: {
            async customUpload(file, insertFn) {
              const maxSize = 5;
              if (file.size > 1024 * 1024 * maxSize) {
                _this.$message.error(`文件大小不能超过${maxSize}M`);
                return;
              }
              const fileFormData = new FormData();
              fileFormData.append("image", file);
              try {
                const {
                  data: { message }
                } = await _this.$api.cmsUploadImg(fileFormData);
                insertFn(message, "", message);
              } catch (error) {}
            }
          }
        }
      };
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
      editorConfig.onChange = editor => {
        // 当编辑器选区、内容变化时，即触发
        const html = editor.getHtml();
        const text = editor.getText();
        this.form.content = text || html.includes("<img") ? html : "";
      };
      editorConfig.onCreated = editor => {
        if (this.form.content) {
          if (
            !this.form.content.includes("<") &&
            !this.form.content.includes(">")
          ) {
            editor.setHtml(`<div>${this.form.content}</div>`);
          } else {
            editor.setHtml(this.form.content);
          }
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
            menuKeys: ["through", "clearStyle"]
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
              "justifyJustify"
            ]
          },
          {
            key: "group-indent", // 以 group 开头
            title: t("editor.indent"),
            iconSvg: INDENT_RIGHT_SVG,
            menuKeys: ["indent", "delIndent"]
          },
          "|",
          "insertLink",
          "divider",
          "|",
          "redo",
          "undo",
          "|",
          "uploadImage"
          // "fullScreen",
        ]
      };

      // 创建编辑器
      const editor = createEditor({
        selector: "#editor-container",
        config: editorConfig,
        mode: "default" // 或 'simple' 参考下文
      });
      // 创建工具栏
      const toolbar = createToolbar({
        editor,
        selector: "#toolbar-container",
        config: toolbarConfig,
        mode: "default" // 或 'simple' 参考下文
      });
    },
    submitForm() {
      this.computedFormRef &&
        this.computedFormRef.validate(async valid => {
          if (valid) {
            try {
              if (this.$route.query.id) {
                await this.$api.cmsUpdate({
                  ...this.formData
                });
                this.$router.push({ name: "cmsManagement" });
                this.$message.success("保存成功");
              } else {
                await this.$api.cmsSave({
                  ...this.formData
                });
                this.$message.success("新建成功");
                this.$router.push({ name: "cmsManagement" });
              }
            } catch (error) {}
          } else {
            this.$message.warning("请填写全部必填信息");
            return false;
          }
        });
    },
    async getCMSSpecialLines() {
      try {
        const {
          data: { data }
        } = await this.$api.getCMSSpecialLines({});
        this.specialLines = data.map(item => {
          return {
            value: item.id,
            label: item.plName
          };
        });
      } catch (error) {}
    },
    async getCMSAgentList() {
      try {
        const {
          data: { data }
        } = await this.$api.getCMSAgentList("");
        this.agentList = data.map(item => {
          return {
            label: item.name,
            value: item.id
          };
        });
      } catch (error) {}
    }
  }
};
</script>
<style lang="less">
.image-preview-message-box {
  max-width: 60vw !important;
  img {
    max-width: 80%;
  }
}
</style>
<style lang="less" scoped>
.CMS-product-detail {
  padding: 20px !important;
  overflow-y: auto;
  .detail-content {
    padding: 20px;
    background: #fff;
  }
  .dc-custom-editor {
    /deep/.el-form-item__content {
      // width: 1020px;
      border: 1px solid #e5e5e5;
    }
  }
}
#editor-container {
  /deep/.w-e-text-container img {
    max-width: 40vw !important;
  }
}
.avatar {
  width: 150px;
  height: 150px;
}
</style>
