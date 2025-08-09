import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,d as e,o as i}from"./app-CN29avzT.js";const l={};function t(p,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="zustand-旧" tabindex="-1"><a class="header-anchor" href="#zustand-旧"><span>Zustand(旧)</span></a></h1><p><a href="https://awesomedevin.github.io/zustand-vue/" target="_blank" rel="noopener noreferrer">ZUSTAND 中文文档 | ZUSTAND</a></p><h2 id="快速上手" tabindex="-1"><a class="header-anchor" href="#快速上手"><span>快速上手</span></a></h2><p>安装依赖：<code>npm i zustand</code></p><div class="language-jsx line-numbers-mode" data-highlighter="prismjs" data-ext="jsx"><pre><code class="language-jsx"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> create <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;zustand&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> useStore <span class="token operator">=</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">set</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">count</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">inc</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">count</span><span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">dec</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">count</span><span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">-</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> useStore<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-jsx line-numbers-mode" data-highlighter="prismjs" data-ext="jsx"><pre><code class="language-jsx"><span class="line"><span class="token keyword">import</span> useCounterStore <span class="token keyword">from</span> <span class="token string">&quot;./store/useCounterStore&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> count<span class="token punctuation">,</span> inc<span class="token punctuation">,</span> dec <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useCounterStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">(</span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"></span>
<span class="line">            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>dec<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">-</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"></span>
<span class="line">            </span><span class="token punctuation">{</span>count<span class="token punctuation">}</span><span class="token plain-text"></span>
<span class="line">            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>inc<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">+</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"></span>
<span class="line">        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> App<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="异步支持" tabindex="-1"><a class="header-anchor" href="#异步支持"><span>异步支持</span></a></h2><p>对于异步操作的支持不需要特殊的操作，直接在函数中编写异步逻辑，最后把接口的数据放到set函数中返回即可</p><div class="language-jsx line-numbers-mode" data-highlighter="prismjs" data-ext="jsx"><pre><code class="language-jsx"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> create <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;zustand&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> <span class="token constant">URL</span> <span class="token operator">=</span> <span class="token string">&quot;http://geek.itheima.net/v1_0/channels&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> useChannelStore <span class="token operator">=</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">set</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">channelList</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">fetchChannelList</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token constant">URL</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">const</span> jsonData <span class="token operator">=</span> <span class="token keyword">await</span> res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">channelList</span><span class="token operator">:</span> jsonData<span class="token punctuation">.</span>data<span class="token punctuation">.</span>channels <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> useChannelStore<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-jsx line-numbers-mode" data-highlighter="prismjs" data-ext="jsx"><pre><code class="language-jsx"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> useEffect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> useChannelStore <span class="token keyword">from</span> <span class="token string">&quot;./store/useChannelStore&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> <span class="token punctuation">{</span> channelList<span class="token punctuation">,</span> fetchChannelList <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useChannelStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">fetchChannelList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>fetchChannelList<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">(</span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"></span>
<span class="line">            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"></span>
<span class="line">                </span><span class="token punctuation">{</span>channelList<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">item</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span></span>
<span class="line">                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>id<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>name<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">                <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token plain-text"></span>
<span class="line">            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"></span>
<span class="line">        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> App<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="切片模式" tabindex="-1"><a class="header-anchor" href="#切片模式"><span>切片模式</span></a></h2><p>切片模式(Slice Pattern)是一种组织和模块化状态管理逻辑的方式,它可以更好地将复杂的状态划分为多个独立的&quot;切片&quot;。这种模式有助于提高代码的可维护性、可重用性和可测试性。</p><div class="language-jsx line-numbers-mode" data-highlighter="prismjs" data-ext="jsx"><pre><code class="language-jsx"><span class="line"><span class="token keyword">const</span> <span class="token constant">URL</span> <span class="token operator">=</span> <span class="token string">&quot;http://geek.itheima.net/v1_0/channels&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> <span class="token function-variable function">useChannelStore</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">set</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">channelList</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">fetchChannelList</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token constant">URL</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">const</span> jsonData <span class="token operator">=</span> <span class="token keyword">await</span> res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">channelList</span><span class="token operator">:</span> jsonData<span class="token punctuation">.</span>data<span class="token punctuation">.</span>channels <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> useChannelStore<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-jsx line-numbers-mode" data-highlighter="prismjs" data-ext="jsx"><pre><code class="language-jsx"><span class="line"><span class="token keyword">const</span> <span class="token function-variable function">useCounterStore</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">set</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">count</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">inc</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">count</span><span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">dec</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">set</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">count</span><span class="token operator">:</span> state<span class="token punctuation">.</span>count <span class="token operator">-</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> useCounterStore<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-jsx line-numbers-mode" data-highlighter="prismjs" data-ext="jsx"><pre><code class="language-jsx"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> create <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;zustand&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> useCounterStore <span class="token keyword">from</span> <span class="token string">&quot;./useCounterStore&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> useChannelStore <span class="token keyword">from</span> <span class="token string">&quot;./useChannelStore&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> useStore <span class="token operator">=</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">set<span class="token punctuation">,</span> <span class="token keyword">get</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token operator">...</span><span class="token function">useCounterStore</span><span class="token punctuation">(</span>set<span class="token punctuation">,</span> get<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token operator">...</span><span class="token function">useChannelStore</span><span class="token punctuation">(</span>set<span class="token punctuation">,</span> get<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> useStore<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="对接devtools" tabindex="-1"><a class="header-anchor" href="#对接devtools"><span>对接DevTools</span></a></h2><blockquote><p>简单的调试我们可以安装一个 名称为 simple-zustand-devtools 的调试工具</p></blockquote><ol><li>安装</li></ol><p><code>npm i simple-zustand-devtools -D</code></p><ol start="2"><li>配置</li></ol><div class="language-jsx line-numbers-mode" data-highlighter="prismjs" data-ext="jsx"><pre><code class="language-jsx"><span class="line"><span class="token keyword">import</span> create <span class="token keyword">from</span> <span class="token string">&#39;zustand&#39;</span></span>
<span class="line"><span class="token comment">// 导入核心方法</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> mountStoreDevtool <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;simple-zustand-devtools&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 省略部分代码...</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 开发环境开启调试</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">===</span> <span class="token string">&#39;development&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">mountStoreDevtool</span><span class="token punctuation">(</span><span class="token string">&#39;channelStore&#39;</span><span class="token punctuation">,</span> useChannelStore<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> useChannelStore</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>使用</li></ol><p><img src="https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508204.png" alt="img" loading="lazy"></p><h1 id="zustand-新" tabindex="-1"><a class="header-anchor" href="#zustand-新"><span>Zustand(新)</span></a></h1><blockquote><p><a href="https://zustand.nodejs.cn/docs/getting-started/introduction" target="_blank" rel="noopener noreferrer">简介 | Zustand 中文网</a></p></blockquote><p><strong>Zustand</strong> 是一个用于 React 应用的状态管理库，它的名字在德语中意思是“状态”。</p><p>与其他大型状态管理库（如 Redux）相比，Zustand 的主要特点是：</p><ul><li><strong>极简的 API</strong>：它没有 Redux 那样复杂的 <code>action</code>、<code>reducer</code>、<code>middleware</code> 等概念。你只需一个函数就能创建并管理你的状态。</li><li><strong>不使用 Context API</strong>：Zustand 通过 Hook 的方式在组件外部创建状态，然后直接在组件内部使用，这避免了 React Context 带来的重新渲染问题，因为它只在状态真正变化时才会通知组件更新。</li><li><strong>无样板代码</strong>：告别了大量的配置文件和繁琐的设置。创建一个 Zustand store 非常简单，就像写一个 JavaScript 对象一样。</li><li><strong>响应式</strong>：它会订阅你的组件，当状态发生改变时，只有使用了该状态的组件才会重新渲染，而不是整个应用。</li></ul><h2 id="快速上手-1" tabindex="-1"><a class="header-anchor" href="#快速上手-1"><span>快速上手</span></a></h2><p>Zustand 的工作方式非常简单，主要围绕一个核心概念：<strong>Store（状态仓库）</strong>。</p><h3 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用"><span>基本使用</span></a></h3><ol><li>创建 Store</li></ol><p>你使用 <code>create</code> 函数来创建一个 store。这个函数接收一个回调，其中包含 <code>set</code> 和 <code>get</code> 两个方法。</p><ul><li><code>set</code>：用于更新状态。你可以传递一个新状态对象，或者一个接收当前状态作为参数的函数来更新状态。</li><li><code>get</code>：用于获取当前状态。</li></ul><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">// stores/counterStore.js</span>
<span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line"></span>
<span class="line">// 创建一个名为 useCounterStore 的 Hook</span>
<span class="line">const useCounterStore = create((set, get) =&gt; ({</span>
<span class="line">  count: 0,</span>
<span class="line">  // 定义更新 count 的方法</span>
<span class="line">  increment: () =&gt; set(state =&gt; ({ count: state.count + 1 })),</span>
<span class="line">  decrement: () =&gt; set(state =&gt; ({ count: state.count - 1 })),</span>
<span class="line">  // 也可以访问其他状态来更新</span>
<span class="line">  reset: () =&gt; set({ count: 0 }),</span>
<span class="line">}));</span>
<span class="line"></span>
<span class="line">export default useCounterStore;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>在组件中使用store</li></ol><p>在组件中，你可以直接像使用 React Hook 一样使用你创建的 <code>useCounterStore</code>。</p><ul><li><strong>选择性订阅</strong>：你可以选择性地订阅你需要的状态，而不是整个 store。这是 Zustand 高效渲染的关键。</li><li><strong>两种获取状态的方式</strong>： <ol><li><strong>直接获取</strong>：像 <code>const { count, increment } = useCounterStore();</code> 这样。</li><li><strong>函数选择器</strong>：推荐使用这种方式，因为它能确保只有当选定的状态变化时，组件才会重新渲染。</li></ol></li></ul><div class="language-JSX line-numbers-mode" data-highlighter="prismjs" data-ext="JSX"><pre><code class="language-JSX"><span class="line">// components/Counter.jsx</span>
<span class="line">import React from &#39;react&#39;;</span>
<span class="line">import useCounterStore from &#39;../stores/counterStore&#39;;</span>
<span class="line"></span>
<span class="line">function Counter() {</span>
<span class="line">  // 使用函数选择器只获取 count，当 count 变化时才重新渲染</span>
<span class="line">  const count = useCounterStore(state =&gt; state.count);</span>
<span class="line">  const increment = useCounterStore(state =&gt; state.increment);</span>
<span class="line">  const decrement = useCounterStore(state =&gt; state.decrement);</span>
<span class="line"></span>
<span class="line">  return (</span>
<span class="line">    &lt;div&gt;</span>
<span class="line">      &lt;h2&gt;计数器: {count}&lt;/h2&gt;</span>
<span class="line">      &lt;button onClick={increment}&gt;加 1&lt;/button&gt;</span>
<span class="line">      &lt;button onClick={decrement}&gt;减 1&lt;/button&gt;</span>
<span class="line">    &lt;/div&gt;</span>
<span class="line">  );</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">export default Counter;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="异步操作" tabindex="-1"><a class="header-anchor" href="#异步操作"><span>异步操作</span></a></h3><p>可以在 Store 中定义一个异步函数，然后直接在组件中调用它。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line"></span>
<span class="line">interface BearState {</span>
<span class="line">  bears: number;</span>
<span class="line">  fetchBears: () =&gt; Promise&lt;void&gt;;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">const useBearStore = create&lt;BearState&gt;((set) =&gt; ({</span>
<span class="line">  bears: 0,</span>
<span class="line">  fetchBears: async () =&gt; {</span>
<span class="line">    // 假设这是一个异步 API 调用</span>
<span class="line">    const response = await fetch(&#39;https://api.example.com/bears&#39;);</span>
<span class="line">    const data = await response.json();</span>
<span class="line">    set({ bears: data.count });</span>
<span class="line">  },</span>
<span class="line">}));</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="指南" tabindex="-1"><a class="header-anchor" href="#指南"><span>指南</span></a></h2><h3 id="更新状态" tabindex="-1"><a class="header-anchor" href="#更新状态"><span>更新状态</span></a></h3><table><thead><tr><th>更新方式</th><th>行为说明</th></tr></thead><tbody><tr><td><code>set({ key: val })</code></td><td>✅ 扁平更新，浅层合并</td></tr><tr><td><code>set((state) =&gt; ...)</code></td><td>✅ 推荐方式，适合依赖当前状态</td></tr><tr><td><code>set({ user: { ... } })</code></td><td>⚠️ 替换整个对象，注意深合并</td></tr></tbody></table><h4 id="扁平更新" tabindex="-1"><a class="header-anchor" href="#扁平更新"><span>扁平更新</span></a></h4><p>“<strong>扁平更新</strong>”指的是用 <code>set</code> 方法更新状态时，<strong>直接传入对象</strong>（而不是嵌套地合并）来修改状态。这种方式类似于 React 的 <code>useState</code> 的行为，会浅层合并原有状态和新状态。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import { create } from &#39;zustand&#39;</span>
<span class="line"></span>
<span class="line">const useStore = create((set) =&gt; ({</span>
<span class="line">  count: 0,</span>
<span class="line">  title: &#39;Zustand&#39;,</span>
<span class="line">  setCount: (count) =&gt; set({ count }),         // 👈 扁平更新</span>
<span class="line">  setTitle: (title) =&gt; set({ title }),         // 👈 扁平更新</span>
<span class="line">}))</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">function Counter() {</span>
<span class="line">  const { count, setCount } = useStore()</span>
<span class="line">  return (</span>
<span class="line">    &lt;div&gt;</span>
<span class="line">      &lt;h1&gt;{count}&lt;/h1&gt;</span>
<span class="line">      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;+1&lt;/button&gt;</span>
<span class="line">    &lt;/div&gt;</span>
<span class="line">  )</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>set({ count })</code> 只是更新 <code>count</code> 字段，其他字段（比如 <code>title</code>）会保留。</p><h4 id="深度嵌套对象" tabindex="-1"><a class="header-anchor" href="#深度嵌套对象"><span>深度嵌套对象</span></a></h4><h5 id="正常方法" tabindex="-1"><a class="header-anchor" href="#正常方法"><span>正常方法</span></a></h5><p>与 React 或 Redux 类似，正常方法是复制状态对象的每一级。这是通过扩展运算符 <code>...</code> 完成的，并通过手动将其与新状态值合并。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">  normalInc: () =&gt;</span>
<span class="line">    set((state) =&gt; ({</span>
<span class="line">      deep: {</span>
<span class="line">        ...state.deep,</span>
<span class="line">        nested: {</span>
<span class="line">          ...state.deep.nested,</span>
<span class="line">          obj: {</span>
<span class="line">            ...state.deep.nested.obj,</span>
<span class="line">            count: state.deep.nested.obj.count + 1</span>
<span class="line">          }</span>
<span class="line">        }</span>
<span class="line">      }</span>
<span class="line">    })),</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="使用immer" tabindex="-1"><a class="header-anchor" href="#使用immer"><span>使用Immer</span></a></h5><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import { create } from &#39;zustand&#39;</span>
<span class="line">import { immer } from &#39;zustand/middleware/immer&#39;</span>
<span class="line"></span>
<span class="line">const useStore = create(</span>
<span class="line">  immer((set) =&gt; ({</span>
<span class="line">    user: {</span>
<span class="line">      name: &#39;Tom&#39;,</span>
<span class="line">      address: {</span>
<span class="line">        city: &#39;Shanghai&#39;,</span>
<span class="line">        zip: &#39;200000&#39;</span>
<span class="line">      }</span>
<span class="line">    },</span>
<span class="line">    updateCity: (city) =&gt;</span>
<span class="line">      set((state) =&gt; {</span>
<span class="line">        state.user.address.city = city // ✅ 类似直接修改，内部自动生成不可变数据</span>
<span class="line">      })</span>
<span class="line">  }))</span>
<span class="line">)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="使用optics-ts" tabindex="-1"><a class="header-anchor" href="#使用optics-ts"><span>使用optics-ts</span></a></h5><p>专门用于在 <strong>TypeScript 中安全访问和更新深度嵌套对象</strong></p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import { optics, set } from &#39;optics-ts&#39;</span>
<span class="line"></span>
<span class="line">type State = {</span>
<span class="line">  user: {</span>
<span class="line">    address: {</span>
<span class="line">      city: string</span>
<span class="line">      zip: string</span>
<span class="line">    }</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">const state: State = {</span>
<span class="line">  user: {</span>
<span class="line">    address: {</span>
<span class="line">      city: &#39;Shanghai&#39;,</span>
<span class="line">      zip: &#39;200000&#39;</span>
<span class="line">    }</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">const cityOptic = optics&lt;State&gt;().user.address.city</span>
<span class="line"></span>
<span class="line">const newState = set(cityOptic)(state, &#39;Beijing&#39;)</span>
<span class="line"></span>
<span class="line">// newState = { user: { address: { city: &#39;Beijing&#39;, zip: &#39;200000&#39; } } }</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在Zustand中的用法：</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">const useStore = create((set) =&gt; ({</span>
<span class="line">  state: { user: { address: { city: &#39;Shanghai&#39; } } },</span>
<span class="line">  setCity: (city) =&gt;</span>
<span class="line">    set((s) =&gt; ({</span>
<span class="line">      state: set(optics&lt;typeof s&gt;().state.user.address.city)(s, city),</span>
<span class="line">    })),</span>
<span class="line">}))</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="使用ramda" tabindex="-1"><a class="header-anchor" href="#使用ramda"><span>使用Ramda</span></a></h5><p>Ramda 是一个通用的函数式编程库，目标是让数据变换更声明式、更纯粹。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import * as R from &#39;ramda&#39;</span>
<span class="line"></span>
<span class="line">const state = {</span>
<span class="line">  user: {</span>
<span class="line">    address: {</span>
<span class="line">      city: &#39;Shanghai&#39;,</span>
<span class="line">      zip: &#39;200000&#39;</span>
<span class="line">    }</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 访问</span>
<span class="line">R.path([&#39;user&#39;, &#39;address&#39;, &#39;city&#39;], state) // =&gt; &#39;Shanghai&#39;</span>
<span class="line"></span>
<span class="line">// 更新</span>
<span class="line">const newState = R.assocPath([&#39;user&#39;, &#39;address&#39;, &#39;city&#39;], &#39;Beijing&#39;, state)</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="不可变状态与合并" tabindex="-1"><a class="header-anchor" href="#不可变状态与合并"><span>不可变状态与合并</span></a></h3><h4 id="不可变更新" tabindex="-1"><a class="header-anchor" href="#不可变更新"><span>不可变更新</span></a></h4><p>与 React 的 <code>useState</code> 一样，我们需要不可变地更新状态。</p><p>这是一个典型的例子：</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import { create } from &#39;zustand&#39;</span>
<span class="line"></span>
<span class="line">const useCountStore = create((set) =&gt; ({</span>
<span class="line">  count: 0,</span>
<span class="line">  inc: () =&gt; set((state) =&gt; ({ count: state.count + 1 })),</span>
<span class="line">}))</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>set</code> 函数用于更新存储中的状态。因为状态是不可变的，所以应该是这样的：</p><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">set((state) =&gt; ({ ...state, count: state.count + 1 }))</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>但是，由于这是一种常见模式，<code>set</code> 实际上合并了状态，我们可以跳过 <code>...state</code> 部分：</p><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">set((state) =&gt; ({ count: state.count + 1 }))</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="浅合并" tabindex="-1"><a class="header-anchor" href="#浅合并"><span>浅合并</span></a></h4><p>当你调用 <code>set(newState)</code> 或者 <code>set(callback)</code> 时，Zustand 默认会<strong>浅合并</strong>你提供的新状态对象和旧状态对象。这意味着它会用新对象中的属性来覆盖旧对象中的同名属性，而保留旧对象中没有在新对象中出现的属性。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line"></span>
<span class="line">interface State {</span>
<span class="line">  count: number;</span>
<span class="line">  theme: &#39;light&#39; | &#39;dark&#39;;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">const useStore = create&lt;State&gt;((set) =&gt; ({</span>
<span class="line">  count: 0,</span>
<span class="line">  theme: &#39;light&#39;,</span>
<span class="line">  // 这里的 set 函数默认会合并</span>
<span class="line">  setTheme: (newTheme: &#39;light&#39; | &#39;dark&#39;) =&gt; set({ theme: newTheme }),</span>
<span class="line">}));</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当你调用 <code>useStore.getState().setTheme(&#39;dark&#39;)</code> 时，<code>set</code> 内部收到的对象是 <code>{ theme: &#39;dark&#39; }</code>。Zustand 会将它与旧状态 <code>{ count: 0, theme: &#39;light&#39; }</code> 进行合并，结果是 <code>{ count: 0, theme: &#39;dark&#39; }</code>。<strong><code>count</code> 属性被保留了，这就是浅合并。</strong></p><h4 id="覆盖合并" tabindex="-1"><a class="header-anchor" href="#覆盖合并"><span>覆盖合并</span></a></h4><p><code>set((state) =&gt; newState, true)</code>。</p><p><code>set</code> 的第二个参数是一个可选的布尔值。当这个参数被设为 <code>true</code> 时，它会<strong>关闭</strong>Zustand 的默认浅合并行为，转而执行<strong>完全覆盖</strong>。</p><ul><li><code>set(newState, false)</code> <strong>(或不传，默认)</strong>：执行<strong>浅合并</strong>，保留旧状态中未被新状态覆盖的属性。</li><li><code>set(newState, true)</code>：执行<strong>完全覆盖</strong>，旧状态会被 <code>newState</code> 完全替换，任何未包含在 <code>newState</code> 中的属性都会丢失。</li></ul><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">const useStore = create&lt;State&gt;((set) =&gt; ({</span>
<span class="line">  count: 0,</span>
<span class="line">  theme: &#39;light&#39;,</span>
<span class="line">  // 这是一个会覆盖整个状态的函数</span>
<span class="line">  setCountAndTheme: (newCount: number, newTheme: &#39;light&#39; | &#39;dark&#39;) =&gt; {</span>
<span class="line">    // 这里的第二个参数设为 true，表示完全覆盖旧状态</span>
<span class="line">    set({ count: newCount, theme: newTheme }, true);</span>
<span class="line">  },</span>
<span class="line">}));</span>
<span class="line"></span>
<span class="line">// 假设我们这样使用</span>
<span class="line">const store = useStore.getState();</span>
<span class="line"></span>
<span class="line">// 原始状态: { count: 0, theme: &#39;light&#39; }</span>
<span class="line">console.log(store.count, store.theme); // 0, &#39;light&#39;</span>
<span class="line"></span>
<span class="line">// 调用 set({ theme: &#39;dark&#39; }, true)</span>
<span class="line">store.set({ theme: &#39;dark&#39; }, true);</span>
<span class="line"></span>
<span class="line">// 此时，count 属性会丢失，因为新状态没有包含它</span>
<span class="line">// 新状态: { theme: &#39;dark&#39; }</span>
<span class="line">console.log(store.count, store.theme); // undefined, &#39;dark&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个例子中，因为我们使用了 <code>set({ theme: &#39;dark&#39; }, true)</code>，Zustand 不会去合并 <code>count</code> 属性，而是直接用 <code>{ theme: &#39;dark&#39; }</code> 替换了整个 Store 的状态，导致 <code>count</code> 消失了。</p><h3 id="自动生成选择器" tabindex="-1"><a class="header-anchor" href="#自动生成选择器"><span>自动生成选择器</span></a></h3><p>扁平结构：可以自动生成 selector（性能高）</p><p>嵌套结构：配合 <code>optics-ts</code>、<code>immer</code> 做不可变更新，selector 还是手动写清晰些</p><p>使用工具自动生成，不影响 devtools、调试体验</p><h3 id="重置状态" tabindex="-1"><a class="header-anchor" href="#重置状态"><span>重置状态</span></a></h3><p>Zustand 没有 <code>reset()</code> 内置函数，但你可以通过保留 <code>initialState</code> 来实现“安全、稳定、类型友好”的状态重置。</p><h4 id="手动保存初始状态并提供reset方法" tabindex="-1"><a class="header-anchor" href="#手动保存初始状态并提供reset方法"><span>手动保存初始状态并提供reset方法</span></a></h4><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import { create } from &#39;zustand&#39;</span>
<span class="line"></span>
<span class="line">const initialState = {</span>
<span class="line">  count: 0,</span>
<span class="line">  user: {</span>
<span class="line">    name: &#39;&#39;,</span>
<span class="line">    age: 0</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">const useStore = create((set) =&gt; ({</span>
<span class="line">  ...initialState,</span>
<span class="line"></span>
<span class="line">  // 你可以更新 state</span>
<span class="line">  increment: () =&gt; set((state) =&gt; ({ count: state.count + 1 })),</span>
<span class="line"></span>
<span class="line">  // 自定义 reset 方法</span>
<span class="line">  reset: () =&gt; set(initialState)</span>
<span class="line">}))</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">const reset = useStore((state) =&gt; state.reset)</span>
<span class="line">reset()  // 会重置为 initialState</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="结合getstate-实现更灵活的reset" tabindex="-1"><a class="header-anchor" href="#结合getstate-实现更灵活的reset"><span>结合<code>getState()</code>实现更灵活的reset</span></a></h4><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">const useStore = create((set, get) =&gt; {</span>
<span class="line">  const initial = {</span>
<span class="line">    count: 0,</span>
<span class="line">    user: { name: &#39;&#39;, age: 0 }</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  return {</span>
<span class="line">    ...initial,</span>
<span class="line">    increment: () =&gt; set({ count: get().count + 1 }),</span>
<span class="line">    reset: () =&gt; set(initial)  // 从闭包中取 initial</span>
<span class="line">  }</span>
<span class="line">})</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="zustand-reset中间件" tabindex="-1"><a class="header-anchor" href="#zustand-reset中间件"><span><code>zustand-reset</code>中间件</span></a></h4><p><a href="https://github.com/pmndrs/zustand/discussions/1221" target="_blank" rel="noopener noreferrer">zustand-reset</a> 是社区方案，适合大型 store 的模块化重置，或者使用多 store 的场景，不推荐在简单项目中使用。</p><h4 id="创建store时动态保存初始状态" tabindex="-1"><a class="header-anchor" href="#创建store时动态保存初始状态"><span>创建store时动态保存初始状态</span></a></h4><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">const useStore = create((set, get) =&gt; {</span>
<span class="line">  const initial = {</span>
<span class="line">    count: 0,</span>
<span class="line">    user: { name: &#39;&#39;, age: 0 }</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  return {</span>
<span class="line">    ...initial,</span>
<span class="line">    reset: () =&gt; set(() =&gt; ({ ...initial }))</span>
<span class="line">  }</span>
<span class="line">})</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用props初始化状态" tabindex="-1"><a class="header-anchor" href="#使用props初始化状态"><span>使用props初始化状态</span></a></h3><p><strong>使用 props 初始化状态</strong> 是指在 React 组件中，利用从父组件传递下来的 <strong>props</strong> 作为组件内部 <strong>state</strong> 的初始值。</p><p>当一个组件第一次被创建并挂载到 DOM 上时，它会从父组件那里接收一组数据（即 props），然后将其中一部分或全部数据赋值给自己的内部状态。</p><h4 id="作用" tabindex="-1"><a class="header-anchor" href="#作用"><span>作用</span></a></h4><p>这种模式的核心价值在于<strong>状态的独立性</strong>，它将外部数据（props）和内部数据（state）分离开来。</p><ol><li><strong>提供了初始值</strong>：这是最直接的用途。你不需要在组件内部硬编码初始数据，而是让父组件灵活地决定初始状态是什么。这使得组件更加通用和可复用。</li><li><strong>隔离了状态变化</strong>：一旦状态被初始化，它就独立于 props。即使父组件后续重新渲染并传递了不同的 props，子组件的内部状态也不会自动更新。这有效地防止了父组件的改变意外地影响子组件的内部状态。</li><li><strong>支持内部状态管理</strong>：这种模式让组件可以独立地处理用户交互。例如，一个表单组件从 props 接收初始值，但之后用户的输入只改变表单内部的状态，不会反向影响父组件。</li></ol><p>简而言之，它允许你创建一个<strong>可控的、有初始值的、但之后可以自由变化的组件</strong>。</p><h4 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景"><span>使用场景</span></a></h4><ol><li>创建有初始值的表单组件</li></ol><p>当你需要创建一个表单，其输入框或选择器的初始值由外部数据决定时。用户在表单中的任何输入都会改变内部状态，但不会影响外部数据。</p><p><strong>例子</strong>：一个编辑用户资料的表单。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">// 父组件提供初始数据</span>
<span class="line">&lt;UserEditForm userData={{ name: &quot;Alice&quot;, email: &quot;alice@example.com&quot; }} /&gt;</span>
<span class="line"></span>
<span class="line">// UserEditForm 内部，使用 userData 初始化表单状态</span>
<span class="line">const [name, setName] = useState(userData.name);</span>
<span class="line">const [email, setEmail] = useState(userData.email);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>实现一个可以被用户修改的计数器或开关</li></ol><p>当一个组件需要一个由父组件决定的初始值，但之后可以独立地由用户交互来改变其值时。</p><p><strong>例子</strong>：一个点赞按钮组件。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">// 父组件提供初始点赞数</span>
<span class="line">&lt;LikeButton initialCount={100} /&gt;</span>
<span class="line"></span>
<span class="line">// LikeButton 内部，使用 initialCount 初始化状态</span>
<span class="line">const [count, setCount] = useState(initialCount);</span>
<span class="line">// 用户点击后，count 会独立地增加，不再受 initialCount 变化的影响</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>将数据从“受控”转为”非受控”</li></ol><p>这种模式常用于将一个<strong>受控组件</strong>（状态由父组件完全控制）转换为一个<strong>非受控组件</strong>（状态由自己内部管理）。组件的初始状态是受控的，但之后的行为是独立的。</p><p><strong>例子</strong>：一个具有可拖动边界的面板。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">// 父组件决定面板的初始位置</span>
<span class="line">&lt;ResizablePanel initialWidth={200} /&gt;</span>
<span class="line"></span>
<span class="line">// ResizablePanel 内部，使用 initialWidth 初始化状态</span>
<span class="line">const [width, setWidth] = useState(initialWidth);</span>
<span class="line">// 之后用户拖动面板时，width 只会在内部变化</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h4><p>一个 <code>UserProfile</code> 组件，它从父组件接收 <code>initialName</code> 和 <code>initialAge</code> 作为 props。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">// 父组件</span>
<span class="line">&lt;UserProfile initialName=&quot;Alice&quot; initialAge={30} /&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>UserProfile</code> 内部，它会将这两个 props 的值赋给自己的状态。</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">import React, { useState } from &#39;react&#39;;</span>
<span class="line"></span>
<span class="line">interface UserProfileProps {</span>
<span class="line">  initialName: string;</span>
<span class="line">  initialAge: number;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">function UserProfile({ initialName, initialAge }: UserProfileProps) {</span>
<span class="line">  // 使用 props 的值作为 useState 的初始值</span>
<span class="line">  const [name, setName] = useState&lt;string&gt;(initialName);</span>
<span class="line">  const [age, setAge] = useState&lt;number&gt;(initialAge);</span>
<span class="line"></span>
<span class="line">  // ... 之后组件内部可以独立地修改 name 和 age</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="切片模式-1" tabindex="-1"><a class="header-anchor" href="#切片模式-1"><span>切片模式</span></a></h3><p>当你的状态越来越复杂，Zustand 的 store 会变得臃肿。切片模式的目的就是：</p><table><thead><tr><th>优点</th><th>描述</th></tr></thead><tbody><tr><td>✅ 模块化</td><td>把状态拆成小的 slice，每个 slice 专注一个功能</td></tr><tr><td>✅ 可读性更高</td><td>每个模块职责单一，便于维护</td></tr><tr><td>✅ 支持类型提示</td><td>类型推导清晰，不容易出错</td></tr><tr><td>✅ 可组合</td><td>多个 slice 合并成一个大的 store</td></tr></tbody></table><p><strong>使用流程：</strong></p><ol><li>定义每个Slice（模块）</li></ol><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">// slices/counterSlice.ts</span>
<span class="line">export interface CounterSlice {</span>
<span class="line">  count: number</span>
<span class="line">  increment: () =&gt; void</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">export const createCounterSlice = (set): CounterSlice =&gt; ({</span>
<span class="line">  count: 0,</span>
<span class="line">  increment: () =&gt; set((state) =&gt; ({ count: state.count + 1 }))</span>
<span class="line">})</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">// slices/userSlice.ts</span>
<span class="line">export interface UserSlice {</span>
<span class="line">  user: { name: string }</span>
<span class="line">  setUser: (user: { name: string }) =&gt; void</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">export const createUserSlice = (set): UserSlice =&gt; ({</span>
<span class="line">  user: { name: &#39;&#39; },</span>
<span class="line">  setUser: (user) =&gt; set({ user })</span>
<span class="line">})</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>组合多个Slice生成一个Store</li></ol><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">// store/index.ts</span>
<span class="line">import { create } from &#39;zustand&#39;</span>
<span class="line">import { createCounterSlice, CounterSlice } from &#39;./slices/counterSlice&#39;</span>
<span class="line">import { createUserSlice, UserSlice } from &#39;./slices/userSlice&#39;</span>
<span class="line"></span>
<span class="line">// 通过联合类型合并多个 slice 成完整 AppState</span>
<span class="line">type AppState = CounterSlice &amp; UserSlice</span>
<span class="line"></span>
<span class="line">export const useStore = create&lt;AppState&gt;()((set) =&gt; ({</span>
<span class="line">  ...createCounterSlice(set),</span>
<span class="line">  ...createUserSlice(set),</span>
<span class="line">}))</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>使用</li></ol><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">const count = useStore((s) =&gt; s.count)</span>
<span class="line">const increment = useStore((s) =&gt; s.increment)</span>
<span class="line"></span>
<span class="line">const user = useStore((s) =&gt; s.user)</span>
<span class="line">const setUser = useStore((s) =&gt; s.setUser)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="useshallow防止重新渲染" tabindex="-1"><a class="header-anchor" href="#useshallow防止重新渲染"><span><code>useShallow</code>防止重新渲染</span></a></h3><h4 id="重新渲染" tabindex="-1"><a class="header-anchor" href="#重新渲染"><span>重新渲染</span></a></h4><p><strong>重新渲染</strong>指的是 React 组件因为某些变化而再次执行其渲染函数（即函数组件的整个函数体）。这个过程会生成新的虚拟 DOM（Virtual DOM）树，然后 React 会将新的虚拟 DOM 与旧的进行比较，找出差异，最后只更新真实 DOM 中发生变化的部分。</p><p>重新渲染的主要触发条件有三个：</p><ol><li><strong>状态（State）变化</strong>：组件内部的状态 (<code>useState</code>) 发生变化。</li><li><strong>属性（Props）变化</strong>：父组件重新渲染时，向子组件传递了新的属性。</li><li><strong>上下文（Context）变化</strong>：组件订阅的 React Context 发生变化。</li></ol><p>在大多数情况下，重新渲染是 React 保持 UI 与数据同步的正常工作机制。但如果重新渲染过于频繁，或者渲染了本不需要更新的组件，就会造成不必要的性能开销，导致应用卡顿。</p><p><strong>一个常见的性能问题是：</strong> 当一个组件订阅了 Zustand Store 的所有状态，而 Store 中只有一个不相关的属性改变时，该组件也会重新渲染。即使它只使用了 Store 中的一小部分数据，但因为整个 Store 对象的引用改变了，它仍会被通知更新。</p><h4 id="使用方法" tabindex="-1"><a class="header-anchor" href="#使用方法"><span>使用方法</span></a></h4><p><code>useShallow</code>作用是<strong>只在状态的浅层内容发生变化时才触发组件重新渲染</strong>。它通过执行<strong>浅比较</strong>来优化性能。</p><p>假设 Zustand Store 的状态是 <code>{ count: 0, theme: &#39;light&#39; }</code>。</p><ul><li><strong>第一次渲染</strong>：选择器返回 <code>{ count: 0 }</code>。组件正常渲染。</li><li><strong>Store 状态变为 <code>{ count: 0, theme: &#39;dark&#39; }</code></strong>： <ul><li>选择器再次执行，返回 <code>{ count: 0 }</code>。</li><li><code>useShallow</code> 将 <code>{ count: 0 }</code> 与上一次返回的 <code>{ count: 0 }</code> 进行浅比较。</li><li>因为 <code>count</code> 的值没有变化，<code>useShallow</code> 判断它们是相等的，所以<strong>阻止了组件重新渲染</strong>。</li></ul></li><li><strong>Store 状态变为 <code>{ count: 1, theme: &#39;dark&#39; }</code></strong>： <ul><li>选择器再次执行，返回 <code>{ count: 1 }</code>。</li><li><code>useShallow</code> 将 <code>{ count: 1 }</code> 与上一次返回的 <code>{ count: 0 }</code> 进行浅比较。</li><li>因为 <code>count</code> 的值变了，<code>useShallow</code> 判断它们不相等，所以<strong>允许组件重新渲染</strong>。</li></ul></li></ul><p>使用 <code>useShallow</code> 的语法非常简单，你只需将选择器函数包裹在 <code>useShallow</code> 中即可:</p><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">import React from &#39;react&#39;;</span>
<span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line">import { useShallow } from &#39;zustand/react&#39;; // 从 zustand/react 导入 useShallow</span>
<span class="line"></span>
<span class="line">// 假设我们的 Store 有多个属性</span>
<span class="line">interface MyState {</span>
<span class="line">  count: number;</span>
<span class="line">  theme: &#39;light&#39; | &#39;dark&#39;;</span>
<span class="line">  user: {</span>
<span class="line">    name: string;</span>
<span class="line">  };</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">const useMyStore = create&lt;MyState&gt;(() =&gt; ({</span>
<span class="line">  count: 0,</span>
<span class="line">  theme: &#39;light&#39;,</span>
<span class="line">  user: {</span>
<span class="line">    name: &#39;Alice&#39;,</span>
<span class="line">  },</span>
<span class="line">}));</span>
<span class="line"></span>
<span class="line">function MyComponent() {</span>
<span class="line">  // 使用 useShallow，只选择 count 和 user.name</span>
<span class="line">  // 当 theme 变化时，这个组件不会重新渲染</span>
<span class="line">  // 当 user.name 变化时，这个组件会重新渲染</span>
<span class="line">  // 当 count 变化时，这个组件会重新渲染</span>
<span class="line">  const { count, userName } = useMyStore(</span>
<span class="line">    useShallow((state) =&gt; ({</span>
<span class="line">      count: state.count,</span>
<span class="line">      userName: state.user.name,</span>
<span class="line">    })),</span>
<span class="line">  );</span>
<span class="line">  </span>
<span class="line">  console.log(&#39;MyComponent 重新渲染了！&#39;);</span>
<span class="line"></span>
<span class="line">  return (</span>
<span class="line">    &lt;div&gt;</span>
<span class="line">      &lt;p&gt;计数: {count}&lt;/p&gt;</span>
<span class="line">      &lt;p&gt;用户名: {userName}&lt;/p&gt;</span>
<span class="line">    &lt;/div&gt;</span>
<span class="line">  );</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="api" tabindex="-1"><a class="header-anchor" href="#api"><span>API</span></a></h2><h2 id="钩子" tabindex="-1"><a class="header-anchor" href="#钩子"><span>钩子</span></a></h2><h2 id="中间件" tabindex="-1"><a class="header-anchor" href="#中间件"><span>中间件</span></a></h2><h3 id="combine" tabindex="-1"><a class="header-anchor" href="#combine"><span>combine</span></a></h3><p><code>combine</code> 中间件是 Zustand 提供的一个实用工具，它的主要作用是<strong>将状态（State）和方法（Actions/Methods）分开定义，然后将它们组合成一个完整的 Store 对象</strong>。这使得状态和逻辑的组织更加清晰，尤其是在 TypeScript 环境下，能提供更好的类型推断和代码可读性。</p><h4 id="问题引入" tabindex="-1"><a class="header-anchor" href="#问题引入"><span>问题引入</span></a></h4><p><code>combine</code> 旨在解决一个特定的 TypeScript 痛点：当你在 <code>create</code> 函数中定义状态和方法时，所有属性都混在一起。</p><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">// 没有使用 combine 的代码</span>
<span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line"></span>
<span class="line">interface MyState {</span>
<span class="line">  count: number;</span>
<span class="line">  increment: () =&gt; void;</span>
<span class="line">  decrement: () =&gt; void;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">const useMyStore = create&lt;MyState&gt;((set) =&gt; ({</span>
<span class="line">  count: 0,</span>
<span class="line">  increment: () =&gt; set((state) =&gt; ({ count: state.count + 1 })),</span>
<span class="line">  decrement: () =&gt; set((state) =&gt; ({ count: state.count - 1 })),</span>
<span class="line">}));</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个例子中，<code>count</code> 和 <code>increment</code> 属于同一个对象，但它们的角色不同（一个表示状态，一个表示方法）。当 Store 变得复杂时，这种模式会使代码变得难以管理。</p><p><code>combine</code> 中间件通过一种更结构化的方式来解决这个问题：</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">const nextStateCreatorFn = combine(initialState, additionalStateCreatorFn)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ol><li><strong>它接收一个初始状态对象。</strong></li><li><strong>它接收一个返回方法的函数。</strong></li><li><strong>它将两者合并成一个 Store 对象。</strong></li></ol><h4 id="基本用法" tabindex="-1"><a class="header-anchor" href="#基本用法"><span>基本用法</span></a></h4><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line">import { combine } from &#39;zustand/middleware&#39;;</span>
<span class="line"></span>
<span class="line">// 1. 定义状态的类型</span>
<span class="line">interface State {</span>
<span class="line">  count: number;</span>
<span class="line">  text: string;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 2. 定义方法的类型</span>
<span class="line">interface Actions {</span>
<span class="line">  increment: () =&gt; void;</span>
<span class="line">  setText: (newText: string) =&gt; void;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 3. 将状态和方法合并</span>
<span class="line">type MyStore = State &amp; Actions;</span>
<span class="line"></span>
<span class="line">// 4. 创建 Store</span>
<span class="line">const useMyStore = create&lt;MyStore&gt;(</span>
<span class="line">  // 使用 combine 中间件</span>
<span class="line">  combine&lt;State, Actions&gt;(</span>
<span class="line">    // 第一个参数：初始状态</span>
<span class="line">    {</span>
<span class="line">      count: 0,</span>
<span class="line">      text: &#39;hello&#39;,</span>
<span class="line">    },</span>
<span class="line">    // 第二个参数：返回方法的函数，它接收 set 和 get 作为参数</span>
<span class="line">    (set) =&gt; ({</span>
<span class="line">      increment: () =&gt; set((state) =&gt; ({ count: state.count + 1 })),</span>
<span class="line">      setText: (newText: string) =&gt; set({ text: newText }),</span>
<span class="line">    })</span>
<span class="line">  )</span>
<span class="line">);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="结合切片使用" tabindex="-1"><a class="header-anchor" href="#结合切片使用"><span>结合切片使用</span></a></h4><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">// slices/counterSlice.ts</span>
<span class="line">import { StateCreator } from &#39;zustand&#39;;</span>
<span class="line">import { combine } from &#39;zustand/middleware&#39;;</span>
<span class="line"></span>
<span class="line">// 状态类型</span>
<span class="line">interface CounterState {</span>
<span class="line">    count: number;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 方法类型</span>
<span class="line">interface CounterActions {</span>
<span class="line">    increment: () =&gt; void;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 切片函数</span>
<span class="line">export const createCounterSlice: StateCreator&lt;</span>
<span class="line">    CounterState &amp; CounterActions, // 整个切片的类型</span>
<span class="line">    [[&#39;zustand/combine&#39;, CounterState, CounterActions]] // combine 的类型参数</span>
<span class="line">&gt; = combine&lt;CounterState, CounterActions&gt;(</span>
<span class="line">    // 初始状态</span>
<span class="line">    {</span>
<span class="line">        count: 0,</span>
<span class="line">    },</span>
<span class="line">    // 方法</span>
<span class="line">    (set) =&gt; ({</span>
<span class="line">        increment: () =&gt; set((state) =&gt; ({ count: state.count + 1 })),</span>
<span class="line">    })</span>
<span class="line">);</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">// store/useAppStore.ts</span>
<span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line">import { createCounterSlice } from &#39;./slices/counterSlice&#39;;</span>
<span class="line">import { createAuthSlice } from &#39;./slices/authSlice&#39;;</span>
<span class="line"></span>
<span class="line">// 组合所有切片的类型</span>
<span class="line">type AppState = CounterState &amp; CounterActions &amp; AuthState &amp; AuthActions;</span>
<span class="line"></span>
<span class="line">const useAppStore = create&lt;AppState&gt;()((...a) =&gt; ({</span>
<span class="line">    ...createCounterSlice(...a),</span>
<span class="line">    ...createAuthSlice(...a),</span>
<span class="line">}));</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>A. <code>StateCreator&lt;CounterState &amp; CounterActions, ...&gt;</code></p><ul><li><strong><code>StateCreator</code></strong> 是 Zustand 提供的核心类型，用于创建 Store 或切片。它的完整类型签名是 <code>StateCreator&lt;T, A, B, C&gt;</code>，其中： <ul><li><code>T</code>：最终 Store 的<strong>状态类型</strong>。</li><li><code>A</code>、<code>B</code>、<code>C</code>：可选的中间件类型参数。</li></ul></li><li>在这里，<code>T</code> 是 <code>CounterState &amp; CounterActions</code>。这行代码告诉 TypeScript： <ul><li>最终创建的 Store 对象将同时包含 <code>CounterState</code> 中定义的所有属性（<code>count: number</code>）。</li><li>以及 <code>CounterActions</code> 中定义的所有属性（<code>increment: () =&gt; void</code>）。</li></ul></li><li>这是对最终 Store 形状的一个<strong>整体描述</strong>。</li></ul><p>B. <code>[[&#39;zustand/combine&#39;, CounterState, CounterActions]]</code></p><ul><li>这是 <code>StateCreator</code> 的第二个类型参数，它是一个<strong>中间件的类型元组</strong>。</li><li>这个类型元组的格式是 <code>[[&#39;中间件名称&#39;, 类型1, 类型2, ...]]</code>。它的作用是告诉 TypeScript，这个 <code>StateCreator</code> 将<strong>被哪个中间件包装</strong>，以及该中间件的<strong>类型参数是什么</strong>。</li><li>在这里，<code>[[&#39;zustand/combine&#39;, CounterState, CounterActions]]</code> 告诉 TypeScript： <ol><li>这个 <code>StateCreator</code> 将被 <code>zustand/combine</code> 中间件所包装。</li><li><code>combine</code> 中间件接收两个类型参数，分别是 <code>CounterState</code> 和 <code>CounterActions</code>。</li></ol></li></ul><h3 id="devtools" tabindex="-1"><a class="header-anchor" href="#devtools"><span>devtools</span></a></h3><h3 id="immer" tabindex="-1"><a class="header-anchor" href="#immer"><span>immer</span></a></h3><p>简化不可变的嵌套数据的修改</p><div class="language-TS line-numbers-mode" data-highlighter="prismjs" data-ext="TS"><pre><code class="language-TS"><span class="line">const nextStateCreatorFn = immer(stateCreatorFn)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="persist" tabindex="-1"><a class="header-anchor" href="#persist"><span>persist</span></a></h3><p><code>persist</code> 中间件的核心作用是<strong>将你的 Store 状态持久化到浏览器中</strong>，比如 <code>localStorage</code> 或 <code>sessionStorage</code>。这意味着即使你刷新页面，Store 的状态也不会丢失，而是会从持久化存储中自动恢复。</p><h4 id="问题引入-1" tabindex="-1"><a class="header-anchor" href="#问题引入-1"><span>问题引入</span></a></h4><p>在没有 <code>persist</code> 中间件的情况下，当你的应用重新加载（比如用户刷新了页面），Zustand Store 会被重置为它的初始状态。这对于许多应用场景来说是不希望发生的，比如：</p><ul><li><strong>用户登录状态</strong>：你希望用户登录后，即使刷新页面也保持登录状态。</li><li><strong>购物车内容</strong>：用户不小心关闭了页面，重新打开后购物车里的商品还在。</li><li><strong>应用主题设置</strong>：用户选择的深色主题，希望在下次访问时依然生效。</li></ul><p><code>persist</code> 中间件就是为了解决这些问题而生的。它为你自动处理了以下工作：</p><ol><li><strong>保存状态</strong>：当 Store 的状态发生变化时，它会自动将最新的状态保存到你指定的存储中（默认是 <code>localStorage</code>）。</li><li><strong>恢复状态</strong>：当应用加载时，它会首先检查存储中是否有已保存的状态。如果有，它会用这个状态来初始化 Store，而不是使用默认的初始状态。</li><li><strong>异步恢复</strong>：<code>persist</code> 是异步的，它允许你在状态恢复完成之前，显示一个加载状态，以防止 UI 闪烁。</li></ol><h4 id="基本用法-1" tabindex="-1"><a class="header-anchor" href="#基本用法-1"><span>基本用法</span></a></h4><p>最简单的用法是直接使用 <code>persist</code>，它会默认将状态以 Store 的名字作为键，存储在 <code>localStorage</code> 中：</p><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line">import { persist } from &#39;zustand/middleware&#39;;</span>
<span class="line"></span>
<span class="line">interface UserState {</span>
<span class="line">  isLoggedIn: boolean;</span>
<span class="line">  username: string;</span>
<span class="line">  login: (name: string) =&gt; void;</span>
<span class="line">  logout: () =&gt; void;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 整个 Store 函数被包裹在 persist 中</span>
<span class="line">const useUserStore = create&lt;UserState&gt;()(</span>
<span class="line">  persist(</span>
<span class="line">    (set) =&gt; ({</span>
<span class="line">      isLoggedIn: false,</span>
<span class="line">      username: &#39;&#39;,</span>
<span class="line">      login: (name) =&gt; set({ isLoggedIn: true, username: name }),</span>
<span class="line">      logout: () =&gt; set({ isLoggedIn: false, username: &#39;&#39; }),</span>
<span class="line">    }),</span>
<span class="line">    {</span>
<span class="line">      // persist 的配置对象</span>
<span class="line">      name: &#39;user-storage&#39;, // 在 localStorage 中的键名，必须唯一</span>
<span class="line">    }</span>
<span class="line">  )</span>
<span class="line">);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>当 <code>login</code> 方法被调用时，<code>isLoggedIn</code> 和 <code>username</code> 的新值会被自动保存到 <code>localStorage</code> 中，键名是 <code>&#39;user-storage&#39;</code>。</li><li>当页面刷新时，<code>useUserStore</code> 会首先检查 <code>localStorage</code>，发现 <code>&#39;user-storage&#39;</code> 存在，就会用里面的值来初始化 Store，而不是使用 <code>isLoggedIn: false, username: &#39;&#39;</code>。</li></ul><h4 id="配置选项" tabindex="-1"><a class="header-anchor" href="#配置选项"><span>配置选项</span></a></h4><p><a href="https://zustand.nodejs.cn/docs/middlewares/persist#persiststatecreatorfn" target="_blank" rel="noopener noreferrer">persist | Zustand 中文网</a></p><ul><li><strong><code>name</code></strong>: 必须的，存储的键名。</li><li><strong><code>storage</code></strong>: 可选，用于指定不同的存储引擎，比如 <code>sessionStorage</code>。</li></ul><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">import { create } from &#39;zustand&#39;;</span>
<span class="line">import { persist, createJSONStorage } from &#39;zustand/middleware&#39;;</span>
<span class="line"></span>
<span class="line">const useCartStore = create&lt;CartState&gt;()(</span>
<span class="line">  persist(</span>
<span class="line">    (set) =&gt; ({ ... }),</span>
<span class="line">    {</span>
<span class="line">      name: &#39;cart-storage&#39;,</span>
<span class="line">      // 使用 sessionStorage 而不是默认的 localStorage</span>
<span class="line">      storage: createJSONStorage(() =&gt; sessionStorage), </span>
<span class="line">    }</span>
<span class="line">  )</span>
<span class="line">);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong><code>partialize</code></strong>: 可选，用于<strong>只选择 Store 中的部分状态</strong>进行持久化。这在你不希望所有状态都被保存时非常有用。</li></ul><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">const useSettingsStore = create&lt;SettingsState&gt;()(</span>
<span class="line">  persist(</span>
<span class="line">    (set) =&gt; ({</span>
<span class="line">      theme: &#39;light&#39;,</span>
<span class="line">      showModal: false, // 这个状态不希望被持久化</span>
<span class="line">      // ...</span>
<span class="line">    }),</span>
<span class="line">    {</span>
<span class="line">      name: &#39;settings-storage&#39;,</span>
<span class="line">      // 只持久化 theme 状态</span>
<span class="line">      partialize: (state) =&gt; ({ theme: state.theme }),</span>
<span class="line">    }</span>
<span class="line">  )</span>
<span class="line">);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong><code>onRehydrateStorage</code></strong>: 可选，当状态从存储中恢复时，可以执行一些逻辑。这常用于在状态恢复完成前显示一个加载状态。</li></ul><div class="language-TSX line-numbers-mode" data-highlighter="prismjs" data-ext="TSX"><pre><code class="language-TSX"><span class="line">const useHydrationStore = create&lt;HydrationState&gt;()(</span>
<span class="line">  persist(</span>
<span class="line">    (set) =&gt; ({ hasHydrated: false, ... }),</span>
<span class="line">    {</span>
<span class="line">      name: &#39;hydration-storage&#39;,</span>
<span class="line">      onRehydrateStorage: (state) =&gt; {</span>
<span class="line">        console.log(&#39;开始从存储中恢复状态&#39;);</span>
<span class="line">        // 返回一个函数，在恢复完成后调用</span>
<span class="line">        return (state, error) =&gt; {</span>
<span class="line">          if (error) {</span>
<span class="line">            console.log(&#39;状态恢复失败&#39;, error);</span>
<span class="line">          } else {</span>
<span class="line">            console.log(&#39;状态恢复成功&#39;);</span>
<span class="line">            state?.setHasHydrated(true); // 可以在这里更新一个加载状态</span>
<span class="line">          }</span>
<span class="line">        };</span>
<span class="line">      },</span>
<span class="line">    }</span>
<span class="line">  )</span>
<span class="line">);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><table><thead><tr><th>选项</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td><code>name</code></td><td><code>string</code></td><td>存储的 key 名（必填）</td></tr><tr><td><code>storage</code></td><td><code>Storage</code></td><td>默认是 <code>localStorage</code>，也可以用 <code>sessionStorage</code>、<code>AsyncStorage</code></td></tr><tr><td><code>partialize</code></td><td><code>(state) =&gt; any</code></td><td>持久化部分状态</td></tr><tr><td><code>version</code></td><td><code>number</code></td><td>状态版本（配合 <code>migrate</code> 使用）</td></tr><tr><td><code>migrate</code></td><td><code>(persistedState, version) =&gt; newState</code></td><td>状态版本迁移函数</td></tr><tr><td><code>merge</code></td><td><code>(persisted, current) =&gt; newState</code></td><td>合并 persisted 和 fresh state 的逻辑</td></tr></tbody></table><h3 id="redux" tabindex="-1"><a class="header-anchor" href="#redux"><span>redux</span></a></h3><h3 id="subscribewithselector" tabindex="-1"><a class="header-anchor" href="#subscribewithselector"><span>subscribeWithSelector</span></a></h3>`,194)]))}const o=n(l,[["render",t]]),r=JSON.parse('{"path":"/web/react/Zustand.html","title":"Zustand","lang":"zh-CN","frontmatter":{"title":"Zustand","shortTitle":"Zustand","description":null,"date":"2024-06-16T22:29:35.000Z","categories":["前端","React"],"tags":[],"order":5},"git":{"createdTime":1753833319000,"updatedTime":1754730995000,"contributors":[{"name":"Okita1027","username":"Okita1027","email":"96156298+Okita1027@users.noreply.github.com","commits":5,"url":"https://github.com/Okita1027"}]},"readingTime":{"minutes":20.25,"words":6074},"filePathRelative":"web/react/Zustand.md"}');export{o as comp,r as data};
