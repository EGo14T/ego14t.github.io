---
title: Vue-Day01
date: 2019-07-22 10:05:00
tags:
categories: 
  - Vue笔记
---
# Vue 笔记&ensp;Day1
## Vue指令
1. &#123;&#123;&#125;&#125;&ensp;&ensp;&ensp;&ensp;插值表达式会去data里寻找插值表达式中的变量对应的值
2. v-cloak&ensp;&ensp;&ensp;&ensp;可以解决插值表达式闪烁的问题
<!--more-->
3. v-text&emsp;&ensp;&ensp;&ensp;把msg1解析成字符串输出 
```html 
v-text="msg1"
```

4. v-html&emsp;&ensp;&ensp;&ensp;把msg2当作html语句进行输出 
```html
v-html="msg2"
```

5. v-bind&ensp;&ensp;&ensp;&ensp;vue中，提供用于绑定属性的指令,v-bind中可以写合法的Js表达式
```html
v-bind:title="mytitle"  //v-bind可简写成:
:title="mytitle+'123'"  //显示为mytitle123
```
6. v-on&ensp;&ensp;&ensp;&ensp;vue中提供的事件绑定机制
```html
v-on:click="show" //v-on可简写成@
```
7. v-model&ensp;&ensp;&ensp;&ensp;实现表单输入和应用状态之间的双向绑定，只能用于表单元素
```html 
<p>{{ message }}</p><input v-model="message">
```
## &#123;&#123;&#125;&#125;与v-text的不同
1. v-text会覆盖元素中原本的内容   
插值表达式只会把占位符对应的值替换掉（+{{msg}}+）输出+123+，而不会把原本的内容清空
2. v-text不会出现闪烁问题，但是会把标记内内容清空

## Vue的基本代码
```html
<!DOCTYPE html> 
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <script src="./lib/vue.js"></script> 
  </head>
  <body>


    <!--将来new的Vue的实例会控制这个元素的所有内容-->
    <div id="app">

    </div>
    <script>

      var vm = new Vue({
        el: "#app", //当前我们new的这个Vue实例要控制页面上的哪个区域
        data: {
          //data属性中，参访的是el中要用到的数据
          msg: "HelloWorld",
          msg2:'<h1>I am the H1 tag </h1>',
          mytitle: '这是一个自己定义的title' 
        },
        methods: { 
          //v-on绑定的事件在Vue的methods属性内定义
          show: function(){
            alert('hello');
          }
        },
      });

    </script>
  </body>
</html>
```