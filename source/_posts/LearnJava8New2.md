---
title: Java8新特性——Stream流
date: 2020-06-12 13:40:55
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

首先定义一个`Music`类

```java
public class Music {
    private String name;
    private String singer;
    private Integer num;
    public Status status;
    
    public enum Status {
        FREE,
        BUSY
    }
    ...
    //get,set,toString,equals,hashCode,构造器省略
}
```

然后定义一个`List<Music>`

```java
List<Music> music = Arrays.asList(
        new Music("歌1","手1",1),
        new Music("歌2","手2",20),
        new Music("歌3","手3",30),
        new Music("歌4","手4",40),
        new Music("歌5","手5",50),
        new Music("歌6","手6",60),
        new Music("歌6","手6",70),
        new Music("歌6","手6",60)
);
```

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

2. `flatMap`：接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有的流连接成一个流

   ```java
   @Test
   public void test6(){
       List<String> list = Arrays.asList("aaa","bbb","ccc");
       list.stream()
               .flatMap(StreamLearn2::filterCharater)
               .forEach(System.out::println);
   
   }
   
   public static Stream<Character> filterCharater(String str){
        List<Character> list = new ArrayList<>();
   
       for (Character ch :
               str.toCharArray()) {
           list.add(ch);
       }
       return list.stream();
   }
   ```

### 排序

1. `sorted`：自然排序（Comparable）

   ```java
   @Test
   public void test7(){
       List<String> list = Arrays.asList("aaa","bbb","ccc");
       list.stream()
               .sorted()
               .forEach(System.out::println);
   }
   ```

2. `sorted(Comparator com)`：定制排序（Comparator）

   ```java
   @Test
   public void test8(){
       music.stream()
               .sorted((e1,e2)->{
                   if (e1.getName().equals(e2.getName())){
                       return e1.getNum().compareTo(e2.getNum());
                   }else {
                       return e1.getName().compareTo(e2.getName());
                   }
               })
               .forEach(System.out::println);
   }
   ```

## Stream流的终止操作

Stream流的终止操作包括

1. 查找与匹配
2. 归约
3. 收集

### 查找与匹配

1. `allMatch`：检查是否匹配所有元素，必须全部满足才返回`true`

   ```java
   @Test
   public void test1(){
       boolean b1 = music.stream()
               .allMatch(e->e.getStatus().equals(Music.Status.BUSY));
       System.out.println(b1);
   }
   ```

2. `anyMatch`：检查是否匹配至少一个元素，只要有一个元素满足条件就返回`true`

   ```java
   @Test
   public void test2(){
       boolean b2 = music.stream()
               .anyMatch(e->e.getStatus().equals(Music.Status.BUSY));
       System.out.println(b2);
   }
   ```

3. `noneMatch`：检查是否没有匹配所有元素，全部不满足才返回`true`

   ```java
   @Test
   public void test3(){
       boolean b3 = music.stream()
               .noneMatch(e->e.getStatus().equals(Music.Status.BUSY));
       System.out.println(b3);
   }
   ```

4. `findFirst`：返回第一个元素

   ```java
   @Test
   public void test4(){
       Optional<Music> optional = music.stream()
               .sorted((e1, e2) -> e1.getNum().compareTo(e2.getNum()))
               .findFirst();
   
       System.out.println(optional.get());
   }
   ```

5. `findAny`：返回任意一个元素

   ```java
   @Test
   public void test5(){
       Optional<Music> optional = music.stream()
               .filter(e -> e.getStatus().equals(Music.Status.FREE))
               .findAny();
   
       System.out.println(optional.get());
   }
   ```

6. `count`：返回流元素的总个数

   ```java
   public void test6(){
       long count = music.stream()
               .filter(e -> e.getStatus().equals(Music.Status.FREE))
               .count();
   
       System.out.println(count);
   }
   ```

7. `max`：返回流中元素的最大值

   ```java
   @Test
   public void test7(){
       Optional<Music> max = music.stream()
               .max((e1, e2) -> Integer.compare(e1.getNum(), e2.getNum()));
       System.out.println(max.get());
   }
   ```

8. `min`：返回流中元素的最小值

   ```java
   @Test
   public void test8(){
       Optional<Integer> min = music.stream()
               .map(Music::getNum)
               .min(Integer::compare);
       System.out.println(min.get());
   }
   ```

### 归约

`reduce`：可以将流中的元素反复结合起来，得到一个值

1. ` Optional<T> reduce(BinaryOperator<T> accumulator)`

   ```java
   Optional<Integer> optional = music.stream()
           .map(Music::getNum)
           .reduce(Integer::sum);
   System.out.println(optional.get());
   ```

   可能为`null`，返回`Optional`

2. `T reduce(T identity, BinaryOperator<T> accumulator)`

   ```java
   Integer reduce = music.stream()
           .map(Music::getNum)
           .reduce(0, (x, y) -> x + y);
   ```

   起始值为0，返回对应类型

3. `<U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner);`

   ```java
   @Test
   public void reduceTest() {
       ArrayList<Integer> newList = new ArrayList<>();
   
       ArrayList<Integer> accResult_ = Stream.of(2, 3, 4)
               .reduce(newList,
                       (acc, item) -> {
                           acc.add(item);
                           System.out.println("item: " + item);
                           System.out.println("acc+ : " + acc);
                           System.out.println("BiFunction");
                           return acc;
                       }, (acc, item) -> null);
       System.out.println("accResult_: " + accResult_);
   }
   ```

   运行结果：

   ```java
   item: 2
   acc+ : [2]
   BiFunction
   item: 3
   acc+ : [2, 3]
   BiFunction
   item: 4
   acc+ : [2, 3, 4]
   BiFunction
   accResult_: [2, 3, 4]
   ```

   首先看一下BiFunction的三个泛型类型分别是U、 ? super T、U，参考BiFunction函数式接口apply方法定义可以知道，累加器通过类型为U和? super T的两个输入值计算得到一个U类型的结果返回。也就是说这种reduce方法，提供一个不同于Stream中数据类型的初始值，通过累加器规则迭代计算Stream中的数据，最终得到一个同初始值同类型的结果

   

### 收集

1. `collect`：将流转化为其他形式。接受一个Collector接口的实现，用于给Stream中元素做汇总的方法
    ```java
    public void collectTest(){
        List<String> collect = music.stream()
                .map(Music::getName)
                .collect(Collectors.toList());

        HashSet<String> collect1 = music.stream()
                .map(Music::getName)
                .collect(Collectors.toCollection(HashSet::new));

        collect.forEach(System.out::println);
        collect1.forEach(System.out::println);
    }
    ```
    
    运行结果：

    ```java
    歌1
    歌2
    歌3
    歌4
    歌5
    歌6
    歌4
    歌5
    歌6
    歌1
    歌2
    歌3
    ```
    
2. `groupingBy`：分组&多级分组

    分组，按照相同的属性进行分组

    ```java
    public void groupTest1(){
        Map<Music.Status, List<Music>> collect = music.stream()
                .collect(Collectors.groupingBy(Music::getStatus));
    
        System.out.println(collect);
    }
    ```

    运行结果：

    ```java
    {BUSY=[Music{name='歌1', singer='手1', num=1, status=BUSY}, Music{name='歌3', singer='手3', num=30, status=BUSY}, Music{name='歌4', singer='手4', num=40, status=BUSY}], FREE=[Music{name='歌2', singer='手2', num=20, status=FREE}, Music{name='歌5', singer='手5', num=50, status=FREE}, Music{name='歌6', singer='手6', num=60, status=FREE}]}
    ```

    多级分组，首先按照相同的属性分组，然后再按照条件分，或者还可以按照属性分，嵌套下去

    ```java
    public void groupTest2(){
        Map<Music.Status, Map<String, List<Music>>> collect = music.stream()
            .collect(Collectors.groupingBy(Music::getStatus, 
                 	Collectors.groupingBy(e -> {
                    	if (e.getNum() >= 30) {
                        	return "高产";
                    	} else {
                        	return "低产";
                        }
                	})));
        System.out.println(collect);
    }
    ```

    运行结果：

    ```java
    {BUSY={低产=[Music{name='歌1', singer='手1', num=1, status=BUSY}], 高产=[Music{name='歌3', singer='手3', num=30, status=BUSY}, Music{name='歌4', singer='手4', num=40, status=BUSY}]}, FREE={低产=[Music{name='歌2', singer='手2', num=20, status=FREE}], 高产=[Music{name='歌5', singer='手5', num=50, status=FREE}, Music{name='歌6', singer='手6', num=60, status=FREE}]}}
    ```

3. `partitioningBy`：分区，符合条件的放在一起，不符合条件的放在一起

    ```java
    public void partTest(){
        Map<Boolean, List<Music>> collect = music.stream()
                .collect(Collectors.partitioningBy(e -> e.getNum() > 30));
        System.out.println(collect);
    }
    ```

    运行结果：

    ```java
    {false=[Music{name='歌1', singer='手1', num=1, status=BUSY}, Music{name='歌2', singer='手2', num=20, status=FREE}, Music{name='歌3', singer='手3', num=30, status=BUSY}], true=[Music{name='歌4', singer='手4', num=40, status=BUSY}, Music{name='歌5', singer='手5', num=50, status=FREE}, Music{name='歌6', singer='手6', num=60, status=FREE}]}
    ```

4. `join`连接，将结果，以什么字符开头，结尾，和分割

    ```java
    public void joinTest(){
        String collect = music.stream()
                .map(Music::getName)
                .collect(Collectors.joining(",", "[", "]"));
    
        System.out.println(collect);
    }
    ```

    运行结果：

    ```java
    [歌1,歌2,歌3,歌4,歌5,歌6]
    ```
