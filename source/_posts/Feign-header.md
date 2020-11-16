---
title: Feign_header
date: 2020-08-16 11:38:54
tags: SpringCloud
categories:
  - 学习笔记
---

# Spring Cloud之Feign 转发请求头(header参数)
在做接口请求时，我们经常会在header头中增加一些鉴权信息，如token 或 jwt，那么在通过fegin从A server去调用B server的接口时，如果B server的接口需要header信息，我们需要将A sever获取的header转发到B上。
<!--more-->

## 解决方式

我们需要实现Feign提供的一个接口`RequestInterceptor`

```java
@Configuration
public class FeignConfiguration implements RequestInterceptor{
    private final Logger logger = LoggerFactory.getLogger(getClass());
            @Override
            public void apply(RequestTemplate template) {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                        .getRequestAttributes();
                HttpServletRequest request = attributes.getRequest();
                Enumeration<String> headerNames = request.getHeaderNames();
                if (headerNames != null) {
                    while (headerNames.hasMoreElements()) {
                        String name = headerNames.nextElement();
                        String values = request.getHeader(name);
                        template.header(name, values);
 
                    }
                    logger.info("feign interceptor header:{}",template);
                }
            }
        }
```

在`@FeignClient`注解里面的属性加上`configuration = FeignConfiguration.class`就可以了。如

```java
@FeignClient(value = "xinmusic-music",configuration = FeignConfig.class)
@RequestMapping("/music")
public interface MusicService {
    //todo
}
```

