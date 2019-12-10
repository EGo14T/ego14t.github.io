---
title: Vue-Day5
date: 2019-12-01 15:09:17
tags:
categories:
  - Vue笔记
---

上个月，本来是后端程序员的我，被拉上当前端来用，第一次体验到前端的工作，还有人生中第一次加班（连着两周。。）咕咕咕好久的博客了，这次在这里总结一下噩梦18天我学到的东西，知识点可能比较杂碎~

![表情1](../images/表情1.jpg)

<!--more-->

# Vue-Router

Vue Router是Vue的路由管理器，以下是简单的使用步骤：

1. 首先要把组件映射到路由上（components--->routers）：

   ```js
   import Vue from 'vue'
   import Router from 'vue-router'
   
   import Home from './components/Home'
   import Users from './components/Users'
   import MyMusic from './components/MyMusic'
   
   Vue.use(Router)
   
   export default new Router({
     mode: 'history',
     base: process.env.BASE_URL,
     routes: [
       {
           path:'/',
           component:Users
       },
       {
           path:'/home',
           component:Home
           children:[
           {
           path:'/mymusic',
           component:MyMusic
           }
     		]
       },
       {
           path:'*',
           redirect:'/'
       }
     ]
   })
   ```
   
   *全匹配，即路由表中没有的，则自动跳转到“/”路径下；还可以设置`children`配置子路由，即在`/home`下跳转到`/chat`最终路由为`/home/chat`

2. 然后告诉Vue Router在哪里渲染这些组件

   ```vue
   <template>
     <div class="app">
       <div class="main">
           <router-view></router-view>
       </div>
     </div>
   </template>
   ```

   `<router-view>`标签就是渲染路由对应组件的地方

Vue Router还可以进行动态路由匹配，举个栗子就是：我们有一个 `User` 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 `vue-router` 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果

```js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```

此时，`user/1`和`user/2`都将跳转到`/user`路由下，然后参数会被设置到`this.$route.params`中，使用方法如下：

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

# Vuex

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。<---这是官方的解释，我的理解就是Vuex与Java中的全局变量类似。以下是Vuex的简单用法：

在`main.js`中

```js
import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
```

在组件中

```vue
<template>
  <div class="about">
    {{count}}
    <button @click="increment">+</button>
  </div>
</template>

<script>
export default {
  computed: {
      count(){
        return this.$store.state.count
      },
  },
  methods: {
    increment(){
      this.$store.commit('increment')
    }
  }
}
</script>
```

在Vuex的`store.js`中

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(){
      this.state.count++;
    }
  },
  actions: {
  },
  modules: {
  }
})
```

然后在所有组件中

```js
this.$store.state.count
```

即可取到`count`的值，并可使用`store.js`（Vuex的`mutations`）属性，来改变`count`的值

```js
increment(){
      this.$store.commit('increment')
}
```

在做的项目中，仅仅简单的使用了Vuex来管理用户的基本信息，Vuex复杂的使用方式以后会专门写一篇博客来介绍（立个flag）

# axios

axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中，类似于Jquery中的`$.ajax`。

在项目中主要用到了全局拦截和封装`axios`

首先来讲全局拦截器：

1. 定义一个全局请求拦截器

   ```js
   // http request 拦截器
   axios.interceptors.request.use(config => {
    //TODO
     return config;
   }, err => {
       //TODO
   })
   ```
   
2. 定义一个全局响应拦截器

   ```js
   // http response 拦截器
   axios.interceptors.response.use(data => {
     //TODO
     return data;
   }, err => {
     //TODO
   })
   ```

然后是简单的`axios`封装

```js
let base = '';
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`
  });
}
```

# 杂碎的知识点

1. 使用`setInterval()`方法时一定要记得销毁，利用`clearInterval()`

2. 过滤器的使用

   ```js
   //姓名脱敏
   filters:{
       name:function(value){
           if(value == undefined) return "";
           if(value.length==2) return value.substring(0,1)+'*';
           if(value.length==3) return value.substring(0,1)+'**';
         },
     }
   ```

3. vue中`<style>`标签的`scope`属性和深度选择器`/deep/`的使用，应用场景：你自定义一个css样式，但是又不想影响全局，这时你可以给`<style>`标签设置`scope`属性，这样css样式只在此组件中有效，但是有些样式又想作用在子组件中，此时可以在该样式之前加上`/deep`或者`::v-deep`，该样式就可以穿透到子组件中了。这样做不仅可以减少标签id或者class的定义还可以避免css样式污染。

先写这么多，以后遇到新的知识点还会补充~~~