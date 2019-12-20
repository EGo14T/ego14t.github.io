---
title: LeetCode4--FindMedianSortedArrays
date: 2019-09-14 12:45:11
tags: LeetCode
categories:
  - LeetCode
---

# 题目描述

给定两个大小为 m 和 n 的有序数组 nums1 和 nums2。

请你找出这两个有序数组的中位数，并且要求算法的时间复杂度为 O(log(m + n))。

你可以假设 nums1 和 nums2 不会同时为空。

示例 1:

nums1 = [1, 3]
nums2 = [2]

则中位数是 2.0
示例 2:

nums1 = [1, 2]
nums2 = [3, 4]

则中位数是 (2 + 3)/2 = 2.5

<!--more-->



# 思路

## 第一种（暴力解法）

两个有序数组，我想到了归并排序中的第二步。合并两个有序数组，然后求出中位数

### 代码

```java
public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m = nums1.length;
        int n = nums2.length;
        int[] nums = new int[m+n];

        if (m == 0) {
            return n % 2 == 0?(nums2[n / 2 - 1] + nums2[n / 2]) / 2.0 : nums2[n / 2];
        }
        if (n == 0) {
            return m % 2 == 0?(nums1[m / 2 - 1] + nums1[m / 2]) / 2.0 : nums1[m / 2];
        }

        int count = 0;
        int i = 0, j = 0;
        while (count != (m + n)) {
            if (i == m) {
                //--------------------------------------------------------
                //当有一个数组遍历完之后，另一个数组直接灌入新的数组 跳过判断
                while (j != n) {
                    nums[count++] = nums2[j++];
                }
                break;
            }
            if (j == n) {
                while (i != m) {
                    nums[count++] = nums1[i++];
                }
                break;
                //---------------------------------------------------------
            }
            //-------------------------------------------------------------
            //比大小，小的数填入新的数组，下标右移
            if (nums1[i] < nums2[j]) {
                nums[count++] = nums1[i++];
            } else {
                nums[count++] = nums2[j++];
            }
        }
            //--------------------------------------------------------------
        if (count % 2 == 0) {
            return (nums[count / 2 - 1] + nums[count / 2]) / 2.0;
        } else {
            return nums[count / 2];
        }

    }
```

时间复杂度：`O（m+n）`

## 第二种（寻找第n小的数）

中位数的定义：是按顺序排列的一组数据中居于中间位置的数。

所以我们只需要寻找一个有序数组中第n/2位置的数就可以了。（n为两个数组的长度之和）

寻找第n/2小的数，找的思路如下图所示

![](https://cdn.ego1st.cn/postImg/findSmall.gif)

### 代码

```java
public double findMedianSortArrays(int[] nums1, int[] nums2){
        int m = nums1.length;
        int n = nums2.length;
        int left = (m+n+1)/2;
        int right = (m+n+2)/2;
        //当数组的长度为奇数时，求出两个相同的数除以2为中位数，偶数则是left，right位置的数相加除以2
        return (getKth(nums1,0,m-1,nums2,0,n-1,left)+getKth(nums1,0,m-1,nums2,0,n-1,right))*0.5;
    }
	//递归调用
    private int getKth(int[] nums1, int start1, int end1, int[] nums2, int start2, int end2, int k){
        int len1 = end1 - start1 + 1;
        int len2 = end2 - start2 + 1;
        //让len1永远比len2小，遇到大小相同的数时，留上面的，排除下面的
        if (len1 > len2) return getKth(nums2, start2, end2, nums1, start1, end1, k);
        //一个数组被排除到空，返回另一个数组的当前第K值
        if (len1 == 0) return nums2[start2 + k - 1];
        //如果k=1 返回两个数组中 第一个数字小的那个数，就是我们要找的第K小的数
        if (k == 1)return Math.min(nums1[start1],nums2[start2]);
        //如果k/2 比 当前数组长度长，则直接取 数组长度
        int i = start1 + Math.min(len1, k/2)-1;
        int j = start2 + Math.min(len2, k/2)-1;

        //排除小的数
        if (nums1[i] > nums2[j]){
            return getKth(nums1, start1, end1, nums2, j + 1, end2, k - (j - start2 + 1));
        }
        else{
            return getKth(nums1, i + 1, end1, nums2, start2, end2, k - (i - start1 + 1));
        }


    }
```

时间复杂度：`O(log(m+n）`

