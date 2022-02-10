

<template>
  <div>
    <el-tabs v-model="activeName" type="card"  @tab-click="handleClick">
      <el-tab-pane label="部门管理" name="DepMana"><DepMana></DepMana></el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana"><PosMana></PosMana></el-tab-pane>
      <el-tab-pane label="职称管理" name="JobMana"><JobMana></JobMana></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcMana"><EcMana></EcMana></el-tab-pane>
      <el-tab-pane label="权限组" name="PermissMana"><PermissMana></PermissMana></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>


import DepMana from "@/components/sys/basic/DepMana";
import EcMana from "@/components/sys/basic/EcMana";
import JobMana from "@/components/sys/basic/JobMana";
import PosMana from "@/components/sys/basic/PosMana";
import PermissMana from "@/components/sys/basic/PermissMana";

export default {
  name: "SysBasic.vue",
  data() {
    return {
      activeName: 'DepMana'
    };
  },
  components:{
    DepMana,
    EcMana,
    JobMana,
    PosMana,
    PermissMana
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}

</script>

<style scoped>

</style>