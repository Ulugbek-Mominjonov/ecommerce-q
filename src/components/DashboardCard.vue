<template>
  <div class="card">
    <div class="card-body">
      <div class="card-left">
        <div class="card-title">{{title}}</div>
        <div class="card-content">
          <span class="card-content-value">{{getValue}}</span>
          <small>сўм</small>
        </div>
      </div>
      <div class="card-icon">
        <q-icon :name="icon" color="white" size="20px"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    title: {
      type: String
    },
    value: {
      type: Number
    },
    icon: {
      type: String
    }
  },
  computed: {
    getValue() {
      return this.formatPrice(this.value)
    }
  },
}
</script>

<style lang="scss" scoped>
  .card {
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 17%);
    margin: 0;
    padding: 0;
    color: rgba(0,0,0,.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    background: #fff;
    transition: all .3s;
    border: 1px solid #c1c1c1;

    &-body {
      padding: 16px;
      position: relative;
      zoom: 1;
    }
    &-left {
      color: #52c41a;
      margin-right: 45px;
      box-sizing: border-box;
      padding: 0;
      color: rgba(0,0,0,.65);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5;
      list-style: none;
      font-feature-settings: "tnum";
    }
    &-icon {
      width: 33px;
      height: 33px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 16px;
      margin: auto;
      background-color: #344767;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-title {
      font-family: open sans,Helvetica,Arial,sans-serif;
      font-weight: 600;
      color: #8c8c8c;
      font-size: 14px;
      margin-bottom: 4px;
    }
    &-content {
      font-family: open sans,Helvetica,Arial,sans-serif;
      font-weight: 700;
      color: inherit;
      font-size: 1em;
      line-height: 25px;

      &-prefix {
        display: inline-block;
        color: #141414;
      }
      &-value {
        color: #141414;
      }
      small {
        font-size: 14px;
        margin-left: 5px;
      }
    }
  }
</style>
