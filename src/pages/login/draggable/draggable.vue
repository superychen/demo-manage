<template>
  <div>
<!--    <draggable class="list-group" tag="ul" v-model="lists" :move="onMove" @start="isDragging=true"-->
<!--               @end="isDragging=false">-->
<!--      <transition-group type="transition" :name="'flip-list'">-->
<!--        <li class="list-group-item" v-for="(item) in lists" :key="item.id">-->
<!--          {{item}}-->
<!--        </li>-->
<!--      </transition-group>-->
<!--    </draggable>-->
    <div style="background-color: red; width: 500px;height: 300px;"></div>

<!--    <draggable class="list-group" v-model="demo2" :move="onMove" @start="isDragging=true" @end="isDragging=false">-->
<!--      <div style=" background-color: green; width: 100px;height: 50px;">先拖动这个</div>-->
<!--      &lt;!&ndash;      <div style="background-color: salmon; width: 100px;height: 50px;">再拖动这个</div>&ndash;&gt;-->
<!--    </draggable>-->

    <div id="app" @mousedown="move">       <!--绑定按下事件-->
      {{positionX}}
      {{positionY}}
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: "draggablevue",
    components: {
      draggable,
    },
    data() {
      return {
        lists: [{
          id: 1,
          name: 'nihao',
        }, {
          id: 2,
          name: '222222222',
        }, {
          id: 3,
          name: '3333333333'
        }],
        isDragging: false,

        demo2: ['sdfa', 'fdsafer', '51354'],
        positionX: 0,
        positionY: 0,
      }
    },
    methods: {
      onMove({relatedContext, draggedContext}) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        console.log(relatedContext);
        console.log(draggedContext);
        return (
          (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        );
      },

      move(e) {
        let odiv = e.target;        //获取目标元素

        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        console.log(disX + "----"+ disY);
        document.onmousemove = (e) => {       //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;
          let top = e.clientY - disY;

          //绑定元素位置到positionX和positionY上面
          this.positionX = top;
          this.positionY = left;

          //移动当前元素
          odiv.style.left = left + 'px';
          odiv.style.top = top + 'px';
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
  }
</script>

<style scoped>
  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .list-group {
    min-height: 20px;
  }

  .list-group-item {
    cursor: move;
  }

  .list-group-item i {
    cursor: pointer;
  }

  #app {
    position: absolute; /*定位*/
    top: 10px;
    left: 10px;
    width: 200px;
    height: 200px;
    background: #666; /*设置一下背景*/
  }
</style>
