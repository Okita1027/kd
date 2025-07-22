---
title: Axios
shortTitle: Axios
description: 
date: 2024-06-16 22:29:35
categories: [前端,Axios]
tags: []
---
## 快速上手
### get
```typescript
/** @format */
// import axios from "axios";
// axios.<method> 能够提供自动完成和参数类型推断功能
const axios = require("axios").default;
axios
	.get("/user?ID=123")
	.then((result) => {
		// 处理成功情况
		console.log(result);
	})
	.catch((err) => {
		// 处理错误情况
		console.log(err);
	})
	.finally(() => {
		// 处理完成情况
		console.log("finally!");
	});

axios
	.get("/user", {
		params: {
			ID: 12345,
		},
	})
	.then((result) => {
		// 处理成功情况
		console.log(result);
	})
	.catch((err) => {
		// 处理错误情况
		console.log(err);
	})
	.finally(() => {
		// 处理完成情况
		console.log("finally!");
	});

async function getUser() {
	try {
		const result = await axios.get("/user?ID=123");
		console.log(result);
	} catch (err) {
		console.log(err);
	}
}

```
### post
```typescript
/** @format */
export default {};
// import axios from "axios";
const axios = require("axios").default;
// 发起一个post请求。
axios
	.post("/user", {
		firstName: "Fred",
		lastName: "Flintstone",
	})
	.then((response) => {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	})
	.finally(function () {
		// always executed
		console.log("finally!");
	});

// 发起多个并发请求。
function getUserAccount() {
	return axios.get("/user/12345");
}

function getUserPermissions() {
	return axios.get("/user/12345/permissions");
}

// 写法1
  const [acct, perm] = await Promise.all([getUserAccount(), getUserPermissions()]);

// 写法2
Promise.all([getUserAccount(), getUserPermissions()]).then(function ([
	acct,
	perm,
]) {
	// ...
});

// 将 HTML Form 转换成 JSON 进行请求
const { data } = await axios.post("/user", document.querySelector("#my-form"), {
	headers: {
		"Content-Type": "application/json",
	},
});



// Multipart (multipart/form-data)
const {data} = await axios.post('https://httpbin.org/post', {
    firstName: 'Fred',
    lastName: 'Flintstone',
    orders: [1, 2, 3],
    photo: document.querySelector('#fileInput').files
  }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
)

// URL encoded form (application/x-www-form-urlencoded)
const {data} = await axios.post('https://httpbin.org/post', {
    firstName: 'Fred',
    lastName: 'Flintstone',
    orders: [1, 2, 3]
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
})
```
## API
### api
向 axios 传递相关配置来创建请求
```javascript
// 发起一个post请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```
请求方式别名：

- `axios.request(config)`
- `axios.get(url[, config])`
- `axios.delete(url[, config])`
- `axios.head(url[, config])`
- `axios.options(url[, config])`
- `axios.post(url[, data[, config]])`
- `axios.put(url[, data[, config]])`
- `axios.patch(url[, data[, config]])`
- `axios.postForm(url[, data[, config]])`
- `axios.putForm(url[, data[, config]])`
- `axios.patchForm(url[, data[, config]])`
> 在使用别名方法时， url、method、data 这些属性都不必在配置中指定。

### 实例
可以使用自定义配置新建一个实例。
```javascript
import axios from 'axios';

// 创建Axios实例
const instance = axios.create({
  baseURL: 'https://api.example.com', // 设置基本URL
  timeout: 5000, // 设置超时时间（单位：毫秒）
  headers: {
    'Content-Type': 'application/json', // 设置默认请求头
  },
});

// 使用Axios实例发送请求
instance.get('/users')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```
以下是可用的实例方法。指定的配置将与实例的配置合并。

- axios#request(config)
- axios#get(url[, config])
- axios#delete(url[, config])
- axios#head(url[, config])
- axios#options(url[, config])
- axios#post(url[, data[, config]])
- axios#put(url[, data[, config]])
- axios#patch(url[, data[, config]])
- axios#getUri([config])
### 请求配置
```javascript
{
  // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // 默认值

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 它只能用于 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 数组中最后一个函数必须返回一个字符串， 一个Buffer实例，ArrayBuffer，FormData，或 Stream
  // 你可以修改请求头。
  transformRequest: [function (data, headers) {
    // 对发送的 data 进行任意转换处理

    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对接收的 data 进行任意转换处理

    return data;
  }],

  // 自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是与请求一起发送的 URL 参数
  // 必须是一个简单对象或 URLSearchParams 对象
  params: {
    ID: 12345
  },

  // `paramsSerializer`是可选方法，主要用于序列化`params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求体被发送的数据
  // 仅适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法
  // 在没有设置 `transformRequest` 时，则必须是以下类型之一:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属: FormData, File, Blob
  // - Node 专属: Stream, Buffer
  data: {
    firstName: 'Fred'
  },
  
  // 发送请求体数据的可选语法
  // 请求方式 post
  // 只有 value 会被发送，key 则不会
  data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` 指定请求超时的毫秒数。
  // 如果请求时间超过 `timeout` 的值，则请求会被中断
  timeout: 1000, // 默认值是 `0` (永不超时)

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，这使测试更加容易。
  // 返回一个 promise 并提供一个有效的响应 （参见 lib/adapters/README.md）。
  adapter: function (config) {
    /* ... */
  },

  // `auth` HTTP Basic Auth
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` 表示浏览器将要响应的数据类型
  // 选项包括: 'arraybuffer', 'document', 'json', 'text', 'stream'
  // 浏览器专属：'blob'
  responseType: 'json', // 默认值

  // `responseEncoding` 表示用于解码响应的编码 (Node.js 专属)
  // 注意：忽略 `responseType` 的值为 'stream'，或者是客户端请求
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // 默认值

  // `xsrfCookieName` 是 xsrf token 的值，被用作 cookie 的名称
  xsrfCookieName: 'XSRF-TOKEN', // 默认值

  // `xsrfHeaderName` 是带有 xsrf token 值的http 请求头名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值

  // `onUploadProgress` 允许为上传处理进度事件
  // 浏览器专属
  onUploadProgress: function (progressEvent) {
    // 处理原生进度事件
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  // 浏览器专属
  onDownloadProgress: function (progressEvent) {
    // 处理原生进度事件
  },

  // `maxContentLength` 定义了node.js中允许的HTTP响应内容的最大字节数
  maxContentLength: 2000,

  // `maxBodyLength`（仅Node）定义允许的http请求内容的最大字节数
  maxBodyLength: 2000,

  // `validateStatus` 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，
  // 则promise 将会 resolved，否则是 rejected。
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },

  // `maxRedirects` 定义了在node.js中要遵循的最大重定向数。
  // 如果设置为0，则不会进行重定向
  maxRedirects: 5, // 默认值

  // `socketPath` 定义了在node.js中使用的UNIX套接字。
  // e.g. '/var/run/docker.sock' 发送请求到 docker 守护进程。
  // 只能指定 `socketPath` 或 `proxy` 。
  // 若都指定，这使用 `socketPath` 。
  socketPath: null, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // `proxy` 定义了代理服务器的主机名，端口和协议。
  // 您可以使用常规的`http_proxy` 和 `https_proxy` 环境变量。
  // 使用 `false` 可以禁用代理功能，同时环境变量也会被忽略。
  // `auth`表示应使用HTTP Basic auth连接到代理，并且提供凭据。
  // 这将设置一个 `Proxy-Authorization` 请求头，它会覆盖 `headers` 中已存在的自定义 `Proxy-Authorization` 请求头。
  // 如果代理服务器使用 HTTPS，则必须设置 protocol 为`https`
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // see https://axios-http.com/zh/docs/cancellation
  cancelToken: new CancelToken(function (cancel) {
  }),

  // `decompress` indicates whether or not the response body should be decompressed 
  // automatically. If set to `true` will also remove the 'content-encoding' header 
  // from the responses objects of all decompressed responses
  // - Node only (XHR cannot turn off decompression)
  decompress: true // 默认值

}
```
### 响应结构
```javascript
{
  // `data` 由服务器提供的响应
  data: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 是服务器响应头
  // 所有的 header 名称都是小写，而且可以使用方括号语法访问
  // 例如: `response.headers['content-type']`
  headers: {},

  // `config` 是 `axios` 请求的配置信息
  config: {},

  // `request` 是生成此响应的请求
  // 在node.js中它是最后一个ClientRequest实例 (in redirects)，
  // 在浏览器中则是 XMLHttpRequest 实例
  request: {}
}
```
```javascript
axios.get('/user/12345')
  .then(function (response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
```
当使用 `catch`，或者传递一个`[rejection callback](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)`作为 `then`的第二个参数时，响应可以通过 `error`对象被使用，正如在[错误处理](https://www.axios-http.cn/docs/handling_errors)部分解释的那样。
### 默认配置
可以指定默认配置，它将作用于每个请求。
#### 全局Axios默认值
在Axios中，可以通过`axios.defaults`对象来设置全局的默认值。这些默认值将应用于所有通过Axios发送的请求。以下是一些常见的全局默认值配置示例：
```javascript
axios.defaults.baseURL = 'https://api.example.com'; // 设置全局的基础URL
axios.defaults.timeout = 5000; // 设置全局的超时时间（单位：毫秒）
axios.defaults.headers.common['Authorization'] = 'Bearer token123'; // 设置全局的请求头
```
在上述示例中，我们使用`axios.defaults`对象来设置全局的默认值。通过直接给`axios.defaults`对象的属性赋值，我们可以设置全局的基础URL、超时时间和请求头。
需要注意的是，全局默认值将应用于所有Axios请求，但您仍然可以在每个请求中通过传递一个配置对象来覆盖这些默认值。例如：
```javascript
axios.get('/users'); // 使用全局默认值发送GET请求

axios.post('/products', data, {
  headers: {
    'Content-Type': 'application/json',
  },
}); // 在POST请求中覆盖全局默认值的请求头
```
通过设置全局默认值，您可以在整个应用程序中统一配置Axios请求的行为，从而简化请求的设置和管理。
#### 自定义实例默认值
```javascript
// 创建实例时配置默认值
const instance = axios.create({
  baseURL: 'https://api.example.com'
});

// 创建实例后修改默认值
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```
#### 配置的优先级
在Axios中，配置的优先级顺序如下：

1.  **请求**级别配置：配置对象直接传递给请求方法（例如`axios.get(url, config)`）的配置具有最高优先级。这些配置将覆盖任何其他级别的默认配置。 
2.  **实例**级别配置：通过`axios.create()`方法创建的自定义实例可以设置默认配置。这些配置将应用于该实例的所有请求，除非被请求级别配置覆盖。 
3.  **全局**默认配置：通过`axios.defaults`对象设置的全局默认配置将应用于所有Axios请求。然而，它们可以被实例级别配置或请求级别配置所覆盖。 

具体来说，如果存在冲突或重叠的配置项，将按照以上优先级顺序进行覆盖。请求级别配置始终具有最高优先级，其次是实例级别配置，最后是全局默认配置。
```javascript
// 全局默认配置
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.timeout = 5000;

// 创建实例并设置实例级别配置
const instance = axios.create({
  baseURL: 'https://api.another-example.com',
  timeout: 3000,
});

// 发送请求，覆盖实例级别配置
instance.get('/users', {
  baseURL: 'https://api.custom-example.com',
});

// 请求级别配置，覆盖实例级别和全局默认配置
axios.get('/products', {
  timeout: 2000,
});
```
在上述示例中，全局默认配置设置了基础URL和超时时间。
然后，我们创建了一个实例并设置了实例级别配置，覆盖了全局默认配置中的基础URL和超时时间。
在实例级别配置之后，我们发送了一个请求，并在请求级别配置中覆盖了实例级别配置。这将使请求使用请求级别配置中指定的自定义基础URL。
### 拦截器
拦截器（Interceptors）是Axios提供的功能之一，用于在请求发送之前和响应返回之后对请求进行拦截、转换和处理。您可以使用拦截器来实现全局的请求和响应处理逻辑，例如添加请求头、对请求数据进行转换、处理错误响应等。
#### **请求拦截器**
请求拦截器会在请求发送之前执行，允许您对请求进行修改、添加请求头或进行其他处理。使用`axios.interceptors.request.use()`方法来添加请求拦截器。以下是一个示例：
```javascript
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers['Authorization'] = 'Bearer token123';
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
```
在上述示例中，我们使用`axios.interceptors.request.use()`方法添加了一个请求拦截器。在请求拦截器的第一个函数中，我们可以修改请求的配置对象，例如添加请求头。第二个函数用于处理请求错误。
#### **响应拦截器**
响应拦截器会在响应返回之后执行，允许您对响应进行全局处理、错误处理或对响应数据进行转换。使用`axios.interceptors.response.use()`方法来添加响应拦截器。以下是一个示例：
```javascript
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做些什么
    return response;
  },
  function (error) {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);
```
在上述示例中，我们使用`axios.interceptors.response.use()`方法添加了一个响应拦截器。在响应拦截器的第一个函数中，我们可以对响应数据进行处理或转换。第二个函数用于处理响应错误。
通过添加请求拦截器和响应拦截器，您可以在Axios中实现全局的请求和响应处理逻辑。这使得在请求发送和响应返回时执行一些通用的逻辑变得更加容易，从而提高了代码的可维护性和复用性。
#### 常见操作
```javascript
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```
```javascript
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```
### 错误处理
错误对象的属性

- error.message：错误的描述信息。
- error.response：包含响应数据的错误对象，如果有的话。它具有状态码、响应头和数据等属性。
- error.request：发出请求但未收到响应的请求对象。
```javascript
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
      // 而在node.js中是 http.ClientRequest 的实例
      console.log(error.request);
    } else {
      // 发送请求时出了点问题
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```
```javascript
axios.get('/user/12345', {
  validateStatus: function (status) {
    return status < 500; // 处理状态码小于500的情况
  }
})
```
```javascript
axios.get('/user/12345')
  .catch(function (error) {
    console.log(error.toJSON());
  });
```
### 取消请求
从 v0.22.0 开始，Axios 支持以 fetch API 方式—— [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 取消请求：
```javascript
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {
   //...
});
// 取消请求
controller.abort()
```
### 请求体编码
在网络通信中，请求体编码是指在将数据发送到服务器时对请求体进行格式编码的过程。请求体编码方式包括以下几种：

1.  **application/x-www-form-urlencoded：** 这是最常见的请求体编码方式。在这种编码方式下，请求体数据被编码为键值对的形式，并使用`key1=value1&key2=value2`的格式进行表示。这种编码方式适用于简单的表单提交，例如 HTML 表单的默认编码方式。 
2.  **multipart/form-data：** 这种编码方式常用于上传文件或二进制数据。在这种编码方式下，请求体数据被分割成多个部分，每个部分都有自己的内容类型，并且每个部分都有一个唯一的标识符。这种编码方式适用于包含文件上传的表单提交。 
3.  **application/json：** 这种编码方式适用于传输 JSON（JavaScript Object Notation）格式的数据。在这种编码方式下，请求体数据被序列化为 JSON 字符串，并设置请求头的`Content-Type`为`application/json`。 
4.  **text/plain：** 这种编码方式适用于纯文本数据的传输。在这种编码方式下，请求体数据以纯文本的形式进行传输，没有进一步的格式化或编码。 
5.  **application/xml：** 这种编码方式适用于传输 XML（eXtensible Markup Language）格式的数据。类似于`application/json`，请求体数据被序列化为 XML 字符串，并设置请求头的`Content-Type`为`application/xml`。 
6.  **application/octet-stream：** 这种编码方式适用于传输二进制数据，例如文件下载或二进制流的传输。在这种编码方式下，请求体数据以原始的二进制形式进行传输，没有进一步的格式化或编码。 
7.  **gzip 和 deflate 压缩：** 除了请求体的编码方式，还可以使用数据压缩来减小请求体的大小，提高传输效率。常见的压缩算法包括 Gzip 和 Deflate。当请求头中包含`Content-Encoding: gzip`或`Content-Encoding: deflate`时，服务器可以对请求体进行相应的解压缩。 
8.  **URL 编码：** 在某些情况下，需要对请求体中的特殊字符进行编码，以便在 URL 中进行传输。这种编码方式将特殊字符转换为`%`后面跟随两位十六进制的编码形式。例如，空格字符会被编码为`%20`。URL 编码通常在使用`application/x-www-form-urlencoded`编码方式时使用。 

例如，在使用 Axios 发送 POST 请求时，您可以通过设置请求头的`Content-Type`来指定请求体的编码方式：
```javascript
axios.post('/api/data', data, {
  headers: {
    'Content-Type': 'application/json' // 使用 application/json 编码方式
  }
})
  .then(response => {
    // 请求成功的处理逻辑
    console.log(response.data);
  })
  .catch(error => {
    // 请求错误的处理逻辑
    console.error(error);
  });
```
在上述示例中，我们将`data`作为请求体数据发送到`/api/data`。通过设置请求头的`Content-Type`为`application/json`，我们指定了使用 JSON 编码方式。
#### 自动序列化
自动序列化是指在发送请求时，HTTP客户端库能够自动将请求体数据转换为特定格式（例如JSON或表单编码）的过程。这样可以简化开发者的工作，无需手动进行数据序列化，提高了代码的可读性和易用性。
```javascript
import axios from 'axios';

const data = {
  name: 'John Doe',
  age: 25
};

axios.post('/api/user', data)
  .then(response => {
    // 请求成功的处理逻辑
    console.log(response.data);
  })
  .catch(error => {
    // 请求错误的处理逻辑
    console.error(error);
  });
```
上述示例中，我们使用Axios发送了一个POST请求到/api/user，并传递了一个JavaScript对象data作为请求体数据。Axios会自动将data对象序列化为JSON格式的字符串，并设置Content-Type为application/json。
### Multipart实体请求
Multipart实体请求（Multipart Entity Request）是一种用于在HTTP请求中传输包含多部分数据的方法。它通常用于上传文件或同时发送多个数据字段的场景。
在Multipart实体请求中，请求体被分割成多个部分（parts），每个部分都可以包含不同类型的数据，例如文本、文件、二进制数据等。每个部分都有自己的内容类型（Content-Type）和可选的其他头部信息，以及一个唯一的标识符（boundary）来标识各个部分。
以下是一个示例，展示了如何创建一个Multipart实体请求以上传包含文本字段和文件的数据：
```
POST /api/upload HTTP/1.1
Host: example.com
Content-Type: multipart/form-data; boundary=----boundary

------boundary
Content-Disposition: form-data; name="username"

John Doe
------boundary
Content-Disposition: form-data; name="profile_pic"; filename="profile.jpg"
Content-Type: image/jpeg

[Binary file data]
------boundary--
```
在上述示例中，请求的Content-Type被设置为`multipart/form-data`，并使用`boundary`参数来指定各个部分的分隔符。请求体被分割成三个部分：

1. 第一个部分包含了一个文本字段`username`，其值为`John Doe`。
2. 第二个部分是一个文件字段`profile_pic`，它包含了一个名为`profile.jpg`的JPEG图像文件的内容。文件部分的Content-Type会根据实际文件类型自动设置。
3. 请求体的结束标志`------boundary--`表示所有部分的结束。

在客户端代码中，可以使用相应的HTTP客户端库来创建Multipart实体请求。这些库通常提供了便捷的方法和API来构建和发送Multipart请求，无需手动处理请求体的分割和编码。
以下是一些常见的HTTP客户端库示例，演示了如何使用它们来创建Multipart实体请求：
**Axios（JavaScript）：**
```javascript
import axios from 'axios';
import FormData from 'form-data';

const formData = new FormData();
formData.append('username', 'John Doe');
formData.append('profile_pic', file, 'profile.jpg');

axios.post('/api/upload', formData, {
  headers: {
    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
  }
})
  .then(response => {
    // 请求成功的处理逻辑
    console.log(response.data);
  })
  .catch(error => {
    // 请求错误的处理逻辑
    console.error(error);
  });
```

