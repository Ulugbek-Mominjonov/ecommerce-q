<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="row">
    <div class="col-7">
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
        @row-click="singleRowClick"
        :dense="$q.screen.lt.md"
        :grid="$q.screen.xs"
        class="sticky-first-column-table sticky-last-column-table q-mt-lg"
        style="height: calc(100vh - 150px)"
      >
        <template v-slot:no-data="props">
          {{$t('system.no_matching_found')}}
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
            <q-btn size="sm" dense color="secondary" icon="edit" @click.stop="rowEdit(props.row)" class="q-mr-xs">
              <q-tooltip content-class="bg-secondary">
                {{$t('system.edit')}}
              </q-tooltip>
            </q-btn>
            <q-btn size="sm" dense color="negative" icon="delete" @click.stop="rowDelete(props.row)" class="q-mr-sm">
              <q-tooltip content-class="bg-negative">
                {{$t('system.delete')}}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>


        <template v-slot:top="props">
          <q-input v-model="filter.storeName" placeholder="Do'kon manzili"
                   label="Do'kon manzili"
                   class="q-pa-sm col-3" dense outlined>
            <template v-slot:append>
              <q-icon v-if="filter.storeName" name="close" color="primary" @click.stop="filter.storeName = ''"
                      class="cursor-pointer"/>
            </template>
          </q-input>

          <q-input v-model="filter.ownerName" placeholder="Do'kon egasi"
                   label="Do'kon egasi"
                   class="q-pa-sm col-3" dense outlined>
            <template v-slot:append>
              <q-icon v-if="filter.ownerName" name="close" color="primary" @click.stop="filter.ownerName = ''"
                      class="cursor-pointer"/>
            </template>
          </q-input>

          <q-input v-model="filter.phone" placeholder="Telefon nomer"
                   label="Do'kon egasi"
                   mask="+### (##) ### ## ##"
                   unmasked-value
                   fill-mask
                   class="q-pa-sm col-3" dense outlined>
            <template v-slot:append>
              <q-icon v-if="filter.phone" name="close" color="primary" @click.stop="filter.phone = ''"
                      class="cursor-pointer"/>
            </template>
          </q-input>
          <q-space/>
          <q-btn icon="refresh" class="q-mr-sm bg-primary text-white" @click="refreshTable" dense>
            <q-tooltip content-class="bg-primary">
              {{ $t('xshop_captions.l_refresh') }}
            </q-tooltip>
          </q-btn>

        </template>

        <!--      <template v-slot:item="props">-->
        <!--        <div-->
        <!--          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"-->
        <!--        >-->
        <!--          <q-card :class="props.selected ? 'row-selected' : ''">-->
        <!--            <q-card-section>-->
        <!--              <q-checkbox dense v-model="props.selected" :label="props.row[cardCheckField]"/>-->
        <!--            </q-card-section>-->
        <!--            <q-separator/>-->
        <!--            <q-list dense>-->
        <!--              <q-item v-for="col in props.cols.filter(col_ => col_.name !== actionsColumnName)" :key="col.name">-->
        <!--                <q-item-section>-->
        <!--                  <q-item-label>{{ col.label }}</q-item-label>-->
        <!--                </q-item-section>-->
        <!--                <q-item-section side>-->
        <!--                  <q-item-label caption>{{ col.value }}</q-item-label>-->
        <!--                </q-item-section>-->
        <!--              </q-item>-->
        <!--            </q-list>-->
        <!--            <q-separator/>-->
        <!--            <q-card-section class="row justify-end"-->
        <!--                            v-if="props.cols.filter(col => col.name === actionsColumnName).length>0">-->
        <!--              <q-btn size="sm" dense color="secondary" icon="edit" @click.stop="rowEdit(props.row)" class="q-mr-xs">-->
        <!--              </q-btn>-->
        <!--              <q-btn size="sm" dense color="negative" icon="delete" @click.stop="rowDelete(props.row)" class="q-mr-sm">-->
        <!--              </q-btn>-->
        <!--            </q-card-section>-->

        <!--          </q-card>-->
        <!--        </div>-->
        <!--      </template>-->
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
    <div class="col-5 q-pt-lg q-pl-md">
      <q-toolbar class="bg-primary text-white shadow-2 col-12" style="min-height: 40px !important;">
        <q-toolbar-title class="text-subtitle1">Do'kon joylashuvi</q-toolbar-title>
      </q-toolbar>
      <div style="width: 100%; height: calc(100% - 40px); overflow: hidden">
        <yandex-map
          :coords="coords"
          :zoom="10"
          @click="onClick"
        >
          <ymap-marker
            :coords="coords"
            marker-id="123"
            hint-content="some hint"
          />
        </yandex-map>
      </div>
    </div>

    <!--DIALOG-->
    <standart-input-dialog v-model="formDialog" :model-id="bean.id" :on-submit="onSubmit"
                           :on-validation-error="onValidationError">

      <div class="row">
        <q-input v-model="bean.fullName" :placeholder="$t('xshop_captions.l_fullname')"
                 :label="$t('xshop_captions.l_fullname')"
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.phone" :placeholder="$t('xshop_captions.l_phone')"
                 :label="$t('xshop_captions.l_phone')"
                 mask="+### (##) ### ## ##"
                 unmasked-value
                 fill-mask
                 class="q-pa-md col-12 col-md-6" dense
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.passportSeries" :placeholder="$t('xshop_captions.l_p_seria')"
                 :label="$t('xshop_captions.l_p_seria')"
                 class="q-pa-md q-pr-none col-5 col-md-3" dense
                 mask="AA"
                 hint="AA"
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>
        <q-input v-model="bean.passportNumber" :placeholder="$t('xshop_captions.l_p_number')"
                 :label="$t('xshop_captions.l_p_number')"
                 class="q-pa-md q-pl-none col-7 col-md-9" dense
                 mask="#######"
                 hint="1234567"
                 lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]">
        </q-input>

        <q-select
          v-model="bean.workerTypesId"
          emit-value
          map-options
          :options="workerTypes"
          option-value="id"
          option-label="nameUz"
          :label="$t('xshop_captions.l_worker_type')"
          transition-show="flip-up"
          transition-hide="flip-down"
          class="q-pa-md col-xs-12 col-sm-12 col-md-12 col-lg-12" dense
          lazy-rules :rules="[val => !!val || this.$t('system.field_is_required')]"
        >
          <template v-slot:append>
            <q-icon name="close" color="primary" @click.stop="bean.workerTypesId = null"
                    class="cursor-pointer"/>
          </template>
          <template v-slot:selected-item="props">
            <div>{{props.opt.nameUz}}</div>
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
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

export default {
  name: "Stores",
  components: {StandartInputDialog, yandexMap, ymapMarker},
  mixins: [StandartTable],
  data() {
    return {
      coords: [
        54.82896654088406,
        39.831893822753904,
      ],
      apiUrl: urls.STORES,
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
        workerTypesId: null
      },
      formDialog: false,
      filter: {
        page: 0,
        rowsPerPage: 5,
        rowsNumber: 0,
        descending: false,
        storeName: "",
        ownerName: "",
        phone: "",
      },
      columns: [
        {
          name: 'id',
          field: 'id',
          label: this.$t('xshop_captions.l_id'),
          sortable: true, align: 'left',
          classes: '1rem'
        },

        {
          name: 'storeName',
          field: row => row.storeName,
          label: "Do'kon nomi",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1 text-bold',
        },
        {
          name: 'address',
          field: row => row.address,
          label: "Do'kon manzili",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'ownerName',
          field: row => row.ownerName,
          label: "Do'kon egasi",
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'phone',
          field: row => this.phone_format(row.phone),
          label: this.$t('xshop_captions.l_phone'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },

        {
          name: 'modifyDate',
          field: row => row.modifiedDate,
          label: this.$t('xshop_captions.l_update_date'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {
          name: 'createdDate',
          field: row => row.createdDate,
          label: this.$t('xshop_captions.l_created_date'),
          format: val => `${val}`,
          sortable: true,
          align: 'left',
          classes: 'col-1',
        },
        {name: 'actions', align: 'center', label: "Harakatlar", style:'width: 1rem'},
      ],
      data: [],
      regions: [],
      workerTypes: [],
      model: 1
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.filter.rowsNumber / this.filter.rowsPerPage)
    }
  },
  methods: {
    onClick(e) {
      this.coords = e.get('coords');
    },
    getWorkerTypes() {
      this.$axios.get(urls.WORKER_TYPES + '/all')
        .then(res => {
          console.log(res)
          this.workerTypes.splice(0, this.workerTypes.length, ...res.data)
        }).catch(err => {
          this.showError(err)
      }).finally(() => {})
    },

    rowEdit(row) {
      for (let k in row) {
        this.$set(this.bean, k, row[k]);
      }
      this.$set(this.bean, 'workerTypesId', row.workerTypes.id);
      this.showForm();
    },
    singleRowClick(evt, row) {
      const table = this.$refs.table;
      if (table.selected.shift() == row) {
        table.selected.shift()
        this.coords = []
        this.coords.push(row.latitude, row.longitude)
        console.log(1)
      } else {
        table.selected.push(row)
        console.log(2)
      }
    },
  },
  watch: {
    model(newval) {
      this.$set(this.filter, 'page', newval-1);
    }
  },
  mounted() {
    this.getWorkerTypes()
  }
}
</script>
