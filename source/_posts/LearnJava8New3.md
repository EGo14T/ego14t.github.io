---
title: Java8新特性——Optional
date: 2020-07-30 15:32:50
tags: Java8新特性
categories:
  - 学习笔记
---

# Java8 Optional

Optional是一个包装类。类中包装的对象可以为`null`也可以为`非null`，简单来讲就是把`null`封装了一层， 防止出现空指针异常

<!--more-->

## Optional优化null判断

看一段代码：

```java
public static String getAge(Student student){
	if(null == student){
		return "Unkown";
	}
        return student.getAge();
}
```

该方法获取学生年龄，为了防止Student对象为空，做了防御性检查，我们可以使用Optional优化该段代码

```java
public static String getAge(Student student){
	return Optional.ofNullable(student).map(Student::getAge()).orElse("Unkown");
}
```

可以看到，Optional结合Lambda表达式，可以让代码看起来更加优雅

## 创建Optional对象

```java
public final class Optional<T> {
    
    private static final Optional<?> EMPTY = new Optional<>();

    private final T value;

    private Optional() {
        this.value = null;
    }

    public static<T> Optional<T> empty() {
        @SuppressWarnings("unchecked")
        Optional<T> t = (Optional<T>) EMPTY;
        return t;
    }

    private Optional(T value) {
        this.value = Objects.requireNonNull(value);
    }

    public static <T> Optional<T> of(T value) {
        return new Optional<>(value);
    }

    public static <T> Optional<T> ofNullable(T value) {
        return value == null ? empty() : of(value);
    }
    
    ...
}
```

可以看到Optional类的构造方法设置为了私有，所以不能通过`new`来创建，它提供了三个静态方法来创建Optional对象，`of(T value)`、`ofNullable(T value)`、`empty(T value)`

1. `of(T value)`：创建一个包装值非`null`的Optional对象
2. `ofNullable(T value)`：创建一个包装值可以为`null`的Optional对象
3. `empty(T value)`：创建一个包装值为`null`的Optional对象

## Optional类的常用方法

1. `T get()`：获取Optional对象的包装值，如果包装值为`null`，则抛出`NoSuchElementException("No value present");`异常

2. `boolean isPresent()`：判断Optional对象的包装值是否为`null`

3. `void ifPresent(Consumer<? super T> consumer)`：如果Optional包装值不为`null`，则执行一些动作，否则什么也不做

4. `Optional<T> filter(Predicate<? super T> predicate)`：`filter`接受一个`Predicate`对象，可以实现对Optional对象包装值的过滤，如果满足条件则返回该Optional对象，不满足则返回空Optional对象

5. `Optional<U> map(Function<? super T, ? extends U> mapper)`：`map`方法传入一个函数进行运算，如果Optional对象的包装值为`null`，或经过函数运算后返回值为`null`则返回一个包装值为`null`的Optional对象，否则返回经函数处理后的Optional对象，包装对象的类型可能改变

   ```java
   Optional<Integer> map = Optional.ofNullable(student).map(Student::getAge);
   ```

6. `Optional<U> flatMap(Function<? super T, Optional<U>> mapper)`：`flatMap`方法类似于`map`方法，但是该方法可以返回一个新的Optional对象，举例如下：

   ```java
   Optional<Integer> flatmap = Optional.ofNullable(student)
       								   .flatMap(s-> Optional.ofNullable(s.getAge()));
   ```

   注意：`flatmap`和`map`的区别是`map`方法返回值自动封装为Optional对象，而`flatmap`方法需要手动封装为Optional对象

7. `T orElse(T other)`：如果Optional对象包装值不为`null`则返回包装值，否则返回`other`

8. `T orElseGet(Supplier<? extends T> other)`：与`orElse`的区别是将`Supplier`的`get`方法的返回值作为默认值

9. `T orElseThrow(Supplier<? extends X> exceptionSupplier)`：Optional对象包装值为`null`时，抛出异常，示例：

   ```java
   Optional.ofNullable(student).map(u -> u.getAge()).orElseThrow(() -> new RuntimeException("Unkown"));
   ```

   





