<template>
  <div>
    <el-card class="box-card" style="width: 400px">
      <div slot="header" class="clearfix">
        <span>{{ admin.name }}</span>
      </div>
      <div>
        <div style="margin: 10px">
          <div style="display: flex;justify-content: center">
            <el-upload
                :headers="headers"
                :data="admin"
                :show-file-list="false"
                :on-success="onSuccess"
                action="/system/admin/info/updatePictureForUserCenter">
              <img :src="admin.userFace" title="点击修改头像" style="height: 100px;width:100px;border-radius: 50px" alt="">
            </el-upload>
          </div>

          <div style="margin-top: 10px">电话号码：
            <el-tag>{{ admin.phone }}</el-tag>
          </div>
          <div style="margin-top: 10px">手机号码：
            <el-tag>{{ admin.telephone }}</el-tag>
          </div>
          <div style="margin-top: 10px">居住地址：
            <el-tag>{{ admin.address }}</el-tag>
          </div>
          <div style="margin-top: 10px">用户角色：
            <el-tag style="margin-right: 4px;margin-bottom: 4px" type="success" v-for="(role,index) in admin.roles"
                    :key="index">{{ role.nameZh }}
            </el-tag>
          </div>
          <div style="margin-top: 10px;">
            <el-button type="primary" size="mini"
                       @click="showUserInfoDialog" style="width: 150px">修改信息
            </el-button>
            <el-button type="danger" size="mini"
                       @click="updatePassword" style="width: 150px">修改密码
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="30%">
      <div>
        <table style="width:100%">
          <tr>
            <td>
              <el-tag>用户昵称：</el-tag>
            </td>
            <td>
              <el-input v-model="editAdmin.name" placeholder="请输入用户昵称..."></el-input>
            </td>
          </tr>

          <tr>
            <td>
              <el-tag>手机号码：</el-tag>
            </td>
            <td>
              <el-input v-model="editAdmin.phone" placeholder="请输入手机号码..."></el-input>
            </td>
          </tr>

          <tr>
            <td>
              <el-tag>电话号码：</el-tag>
            </td>
            <td>
              <el-input v-model="editAdmin.telephone" placeholder="请输入电话号码..."></el-input>
            </td>
          </tr>

          <tr>
            <td>
              <el-tag>居住地址：</el-tag>
            </td>
            <td>
              <el-input v-model="editAdmin.address" placeholder="请输入居住地址..."></el-input>
            </td>
          </tr>

        </table>
      </div>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content:center">
        <el-button @click="doCancelDialog">取消</el-button>
        <el-button type="primary" @click="doSaveUserInfo">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="passwordDialogVisible" width="30%">
      <div class="passwordForm">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="旧密码" prop="oldPassword">
            <label slot="label">旧&#8194;密&#8194;码</label>
            <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <label slot="label">密&#12288;&#12288;码</label>
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" style="width: 90px">提交</el-button>
            <el-button type="warning" @click="resetForm('ruleForm')" style="width: 90px">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, putRequest} from "@/utils/api";

export default {
  name: "UserInfo",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      headers:{
        Authorization:window.sessionStorage.getItem('tokenStr')
      },
      admin: {},
      dialogVisible: false,
      passwordDialogVisible: false,
      editAdmin: {
        name: '',
        phone: '',
        telephone: '',
        address: ''
      },
      ruleForm: {
        oldPassword: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [{validator: validatePass, trigger: 'blur'}],
        checkPass: [{validator: validatePass2, trigger: 'blur'}],
        oldPassword: [{validator: validatePass, trigger: 'blur'}]
      }
    }
  },
  methods: {
    onSuccess(){
      this.initAdmin();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.adminId = this.admin.id;
          putRequest('/system/admin/info/updatePassword',this.ruleForm).then(resp=>{
          if(resp){
            this.postRequest('/logout')
            window.sessionStorage.removeItem('tokenStr');
            window.sessionStorage.removeItem('user');
            this.$store.commit('initRoutes', [])
            this.$router.replace('/')
          }
          })

        } else {
          console.log('失败');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updatePassword() {
      this.passwordDialogVisible = true;
    },
    doSaveUserInfo() {
      putRequest('/system/admin/info/updateAdminForUserCenter', this.editAdmin).then(resp => {
        if (resp) {
          this.dialogVisible = false
          this.initAdmin();
        }
      })
    },
    doCancelDialog() {
      this.dialogVisible = false
    },
    showUserInfoDialog() {
      this.dialogVisible = true
      Object.assign(this.editAdmin, this.admin);
    },
    initAdmin() {
      getRequest('/admin/info').then(resp => {
        if (resp) {
          this.admin = resp;
          window.sessionStorage.setItem('user', JSON.stringify(this.admin));
          this.$store.commit('INIT_ADMIN', this.admin);
        }
      })
    }
  },
  mounted() {
    this.initAdmin()
  }
}
</script>

<style scoped>
.passwordForm {
  display: flex;
  justify-content: space-around;
  margin-right: 40px;
}
</style>