<template>
  <div class="dashboard">
    <div class="flex justify-between dashboard-header">
      <dashboard-card style="width: 24%;" title="Касса" :value="cardInfo.kassaBalance" icon="mdi-bank-plus"/>
      <dashboard-card style="width: 24%;" title="Харидорлар" :value="cardInfo.customerBalance" icon="mdi-account-cash-outline"/>
      <dashboard-card style="width: 24%;" title="Дўконлар" :value="cardInfo.storeBalance" icon="mdi-store-outline"/>
      <dashboard-card style="width: 24%;" title="Таъминотчилар" :value="cardInfo.supplierBalance" icon="mdi-truck-outline"/>
      <dashboard-card style="width: 30%; margin-top: 20px"  title="Фойдаланувчилар" :value="cardInfo.userBalance" icon="mdi-cash-check"/>
      <dashboard-card style="width: 30%; margin-top: 20px" title="Берилган иш хақи" :value="cardInfo.workerSalaries" icon="mdi-cash-check"/>
      <dashboard-card style="width: 30%; margin-top: 20px" title="Харажатлар" :value="cardInfo.kassaOutputs" icon="mdi-cash-check"/>
    </div>

    <div class="dashboard-statistic flex justify-between">
      <div class="statistic-item strore">
        <q-timeline color="secondary">
          <q-timeline-entry  heading>
            <div class="text-h5 q-pb-none">
              Қарздор дўконлар
            </div>
          </q-timeline-entry>

          <template v-for="item in debitorStore">
            <q-timeline-entry
              icon="mdi-store"
            >
              <div class="text-bold">{{item.storeName}} ( {{ formatPrice(item.balance) }} сўм )</div>
              <div class="text-secondary">
                <div>{{item.ownerName }} ({{item.phone}})</div>
              </div>
            </q-timeline-entry>
          </template>
        </q-timeline>
      </div>
      <div class="statistic-item strore">
        <q-timeline color="secondary">
          <q-timeline-entry  heading>
            <div class="text-h5">
              Қарздор харидорлар
            </div>
          </q-timeline-entry>

          <template v-for="item in debitorCustomer">
            <q-timeline-entry
              icon="mdi-account-cash-outline"
            >
              <div class="text-bold">{{item.fullName}} ( {{ formatPrice(item.balance) }} сўм )</div>
              <div class="text-secondary">
                <div>{{item.phone }}</div>
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
import {mapMutations} from 'vuex';
import {mapState} from 'vuex';

export default {
  name: "Dashboard",
  components: {DashboardCard},
  data() {
    return {
      cardInfo: {},
      debitorStore: [],
      debitorCustomer: []
    }
  },
  methods: {
    getCardInfo() {
      this.$axios.get(urls.DASHBOARD_CARD_INFO)
        .then(res => {
          this.cardInfo = Object.assign({}, res.data);
          console.log(this.cardInfo)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {})
    },

    getDebitorStore() {
      this.$axios.get(urls.DASHBOARD_DEBITOR_STORE)
        .then(res => {
          this.debitorStore.splice(0, this.debitorStore.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {})
    },
    getDebitorCustomer() {
      this.$axios.get(urls.DASHBOARD_DEBITOR_CUSTOMER)
        .then(res => {
          this.debitorCustomer.splice(0, this.debitorCustomer.length, ...res.data);
          console.log(this.debitorCustomer)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {})
    },
  },
  mounted() {
    this.getCardInfo()
    this.getDebitorStore()
    this.getDebitorCustomer()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);

  .dashboard-header {
    flex-grow: 0;
  }
  .dashboard-statistic {
    width: 100%;
    margin-top: 40px;
    margin-left: auto;
    margin-right: auto;
    flex-grow: 1;

    .statistic-item {
      background-color: white;
      padding: 15px;
      padding-left: 40px;
      width: 47%;
      border-radius: 12px;
      box-shadow: 0 20px 27px rgb(0 0 0 / 7%);
    }
  }
}
</style>
