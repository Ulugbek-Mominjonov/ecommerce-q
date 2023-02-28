<template>
  <div class="dashboard">
    <div class="flex justify-between dashboard-header">
      <dashboard-card style="width: 25%;" title="Касса" :value="cardInfo.kassaBalance" icon="mdi-bank-plus"/>
      <dashboard-card style="width: 24%;" title="Харидорлар" :value="cardInfo.customerBalance"
                      icon="mdi-account-cash-outline"/>
      <dashboard-card style="width: 24%;" title="Дўконлар" :value="cardInfo.storeBalance" icon="mdi-store-outline"/>
      <dashboard-card style="width: 25%;" title="Таъминотчилар" :value="cardInfo.supplierBalance"
                      icon="mdi-truck-outline"/>
      <dashboard-card style="width: 33%; margin-top: 5px" title="Фойдаланувчилар" :value="cardInfo.userBalance"
                      icon="mdi-cash-check"/>
      <dashboard-card style="width: 33%; margin-top: 5px" title="Берилган иш хақи" :value="cardInfo.workerSalaries"
                      icon="mdi-cash-check"/>
      <dashboard-card style="width: 33%; margin-top: 5px" title="Харажатлар" :value="cardInfo.kassaOutputs"
                      icon="mdi-cash-check"/>
    </div>

    <div class="q-mt-lg">
      <dashboard-chart/>
    </div>

    <div class="dashboard-statistic flex justify-between">
      <div class="statistic-item strore" style="height: 550px">
        <q-timeline color="primary">
          <q-timeline-entry heading>
            <div class="row">
              <div class="col col-lg-6 col-md-6">
                <div class="text-h5">
                  Қарздор дўконлар
                </div>
              </div>
              <div class="col col-lg-6 col-md-6">
                <q-input v-model="storeName"
                         :label="'Дўкон номи'"
                         class="q-pa-md col-4" dense outlined>
                  <template v-slot:append>
                    <q-icon v-if="storeName" name="close" color="primary"
                            @click.stop="storeName = ''"
                            class="cursor-pointer"/>
                  </template>
                </q-input>
              </div>
            </div>
          </q-timeline-entry>

          <template v-for="item in debitorStore">
            <q-timeline-entry
              icon="mdi-store">
              <div class="text-bold">{{ item.storeName }} ( {{ formatPrice(item.balance) }} сўм )</div>
              <div class="text-primary">
                <div>{{ item.ownerName }} ({{ item.phone }})</div>
              </div>
            </q-timeline-entry>
          </template>
        </q-timeline>
      </div>
      <div class="statistic-item strore"  style="height: 550px">
        <q-timeline color="primary">
          <q-timeline-entry heading>
            <div class="row">
              <div class="col col-lg-6 col-md-6">
                <div class="text-h5">
                  Қарздор харидорлар
                </div>
              </div>
              <div class="col col-lg-6 col-md-6">
                <q-input v-model="customerFullName"
                         :label="'Харидор исми'"
                         class="q-pa-md col-4" dense outlined>
                  <template v-slot:append>
                    <q-icon v-if="customerFullName" name="close" color="primary"
                            @click.stop="customerFullName = ''"
                            class="cursor-pointer"/>
                  </template>
                </q-input>
              </div>
            </div>
          </q-timeline-entry>

          <template v-for="item in debitorCustomer">
            <q-timeline-entry
              icon="mdi-account-cash-outline"
            >
              <div class="text-bold">{{ item.fullName }} ( {{ formatPrice(item.balance) }} сўм )</div>
              <div class="text-primary">
                <div>{{ item.phone }}</div>
              </div>
            </q-timeline-entry>
          </template>
        </q-timeline>
      </div>
    </div>

    <div class="dashboard-statistic flex justify-between" style="margin-bottom: 20px">
      <div class="statistic-item strore"  style="height: 950px">
        <q-timeline color="primary">
          <q-timeline-entry heading>
            <div class="row">
              <div class="col col-lg-6 col-md-6">
                <div class="text-h5">
                  Кам савдо қилган дистрибуторлар
                </div>
              </div>
              <div class="col col-lg-6 col-md-6">
                <q-input v-model="distributorFullName"
                         :label="'Харидор исми'"
                         class="q-pa-md col-4" dense outlined>
                  <template v-slot:append>
                    <q-icon v-if="distributorFullName" name="close" color="primary"
                            @click.stop="distributorFullName = ''"
                            class="cursor-pointer"/>
                  </template>
                </q-input>
              </div>
            </div>
          </q-timeline-entry>

          <template v-for="item in topDistributor">
            <q-timeline-entry
              icon="mdi-account-cash-outline"
            >
              <div class="text-bold">{{ item.fullName }} ( {{ formatPrice(item.tradeAmount) }} сўм )</div>
              <div class="text-primary">
                <div>{{ item.ownerName }} ({{ item.phone }})</div>
              </div>
            </q-timeline-entry>
          </template>
        </q-timeline>
      </div>
      <div class="statistic-item strore"  style="height: 950px">
        <q-timeline color="primary">
          <q-timeline-entry heading>
            <div class="row">
              <div class="col col-lg-6 col-md-6">
                <div class="text-h5">
                  Дўконлар охирги савдо саналари
                </div>
              </div>
              <div class="col col-lg-6 col-md-6">
                <q-input v-model="storeName2"
                         :label="'Дўкон номи'"
                         class="q-pa-md col-4" dense outlined>
                  <template v-slot:append>
                    <q-icon v-if="storeName2" name="close" color="primary"
                            @click.stop="storeName2 = ''"
                            class="cursor-pointer"/>
                  </template>
                </q-input>
              </div>
            </div>
          </q-timeline-entry>

          <template v-for="item in oldTradedStore">
            <q-timeline-entry
              icon="mdi-store">
              <div class="text-bold">{{ item.storeName }} ( {{ formatPrice(item.balance) }} сўм ) &nbsp;&nbsp;&nbsp; <span class="text-negative">{{ item.lastTradeDate.toString().substring(0,10) }}</span></div>
              <div class="text-primary">
                <div>{{ item.ownerName }} ({{ item.phone }})</div>
              </div>
              <div class="text-negative">
                <div></div>
              </div>
            </q-timeline-entry>
          </template>
        </q-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardCard from "components/DashboardCard.vue";
import {urls} from 'src/utils/constants';
import DashboardChart from "components/DashboardChart.vue";

export default {
  name: "Dashboard",
  components: {DashboardChart, DashboardCard},
  data() {
    return {
      cardInfo: {},
      debitorStore: [],
      oldTradedStore: [],
      debitorCustomer: [],
      topDistributor: [],
      storeName: "",
      storeName2: "",
      customerFullName: "",
      distributorFullName: "",
    }
  },
  methods: {
    getCardInfo() {
      this.$axios.get(urls.DASHBOARD_CARD_INFO)
        .then(res => {
          this.cardInfo = Object.assign({}, res.data);
        }).catch(err => {
        this.showError(err)
      }).finally(() => {
      })
    },

    getDebitorStore() {
      this.$axios.get(urls.DASHBOARD_DEBITOR_STORE + "?storeName=" + this.storeName)
        .then(res => {
          this.debitorStore.splice(0, this.debitorStore.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {
      })
    },
    getOldTradedStore() {
      this.$axios.get(urls.DASHBOARD_LAST_TRADE_DATE_STORE + "?storeName=" + this.storeName2)
        .then(res => {
          this.oldTradedStore.splice(0, this.oldTradedStore.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {
      })
    },
    getDebitorCustomer() {
      this.$axios.get(urls.DASHBOARD_DEBITOR_CUSTOMER + "?fullName=" + this.customerFullName)
        .then(res => {
          this.debitorCustomer.splice(0, this.debitorCustomer.length, ...res.data);
        }).catch(err => {
        this.showError(err)
      }).finally(() => {
      })
    },
    getDistributor() {
      this.$axios.get(urls.DASHBOARD_TOP_DISTRIBUTOR + "?fullName=" + this.distributorFullName)
        .then(res => {
          this.topDistributor.splice(0, this.topDistributor.length, ...res.data);
        }).catch(err => {
        this.showError(err)
      }).finally(() => {
      })
    },
  },
  mounted() {
    this.getCardInfo()
    this.getDebitorStore()
    this.getOldTradedStore()
    this.getDebitorCustomer()
    this.getDistributor()
  },
  watch: {
    customerFullName() {
      this.getDebitorCustomer()
    },
    storeName() {
      this.getDebitorStore()
    },
    distributorFullName() {
      this.getDistributor()
    },
    storeName2() {
      this.getOldTradedStore()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;

  .dashboard-header {
    flex-grow: 0;
  }

  .dashboard-statistic {
    width: 100%;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    flex-grow: 1;

    .statistic-item {
      background-color: white;
      padding: 15px 15px 15px 30px;
      width: 49%;
      border-radius: 12px;
      box-shadow: 0 20px 27px rgb(0 0 0 / 27%);
      border: 1px solid #c1c1c1;
    }
    .statistic-item2 {
      background-color: white;
      padding: 15px 15px 15px 30px;
      width: 98%;
      margin-top: 20px;
      margin-bottom: 20px;
      border-radius: 12px;
      box-shadow: 0 20px 27px rgb(0 0 0 / 27%);
      border: 1px solid #c1c1c1;
      min-height: 550px;
    }
  }
}
</style>
