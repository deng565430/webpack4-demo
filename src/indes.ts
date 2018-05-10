const f = () => {
  const b = 2
  console.log(b)
}
import {render as dd} from 'react-dom'

console.log(f)
// 还需要在主要的js文件里写入下面这段代码
if (module.hot) {
  // 实现热更新
  module.hot.accept()
}
