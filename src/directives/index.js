import DcStore from "@/store";
export default {
  auth: {
    bind(el, binding) {
      const authCodes = binding.value;
      if (!authCodes) {
        return;
      }
      const mode = binding.arg;
      const noAuthCodes =
        JSON.parse(sessionStorage.getItem("noAuthCodes")) || [];
      if (authCodes.every(code => noAuthCodes.includes(code))) {
        switch (mode) {
          case "hidden":
            el.style.visibility = "hidden";
            break;
          case "disabled":
            el.style.pointerEvents = "none";
            el.style.color = "";
            break;
          case "none":
            el.style.display = "none";
            break;
          default:
            el.style.visibility = "hidden";
            break;
        }
      }
    }
  },
  "auth-field": {
    bind(el, binding) {
      const authFieldCodes = binding.value;
      if (!authFieldCodes) {
        return;
      }
      const text = binding.arg;
      const {
        validEditAuthFieldCodes,
        validViewAuthFieldCodes,
        allAuthFields
      } = DcStore.getters;
      const edit = authFieldCodes.every(code =>
        validEditAuthFieldCodes.includes(code)
      );
      const view = authFieldCodes.every(code =>
        validViewAuthFieldCodes.includes(code)
      );
      const isAuthFieldCode = authFieldCodes.every(code =>
        allAuthFields.includes(code)
      );
      if (!isAuthFieldCode) {
        return;
      }
      if (edit) {
        return;
      }
      if (view && text === "html-readonly") {
        // 只读并且需要显示原本html的配置
        return;
      }
      if (view) {
        el.innerHTML = text;
        return;
      }
      el.classList.add("auth-field-none");
      el.innerHTML = "***";
    }
  },
  "auth-field-list": {
    componentUpdated(el, binding) {
      const authFieldCodes = binding.value;
      if (!authFieldCodes) {
        return;
      }
      const text = binding.arg;
      const {
        validEditAuthFieldCodes,
        validViewAuthFieldCodes,
        validListAuthFieldCodes
      } = DcStore.getters;
      const edit = authFieldCodes.every(code =>
        validEditAuthFieldCodes.includes(code)
      );
      const view = authFieldCodes.every(code =>
        validViewAuthFieldCodes.includes(code)
      );
      const list = authFieldCodes.every(code =>
        validListAuthFieldCodes.includes(code)
      );
      if (edit) {
        return;
      }
      if (view && list) {
        el.innerHTML = text;
        return;
      }
      if (!view && list) {
        el.innerHTML = "***";
        return;
      }
      el.classList.add("auth-field-none");
      el.innerHTML = "";
    }
  },
  "input-limit": {
    bind(el, binding) {
      // console.log(binding, el, "bind");
      if (binding.value) {
        let limitLength = binding.value.floatLimit;
        let limitMinus = binding.value.limitMinus;
        let flag = false;
        el.addEventListener("compositionstart", () => {
          flag = true;
        });
        el.addEventListener("compositionend", () => {
          flag = false;
        });
        if (limitLength) {
          //{floatLimit:[4,2],limitMinus:false} 小数限制 floatLimit前后位数，limitMinus允许输入负数
          let conditions = new RegExp(
            `^${limitMinus ? "-?" : ""}\\d{0,${limitLength[0]}}(\\.\\d{0,${
              limitLength[1]
            }})?`
          );
          el.onkeyup = val => {
            setTimeout(() => {
              if (!flag) {
                let res = val.target.value.match(conditions);
                val.target.value = res ? res[0] : ""; //限制输入
              }
            }, 0);
          };
        } else {
          let need = binding.value.type;
          let symbol = binding.value.singleSym;
          let number = binding.value.length;

          //{type:[1,2,3],length:3,singleSym:"+-"} //type 输入类型 1：数字，2：字母，3：中文 length长度限制 singleSym:允许输入的字符
          let condition = `${need.includes(1) ? "\\d" : ""}${
            need.includes(2) ? "a-zA-Z" : ""
          }${need.includes(3) ? "\\u4e00-\\u9fa5" : ""}${
            symbol ? `${symbol}` : ""
          }`;
          let reg = new RegExp(`[^${condition}]`, "g");
          el.onkeyup = val => {
            setTimeout(() => {
              if (!flag) {
                val.target.value = val.target.value
                  .replace(reg, "")
                  .substr(0, number); //限制输入
              }
            }, 0);
          };
        }
      }
    },
    inserted(el, binding, vnode) {
      el.childNodes[1].onblur = function(val) {
        vnode.context[binding.value.bindField] = val.target.value;
      };
    }
  }
};
