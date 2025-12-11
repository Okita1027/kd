---
title: C#中的特殊语法
shortTitle: C#语法特性
description: C#中的特殊语法
date: 2025-09-07 14:41:33
categories: [.NET, C#]
tags: [.NET]
---




| C# 版本   | 特性               | 旧写法                                                       | 新写法                                                      |
| --------- | ------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| **C# 10** | 全局 using         | 每个文件都要写：`using System;`                              | 在任意文件声明：`global using System;`                      |
|           | 文件范围命名空间   | `csharp<br>namespace MyApp {<br>  class A {}<br>}<br>`       | `csharp<br>namespace MyApp;<br>class A {}<br>`              |
|           | 记录结构体         | 只能写 record class                                          | `public record struct Point(int X, int Y);`                 |
|           | 常量插值字符串     | 不能作为常量                                                 | `const string Info = $"Ver {Version}";`                     |
| **C# 11** | 原始字符串字面量   | `"C:\\path\\file.txt"`                                       | `"""C:\path\file.txt"""`                                    |
|           | 多行插值原始字符串 | 复杂转义：`"{ \"name\": \"" + name + "\" }"`                 | `csharp<br>string msg = $$"""{ "name": "{{name}}" }""";`    |
|           | UTF-8 字符串       | `Encoding.UTF8.GetBytes("Hi")`                               | `"Hi"u8`                                                    |
|           | 列表模式匹配       | `if (arr.Length==3 && arr[0]==1...)`                         | `if (arr is [1,2,3])`                                       |
|           | 必需成员           | 手动检查 null                                                | `public required string Name {get; init;}`                  |
| **C# 12** | 主构造函数         | `csharp<br>class User {<br>  public User(string n){Name=n;}<br>}<br>` | `class User(string Name)`                                   |
|           | 集合表达式         | `var list = new List<int>{1,2,3};`                           | `var list = [1,2,3];`                                       |
|           | using 别名增强     | 仅类/命名空间                                                | `using MyList = List<int>;`                                 |
|           | Lambda 默认参数    | `x=> $"Hi {x}"`，不能有默认值                                | `(string name="world") => $"Hi {name}"`                     |
|           | 内联数组           | 只能用 `fixed` 或 Span                                       | `csharp<br>[InlineArray(3)]<br>struct Buffer<T>{T e0;}<br>` |



## C#12

### 主要构造函数



### 集合表达式



### 内联数组



### Lambda表达式中的可选参数



### ref readonly参数



### 任何类型的别名



### 实验属性



### 拦截器



## C#13







## C#14