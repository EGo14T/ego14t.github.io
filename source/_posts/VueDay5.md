---
title: Vue-Day5
date: 2019-12-01 15:09:1
tags:
categories:
  - Vue笔记
---

上个月，本来是后端程序员的我，被拉上当前端来用，第一次体验到前端的工作，还有人生中第一次加班（连着两周。。）咕咕咕好久的博客了，这次在这里总结一下噩梦18天我学到的东西，知识点可能比较杂碎~

![]()

![表情1](./images/表情1.jpg)

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

