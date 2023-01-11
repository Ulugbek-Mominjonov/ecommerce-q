<template>
  <q-dialog :value="value" @input="updateValue($event)" persistent
            transition-show="jump-up"
            transition-hide="jump-down"
  >
    <q-card>
      <q-bar class="bg-indigo text-white">

        <div class="cursor-pointer text-white">{{modelId===null?this.$t('system.new'):this.$t('system.edit')}}</div>
        <q-space/>
        <q-btn dense flat icon="close" v-close-popup class="q-px-none">
          <q-tooltip content-class="bg-indigo text-white">{{$t('system.l_close')}}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-form ref="editForm" @submit="onSubmit" @validation-error="onValidationError">
        <q-card-section class="q-pa-sm">

          <slot></slot>

        </q-card-section>
        <q-separator color="secondary"/>
        <q-card-actions align="right" class="q-pa-sm">
          <div class="q-pa-md q-gutter-md">
            <q-chip dense square size="10" :color="modelId?'primary':'accent'" text-color="white" icon="mdi-key"
            >
              {{this.$t('captions.l_id')+': '+(modelId===null?this.$t('system.new'):modelId)}}
            </q-chip>
          </div>
          <q-space/>
          <q-btn flat :label="$t('system.l_cancel')" class="text-secondary" v-close-popup/>
          <q-btn :loading="loading" flat :label="$t('system.l_save')" class="text-secondary text-bold" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>


export default {
  name: 'StandartInputDialog',
  props: {
    value: {type: Boolean},
    loading: {
      type: Boolean,
      default: false
    },
    modelId: {type: Number},
    onSubmit: {type: Function},
    onValidationError: {type: Function},
  },
  data() {
    return {}
  },
  methods: {
    updateValue: function (ev) {
      this.$emit('input', ev);
    },
  },
  computed: {}
}
</script>
