<template>
  <div>
    <div style="display: flex;justify-content: center">
      <el-button type="danger" @click="initDatabase">初始化数据库</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysInit",
  methods: {
    initDatabase() {
      this.$confirm('此操作将初始化数据库到初始状态！是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getRequest('/system/init/initDatabase').then(resp => {
          if (resp) {
            this.initRoles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消初始化！'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>