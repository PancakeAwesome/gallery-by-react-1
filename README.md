# 图片画廊web单页APP
> **功能**：图片特效展示与动画切换。  
> ([MaterLiu老师慕课上的react实战课程](http://www.imooc.com/learn/507))  
> 视频实在太久远，我尽量总结在课程中遇到的问题，希望可以有所帮助！

## 项目说明
* 构建工具 [Yeoman](http://yeoman.io/)
* 脚手架 [generator-react-webpack](https://github.com/react-webpack-generators/generator-react-webpack)
* SCSS编译 [autoprefixer](https://github.com/postcss/autoprefixer) 
* 技术栈 React + Webpack + SCSS

## 踩坑总结
* 新版generator-react-webpack生成的工程环境移除了grunt，运行命令`npm run start`  
* 以往webpack.config.js的配置内容在cfg/default.js中配置  
* 生成dist目录内容 `npm run clean` `npm run copy` `npm run start`  
* 构建出的工作环境webpack默认版本为1.x，不包含json-loader.  
   解析.json文件一种解决办法是安装json-loader，并在default.js中配置。[json-loader](https://github.com/webpack-contrib/json-loader)  
   另一种解决办法是全局安装webpack2.x及以上版本，自带有json-loader `npm install -g webpack@2.x`  
   **注：require时都必须加上json!前缀**
* 需自行安装sass-loader，安装参考[sass-loader](https://github.com/webpack-contrib/sass-loader)  
  (**注：不要安装最新版本的sass**，会出现版本依赖错误，可以参考安装node-sass4.x和sass-loader3.x版本，我尝试过不会出现错误)
* react需更新组件时是通过DOM与virtual DOM的对比来实现，如果有变化就重新渲染，因此在每次forEach循环添加节点都应给组件添加一个key，以优化对比
* 图标字体可以在[阿里开源图标库](http://www.iconfont.cn/)下载代码，在文件中有对应图标的Unicode码
* 用styleObj对象为组件添加样式时注意一定要使用驼峰命名规则
* 关于inverse和center使用闭包函数的原因，这两个函数都调用到了图片数组下标index，跟随对象的初始化保存，避免被JavaScript的垃圾回收机制回收。
