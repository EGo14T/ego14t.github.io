---
title: SpringCloud之微服务
date: 2019-08-9 17:42:35
tags:
categories:
  - 学习笔记
---

以下是我对SpringCloud中eureka服务注册与发现，服务提供者和服务消费者的理解

![](../images/Snipaste_2019-08-12_10-34-58.jpg)

<!--more-->

大致流程就是，建立三个SpringBoot项目，分别为注册中心（eureka），服务提供者（提供restFul接口），服务消费者（feign）。服务提供者和服务消费者首先在eureka中注册自己，然后消费者通过注册中心发现服务提供者，然后通过service调用服务提供者的接口，然后返回对应的值，外部通过访问服务消费者的接口，以达到使用服务提供者的目的，其中，在注册中心可以注册多个相同的服务提供者，使用feign实现负载均衡。