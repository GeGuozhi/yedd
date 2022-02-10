<template>
  <div>
    <el-form
        v-loading="loading"
        :data="data"
        class="loginContainer">

      <el-button type="primary" style="width: 100%" @click="getInfo()">获取用户信息</el-button>

    </el-form>
  </div>
</template>
<script>
import {Message} from "element-ui";

export default {
  name: "Test.vue",
  data() {
    return {

    }
  },
  methods: {
    getInfo() {
      this.loading = true;
      this.getRequest('/admin/info').then(resp => {
        if (resp) {
          this.loading = false;
          Message.success({message: resp.name})
        } else {
          this.loading = false;
          window.sessionStorage.removeItem('tokenStr');
          this.$router.replace('/')
        }
      })
    }
  }

}
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6;
}

.el-form-item__content{
  display: flex;
  align-items: center;
}

</style>