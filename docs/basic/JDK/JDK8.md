---
title: JDK1.8
shortTitle: "1.8"
description: Java8新特性
date: 2024-5-27 13:09:16
categories: [Java, basic]
tags: [Java, JDK]
index: true
order: 1
---

## Interface

- `default`修饰的方法，是普通实例方法，可以用`this`调用，可以被子类继承、重写。
- `static`修饰的方法，使用上和一般类静态方法一样。但它不能被子类继承，只能用`Interface`调用。

```java
public interface InterfaceNew {
    static void sm() {
        System.out.println("interface提供的方式实现");
    }

    default void def() {
        System.out.println("interface default方法");
    }

    //须要实现类重写
    void f();
}

public interface InterfaceNew1 {
    default void def() {
        System.out.println("InterfaceNew1 default方法");
    }
}
```

如果有一个类既实现了 `InterfaceNew` 接口又实现了 `InterfaceNew1`接口，它们都有`def()`，并且 `InterfaceNew` 接口和 `InterfaceNew1`接口没有继承关系的话，这时必须重写`def()`。不然编译时会报错。

```java
public class InterfaceNewImpl implements InterfaceNew , InterfaceNew1{
    public static void main(String[] args) {
        InterfaceNewImpl interfaceNew = new InterfaceNewImpl();
        interfaceNew.def();
    }

    @Override
    public void def() {
        InterfaceNew1.super.def();
    }

    @Override
    public void f() {
    }
}
```

> Java9开始新增 **私有** 接口方法

## [函数式编程](./functional-programming.md)

## Optional

定义： `Optional` 是一个容器对象，它可以包含或不包含值。如果包含值，可以通过 `get()` 方法获取该值；如果不包含值，则表示为空。

作用：解决NPE，因为它提供了方法来判断值是否为空，并且在获取值时会进行相应的空值检查。

## Date API

### Clock

`Clock` 用于提供当前时间的访问和获取。它是一个抽象类，可以有多种实现方式，用于在**不同的时区和时钟系统**中提供时间信息。

 `Clock` 提供了一些静态工厂方法用于获取不同的实例化对象。

### ZoneId

时区（Time Zones）被抽象为 `ZoneId` 类，并且通过 `ZoneId` 类可以获取系统中所有可用的时区。Java 8 中引入了新的时区类 `ZoneOffset` 用于表示固定偏移量的时区，同时还有 `ZoneRules` 用于管理每个时区的规则。

1. **ZoneId：** 代表了一个时区的标识符。可以通过 `ZoneId.of()` 方法获取特定时区的 `ZoneId` 对象。
2. **ZoneOffset：** 代表了一个固定偏移量的时区，以小时和分钟表示。例如，东八区的偏移量为+08:00。
3. **ZoneRules：** 用于管理每个时区的规则，例如夏令时（Daylight Saving Time）的转换规则等。

```java title="Demo"
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZoneRules;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        // 获取系统中所有可用的时区
        Set<String> availableZoneIds = ZoneId.getAvailableZoneIds();
        System.out.println("Available Zone IDs: " + availableZoneIds);

        // 获取特定时区的 ZoneId 对象
        ZoneId shanghaiZoneId = ZoneId.of("Asia/Shanghai");
        System.out.println("ZoneId for Shanghai: " + shanghaiZoneId);

        // 获取固定偏移量的 ZoneOffset 对象
        ZoneOffset zoneOffset = ZoneOffset.ofHours(8);
        System.out.println("ZoneOffset for UTC+08:00: " + zoneOffset);

        // 获取特定时区的规则信息
        ZoneRules shanghaiZoneRules = shanghaiZoneId.getRules();
        System.out.println("Rules for Shanghai: " + shanghaiZoneRules);
    }
}
```

### ZoneDateTime

`ZonedDateTime` 用于表示带时区的日期时间信息。它包含了日期、时间和时区信息，可以精确地表示全球各个时区的日期时间。

- **带时区信息：** `ZonedDateTime` 包含了时区信息，可以准确地表示特定时区的日期时间。

- **不可变性：** `ZonedDateTime` 是不可变的，一旦创建就无法修改其值。

- **线程安全：** `ZonedDateTime` 是线程安全的，可以安全地在多个线程中共享和使用。

```java
// 获取当前日期时间
ZonedDateTime now = ZonedDateTime.now();
System.out.println("Current ZonedDateTime: " + now);

// 根据指定的时区获取日期时间
ZonedDateTime dateTime = ZonedDateTime.of(2024, 5, 28, 9, 0, 0, 0, ZoneId.of("America/New_York"));
System.out.println("Specified ZonedDateTime: " + dateTime);

// 根据默认时区获取日期时间
ZonedDateTime localDateTime = ZonedDateTime.now(ZoneId.systemDefault());
System.out.println("Local ZonedDateTime: " + localDateTime);
```

### LocalDate

`LocalDate` 类表示一个不带时区的日期，它由年、月、日组成，用于表示如生日、纪念日等日期信息。`LocalDate` 提供了丰富的方法用于日期的操作和计算。

```java
LocalDate today = LocalDate.now(); // 获取当前日期
LocalDate birthday = LocalDate.of(1990, 1, 1); // 指定日期
int year = today.getYear(); // 获取年份
int month = today.getMonthValue(); // 获取月份
int day = today.getDayOfMonth(); // 获取日期
DayOfWeek dayOfWeek = today.getDayOfWeek(); // 获取星期几
```

### LocalTime

`LocalTime` 类表示一个不带时区的时间，它由时、分、秒和纳秒组成，用于表示如会议时间、课程时间等时间信息。`LocalTime` 也提供了丰富的方法用于时间的操作和计算。

```java
LocalTime now = LocalTime.now(); // 获取当前时间
LocalTime lunchTime = LocalTime.of(12, 0); // 指定时间
int hour = now.getHour(); // 获取小时
int minute = now.getMinute(); // 获取分钟
int second = now.getSecond(); // 获取秒
int nano = now.getNano(); // 获取纳秒
```

### LocalDateTime

`LocalDateTime` 类表示一个不带时区的日期时间，它由日期和时间组成，用于表示如事件发生时间、预约时间等日期时间信息。`LocalDateTime` 同样提供了丰富的方法用于日期时间的操作和计算。

```java
LocalDateTime dateTime = LocalDateTime.now(); // 获取当前日期时间
LocalDateTime eventTime = LocalDateTime.of(2024, 5, 28, 9, 0); // 指定日期时间
LocalDate date = dateTime.toLocalDate(); // 获取日期部分
LocalTime time = dateTime.toLocalTime(); // 获取时间部分
```

> `LocalDate`、`LocalTime` 和 `LocalDateTime` 类是**线程安全**的，并且提供了丰富的方法用于日期、时间和日期时间的操作和计算。用于替代旧的 `Date` 和 `Calendar` 类。

### JDBC的关联

现在 jdbc 时间类型和 java8 时间类型对应关系是

1. `Date` ---> `LocalDate`
2. `Time` ---> `LocalTime`
3. `Timestamp` ---> `LocalDateTime`

而之前统统对应 `Date`，也只有 `Date`

## 多重注解

多重注解允许在同一个元素上多次使用相同的注解。在使用多重注解时，可以通过在注解声明中使用 `@Repeatable` 注解来指定其容器注解，从而使得该注解可以重复使用。

使用方法：

1. 创建一个注解，并在其中使用 `@Repeatable` 注解指定其容器注解。

   ```java
   @Repeatable(Roles.class)
   @Retention(RetentionPolicy.RUNTIME)
   @Target(ElementType.TYPE)	// 可以应用在类、接口（包括注解类型）、枚举上。
   public @interface Role {
       String value();
   }
   
   @Retention(RetentionPolicy.RUNTIME)
   @Target(ElementType.TYPE)	// 可以应用在类、接口（包括注解类型）、枚举上。
   public @interface Roles {
       Role[] value();
   }
   ```

2. 在同一个元素上使用多次该注解，或者使用容器注解包装多个注解。

   ```java
   @Roles({
       @Role("Admin"),
       @Role("Manager")
   })
   public class User {
   
   }
   ```

---

容器注解的必要性：

Java语言规范要求注解在编译后的字节码中只能出现一次。通过定义一个包含注解数组的容器注解，Java编译器可以将多次使用的注解合并到这个容器中，从而在运行时通过反射访问到所有实例。

多重注解的引入使得开发者能够更灵活地使用注解，尤其是在需要标记多个相同类型的元数据场景下，比如参数验证、权限控制等。