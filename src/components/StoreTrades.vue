<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <div>
    <q-table
      id="customerTable"
      ref="table"
      title="Xaridlar"
      :row-key="rowKey"
      :data="data"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :pagination="filter"
      @request="refreshData"
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

      <template v-slot:body-cell-passport="props">
        <q-td :props="props">
          <div v-if="props.row.passportSeries && props.row.passportNumber">
            {{props.row.passportSeries}} {{props.row.passportNumber}}
          </div>
          <div v-else>
            -- --- -- --
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-createdDate="props">
        <q-td :props="props">
          {{ $dateutil.formatDate(props.row.createdDate, 'DD.MM.YYYY') }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn v-if="getUser().user.roles.id===1" size="sm" dense color="secondary" icon="edit" @click.stop="rowEdit(props.row)" class="q-mr-xs">
            <q-tooltip content-class="bg-secondary">
              {{ $t('system.edit') }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>


      <template v-slot:top="props">
        <q-select
          v-if="!customersId"
          v-model="filter.customersId"
          emit-value
          map-options
          :options="customersId"
          option-value="id"
          option-label="fullName"
          :label="$t('xshop_captions.l_suppliers')"
          outlined
          class="q-pa-sm col-2 col-md-2" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="filter.customersId !== null" name="close" color="primary"
                    @click.stop="filter.customersId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{ props.opt.fullName }}</div>
          </template>
        </q-select>

        <q-btn v-if="customersId" @click="goBack" color="teal-8" outline icon="mdi-arrow-left"/>

        <q-select
          v-model="filter.productsId"
          emit-value
          map-options
          :options="products"
          option-value="id"
          option-label="nameBg"
          :label="$t('xshop_captions.l_products')"
          outlined
          class="q-pa-sm col-3 col-md-3" dense
          lazy-rules :rules="[val => val>=0 || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="filter.productsId !== null" name="close" color="primary"
                    @click.stop="filter.productsId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{ props.opt.nameBg }}</div>
          </template>
        </q-select>
        <date-input
          v-model="filter.fromDate"
          :label="$t('xshop_captions.l_from_date')"
          class="q-pa-sm col-3 text-white"
        />
        <date-input
          v-model="filter.toDate"
          :label="$t('xshop_captions.l_to_date')"
          class="q-pa-sm col-3 text-white"
        />
        <q-space/>
        <div class="q-mt-sm q-ml-auto">
          <q-btn icon="refresh" class="q-mr-sm bg-primary text-white" @click="refreshTable" dense>
            <q-tooltip content-class="bg-primary">
              {{ $t('xshop_captions.l_refresh') }}
            </q-tooltip>
          </q-btn>

          <q-btn v-if="customersId" icon="add" class="bg-primary text-white" @click="rowAdd" dense>
            <q-tooltip content-class="bg-primary">
              {{ $t('system.add') }}
            </q-tooltip>
          </q-btn>
        </div>
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
    <standart-input-dialog
      v-model="formDialog" :model-id="bean.id" :on-submit="onSubmit"
      :on-validation-error="onValidationError">

      <div class="row">
        <q-select
          v-model="bean.productsId"
          emit-value
          map-options
          :options="products"
          option-value="id"
          option-label="nameBg"
          :label="$t('xshop_captions.l_products')"
          class="q-pa-md col-12 col-md-6" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon v-if="bean.productsId" name="close" color="primary" @click.stop="bean.productsId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-bean="props">
            <div>{{ props.opt.nameBg }}</div>
          </template>
        </q-select>
        <q-input v-model="bean.price"
                 :label="$t('xshop_captions.l_cost')"
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.amount"
                 :label="$t('xshop_captions.l_amount')"
                 class="q-pa-md col-12 col-md-6" dense
                 type="number"
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.returned"
                 :label="'Қайтарилган миқдор'"
                 class="q-pa-md col-12 col-md-6" dense>
        </q-input>
      </div>

    </standart-input-dialog>



  </div>
</template>

<script>
import {urls} from 'src/utils/constants';
import {mapGetters} from 'vuex';
import StandartTable from "src/mixins/StandartTable";
import StandartInputDialog from "components/base/StandartInputDialog";
import DateInput from "components/base/DateInput.vue";

export default {
  name: "StoreTrades",
  components: {DateInput, StandartInputDialog},
  mixins: [StandartTable],
  props: {
    customersId: {
      type: Number,
      default: null
    },
  },
  data() {
    return {
      apiUrl: urls.STORE_TRADES,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        amount: null,
        price: null,
        returned: null,
        productsId: null,
        customersId: this.customersId,
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        descending: false,
        customersId: this.customersId,
        productsId: null,
        fromDate: null,
        toDate: null,
        amount: null,
        price: null
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
          name: 'NameBg',
          field: row => row.products.nameBg,
          label: this.$t('xshop_captions.l_name'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'amount',
          field: row => this.formatPrice(row.amount) + " " + row.products.measureTypes.nameBg,
          label: this.$t('xshop_captions.l_buy_product'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'price',
          field: row => this.formatPrice(row.price) + ' сўм',
          label: this.$t('xshop_captions.l_one_product_cost'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'allPrice',
          field: row => this.formatPrice(row.price * row.amount) + ' сўм',
          label: this.$t('xshop_captions.l_all'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'returned',
          field: row => this.formatPrice(row.returned) + " " + row.products.measureTypes.nameBg,
          label: this.$t('xshop_captions.l_returned_amount'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'returnPrice',
          field: row => this.formatPrice(row.price * row.returned) + ' сўм',
          label: this.$t('xshop_captions.l_returned_summ'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'storeName',
          field: row => row.stores.storeName,
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'ownerName',
          field: row => row.stores.ownerName,
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.stores.phone),
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'address',
          field: row => row.stores.address,
          label: this.$t('xshop_captions.l_pasport'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'modifyDate',
          field: row => row.modifiedDate,
          label: this.$t('xshop_captions.l_update_date'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'createdDate',
          field: row => row.createdDate,
          label: this.$t('xshop_captions.l_created_date'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'modifyBy',
          field: row => row.modifiedBy,
          label: "Ўзгартирган фойдаланувчи",
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'createdBy',
          field: row => row.createdBy,
          label: 'Яратган фойдаланувчи',
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Амаллар", style: 'width: 1rem'},
      ],
      data: [],
      regions: [],
      customers: [],
      products: [],
      productData: [],
      model: 1,
      totalTradeAmount: 0
    }
  },
  computed: {
    pagesNumber() {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    },
    user() {
      return this.getUser()
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),

    rowEdit(row) {
      this.$set(this.bean, 'id', row.id);
      this.$set(this.bean, 'amount', row.amount);
      this.$set(this.bean, 'price', row.price);
      this.$set(this.bean, 'productsId', row.products.id);
      this.$set(this.bean, 'storesId', row.stores.id);
      this.$set(this.bean, 'userTradesId', row.userTrades.id);
      this.showForm();
    },

    getProducts() {
      this.$axios.get(urls.PRODUCTS + '/all')
        .then(res => {
          this.products.splice(0, this.products.length, ...res.data)
        }).catch(err => {
        this.showError(err)
      }).finally(() => {
      })
    },
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval - 1);
    }
  },
  mounted() {
    this.getProducts();
  }
}
</script>

<style lang="scss">
#print {
  display: none;
}

</style>

