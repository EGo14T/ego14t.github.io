---
title: SpringBoot使用MyBaits
date: 2019-08-02 17:59:33
tags:
categories: 
  - 踩坑记录
---

#### SpringBoot整合MyBatis使用过程中出现的错误

错误`Invalid bound statement (not found)`

<!--more-->

如图所示：

![报错信息](https://cdn.ego1st.cn/postImg/Snipaste_2019-08-02_17-33-39.jpg)

网上找了几种解决办法：

1. 检查`xxxmapper.xml`文件中的`namespace`路径是否正确，是否是Mapper interface所在的包名

2. `xxxmapper`类中的方法在`xxxmapper.xml`中是否存在（用逆向工程生成的一般没这个问题）

3. `xxxmapper`类的方法返回值是`List<User>`而`select`元素没有正确配置`ResultMap`，或者只配置`ResultType`

4. 如果你确认没有以上问题,请任意修改下对应的xml文件,比如删除一个空行,保存.问题解决（待求证）

5. 在`application.yml`中mybatis的配置路径是否正确

   ```yaml
   ## 该配置节点为独立的节点，有很多同学容易将这个配置放在spring的节点下，导致配置无法被识别
   mybatis:
   #注意：一定要对应mapper映射xml文件的所在路径
     mapper-locations: classpath:com.ego14t.xinmusic.mapper/*.xml  
   #注意：对应实体类的路径
     type-aliases-package: com.ego14t.xinmusic.pojo  
   ```

#### 我的问题出现在了第五条，但是！！！改完之后运行还是不行。。。

   在我打开`target`目录之后，发现

   ![target目录](https://cdn.ego1st.cn/postImg/Snipaste_2019-08-02_17-54-09.jpg)

`mapper`目录下并没有生成xml文件，百度之后得知，IDEA默认不会生成xml文件，需要修改一下`pom.xml`文件，修改如下：

```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
        <resources>
            <!--让idea生成xml文件-->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
```

在更新完之后，重新运行项目

#### 问题解决！！！