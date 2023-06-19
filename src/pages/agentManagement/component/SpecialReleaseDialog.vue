<template>
  <el-dialog
    class="special-release-dialog"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    width="1000px"
    z-index="1000"
    @closed="$emit('closeEv')"
  >
    <template #title>
      <span class="el-dialog__title">特价发布</span>
      <span style="color: #f59a23">特价信息有效展示期3天</span>
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="computedRules"
      label-width="80px"
      style="padding-top: 20px"
    >
      <el-form-item label="特价标题" prop="discountHeader">
        <el-input
          v-model.trim="form.discountHeader"
          placeholder="请输入标题"
          type="text"
          maxlength="50"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="特价内容" prop="discountInfo" class="discount-info">
        <input type="text" v-model="form.discountInfo" style="display: none" />
        <div id="toolbar-container"></div>
        <div
          id="editor-container"
          style="
            height: 400px;
            border-top: 1px solid #e5e5e5;
            line-height: normal;
          "
        ></div>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </footer>
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
  name: "SpecialReleaseDialog",
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  async created() {
    this.visible = true;
    await this.$nextTick();
    this.initEditor();
  },
  data() {
    return {
      visible: false,
      form: {
        discountHeader: "",
        discountInfo: "",
      },
    };
  },
  computed: {
    computedFormRef() {
      return this.$refs.form;
    },
    computedRules() {
      return {
        discountHeader: [
          { required: true, message: "标题不能为空", trigger: "blur" },
        ],
        discountInfo: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
      };
    },
  },
  methods: {
    submitForm() {
      this.computedFormRef &&
        this.computedFormRef.validate(async (valid) => {
          if (valid) {
            try {
              /*3.用正则表达式实现html转码*/
              function htmlEncodeByRegExp(str) {
                var s = "";
                if (str.length == 0) return "";
                s = str.replace(/&/g, "&amp;");
                s = s.replace(/</g, "&lt;");
                s = s.replace(/>/g, "&gt;");
                s = s.replace(/\s/g, "&nbsp;");
                s = s.replace(/\'/g, "&#39;");
                s = s.replace(/\"/g, "&quot;");
                return s;
              }
              const { discountHeader, discountInfo, id } = this.form;
              if (id) {
                await this.$api.editSysSpecial({
                  id,
                  discountHeader,
                  discountInfo: htmlEncodeByRegExp(discountInfo),
                });
                this.$message.success("保存成功");
                this.$emit("afterEdit");
              } else {
                await this.$api.applySysSpecial({
                  discountHeader,
                  discountInfo: htmlEncodeByRegExp(discountInfo),
                });
                this.$message.success("发布成功");
                this.$emit("afterAdd");
              }
              this.visible = false;
            } catch (error) {}
          } else {
            return false;
          }
        });
    },
    initEditor() {
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
        this.form.discountInfo = text ? html : "";
      };
      editorConfig.onCreated = (editor) => {
        if (this.form.discountInfo) {
          editor.setHtml(this.form.discountInfo);
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