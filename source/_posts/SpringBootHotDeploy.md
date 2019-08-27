---
title: SpringBoot配置热部署
date: 2019-08-27 13:06:24
tags:
categories:
  - 学习笔记
---

spring为开发者提供了一个名为spring-boot-devtools的模块来使Spring Boot应用支持热部署，提高开发者的开发效率，无需手动重启Spring Boot应用。<!--more-->下面我们在IDEA中配置SpringBoot热部署。

## 添加pom.xml依赖

```xml
<!--热部署-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
        </dependency>
```

## 修改IDEA设置

1. File-->Settings-->Build,Execution,Depliyment-->Compiler-->Build Project automatically-->打上√
2. `Ctrl+Shift+Alt+/`组合键-->选择registry-->找到`Compiler autoMake allow when app running`打上 √

## 完成

这时候启动项目 然后修改代码就能实现热部署了



## 原理

深层原理是使用了两个ClassLoader，一个Classloader加载那些不会改变的类（第三方Jar包），另一个ClassLoader加载会更改的类，称为restart ClassLoader,这样在有代码更改的时候，原来的restart ClassLoader 被丢弃，重新创建一个restart ClassLoader，由于需要加载的类相比较少，所以实现了较快的重启时间。

