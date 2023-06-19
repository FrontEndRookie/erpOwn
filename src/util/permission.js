import {asyncRoutes} from "@/router/config"
/**
 * Use meta.role to determine if the current user has permission
 * @param noAuthCodes
 * @param route
 */
 function hasPermission(noAuthCodes, route) {
   if (!route.hidden && route.meta && !route.meta.auth) {
     console.log(`${route.meta.title}  没有authCode`)
   }
    if (route.meta && route.meta.auth) {
      // if (!noAuthCodes.includes(route.meta.auth)) {
      //   console.log(route.meta.auth)
      // }
      const auth = route.meta.auth
      if (Array.isArray(auth)) {
        return !auth.some(a => {
          console.log(noAuthCodes.includes(a))
          return noAuthCodes.includes(a)
        })
      } else {
        return !noAuthCodes.includes(auth)
      }
    } else {
      return true
    }
  }
  
  /**
   * Filter asynchronous routing tables by recursion
   * @param routes asyncRoutes
   * @param noAuthCodes
   */
  export function filterAsyncRoutes(routes, noAuthCodes) {
    const res = []
  
    routes.forEach(route => {
      const tmp = { ...route }
      if (hasPermission(noAuthCodes, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, noAuthCodes)
        }
        res.push(tmp)
      }
    })
  
    return res
  }

  function pathArr(asyncRoutes){
    const arr = []
    asyncRoutes.forEach(item=>{
      item.children.forEach(v=>{
        arr.push(item.path + "/" + v.path)
      })
    })
    return arr
  }

  export const whiteList = pathArr(asyncRoutes)