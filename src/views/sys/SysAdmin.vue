<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 10px">
      <el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search"
                style="width: 305px"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch"></el-button>
    </div>
    <div class="admin-container">
      <el-card class="admin-card" v-for="(admin,index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ admin.name }}</span>
          <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete"
                     @click="doDelete(admin)"></el-button>
        </div>
        <div>
          <div class="imgContainer">
            <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userFace">
          </div>
        </div>
        <div class="userinfo-container">
          <div style="padding-bottom: 5px;">用户名：{{ admin.name }}</div>
          <div style="padding-bottom: 5px;">电话号码：{{ admin.phone }}</div>
          <div style="padding-bottom: 5px;">手机号码：{{ admin.telephone }}</div>
          <div style="padding-bottom: 5px;">地址：{{ admin.address }}</div>
          <div style="padding-bottom: 5px;">用户状态：
            <el-switch
                v-model="admin.enabled"
                @change="enabledChange(admin)"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用">
            </el-switch>
          </div>
          <div>
            用户角色：
            <el-tag style="margin-right: 4px;margin-bottom: 4px" type="success" v-for="(role,index) in admin.roles"
                    :key="index">{{ role.nameZh }}
            </el-tag>
            <el-popover
                placement="right"
                title="角色列表"
                width="200"
                @show="showPop(admin)"
                @hide="hidePop(admin)"
                trigger="click">
              <el-select v-model="selectRoles" multiple placeholder="请选择">
                <el-option
                    v-for="(r,index) in allRoles"
                    :key="index"
                    :label="r.nameZh"
                    :value="r.id">
                </el-option>
              </el-select>
              <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
            </el-popover>

          </div>
          <div>备注：{{ admin.remark }}</div>
        </div>
      </el-card>

    </div>
  </div>
</template>

<script>
export default {
  name: "SysAdmin",
  data() {
    return {
      admins: [],
      keywords: '',
      allRoles: [],
      selectRoles: []
    }
  },
  mounted() {
    this.initAdmins();
  },
  methods: {

    hidePop(admin) {
      let flag = false;
      let roles = [];

      Object.assign(roles, admin.roles);
      let selectRoles = this.selectRoles;
      if (roles.length != selectRoles.length) {
        flag = true;
      } else {
        //判断每一个selectRoles的role是否在admin.roles内
        for (let i = 0; i < selectRoles.length; i++) {
          let judge = false;
          roles.forEach(role => {
            judge = judge || role.id == selectRoles[i]
          })
          //judge 有不相等的需要更新，没有不更新
          if (!judge) {
            flag = true;
            break;
          }
        }
      }

      if (flag) {
        let url = '/system/admin/updateAdminRole?adminId=' + admin.id;
        this.selectRoles.forEach(roleId => {
          url += '&rids=' + roleId;
        })
        this.putRequest(url).then(resp => {
          if (resp) {
            this.initAdmins()
          }
        })
      }
    },
    showPop(admin) {
      this.initAllRoles();
      let roles = admin.roles;
      this.selectRoles = [];
      roles.forEach(item => {
        this.selectRoles.push(item.id)
      })
    }
    ,
    initAllRoles() {
      this.getRequest('/system/admin/roles').then(resp => {
        if (resp) {
          this.allRoles = resp;
        }
      })
    }
    ,
    enabledChange(admin) {
      this.putRequest('/system/admin/updateAdmin', admin).then(resp => {
        if (resp) {
          this.initAdmins()
        }
      })
    }
    ,
    doDelete(admin) {
      this.$confirm('此操作将永久删除[' + admin.name + ']操作员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/admin/deleteAdmin/' + admin.id).then(resp => {
          if (resp) {
            this.initAdmins()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
    ,
    doSearch() {
      this.initAdmins();
    }
    ,
    initAdmins() {
      this.getRequest('/system/admin/getAllAdmins?keywords=' + this.keywords).then(resp => {
        this.admins = resp;
      })
    }
  }
}
</script>

<style>
.admin-card {
  width: 350px;
  margin-bottom: 20px;
}

.admin-container {
  display: flex;
  margin-top: 20px;
  justify-content: space-around;
  flex-wrap: wrap;
}

.userFace {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.imgContainer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.userinfo-container {
  font-size: 12px;
  color: #409eff;
}
</style>