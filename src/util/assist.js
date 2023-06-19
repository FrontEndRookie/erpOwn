//GET时 需要转化数据格式
export function toData(data) {
  var json = ''
  for(var key in data){
  	json +=key+'='+data[key]+'&'
  }
  json = json.substring(0, json.length -1)
  return json
}
