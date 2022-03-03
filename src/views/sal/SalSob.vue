<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button type="primary" icon="el-icon-plus" @click="addSalaryButton">添加员工帐套</el-button>
      <el-button type="success" icon="el-icon-refresh" @click="initSalaries"></el-button>
    </div>
    <div>
      <el-table
          border
          stripe
          style="margin-top: 15px;width: 100%"
          :data="salaries">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="name" label="帐套名称" width="120" align="center"></el-table-column>
        <el-table-column prop="basicSalary" label="基本工资" width="70" align="center"></el-table-column>
        <el-table-column prop="bonus" label="奖金" width="70" align="center"></el-table-column>
        <el-table-column prop="lunchSalary" label="午餐补助" width="70" align="center"></el-table-column>
        <el-table-column prop="trafficSalary" label="交通补助" width="70" align="center"></el-table-column>
        <el-table-column prop="allSalary" label="应发工资" width="70" align="center"></el-table-column>
        <el-table-column prop="pensionBase" label="养老金基数" width="100" align="center"></el-table-column>
        <el-table-column prop="pensionPer" label="养老金比率" width="100" align="center"></el-table-column>
        <el-table-column prop="createDate" label="启用时间" width="150"></el-table-column>
        <el-table-column prop="medicalBase" label="医疗基数" width="70" align="center"></el-table-column>
        <el-table-column prop="medicalPer" label="医疗报销比率" width="70" align="center"></el-table-column>
        <el-table-column prop="accumulationFundBase" label="公积金基数" width="70" align="center"></el-table-column>
        <el-table-column prop="accumulationFundPer" label="公积金比率" width="70" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editSalary(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteSalary(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog
          title="添加工资账套"
          :visible.sync="dialogVisible"
          @closed="initControls"
          width="50%">
        <div style="display: flex;justify-content: space-around;align-items: center">

          <el-steps direction="vertical" :active="activeItemIndex">
            <el-step :title="itemName" v-for="(itemName,index) in salaryItemName" :key="index"></el-step>
          </el-steps>

          <el-input :placeholder="'请输入'+salaryItemName[index]+'...'"
                    v-model="salaryItemValue[title]"
                    v-for="(value,title,index) in salaryItemValue"
                    :key="index"
                    style="width: 200px"
                    v-show="activeItemIndex==index"></el-input>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="preStep">{{ activeItemIndex == 10 ? '取消' : '上一步' }}</el-button>
          <el-button type="primary" @click="nextStep">{{ activeItemIndex == 10 ? '保存' : '下一步' }}</el-button>
        </span>

      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: "SalSob.vue",
  data() {
    return {
      salaries: [],
      dialogVisible: false,
      salaryItemName: [
        '帐套名称', '基本工资', '交通补助', '午餐补助', '奖金', '养老金基数', '养老金比率', '医疗基数', '医疗报销比率', '公积金基数', '公积金比率'
      ],
      salaryItemValue: {
        name: '',
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionBase: 0,
        pensionPer: 0,
        medicalBase: 0,
        medicalPer: 0,
        accumulationFundBase: 0,
        accumulationFundPer: 0
      },
      salaryId: '',
      activeItemIndex: 0,
      isAdd: true
    }
  },
  mounted() {
    this.initSalaries();
  },
  methods: {
    editSalary(index, data) {
      this.dialogVisible = true;
      this.salaryItemValue.name = data.name;
      this.salaryItemValue.basicSalary = data.basicSalary;
      this.salaryItemValue.trafficSalary = data.trafficSalary;
      this.salaryItemValue.lunchSalary = data.lunchSalary;
      this.salaryItemValue.bonus = data.bonus;
      this.salaryItemValue.pensionBase = data.pensionBase;
      this.salaryItemValue.pensionPer = data.pensionPer;
      this.salaryItemValue.medicalBase = data.medicalBase;
      this.salaryItemValue.medicalPer = data.medicalPer;
      this.salaryItemValue.accumulationFundBase = data.accumulationFundBase;
      this.salaryItemValue.accumulationFundPer = data.accumulationFundPer;
      this.salaryId = data.id;
      this.isAdd = false;
    },
    deleteSalary(data) {
      this.deleteRequest('/salary/sob/delSalary/' + data.id).then(resp => {
        if (resp) {
          this.initSalaries();
        }
      })
    },
    preStep() {
      if (this.activeItemIndex === 0) {

      } else if (this.activeItemIndex === 10) {
        this.dialogVisible = false;
      } else {
        this.activeItemIndex--;
      }
    },
    nextStep() {
      if (this.activeItemIndex === 10) {
        let salary = this.salaryItemValue;
        salary.id = this.salaryId;
        if (!this.isAdd) {
          //update
          this.putRequest('/salary/sob/updateSalary', salary).then(resp => {
            if (resp) {
              this.initSalaries();
            }
          })
        } else {
          this.postRequest('/salary/sob/addSalary', this.salaryItemValue).then(resp => {
            if (resp) {
              this.initSalaries();
            }
          })
        }

        this.dialogVisible = false;
      } else {
        this.activeItemIndex++;
      }
    },
    addSalaryButton() {
      this.activeItemIndex = 0;
      this.dialogVisible = true;
      this.isAdd = true;
      this.salaryId = null;
    },
    initControls() {
      this.activeItemIndex = 0;
      this.salaryItemValue = {
        name: '',
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionBase: 0,
        pensionPer: 0,
        medicalBase: 0,
        medicalPer: 0,
        accumulationFundBase: 0,
        accumulationFundPer: 0
      };
    },
    initSalaries() {
      this.getRequest('/salary/sob/getAllSalary').then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    }
  }
}
</script>

<style>

</style>