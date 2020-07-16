---
title: Java8新特性——Lambda表达式
date: 2020-05-14 16:31:20
tags: Java8新特性
categories:
  - 学习笔记
---

# Lambda表达式

Lambda 表达式，也可称为闭包，它是推动 Java 8 发布的最重要新特性。

Lambda 允许把函数作为一个方法的参数（函数作为参数传递进方法中）。

使用 Lambda 表达式可以使代码变的更加简洁紧凑。

<!--more-->

## 什么是Lambda？

对于Java变量，我们可以对其进行赋值，比如：

```java
int value = 233;
```

如果想把`一块代码`赋值给一个变量，在Java8之前，这个是做不到的，但是在Java8之后，我们可以使用Lambda表达式来实现，例如：

```java
aBlockCode = (s) -> System.out.println(s);
```

上面，把“赋值给一个`变量`的`函数`”就是`Lambda表达式`

但是这里仍然有一个问题，就是变量`aBlockCode`的类型应该是什么？

下面我们来介绍函数式接口

## 函数式接口

在Java8中，所有的Lambda的类型都是一个接口，而Lambda表达式本身，就是那段函数，就是这个接口的实现，举个例子：

首先定义一个接口：

```java
@FunctionalInterface
interface MyLambdaInterface{
    void doSomething(String s);
}
```

这种有且仅有一个抽象方法，但是可以有多个非抽象方法的接口，我们称为函数式接口，可以使用`@FunctionalInterface`注解标注

我们给`aBlockCode`加上类型，我们就得到了一个完整的Lambda表达式声明，如下：

```java
MyLambdaInterface aBlockCode = (s) -> System.out.println(s);
```

## Lambda表达式有什么用？

使用 Lambda 表达式可以使代码变的更加简洁紧凑。

举个例子：

我们要实现对一个数组进行筛选

首先我们定义一个函数式接口

```java
@FunctionalInterface
public interface Predicate<T> {
    
    boolean filter(T t);
    
}
```
然后我们先使用匿名内部类的方式实现这个需求，代码如下：

```java
//匿名内部类写法
@Test
public void test1(){
    List<Integer> a = Arrays.asList(1,2,3,4,5);
    List<Integer> b = filter(a, new Predicate<Integer>() {
        @Override
        public boolean filter(Integer integer) {
            return integer>4;
        }
    });
    for (int c :
            b)
        System.out.println(c);
}
```

我们再使用Lambda表达式的方式实现这个需求，代码如下：

```java
//Lambda表达式写法
@Test
public void test4(){
    List<Integer> a = Arrays.asList(1,2,3,4,5);
    List<Integer> b = filter(a, x -> x>4);
    b.forEach(System.out::println);
}
```

可以看出，使用Lambda表达式改写匿名内部类的实现，使代码看起来更加简洁易懂

知道了什么是Lambda还有Lambda表达式的作用，下面我们来看看Lambda表达式的基础语法

## Lambda表达式基础语法

在Java8中，引入了一个新的操作符`->`，该操作符称为箭头操作符或者Lambda操作符

Lambda操作符把Lambda表达式拆分成了两部分

左侧：Lambda表达式的参数列表

右侧：Lambda表达式所需执行的功能，即Lambda体

1. 语法格式一：无参数，无返回值

   ```java
   () -> System.out.println("Hello world");
   ```

2. 语法格式二：有一个参数，无返回值

   ```java
   (s) -> System.out.println(s);
   s -> System.out.println(s); //若只有一个参数，小括号可省略
   ```

3.  语法格式三： 有多个参数(>=2)，且Lambda体中有多条语句
    ```java
    Comparator<Integer> com = (x,y) -> {
    System.out.println("Lambda表达式");
    return Integer.compare(x,y);
    };
    ```
4. 语法格式四：有多个参数(>=2)，Lambda体中只有一条语句

   ```java
   Comparator<Integer> com = (x,y) -> Integer.compare(x,y);
   ```

## 四大核心函数式接口

在实际开发过程中，使用Lambda表达式往往不需要自己编写函数式接口，Java已经内置了我们常用的函数式接口，使我们开发更加便捷，下面是最常用到的Java内置的函数式接口

| 函数式接口                | 参数类型 | 返回类型 | 方法               |
| ------------------------- | -------- | -------- | ------------------ |
| Consumer 消费型接口       | T        | void     | void accept(T t);  |
| Supplier 供给型接口       | void     | T        | T get();           |
| Function<T, R> 函数型接口 | T        | R        | R apply(T t);      |
| Predicate 断言型接口      | T        | boolean  | boolean test(T t); |

1. `Consumer<T>`消费型接口

   ```java
   @Test
   public void test1(){
       ConsumerTest(100, x-> System.out.println(x*x));
   }
   
   public void ConsumerTest(Integer a, Consumer<Integer> consumer){
       consumer.accept(a);
   }
   ```

2. `Supplier<T>`供给型接口

   ```java
   @Test
   public void test2(){
       List<Integer> numList = SupplierTest(5, ()-> (int)(Math.random()*100));
       numList.forEach(System.out::println);
   }
   
   public List<Integer> SupplierTest(Integer a, Supplier<Integer> supplier){
       List<Integer> list = new ArrayList<>();
       for (int i = 0; i < a ; i++) {
           Integer n = supplier.get();
           list.add(n);
       }
       return list;
   }
   ```

3. `Function<T,R>`函数型接口

   ```java
   @Test
   public void test3(){
       Integer a = FunctionTest(10, x->{
           return x*200;
       });
   
       System.out.println(a);
   }
   
   public Integer FunctionTest(Integer a, Function<Integer,Integer> function){
       return function.apply(a);
   }
   ```

4. `Predicate<T>`断言型接口

   ```java
   @Test
   public void test4(){
       List<Integer> a = Arrays.asList(1,2,3,4,5,6,7);
       List<Integer> res = PredicateTest(a,x->{
           return x > 3;
       });
   
       res.forEach(System.out::println);
   }
   
   public List<Integer> PredicateTest(List<Integer> a, Predicate<Integer> predicate){
       List<Integer> list = new ArrayList<>();
   
       for (Integer b :
               a) {
           if (predicate.test(b)){
               list.add(b);
           }
       }
       return list;
   }
   ```

   

## 总结

Lambda表达式是匿名内部类的语法糖，可以使代码更加简洁易懂，我们可以使用自定义的函数式接口或者Java内置的函数式接口来编写Lambda表达式，Lambda表达式还可以和Stream流，Optional<T>结合，使代码更加优雅。