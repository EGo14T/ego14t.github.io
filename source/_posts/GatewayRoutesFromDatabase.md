---
title: Gateway路由配置从数据库或Redis获取
date: 2020-11-16 11:48:15
tags: SpringCloud
categories:
  - 学习笔记
---
目前SpringCloud Gateway只支持配置文件yml、properties和配置文件@Configuration的方式配置路由。这种方式有弊端，就是如果需要变更路由信息，修改路由规则，然后重启Gateway，修改或增加的路由规则才会生效。如果出现该问题，在Gateway重启的这段时间里，所有接入Gateway服务的应用都不可用。这肯定是不可行的。

<!--more-->

# Gateway默认的配置

## yml配置文件

![image-20201116172741310](http://cdn.ego1st.cn//postImg/image-20201116172741310.png)

## @Configuration

![image-20201116172929915](http://cdn.ego1st.cn//postImg/image-20201116172929915.png)

# 路由初始化

不管是什么方式配置路由，这些配置最后都会被封装到`RouteDefinition`中

```java
public class RouteDefinition {
	private String id;
	@NotEmpty
	@Valid
	private List<PredicateDefinition> predicates = new ArrayList<>();
	@Valid
	private List<FilterDefinition> filters = new ArrayList<>();
	@NotNull
	private URI uri;
	private Map<String, Object> metadata = new HashMap<>();
	private int order = 0;
	public RouteDefinition() {
	}
    ...
}
```

一个路由配置就是一个`RouteDefinition`对象，一个`RouteDefinition`对应一个ID，如果不设置，默认为uuid，所有路由信息在系统启动的时候被加载进内存里

![image-20201116173926638](http://cdn.ego1st.cn//postImg/image-20201116173926638.png)

如图框住的部分就是加载yml文件，它返回`PropertiesRouteDefinitionLocator`对象，该对象实现`RouteDefinitionLocator`接口，该接口是路由的装载器

```java
public interface RouteDefinitionLocator {

	Flux<RouteDefinition> getRouteDefinitions();

}
```

该接口只有一个方法，就是获取路由配置，该接口有多个实现类，分别对应不同的配置路由的方式

![image-20201116174349683](http://cdn.ego1st.cn//postImg/image-20201116174349683.png) 

1. CachingRouteDefinitionLocator -RouteDefinitionLocator包装类， 缓存目标RouteDefinitionLocator 为routeDefinitions提供缓存功能 
2. CompositeRouteDefinitionLocator -RouteDefinitionLocator包装类，组合多种 RouteDefinitionLocator 的实现，为 routeDefinitions提供统一入口
3. PropertiesRouteDefinitionLocator-从配置文件(GatewayProperties 例如，YML / Properties 等 ) 读取RouteDefinition 
4. DiscoveryClientRouteDefinitionLocator-从注册中心( 例如，Eureka / Consul / Zookeeper / Etcd 等 )读取RouteDefinition
5. RouteDefinitionRepository-从存储器( 例如，内存 / Redis / MySQL 等 )读取RouteDefinition

初始化顺序是

1. 配置文件加载初始化 PropertiesRouteDefinitionLocator-->CompositeRouteDefinitionLocator 
2. 存储器中加载初始化RouteDefinitionRepository-->CompositeRouteDefinitionLocator 
3. 注册中心加载初始化DiscoveryClientRouteDefinitionLocator-->CompositeRouteDefinitionLocator

而使用存储器中初始化的条件是，没有定义`RouteDefinitionRepository`

```java
@Bean
@ConditionalOnMissingBean(RouteDefinitionRepository.class)
public InMemoryRouteDefinitionRepository inMemoryRouteDefinitionRepository() {
	return new InMemoryRouteDefinitionRepository();
}
```

# 路由配置从数据库中获取

因此，我们可以通过实现`RouteDefinitionRepository`接口来自定义路由配置的获取方式

## 实现RouteDefinitionRepository接口

```java
@Component
public class DBARouteDefinitionRepository implements RouteDefinitionRepository {

    @Resource
    private GatewayDao gatewayDao;

    @Override
    public Flux<RouteDefinition> getRouteDefinitions() {
        List<RouteDefinition> gatewayRouteEntityList = getRouteConfig();
        return Flux.fromIterable(gatewayRouteEntityList);
    }

    private List<RouteDefinition> getRouteConfig() {
        List<RoutesEntity> routesEntities = gatewayDao.queryAllRoutes();

        List<RouteDefinition> definitions = new ArrayList<>();

        //组装RouteDefinition
        for (RoutesEntity entity : routesEntities) {
            RouteDefinition definition = new RouteDefinition();

            Map<String,String> predicateParams = new HashMap<>();
            PredicateDefinition predicate = new PredicateDefinition();

            Map<String,String> filterParams = new HashMap<>();
            FilterDefinition filter = new FilterDefinition();

            URI uri = UriComponentsBuilder.fromHttpUrl(entity.getUri()).build().toUri();

            predicate.setName("Path");
            predicateParams.put("pattern",entity.getPredicates());
            predicate.setArgs(predicateParams);

            //过滤暂时不写
            //filter.setName("StripPrefix");
            //TODO 动态过滤

            definition.setPredicates(Arrays.asList(predicate));
            //definition.setFilters();

            definition.setUri(uri);
            definition.setId(entity.getRouteId());

            definitions.add(definition);
        }

        return definitions;
    }

    @Override
    public Mono<Void> save(Mono<RouteDefinition> route) {
        return null;
    }

    @Override
    public Mono<Void> delete(Mono<String> routeId) {
        return null;
    }
}
```

## 动态路由

```java
@Service
public class DBARouteConfigService implements ApplicationEventPublisherAware {

    @Resource
    private GatewayDao gatewayDao;

    private ApplicationEventPublisher applicationEventPublisher;


    public int add(RoutesEntity entity){
        gatewayDao.create(entity);
        applicationEventPublisher.publishEvent(new RefreshRoutesEvent(this));
        return 1;
    }

    public int delete(String routeId) {
        gatewayDao.deleteByRouteId(routeId);
        applicationEventPublisher.publishEvent(new RefreshRoutesEvent(this));
        return 1;
    }

    public int update(RoutesEntity entity) {
        gatewayDao.updateRouteById(entity);
        applicationEventPublisher.publishEvent(new RefreshRoutesEvent(this));
        return 1;
    }

    /**
     * 发布事件
     * @param applicationEventPublisher
     */
    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }
}
```

在数据库中修改删除路由配置，然后再执行一下`RefreshRoutesEvent`事件，即可刷新路由配置，无需重启，立刻生效