<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">OA系统</div>
        <div>
          <el-button icon="el-icon-bell"
                     type="text"
                     size="normal"
                     @click="goChat"
                     style="margin-right: 8px;color: black"></el-button>

          <el-dropdown class="userInfo" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ user.name }}<i><img :src="user.userFace"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销登陆</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu :index="index+''"
                        v-for="(item,index) in routes"
                        :key="index"
                        v-if="!item.hidden">

              <template slot="title">

                <i :class="item.iconCls" style="color:#1accff;margin-right: 5px"></i>

                <span>{{ item.name }}</span>

              </template>

              <el-menu-item :index="children.path"
                            v-for="(children,indexj) in item.children">

                <i :class="children.iconCls" style="color:#1accff;margin-right: 5px"></i>
                {{ children.name }}

              </el-menu-item>

            </el-submenu>


          </el-menu>
        </el-aside>
        <el-main>

          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到OA系统
          </div>
          <router-view class="homeRouterView"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import {Message} from "element-ui";
import {getRequest} from "@/utils/api";

export default {
  name: "Home.vue",
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  methods: {
    goChat() {
      this.$router.push('/chat')
    },
    handleCommand(command) {
      if (command === 'logout') {

        this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postRequest('/logout')
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          this.$store.commit('initRoutes', [])
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出登录'
          });
        });
      } else if (command === 'userinfo') {
        this.$router.push('/userinfo')
      } else if (command === 'setting') {
        this.$router.push('/setting')
      }
    }
  },
  computed: {
    routes() {
      // return this.$router.options.routes
      return this.$store.state.routes
    },
    user(){
      return this.$store.state.currentAdmin
    }
  }
}
</script>

<style>

.homeHeader {
  background: #1accff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.title {
  font-size: 30px;
  font-family: 华文行楷;
  color: white;
}

.homeHeader.userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: #4093ff;
  padding: 50px;
}

.homeRouterView {
  margin-top: 17px;
}

</style>