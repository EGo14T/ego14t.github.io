---
title: Swagger空串错误
date: 2019-07-30 17:40:35
tags:
categories:
  - 踩坑记录
---
# 关于Swagger2的踩坑

今天在项目中加入了swagger Api文档生成工具，项目启动无异常，但是在try it out的时候，填写好值之后，点击Execute之后，测试正常返回数据，但是在控制台会报出如下错误：

```java
java.lang.NumberFormatException: For input string: ""
	at java.lang.NumberFormatException.forInputString(NumberFormatException.java:65) ~[na:1.8.0_201]
	at java.lang.Long.parseLong(Long.java:601) ~[na:1.8.0_201]
	at java.lang.Long.valueOf(Long.java:803) ~[na:1.8.0_201]
	at io.swagger.models.parameters.AbstractSerializableParameter.getExample(AbstractSerializableParameter.java:412) ~[swagger-models-1.5.20.jar:1.5.20]
```
<!--more-->

## 解决办法：

### 方法1.在@ApiImplicitParam注解中，加入example属性及值

```java
@ApiImplicitParam(paramType="query", name = "id", value = "歌单ID", required = true, dataType = "int",
example = "123")
```

###  方法2.排除`springfox-swagger2`中的`swagger-models 1.5.20`版本，替换为1.5.21版本

在pom文件中加入排除，如图：

![](../images/swagger-4.jpg)

然后导入新版的`swagger-models`

```xml
	      <dependency>
            <groupId>io.swagger</groupId>
            <artifactId>swagger-models</artifactId>
            <version>1.5.22</version>
        </dependency>
```

问题解决



## 原因：

如果example没有写值的话，默认是空串"" ,且不为空。![](../images/swagger-3.jpg)

![](../images/swagger-2.jpg)

因为 空字符串`""`无法转成`Number`所以抛出异常