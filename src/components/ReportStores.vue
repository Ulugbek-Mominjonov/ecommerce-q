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
      class="sticky-first-column-table q-mt-lg"
      style="height: calc(100vh - 150px)"
    >
      <template v-slot:no-data="props">
        {{$t('system.no_matching_found')}}
      </template>

      <template v-slot:top="props">
        <q-input v-model="filter.storeName" placeholder="Дўкон"
                 label="Дўкон"
                 class="q-pa-md col-4" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.storeName" name="close" color="primary" @click.stop="filter.storeName = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>

        <q-input v-model="filter.ownerName" placeholder="Дўкон эгаси"
                 label="Дўкон эгаси"
                 class="q-pa-md col-4" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.ownerName" name="close" color="primary" @click.stop="filter.ownerName = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>
        <q-space/>
      </template>

      <template v-slot:body-cell-storeName="props">
        <q-td :props="props">
          <div>
            <span class="text-bold">Номи: </span> <span>{{props.row.storeName}}</span>
          </div>

          <div>
            <span class="text-bold">Манзили: </span> <span>{{props.row.address}}</span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-ownerName="props">
        <q-td :props="props">
          <div>
            <span class="text-bold">Исми: </span> <span>{{props.row.ownerName}}</span>
          </div>

          <div>
            <span class="text-bold">Телефон: </span> <span>{{phone_format(props.row.phone)}}</span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-distributorName="props">
        <q-td :props="props">
          <div>
            <span class="text-bold">Исми: </span> <span>{{props.row.distributorName}}</span>
          </div>

          <div>
            <span class="text-bold">Телефон: </span> <span>{{phone_format(props.row.distributorPhone)}}</span>
          </div>
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
  </div>
</template>

<script>
import {urls} from 'src/utils/constants';
import {mapMutations} from 'vuex';
import {mapState} from 'vuex';
import StandartTable from "src/mixins/StandartTable";
import StandartInputDialog from "components/base/StandartInputDialog";

export default {
  name: "ReportStores",
  components: {StandartInputDialog},
  mixins: [StandartTable],
  data() {
    return {
      apiUrl: urls.STORES + '/report',
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
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
        storeName: "",
        ownerName: "",
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
          name: 'storeName',
          field: row => row.storeName,
          label: 'Дўкон',
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'balance',
          field: row => this.number_format_old(row.balance, 0, '.', ' ') + " сўм",
          label: "Баланс",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'ownerName',
          field: row => row.ownerName,
          label: 'Дўкон егаси',
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'distributorName',
          field: row => row.distributorName,
          label: 'Тарқатувчи',
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalTrade',
          field: row => this.number_format_old(row.totalTrade, 0, '.', ' '),
          label: "Умумий савдо",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalPayment',
          field: row => this.number_format_old(row.totalPayment, 0, '.', ' '),
          label: "Умумий тўлов",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalReturnedTrade',
          field: row => this.number_format_old(row.totalReturnedTrade, 0, '.', ' '),
          label: "Умумий қайтарилган савдо",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'totalReturnedPayment',
          field: row => this.number_format_old(row.totalReturnedPayment, 0, '.', ' '),
          label: "Умумий қайтарилган тўлов",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
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
