<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <div>
    <q-table
      ref="table"
      title="Mijozlar"
      :row-key="rowKey"
      :data="data"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :pagination="filter"
      @request="refreshData"
      selection="single"
      :selected.sync="selectedRows"
      separator="horizontal"
      color="secondary"
      bordered
      :no-data-label="noDataText()"
      :selected-rows-label="selectedRowsText"
      @row-click="rowClick"
      :dense="$q.screen.lt.md"
      :grid="$q.screen.xs"
      class="sticky-first-column-table sticky-last-column-table q-mt-lg"
      style="height: calc(100vh - 150px)"
    >
      <template v-slot:no-data="props">
        {{$t('system.no_matching_found')}}
      </template>

      <template v-slot:top="props">
        <q-input v-model="filter.fullName" placeholder="Харидор"
                 label="Харидор"
                 class="q-pa-md col-4" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.fullName" name="close" color="primary" @click.stop="filter.fullName = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>
        <q-space/>
        <q-btn icon="refresh" class="q-mr-sm text-white" @click="refreshTable" dense style="background-color: #344767">
          <q-tooltip content-class="bg-primary">
            {{ $t('xshop_captions.l_refresh') }}
          </q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-fullName="props">
        <q-td :props="props">
          <div v-if="props.row.fullName">
            <b>{{props.row.fullName}}</b> <br>
            <b>{{props.row.phone}}</b>
          </div>
          <div v-else>
            0 {{ $t('xshop_captions.l_sum') }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-totalPayment="props">
        <q-td :props="props">
          <div v-if="props.row.totalPayment">
            Нақд: {{ number_format_old(props.row.totalCashPayment, 0, '.', ' ') }} <br>
            Пластик: {{ number_format_old(props.row.totalCardPayment, 0, '.', ' ') }} <br>
            Жами: {{ number_format_old(props.row.totalPayment, 0, '.', ' ') }}
          </div>
          <div v-else>
            0 {{ $t('xshop_captions.l_sum') }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-balance="props">
        <q-td :props="props">
          <div v-if="props.row.balance">
            <b>{{ number_format_old(props.row.balance) }} {{ $t('xshop_captions.l_sum') }}</b>
          </div>
          <div v-else>
            0 {{ $t('xshop_captions.l_sum') }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="sm" dense color="primary" icon="mdi-cash" @click.stop="addTransaction(props.row.id, props.row.fullName)" class="q-mr-sm">
            <q-tooltip content-class="bg-negative">
              Транзаксия яратиш
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="full-width row justify-center q-mt-md">
          <q-pagination
            v-model="model"
            color="grey-8"
            :max="pagesNumber"
            size="sm"
          />
        </div>
      </template>
    </q-table>

    <!--DIALOG-->
    <standart-input-dialog v-model="formDialog" :on-submit="onSubmit"
                           :on-validation-error="onValidationError">
      <div class="row">
        <q-input v-model="customerName"
                 :label="'Таъминотчи исми'"
                 type="text"
                 readonly
                 class="q-pa-md col-12 col-md-12" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.amount"
                 :label="$t('xshop_captions.l_amount')"
                 type="number"
                 class="q-pa-md col-12 col-md-6 col-lg-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-select
          v-model="bean.isPayment"
          emit-value
          map-options
          :options="transactionsTypes"
          option-value="id"
          option-label="name"
          :label="$t('xshop_captions.l_transactions_type')"
          class="q-pa-md col-12 col-md-6 col-lg-6" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.isPayment = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{ props.opt.name }}</div>
          </template>
        </q-select>

        <q-select
          v-model="bean.paymentType"
          emit-value
          map-options
          :options="paymentTypes"
          option-value="id"
          option-label="name"
          :label="'Нақд ёки пластик'"
          class="q-pa-md col-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.paymentType = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{ props.opt.name }}</div>
          </template>
        </q-select>
      </div>
    </standart-input-dialog>

  </div>
</template>

<script>
import {urls} from 'src/utils/constants';
import {mapMutations} from 'vuex';
import {mapState} from 'vuex';
import StandartTable from "src/mixins/StandartTable";
import StandartInputDialog from "components/base/StandartInputDialog";

export default {
  name: "ReportCustomers",
  components: {StandartInputDialog},
  mixins: [StandartTable],
  data() {
    return {
      apiUrl: urls.CUSTOMERS + '/report',
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      customerName: "",
      transactionsTypes: [
        {
          name: 'Тўлов',
          id: 1
        },
        {
          name: 'Қайтариш',
          id: 0
        }
      ],
      paymentTypes: [
        {
          name: 'Нақд',
          id: 1
        },
        {
          name: 'Пластик',
          id: 2
        }
      ],
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        nameUz: '',
        nameRu: '',
        nameBg: '',
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 5,
        rowsNumber: 0,
        descending: false,
        fullName: ""
      },
      columns: [
        {
          name: 'id',
          field: 'id',
          label: this.$t('xshop_captions.l_id'),
          sortable: true, align: 'left',
          classes: 'col-1'
        },
        {
          name: 'fullName',
          field: row => row.fullName,
          label: 'Харидор',
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'balance',
          field: row => this.number_format_old(row.balance, 0, '.', ' '),
          label: "баланс",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalTrade',
          field: row => this.number_format_old(row.totalTrade, 0, '.', ' '),
          label: "Умумий савдо",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalPayment',
          field: row => this.number_format_old(row.totalPayment, 0, '.', ' '),
          label: "Умумий тўлов",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalReturnedTrade',
          field: row => this.number_format_old(row.totalReturnedTrade, 0, '.', ' '),
          label: "Қайтарилган умумий савдо",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalReturnedPayment',
          field: row => this.number_format_old(row.totalReturnedPayment, 0, '.', ' '),
          label: "Қайтарилган умумий тўлов",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Амаллар", style: 'width: 1rem'},
      ],
      data: [],
      regions: [],
      model: 1
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
    addTransaction(id, name) {
      this.bean = Object.assign({}, this.bean);
      this.bean.customersId = id
      this.bean.amount = ''
      this.customerName = name
      this.showForm();
    },
    showForm() {
      this.formDialog = true;
    },

    onSubmit() {
      this.loading = true;
      this.$axios.post(urls.CUSTOMERS_TRANSACTIONS, this.bean)
        .then(response => {
          this.closeForm();
          this.refreshTable();
        }).catch(error => {
        this.showError(error)
        console.error(error);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval-1);
    }
  },
  mounted() {
  }
}
</script>
