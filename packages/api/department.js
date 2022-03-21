export default {
  list: {
    url: '/ouser-web/department/list.do',
    method: 'post',
    params: {
      entityType: ''
    }
  },
  listUserDepartment: {
    url: '/ouser-web/department/listUserDepartment',
    method: 'post',
    params: {
    }
  },
  listByParentCode: {
    url: '/ouser-web/department/listByParentCode',
    method: 'post',
    params: {
      // parentCode: null
    }
  },
  listChildrenCodeAndEmployee: {
    url: '/ouser-web/department/listChildrenCodeAndEmployee',
    method: 'post',
    params: {
      // parentCode: null
    }
  },
  search: {
    url: '/ouser-web/department/search',
    method: 'post',
    params: {
      // name: null
    }
  },
  searchChildrenCodeAndEmployee: {
    url: '/ouser-web/department/searchChildrenCodeAndEmployee',
    method: 'post',
    params: {
      // name: null
    }
  }

}
