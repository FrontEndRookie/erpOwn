import axios from './http'
// 上传文件
export function postImage(url, data) {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      axios.post(url, data, config).then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      );
    });
  }
  // 将blob流改成excle文档 
  /*
  ****** res 二进制流
  ****** type blob的类型

  "application/vnd.ms-excel"
  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  "application/pdf"
  ****** name 下载文件的名字
  */
export function exportFile(res,type,name) {
  const a = document.createElement("a");
  let blob = new Blob([res], {
    type: type
  })
  a.href = URL.createObjectURL(blob)
  a.setAttribute('download', name + '.xls')
  a.click()
}
// 常用的几个国家的货币及符号
export const moneyList = [{
    value: '1',
    label: 'CNY',
    symbol:'￥'
  }, {
    value: '2',
    label: 'HKD',
    symbol:"HK$"
  }, {
    value: '3',
    label: 'USD',
    symbol:'$'
  }, {
    value: '4',
    label: 'EUR',
    symbol:'€'
  }, {
    value: '5',
    label: 'GBP',
    symbol:'￡',
  }]
// 常用的结算方式 
export const payWayArray = [
  {
      value:'',
      label:"全部"
  },{
      value:'0',
      label:"付款买单"
  },{
      value:"1",
      label:'月结'
  }
]
// 限制进仓编号
export function judgeWaybillNo(str){
    if(str.indexOf('-') == -1){
      return str.length <= 20
    }else {
      let testStr = str.replace('-','')
      return testStr.length <= 20
    }
}

//大屏显示
export function debounce (delay, callback) {
  let lastTime

  return function () {
    clearTimeout(lastTime)

    const [that, args] = [this, arguments]

    lastTime = setTimeout(() => {
      callback.apply(that, args)
    }, delay)
  }
}

export function observerDomResize (dom, callback) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  const observer = new MutationObserver(callback)

  observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true })

  return observer
}
