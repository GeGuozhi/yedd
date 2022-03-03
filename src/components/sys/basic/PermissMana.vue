<template>
  <div>
    <div class="permissManaTool">
      <el-input size="small" placeholder="请输入英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" placeholder="请输入中文名" v-model="role.nameZh" @keydown.enter.native="doAddRole"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
    </div>
    <div class="permissManaMain">
      <el-collapse v-model="activeName" accordion @change="change">
        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0; color: #ff424e" type="text"
                         icon="el-icon-delete" @click="doDeleteRole(r)"></el-button>
            </div>
            <div>
              <el-tree :data="allMenus"
                       show-checkbox
                       :props="defaultProps"
                       ref="tree"
                       :key="index"
                       :default-checked-keys="selectMenus"
                       node-key="id"></el-tree>
            </div>
            <div style="display: flex;justify-content: flex-end">
              <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
              <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roles: [],
      allMenus: [],
      // tree: [],
      selectMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      activeName: -1
    }

  },
  mounted() {
    this.initRoles();
  },
  methods: {
    doDeleteRole(role) {
      this.$confirm('此操作将永久删除[' + role.nameZh + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/permiss/delRole/' + role.id).then(resp => {
          if (resp) {
            this.initRoles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddRole() {
      if (this.role.nameZh && this.role.name) {
        this.postRequest('/system/basic/permiss/addRole', this.role).then(resp => {
          if (resp) {
            this.initRoles();
            this.role.name = '';
            this.role.nameZh = '';
          }
        })
      }
    },
    cancelUpdate() {
      this.activeName = -1;
    },
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys();
      let url = '/system/basic/permiss/updateMenuRole?rid=' + rid;
      selectedKeys.forEach(key => {
        url += '&mids=' + key;
      });
      this.putRequest(url).then(resp => {
        if (resp) {
          this.initRoles();
          this.activeName = -1;
        }
      })
    },
    change(rid) {
      this.selectMenus = [];
      this.initAllMenus();
      this.initSelectedMenus(rid);
    },
    initSelectedMenus(rid) {
      if (rid) {
        this.getRequest('/system/basic/permiss/mid/' + rid).then(resp => {
          if (resp) {
            this.selectMenus = resp;
          }
        })
      }
    },
    initAllMenus() {
      this.getRequest('/system/basic/permiss/menu').then(resp => {
        if (resp) {
          this.allMenus = resp;
        }
      })
    },
    initRoles() {
      this.getRequest('/system/basic/permiss/getAllRoles').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    }
  }
}
</script>

<style>
.permissManaTool {
  display: flex;
}

.permissManaTool .el-input {
  width: 300px;
  margin-right: 6px;
}

.permissManaMain {
  width: 700px;
  margin-top: 10px;
}
</style>