

canvas.style.width = window.innerWidth//获取屏幕实际宽度
canvas.style.height = window.innerHeight//获取屏幕实际高度
canvas.width = window.innerWidth * window.devicePixelRatio//真实的像素宽度
canvas.height = window.innerHeight * window.devicePixelRatio//真实的像素高度
let ctx = canvas.getContext('2d')
var currentNum=1
let len = 60 * window.devicePixelRatio
let btnAreas = []
let ctime=0
/**
 * 游戏主函数
 * ____将分数部分renderGameScore调整成帧循环，计时，高效刷新
 */
export default class Main {
  constructor() {
    // 初始化事件监听
    this.initEvent()
    // 维护当前requestAnimationFrame的id
    this.render()
    // 开始计时
    // setInterval(this.renderGameScore.bind(this,ctx), 200)
  }


  renderGameScore(ctx) {
    ctx.fillStyle = "#333333"
    ctx.font = "40px Arial"
    ctime=ctime+200
    var score='   时间：'+' '+ctime
    console.info({ score,ctime})
    ctx.fillText(
      score,
      10,
      200
    )
  }
  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */

  render() {
    let numl = this.shuffle()
    ctx.fillStyle = '#f1f1f1' // 矩形颜色
    console.info(window)
    ctx.fillRect(10, 10, canvas.width -20, canvas.height-20)
    ctx.fillStyle = '#333333' // 字体颜色
    var fontSize = 30 * window.devicePixelRatio+'px'
    var fontFamily = 'SemHei'
    ctx.font = 'italic bold normal ' + fontSize + ' ' + fontFamily
    ctx.fillText("舒尔特注意力训练", 60 * window.devicePixelRatio, 30 * window.devicePixelRatio)
    ctx.fillStyle = '#333333' // 字体颜色
    ctx.font = 'italic bold normal ' + fontSize + ' ' + fontFamily

    console.info(len)
    let i=0
  
    for (let y = 1; y <6 ;y++)
    {
      for (let x=1;x<6;x++)
      { 
        ctx.strokeRect(len*x-20,len*y+40,len,len)
        // 记录每个数字对应的触摸地址，
        btnAreas[numl[i]] = {
          startX: len * x - 20 ,
          startY: len * y + 40 ,
          endX: len * x - 20 +len ,
          endY: len * y + 40 +len
          }
        ctx.fillText(numl[i], len * x-10, len * (y+1))
        i=i+1
      }
    }
    // console.info(btnAreas)
  }
  shuffle() {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    var length = arr.length,
      randomIndex,
      temp;
    while (length) {
      randomIndex = Math.floor(Math.random() * (length--));
      temp = arr[randomIndex];
      arr[randomIndex] = arr[length];
      arr[length] = temp
    }
    return arr;
  }
 
  /**
     * 玩家响应手指的触摸事件
     *
     */
  initEvent() {
    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      console.info(e)
      // 手指离开时判断是否正确，正确则标色，错误则提示失败
      let x = e.changedTouches[0].clientX * window.devicePixelRatio
      let y = e.changedTouches[0].clientY * window.devicePixelRatio
      //
      if (currentNum<26) {
        this.checkNum(x, y)

      }
      else
      {
        
      }

    }).bind(this))
  }
// 
  checkNum(x,y)
  {
    // area 取正确数字的地址
    // var curindex = Math.floor(currentNum)
    var area = btnAreas[currentNum]
    console.info({ area,x,y})
    if (
      x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY 
    )
    {
      currentNum=currentNum+1
      console.info(currentNum)
      // 颜色设置，必须放在绘制之前
      ctx.strokeStyle = '#8dc63f' // 矩形颜色
      // 线宽设置，必须放在绘制之前
      ctx.lineWidth = 16;
      ctx.clearRect(area.startX, area.startY,len,len)
      return true
    }
    
  }
// 
  setNumcolor()
  {

  }

}