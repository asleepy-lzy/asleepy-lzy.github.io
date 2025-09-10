---
title: 摩尔投票排序
published: 2025-08-31
description: "Leetcode刷题感想-摩尔投票排序"
tags: [study, Leetcode]
category: Study
draft: false
---

今天在刷力扣过程过，遇到了一道easy但很有意思的问题。

> Given an array nums of size n, return the majority element.

>The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.

这道问题显然可以直接利用Hashmap直接解决，但空间复杂度属于$O(n)$，不够优雅。可以利用摩尔投票排序的方法压缩到$O(1)$.

## 摩尔投票排序

### 核心直觉：
把多数元素与其他元素“一一配对抵消”。因为多数元素数量更多，配对完仍会“幸存”，于是剩下的就是多数元素。

实现上维护两个变量：
- `candidate`：当前候选人
- `count`：当前候选人的“净票数”

规则：
- 若 `count == 0`，将当前元素设为 `candidate`
- 若当前元素等于 `candidate`，`count++`；否则 `count--`


### 代码实现
```cpp
int majorityElement(vector<int>& nums) {
    int candidate = 0, count = 0;
    for (int x : nums) {
        if (count == 0) candidate = x;
        count += (x == candidate) ? 1 : -1;
    }
    return candidate;
}
```

```python
def majorityElement(nums)
    candidate=None;
    count = 0;
    for x in nums:
        if count == 0 :
            candidate = x;
        count += 1 if x == candidate else -1;
    return dandidate;

```

### 证明
将数组分成若干"抵消段"，每段以 count=0 开始，以下一个 count=0 结束。每段内部，如果最终 candidate 不是 m，那么这段中 m 的数量小于等于非 m 的数量。由于 m 总体上数量超过非 m，必然存在某些段最终 candidate 为 m。最后一段一定以 candidate = m 结束，因为 m 的总体优势确保了这一点。

### 拓展

> 问题定义（Objective） 给定长度为 n 的序列 A 与整数 k ≥ 2，求集合 M = { x ∈ A : f(x) > n/k }，其中 f(x) 为 x 在 A 中的出现次数（频率）。阈值为严格不等式 > n/k。

**Algorithm**:维护至多 k − 1 个候选元素及其计数。当新元素属于候选集时计数自增；若候选未满则插入新候选并置 1；若候选已满且新元素不在其中，则对所有计数同时减 1，并删除计数归零者。该过程等价于从流中反复“删除一组 k 个互异元素”（抵消视角），从而保留所有可能超过 n/k 的候选。

**后验验证**: 第一趟仅产生候选集合，可能包含未达阈值者；需进行第二趟线性计数，对每个候选 x 精确计算 f(x)，输出满足 f(x) > n/k 的元素，确保正确性与完备性。

**复杂度**: 采用哈希映射实现候选与计数，单次更新耗时 O(1) 摊还；当触发“全体减一”时需扫描候选集，代价 O(k)。整体时间复杂度 O(nk)，空间复杂度 O(k)。当 k 视为常数时，总体时间近似线性 O(n)，空间仍为 O(k)。



### 参考

- Boyer, R. S., & Moore, J. S. (1982). MJRTY — A Fast Majority Vote Algorithm. 
- [Boyer–Moore majority vote algorithm (Wikipedia)](https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_majority_vote_algorithm)