require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('json!../data/imageDatas.json');
// 利用自执行函数，将图片信息转成图片URL路径的信息
imageDatas = (function genImageURL(imageDatasArr) {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }

  return imageDatasArr;
})(imageDatas);

/**
 * 获取区间内的随机值
 * @param low 小值
 * @param high 大值
 */
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

var ImgFigure = React.createClass({
  render: function() {
    
    var styleObj = {};

    // 如果props属性中指定了图片的位置则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
});

var AppComponent = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: { // 水平方向取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0,0]
    }
  },

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount: function() {
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 取得ImgFigure大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中间区域图片排布的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左、右侧图片排布区域的位置
    this.Constant.hPosRange = {
      leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
      rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
      y: [-halfImgH, stageH - halfImgH]
    };

    // 计算上侧区域图片排布的位置
    this.Constant.vPosRange = {
      topY: [-halfImgH, halfStageH - halfImgH * 3],
      x: [halfStageW - imgW, halfStageW]
    };

    this.rearrange(0);
  },

  /**
   * 重新布局图片
   * @param centerIndex 指定居中排布图片的下标
   */
  rearrange: function(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),  // 取一个或者不取
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

      // 首先居中centerIndex图片
      imgsArrangeCenterArr[0].pos = centerPos;

      // 取出要布局上侧的图片的状态信息
      topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

      // 布局上侧图片
      imgsArrangeTopArr.forEach(function(value, index) {
        value.pos = {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[0]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        }
      });

      // 布局两侧图片
      for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; ++i) {
        var hPosRangeLORX = null;
        
        // 左边/右边
        if (i < k) {
          hPosRangeLORX = hPosRangeLeftSecX;
        } else {
          hPosRangeLORX = hPosRangeRightSecX;
        }

        imgsArrangeArr[i].pos = {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        }
      }

      if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
      }

      imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
  },

  getInitialState: function() {
    return {
      imgsArrangeArr: []
    };
  },

  render() {
    var controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function(value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }

      imgFigures.push(<ImgFigure data={value}
        ref={'imgFigure' + index}
        arrange={this.state.imgsArrangeArr[index]} />);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
            {imgFigures}
        </section>
        <nav className="controller-nav">
           {controllerUnits}
        </nav>
      </section>
    );
  }
});

export default AppComponent;
