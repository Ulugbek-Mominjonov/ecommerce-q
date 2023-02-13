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
        {{ $t('system.no_matching_found') }}
      </template>

      <template v-slot:top="props">
        <q-input v-model="filter.fullName" placeholder="Тарқатувчи"
                 label="Тарқатувчи"
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

      <template v-slot:body-cell-modifyDate="props">
        <q-td :props="props">
          <div v-if="props.row.modifiedDate">
            {{ $dateutil.formatDate(props.row.modifiedDate, 'DD.MM.YYYY') }}
          </div>
          <div v-else>
            --.--.----
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-fullName="props">
        <q-td :props="props">
          <b>{{ props.row.fullName }}</b> <br>
          {{ $t('login.l_username') }}: <b>{{ props.row.username }}</b> <br>
          {{ $t('xshop_captions.l_phone_short') }}: <b>{{ props.row.phone }}</b> <br>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="sm" dense color="primary" icon="mdi-cash"
                 @click.stop="addTransaction(props.row.id, props.row.fullName)" class="q-mr-sm">
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
                           :on-validation-error="onValidationError" :loading="loading">
      <div class="row">
        <q-input v-model="workerName"
                 :label="'Ходим исми'"
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
          v-model="bean.isToKassa"
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
            <q-icon name="close" color="primary" @click.stop="bean.isToKassa = null"
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
  name: "ReportUsers",
  components: {StandartInputDialog},
  mixins: [StandartTable],
  data() {
    return {
      apiUrl: urls.USERS + '/report',
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      workerName: "",
      users: [],
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
      cardCheckField: 'name',
      beanDefault: {
        usersId: null,
        isToKassa: null,
        amount: null
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
           align: 'left',
          classes: 'col-1'
        },
        {
          name: 'fullName',
          field: row => row.fullName,
          label: 'Фойдаланувчи',
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'balance',
          field: row => this.formatPrice(row.balance),
          label: this.$t('xshop_captions.l_balance'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalToKassa',
          field: row => this.formatPrice(row.totalToKassa),
          label: "Кассага",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalFromKassa',
          field: row => this.formatPrice(row.totalFromKassa),
          label: "Кассадан",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalToStores',
          field: row => this.formatPrice(row.totalToStores),
          label: "Дўконга",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalFromStores',
          field: row => this.formatPrice(row.totalFromStores),
          label: "Дўкондан",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'totalToSuppliers',
          field: row => this.formatPrice(row.totalToSuppliers),
          label: "Таъминотчига",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalFromSuppliers',
          field: row => this.formatPrice(row.totalFromSuppliers),
          label: "Таъминотчидан",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalToCustomers',
          field: row => this.formatPrice(row.totalToCustomers),
          label: "Харидорга",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalFromCustomers',
          field: row => this.formatPrice(row.totalFromCustomers),
          label: "Харидордан",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalToFounders',
          field: row => this.formatPrice(row.totalToFounders),
          label: "Таъсисчига",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalFromFounders',
          field: row => this.formatPrice(row.totalFromFounders),
          label: "Таъсисчидан",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'distributorEarning',
          field: row => this.formatPrice(row.distributorEarning),
          label: "Дистрибутор даромади",
          format: val => `${val}`,

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
    pagesNumber() {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
    addTransaction(id, name) {
      this.bean = Object.assign({}, this.bean);
      this.bean.usersId = id
      this.workerName = name
      this.showForm();
    },
    showForm() {
      this.formDialog = true;
    },

    onSubmit() {
      this.loading = true;
      this.$axios.post(urls.USERS_TRANSACTIONS, this.bean)
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
      this.$set(this.filter, 'page', newval - 1);
    }
  },
  mounted() {
  }
}
</script>
