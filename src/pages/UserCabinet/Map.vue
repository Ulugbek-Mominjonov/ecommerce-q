<template>
  <div class="fit full-height">
    <div class="row">
      <div class="col-6 flex flex-center full-height">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque eos ipsum modi quia, vel veritatis voluptatem. Amet aperiam consequatur, deserunt dolorem eius eos error esse, excepturi fugit illum inventore iste magni necessitatibus nemo pariatur perspiciatis quas qui recusandae repudiandae sed ullam voluptas voluptatibus voluptatum! Ad blanditiis deleniti labore obcaecati odit optio quasi saepe similique voluptatum! Accusantium at, corporis deleniti deserunt eaque earum, est et iste laudantium libero magnam, mollitia neque odit omnis perferendis praesentium repellat tempora unde? Aspernatur consectetur consequuntur debitis delectus dicta dignissimos dolor ducimus facilis harum hic laborum laudantium modi molestiae nam nesciunt nisi odit porro provident quae quis repellendus reprehenderit soluta totam ut, vero. A corporis ea et harum illo, incidunt iure laudantium nemo officiis possimus quas quasi tenetur voluptates! Blanditiis commodi consectetur, corporis, cum dignissimos doloremque excepturi fugiat incidunt itaque maxime modi nobis optio quaerat quasi sequi similique sunt tempora tenetur unde vero? Alias aliquid architecto beatae consequatur debitis delectus dolor, dolores eum explicabo id ipsam labore laudantium nobis officia omnis quis rem tenetur voluptates. Accusantium aut cumque cupiditate dolor dolores, error excepturi exercitationem fugit incidunt itaque iusto laboriosam molestiae nam neque perspiciatis, porro quae quia quod repellat repudiandae sapiente, similique sit tempore unde vitae voluptatem!
      </div>
      <div class="col-6 q-mt-lg">
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
  </div>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';


export default {
  name: "Map",
  components: {yandexMap, ymapMarker},
  data() {
    return {
      coords: [
        54.82896654088406,
        39.831893822753904,
      ],
    }
  },
  methods: {
    onClick(e) {
      this.coords = e.get('coords');
    },
  },
}
</script>

<style>

</style>
