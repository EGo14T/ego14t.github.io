---
title: SpringBoot搭建遇到的问题
date: 2019-07-26 08:15:40
tags:
categories: 
  - 踩坑记录
---
# 关于数据库连接的问题
<!--more-->
# SpringBoot的搭建
## 数据库连接报错
```Java
Loading class `com.mysql.jdbc.Driver'. This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary.
```
### 解决办法：  
将application.yml中数据库配置段  
driver-class-name:  com.mysql.jdbc.Driver&ensp;&ensp;&ensp;  
改为com.mysql.cj.jdbc.Driver(多了个cj)

### 原因：
mysql的驱动类位置改变了  

## 数据库时区问题
```java
erver time zone value '�й���׼ʱ��' is unrecognized or represents more than one time zone. You must configure either the server or JDBC driver (via the serverTimezone configuration property) to use a more specifc time zone value if you want to utilize time zone support.
```
### 解决办法
在数据库连接的url链接后加上"&serverTimezone=GMT%2B8"
### 原因
mysql默认的是美国的时区，比我们中国快8小时，所以我们采用+8:00的格式

