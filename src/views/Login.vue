<template>
  <div>
    <el-form
        v-loading="loading"
        :rules="rules"
        ref="loginForm"
        :model="loginForm"
        class="loginContainer">
      <h3 class="loginTitle">OA系统</h3>

      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="false" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input type="text" v-model="loginForm.code" placeholder="点击图片更换验证码"
                  style="width: 200px ;margin-right: 5px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha()">
      </el-form-item>

      <el-checkbox v-model="checked" style="margin-bottom: 20px">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin()">登陆</el-button>
    </el-form>
  </div>
</template>
<script>

import {getRequest} from "@/utils/api";

export default {
  name: "Login.vue",
  data() {
    return {
      captchaUrl: '/captcha',
      loginForm: {
        username: 'admin',
        password: '123',
        code: '1234'
      },
      loading: false,
      checked: true,
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date();
    },
    submitLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest('/login', this.loginForm).then(resp => {
            if (resp) {
              this.loading = false;
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.setItem('tokenStr', tokenStr);
              //跳转对应页
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined ? '/home' : path)).catch(
                  err => {
                    this.$router.replace((path == '/' || path == undefined ? '/home' : path))
                  }
              );

              // this.$router.replace('/home').catch(err => {
              //   this.$router.replace('/home')
              // })
            } else {
              this.loading = false;
            }
          });
        } else {
          this.$message.error("请输入所有字段")
          return false;
        }
      });
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

.loginContainer .loginTitle {
  font-size: 30px;
  font-family: 华文行楷;
  color: #409EFF;
}


.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>