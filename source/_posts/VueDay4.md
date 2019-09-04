---
title: Vue-Day4
date: 2019-09-04 07:53:17
tags:
categories:
  - Vue笔记
---

# Vue生命周期

每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做**生命周期钩子**的函数，这给了用户在不同阶段添加自己的代码的机会。（摘自https://cn.vuejs.org/）

<!--more-->

## 实例的生命周期图

![](../images/vuelife.png)

## 生命周期钩子在`new Vue`内以**属性**的方式进行声明

```html
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
```

注：在生命周期函数中不能使用箭头函数（=>）

## 生命周期函数

1. `beforeCreate`在实例初始化之后，数据观测（`data observer`）和 `event/watcher事件`配置之前被调用,简单来是，就是页面加载之前被调用，一般可以在这里加载动画
2. `created`在实例创建之后被调用，这一步已经完成了数据观测（`data observer`），属性和方法的运算，`watch/event`事件回调，但是**挂载**还没有开始，`$el`属性目前不可见。一般可以在这里获取数据

------

3. 接下来`Vue`会判断是否有`el`属性，

   + 如果有，则检查有没有`template`

   + 如果没有，则检查有没有`.$mount`，如果没有，则整个生命周期结束

4. 有`template`，则执行`template`中具体的组件，`render`方法渲染页面，或者具体标签

5. 没有`template`和`.$mount`，则生命周期结束

------

6. `beforeMount`在挂载之前被调用，相关的渲染函数首次被调用，虚拟Dom已经配置，但是页面仍未显示
7. `mounted`组件挂在后，`el`被新创建的`vm.$el`替换，挂载成功，此方法执行后，页面显示
8. `beforeUpdate`组件更新前，页面仍未更新，但虚拟Dom已经配置
9. `updated`组件更新，此方法执行后，页面显示
10. `beforeDestroy`组件销毁前
11. `destoryed`组件销毁