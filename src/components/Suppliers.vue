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

      <template v-slot:body-cell-modifyDate="props">
        <q-td :props="props">
          <div v-if="props.row.modifiedDate">
            {{$dateutil.formatDate(props.row.modifiedDate, 'DD.MM.YYYY')}}
          </div>
          <div v-else>
            --.--.----
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-createdDate="props">
        <q-td :props="props">
          {{$dateutil.formatDate(props.row.createdDate, 'DD.MM.YYYY')}}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="sm" dense color="warning" icon="mdi-eye" @click.stop="goTrades({id: props.row.id, tab: '2'})" class="q-mr-xs">
            <q-tooltip content-class="bg-secondary">
              {{$t('xshop_captions.l_show_trades')}}
            </q-tooltip>
          </q-btn>
          <q-btn v-if="getUser().user.roles.id === 1" size="sm" dense color="positive" icon="mdi-table-eye" @click.stop="goTrades({id: props.row.id, tab: '3'})" class="q-mr-xs">
            <q-tooltip content-class="bg-secondary">
              Tranzaksiyalarni ko'rish
            </q-tooltip>
          </q-btn>
          <q-btn v-if="getUser().user.roles.id === 1" size="sm" dense color="secondary" icon="edit" @click.stop="rowEdit(props.row)" class="q-mr-xs">
            <q-tooltip content-class="bg-secondary">
              {{$t('system.edit')}}
            </q-tooltip>
          </q-btn>
          <q-btn v-if="getUser().user.roles.id === 1" size="sm" dense color="negative" icon="delete" @click.stop="rowDelete(props.row)" class="q-mr-sm">
            <q-tooltip content-class="bg-negative">
              {{$t('system.delete')}}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>


      <template v-slot:top="props">
        <q-input v-model="filter.fullName"
                 :label="$t('xshop_captions.l_fio')"
                 class="q-pa-md col-3" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter.fullName" name="close" color="primary" @click.stop="filter.fullName = ''"
                    class="cursor-pointer"/>
          </template>
        </q-input>
        <q-input v-model="filter.phone"
                 :label="$t('xshop_captions.l_phone')"
                 mask="+### (##) ### ## ##"
                 unmasked-value
                 fill-mask
                 outlined
                 class="q-pa-md col-3" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-space/>
        <q-btn icon="refresh" class="q-mr-sm bg-primary text-white" @click="refreshTable" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('xshop_captions.l_refresh') }}
          </q-tooltip>
        </q-btn>

        <q-btn v-if="getUser().user.roles.id===1 || getUser().user.roles.id===4" icon="add" class="bg-primary text-white" @click="rowAdd" dense>
          <q-tooltip content-class="bg-primary">
            {{ $t('system.add') }}
          </q-tooltip>
        </q-btn>
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
    <standart-input-dialog v-model="formDialog" :model-id="bean.id" :on-submit="onSubmit"
                           :on-validation-error="onValidationError" :loading="loading">

      <div class="row">
        <q-input v-model="bean.fullName"
                 :label="$t('xshop_captions.l_fullname')"
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.phone"
                 :label="$t('xshop_captions.l_phone')"
                 mask="+### (##) ### ## ##"
                 unmasked-value
                 fill-mask
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.passportSeries"
                 :label="$t('xshop_captions.l_p_seria')"
                 class="q-pa-md q-pr-none col-5 col-md-3" dense
                 mask="AA"
                 hint="AA">
        </q-input>
        <q-input v-model="bean.passportNumber"
                 :label="$t('xshop_captions.l_p_number')"
                 class="q-pa-md q-pl-none col-7 col-md-9" dense
                 mask="#######"
                 hint="1234567">
        </q-input>
      </div>

    </standart-input-dialog>

  </div>
</template>

<script>
import {urls} from 'src/utils/constants';
import {mapGetters, mapMutations} from 'vuex';
import {mapState} from 'vuex';
import StandartTable from "src/mixins/StandartTable";
import StandartInputDialog from "components/base/StandartInputDialog";

export default {
  name: "Suppliers",
  components: {StandartInputDialog},
  mixins: [StandartTable],
  data() {
    return {
      apiUrl: urls.SUPPLIERS,
      loading: false,
      rowKey: 'id',
      selectedRows: [],
      bean: {},
      cardCheckField: 'name',
      beanDefault: {
        id: null,
        fullName: '',
        phone: '',
        passportSeries: '',
        passportNumber: null,
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        descending: false,
        fullName: "",
        phone: ""
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
          label: this.$t('xshop_captions.l_fio'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.phone),
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,

          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'passport',
          field: row => `${row.passportSeries} ${row.passportNumber}`,
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
        {name: 'actions', align: 'center', label: "Амаллар", style:'width: 1rem'},
      ],
      data: [],
      model: 1
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {

    ...mapGetters([
      'getUser'
    ]),

    goTrades(val) {
      this.$emit('goTab', val)
    }
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
