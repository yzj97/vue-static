## 使用lang

可以把当前页面的vue文件，未添加$t的文件自动添加下

### 1. 运行

```bash
# 运行单个文件
node lang src\agent\views\distribution\list\index.vue  

# 运行pool
node lang agent

# 运行整个（all)
node lang all
```

### 2. 示例效果

#### 2.1 单个文件

运行前

![1569467630260](.\images\1569467630260.png)

运行后

1. vue 页面的 html 和 js都相应替换成$t 开头

![1569467721147](.\images\1569467721147.png)

2. 未翻译的key自动添加到 pacages/lang/en_US.js 下

![1569467875373](.\images\1569467875373.png)

### 2.2 pool 以 agent 为例子

运行前

![1569469226865](.\images\1569469226865.png)

运行命令

![1569469303225](.\images\1569469303225.png)

运行后

1. vue 页面的 html 和 js都相应替换成$t 开头

   ![1569469351381](.\images\1569469351381.png)

2. 未翻译的key自动添加到 pacages/lang/en_US.js 下

   ![1569469493738](.\images\1569469493738.png)