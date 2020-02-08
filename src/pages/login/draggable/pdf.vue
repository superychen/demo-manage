<template>
  <div>
    <div id="showPdf" style="width: 60%; margin-left: 20%; float: left;">
      <el-scrollbar ref="elscrollbar" style="height: 1200px; overflow-y: hidden;">
        <div class="position page">
          <span class="span_1" @click="pageUp">上一页</span>
          <span>页码：{{`${pageNo}/${totals.length}`}}</span>
          <span class="span_2" @click="pageDown">下一页</span>
        </div>
        <div class="position info">
          <span class="span_1">上传者：{{pdfInfo.updateBy}}</span>
          <span>上传时间：{{pdfInfo.updateOn}}</span>
          <span class="span_2">附件编号：{{pdfInfo.workNo}}</span>
        </div>
        <div class="main_content" id="mainContent" ref="mainContent">
          <div v-for="item in totals" :id="`page-${item}`" :key="item" class="pdf-box">
            <canvas :id="'canvas-pdf-' + item" class="canvas-pdf"></canvas>
          </div>
        </div>
      </el-scrollbar>

      <vue-draggable-resizable
        v-if="isSeal"
        :w="150"
        :h="150"
        :x="50"
        :y="50"
        :resizable="false"
        :parent="true"
        :grid="[10,10]"
        class-name="dragging1"
        @dragging="onDrag"
        @resizing="onResize"
      >
        <!--        <p>-->
        <!--          你好！ 我是一个灵活的组件。 你可以拖我四处，你可以调整我的大小。-->
        <!--          <br/>-->
        <!--          X: {{ x }} / Y: {{ y }} - Width: {{ width }} / Height: {{ height }}-->
        <!--        </p>-->
        <img :src="sealUrl" alt="印章">
      </vue-draggable-resizable>
    </div>
    <div class="" style="position: fixed; right: 5%; top: 15px;">
      <el-button @click="isShowSeal" type="primary">显示章</el-button>
      <el-button @click="saveSign" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
  import PDFJS from 'pdfjs-dist'
  import axios from 'axios'
  import {TextLayerBuilder} from 'pdfjs-dist/web/pdf_viewer'
  import 'pdfjs-dist/web/pdf_viewer.css'

  export default {
    name: 'pdf',
    props: ['pdfUrl'],
    data() {
      return {
        scale: 1.2,
        totals: [],
        pageNo: 1,
        viewHeight: 0,
        scrollbar: '',
        pdfInfo: {
          updateBy: 'cqyc',
          updateOn: new Date(),
          workNo: '500240',
        },
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        //
        signUrl: "pdfs/group1/M00/00/00/wKjkM13onnWAVRgEAAU8B7_39zQ690.pdf",
        isSeal: false, //印章是否显示
        //印章图片路径，先写死　
        sealUrl: "pdfs/group1/M00/00/00/wKgAZ14AXueAIuRDAAAVlBUVF0Q788.jpg",
      }
    },
    mounted() {
      this.scrollbar = this.$refs['elscrollbar'].$refs['wrap']
      this.scrollbar.addEventListener('scroll', this.scrollfun, false)
      this.getMainContentWidth()
      this.getPdfFun()
    },
    methods: {
      // 当PDF地址跨域时，后台以流的形式传输PDF
      getPdfFun() {
        axios({
          method: 'get',
          url: this.signUrl,
          data: {},
          responseType: 'blob'
        }).then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          this.renderPdf(url);
        })
      },
      getMainContentWidth() {
        let div = this.$refs.mainContent
        let width = window.getComputedStyle(div).width
        this.contentWidth = parseInt(width)
      },
      renderPdf(pdfUrl) {
        PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.min')
        PDFJS.getDocument(pdfUrl).then(pdf => {
          let totalPage = pdf.numPages
          let idName = 'canvas-pdf-'
          this.createCanvas(totalPage, idName)
          for (let i = 1; i <= totalPage; i++) {
            pdf.getPage(i).then((page) => {
              let pageDiv = document.getElementById(`page-${i}`)
              // let viewport = page.getViewport(scale)
              let viewportFirst = page.getViewport(1)
              // 计算 scale值，this.contentWidth 为 ref = mainContent 的元素的宽度
              let scale = this.contentWidth / viewportFirst.width
              let viewport = page.getViewport(scale)
              let canvas = document.getElementById(idName + i)
              let context = canvas.getContext('2d')
              canvas.height = viewport.height
              canvas.width = viewport.width
              this.viewHeight = viewport.height
              let renderContext = {
                canvasContext: context,
                viewport
              }
              page.render(renderContext).then(() => {
                return page.getTextContent()
              }).then((textContent) => {
                // 创建文本图层div
                const textLayerDiv = document.createElement('div')
                textLayerDiv.setAttribute('class', 'textLayer')
                // 将文本图层div添加至每页pdf的div中
                pageDiv.appendChild(textLayerDiv)
                // 创建新的TextLayerBuilder实例
                let textLayer = new TextLayerBuilder({
                  textLayerDiv: textLayerDiv,
                  pageIndex: page.pageIndex,
                  viewport: viewport
                })
                textLayer.setTextContent(textContent)
                textLayer.render()
              })
            })
          }
        })
      },
      createCanvas(totalPages) {
        for (let i = 1; i <= totalPages; i++) {
          this.totals.push(i)
        }
      },
      /**
       * 分页
       */
      scrollfun(e) {
        let scrollTop = e.target.scrollTop
        if (scrollTop === 0) {
          this.pageNo = 1
        } else {
          this.pageNo = Math.ceil((scrollTop + 15) / this.viewHeight)
        }
      },
      /**
       * 上一页
       */
      pageUp() {
        let totalPages = this.totals.length;
        if (this.pageNo > 0) {
          this.scrollbar.scrollTop = (this.pageNo - 2) * (this.scrollbar.scrollHeight / totalPages)
        }
      },
      /**
       * 下一页
       */
      pageDown() {
        let totalPages = this.totals.length
        if (this.pageNo < totalPages) {
          this.scrollbar.scrollTop = this.pageNo * (this.scrollbar.scrollHeight / totalPages)
        }
      },

      //扩大时的操作
      onResize: function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      },
      onDrag: function (x, y) {
        this.x = x;
        this.y = y;
      },

      //签约
      saveSign() {
        let pdfUpload = {
          fileId: this.signUrl,//pdf的地址，需要去除pdfs
          fileImg: this.sealUrl, //图片地址
          pageNo: this.pageNo, //pdf当前页
          offsetX: parseFloat("300.0"),
          offsetY: parseFloat("300.0"),
        };
        console.log(this.pageNo);
        this.$axios.post('/apis/management/file/pdf/upload', pdfUpload).then(res => {
          console.log(res.data);
        }).catch(err => {
          console.log(err.response);
        })
      },
      isShowSeal() {
        //显示印章
        this.isSeal = true;
      }
    }
  }
</script>

<style lang="scss">
  #showPdf {
    .position {
      position: absolute;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 100;
      padding: 0 15px;
      line-height: 25px;
      color: #fff;

      .span_1 {
        float: left;
      }

      .span_2 {
        float: right;
      }
    }

    .page {
      bottom: 0;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      .span_1 {
        cursor: pointer;
      }

      .span_2 {
        cursor: pointer;
      }
    }

    .info {
      top: 0;
    }

    .pdf-box {
      width: 60%;
      position: relative;
      text-align: left;
      display: inline-block;
    }

    .dragging1 {
      margin-left: 20%;
    }
  }
</style>
