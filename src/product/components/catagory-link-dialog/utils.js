/*
 * @Author: your name
 * @Date: 2021-09-01 15:38:51
 * @LastEditTime: 2021-09-01 16:43:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-static/src/product/components/catagory-link-dialog/ulits.js
 */
export function getSearchList(treeList, searchText) {
  const newList = treeList.filter(node => {
    if (hasSearch(node.name, searchText)) {
      return true
    }
    if (node.children && node.children.length > 0) {
      node.children = getSearchList(node.children, searchText)
      return node.children.length > 0 || hasSearch(node.name, searchText)
    }
    return false
  })
  return newList
}

function hasSearch(name, searchText) {
  return name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
}
export function getCheckList(treeList) {
  const list = treeList.map((x) => {
    if (x.children && x.children.length > 0) {
      return [x.id, ...getCheckList(x.children)]
    }
    return x.id
  }).flat()
  return list
}
