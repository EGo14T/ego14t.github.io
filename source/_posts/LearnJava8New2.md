---
title: LearnJava8New2
date: 2020-07-15 16:40:55
tags: Java8新特性
categories:
  - 学习笔记
---

# Stream流

Java 8 API添加了一个新的抽象称为流Stream，可以让你以一种声明的方式处理数据。

Stream API可以极大提高Java程序员的生产力，让程序员写出高效率、干净、简洁的代码。

<!--more-->

## 什么是Stream流

Stream 是对集合(Collection)对象功能的增强。

Stream 使用一种类似用 SQL 语句从数据库查询数据的直观方式来提供一种对 Java 集合运算和表达的高阶抽象。

这种风格将要处理的元素集合看作一种流， 流在管道中传输， 并且可以在管道的节点上进行处理， 比如筛选， 排序，聚合等。

元素流在管道中经过中间操作（intermediate operation）的处理，最后由最终操作(terminal operation)得到前面处理的结果。

举个简单的例子：

```java
List<String> strings = Arrays.asList("abc", "", "bc", "efg", "abcd","", "jkl");
List<String> filtered = strings.stream()
    						   .filter(string -> !string.isEmpty())
                               .collect(Collectors.toList());
```

上面得到的结果是把`strings`中不为空的筛选出来；

Stream对数据的处理流程如下所示：

```java
+--------------------+       +------+   +------+   +---+   +-------+
| stream of elements +-----> |filter+-> |sorted+-> |map+-> |collect|
+--------------------+       +------+   +------+   +---+   +-------+
```

## 如何获得Stream流

在Java8中，有三种方法生成Stream流

1. 通过`Collection`系列集合提供的`stream()`和`parallelStream()`方法获得流

   其中通过`stream()`方法生成的是串行流，通过`parallelStream()`方法生成的是并行流

   ```java
   List<String> list = new ArrayList<>();
   Stream<String> stream1 = list.stream();
   Stream<String> stream2 = list.`parallelStream();
   ```

2. 通过`Arrays`中的静态方法`stream()`获得流

   ```java
   Music[] music = new Music[10];
   Stream<Music> stream3 = Arrays.stream(music);
   ```

3. 通过Stream类中的静态方法`of()`获得流

   ```java
   Stream<String> stream4 = Stream.of("abc","a","b");
   ```

还有两种方法创建无限流

1. 迭代

   ```java
   Stream<Integer> stream5 = Stream.iterate(0,(x)->x+2);
   ```

2. 生成

   ```java
   Stream<Double> stream6 = Stream.generate(() -> Math.random());
   ```

讲完了如何获得流，下面我们来讲Stream流的中间操作

## Stream流的中间操作

Stream流的中间操作包括：

1. 筛选与切片
2. 映射
3. 排序

首先

### 筛选与切片

1. `filter`：接收Lambda，从流中排除某些元素

   ```java
   @Test
   public void test1(){
   	//内部迭代：迭代操作由Stream API完成
   	music.stream()
                  .filter((e)->e.getNum()>10)
                  .forEach(System.out::println);
   }
   ```

2. `limit`：截断流，使其元素不超过给定数量

   ```java
   @Test
   public void test2(){
       //limit操作拿到给定数量的值后，就不再继续执行称为短路操作"
      	music.stream()
           .filter((e)->{
                   System.out.println("短路!);
                   return e.getNum()>10;})
           .limit(2)
           .forEach(System.out::println);
   }
   ```

3. `skip`：跳过元素，返回一个扔掉了前n个元素的流

   ```java
   @Test
   public void test3(){
       /// 若流中元素不足n个，则返回一个空流，与limit(n)互补
       music.stream()
               .filter((e)->e.getNum()>10)
               .skip(2)
               .forEach(System.out::println);
   }
   ```

4. `distinct`筛选，通过流生成元素的hashCode()和equals()去除重复元素

   ```java
   @Test
   public void test4(){
       music.stream()
               .filter((e)->e.getNum()>10)
               .skip(2)
               .distinct()
               .forEach(System.out::println);
   
   }
   ```

### 映射

1. `map`：接收Lambda，将元素转换成其他形式或提取信息。接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素

   ```java
   @Test
   public void test5(){
       //把list中的元素转换为大写
        List<String> list = Arrays.asList("aaa","bbb","ccc");
        list.stream()
                .map(s -> s.toUpperCase())
                .forEach(System.out::println);
   }
   ```

   