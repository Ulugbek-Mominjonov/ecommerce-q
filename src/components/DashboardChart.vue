<template>
  <div id="chart" class="dashboard-chart">
    <apexchart ref="apexChart"  type="area" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>

import VueApexCharts from "vue-apexcharts";
import {urls} from "src/utils/constants";

export default  {
  name: "DashboardChart",
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
  },
  data() {
    return {
      series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
      }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'String',
          categories: [1,2,3,4,5,6,7]
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
      },
      chartData: []
    }
  },
  methods: {
    getData() {
      this.$axios.get(urls.DASHBOARD_CHART)
        .then(res => {
          console.log(res.data)
          this.chartData.splice(0, this.chartData.length, ...res.data)
          this.updateChart(this.chartData)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {
      })
    },
    updateChart(data) {
      let month = [];
      let paymentToSuppliers = [];
      let paymentFromUsers = [];
      let paymentFromCustomers = [];
      let salaryForWorkers = [];
      let kassaOutputs = [];

      data.forEach(item => {
        month.push(item.month)
        paymentToSuppliers.push(item.paymentToSuppliers)
        paymentFromUsers.push(item.paymentFromUsers)
        paymentFromCustomers.push(item.paymentFromCustomers)
        salaryForWorkers.push(item.salaryForWorkers)
        kassaOutputs.push(item.kassaOutputs)
      })
      this.$refs.apexChart.updateOptions({
        xaxis: {
          type: 'String',
          categories: month
        },
      });

      this.$refs.apexChart.updateSeries([
        {
          name: 'paymentToSuppliers',
          data: paymentToSuppliers
        },
        {
          name: 'paymentFromUsers',
          data: paymentFromUsers
        },
        {
          name: 'paymentFromCustomers',
          data: paymentFromCustomers
        },
        {
          name: 'salaryForWorkers',
          data: salaryForWorkers
        },
        {
          name: 'kassaOutputs',
          data: kassaOutputs
        },
      ])
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.dashboard-chart {
  background-color: white;
  padding: 15px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 27%);
}
</style>
