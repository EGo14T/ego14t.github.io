---
title: volatile关键字
date: 2019-10-10 08:25:52
tags:
categories:
  - 学习笔记
---
`volatile`是Java提供的一种轻量级的同步机制。Java 语言包含两种内在的同步机制：同步块（或方法）和 `volatile` 变量，相比于`synchronized`（`synchronized`通常称为重量级锁），`volatile`更轻量级，因为它不会引起线程上下文的切换和调度。但是`volatile` 变量的同步性较差（有时它更简单并且开销更低），而且其使用也更容易出错。
<!--more-->

## 特性

被`volatile`关键字修饰的共享变量具有以下特性

1. 保证了不同线程对该变量操作时的内存可见性
2. 禁止了指令重排序

## 理解

A，B线程都用到了一个变量，Java默认是A运行时保存一份copy到该线程的缓存中，此时如果B线程修改了该变量，则线程A未必知道，因为A线程用的是自己缓存中的该变量的拷贝

使用`volatile`关键字修饰，会让所有线程读到该变量的修改值，强制线程读取堆内存

```java
public class T {
	//对比一下有无volatile的情况下，整个程序运行结果的区别
    /*volatile*/ boolean running = true; 
	void m() {
		System.out.println("m start");
		while(running) {
			/*
			try {
				TimeUnit.MILLISECONDS.sleep(10);
			} catch (InterruptedException e) { 			
				e.printStackTrace();
			}*/
		}
		System.out.println("m end!");
	}
	
	public static void main(String[] args) {
		T t = new T();
		
		new Thread(t::m, "t1").start();
		
		try {
			TimeUnit.SECONDS.sleep(1);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		t.running = false;
	}
}
```

运行以上代码可以发现，当running变量没有被`volatile`关键字修饰时，线程t1一直运行；当running变量被`volatile`关键字修饰时，主线程改变running值，t1线程会读取到改变进而输出“m end”结束线程

以上的说法方便理解

其实真实的情况是，没有被`volatile`关键字修饰的变量，t1线程使用时会拷贝一份到该线程的缓存中，但是，当CPU空闲时，仍然会去堆内存中读取running值，从而导致t1线程停止。



## volatile关键字注意点

1. `volatile`关键字并不能保证多个线程共同修改同一个变量所带来的不一致问题，也就是说`volatile`不能替代`synchronized`关键字解决同步问题

   ```java
   public class T {
   	volatile int count = 0; 
   	void m() {
   		for(int i=0; i<10000; i++) count++;
   	}
   	public static void main(String[] args) {
   		T t = new T();
   		List<Thread> threads = new ArrayList<Thread>();	
   		for(int i=0; i<10; i++) {
   			threads.add(new Thread(t::m, "thread-"+i));
   		}
   		threads.forEach((o)->o.start());
   		threads.forEach((o)->{
   			try {
   				o.join();
   			} catch (InterruptedException e) {
   				e.printStackTrace();
   			}
   		});
   		System.out.println(t.count);	
   	}	
   }
   ```

   输出：

   ```java
   55600
   ```

   这说明`volatile`关键字并不能解决同步问题，因为每个线程可能从内存中读取到的值一样，并在此基础上相加，所以输出的值远远小于10000

2. `synchronized`关键字保证可见性和原子性，`volatile`关键字只能保证可见性

