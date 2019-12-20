---
title: 持续化部署你的blog
date: 2019-08-13 15:36:06
tags:
categories:
  - 技术教程
---

上一周把自己的博客搬到新买的腾讯云上了，为了节省部署的时间，所以我的博客使用了持续化部署，其中踩了许多坑，写个教程总结记录一下。  

<!--more-->

大概的过程：

1. 首先在你的服务器上安装Git，搭建Git服务器，并使用免密登陆SSH

2. 在服务器上创建仓库用来存放TravisCI生成的博客静态文件

3. 把你的博客项目放在GitHub上，其中博客静态文件放在主分支（master）上，其他文件（博客项目）放在其他分支上（本文为hexo分支）

4. 配置TravisCI，监听你的hexo分支，即你写完博客，push到GitHub上，TravisCI监听到hexo分支发生改变，自动帮你构建博客静态文件

5. TravisCI帮你构建完静态文件后，通过git命令把博客静态文件push到博客仓库主分支上和你的服务器Git仓库中

6. 配置服务器Git仓库钩子（GitHooks），使服务器仓库发现有push到仓库的动作后，自动把仓库中的静态文件部署到网站根目录

   
   
   

# 在VPS上搭建Git服务端

默认使用的操作系统为Centos7  

## 安装Git服务

首先查看yum源仓库的Git信息

```shell
$ yum info git
```

![](https://cdn.ego1st.cn/postImg/Snipaste_2019-08-14_16-33-13.jpg)

版本是1.8.3.1，想使用最新版的Git，只能使用编译安装  

### 下载Git：

Git[下载地址](https://pan.baidu.com/s/1HEz1isggSfyDXnfrITBSTA "With a Title"). 提取码: ugu2

### 在Centos7中安装依赖库

```shell
$ yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel
$ yum install gcc perl-ExtUtils-MakeMaker
```

### 卸载低版本Git

```shell
yum remove git
```

### 解压编译安装Git

移动到存放Git源码的目录，我的在`/usr/local/git `git目录自己创建  

解压编译安装

```shell
$ tar -xzvf git-2.22.0.tar.gz
$ cd git-2.22.0
$ make prefix=/usr/local/git all
$ make prefix=/usr/local/git install
```

添加到环境变量

```shell
$ vim /etc/profile
#在末尾添加
$ export PATH="/usr/local/git/bin:$PATH"
```

保存退出，使配置立即生效

```shell
$ source /etc/profile
$ git --version  #查看版本号
```

将git设置为默认路径

```shell
$ ln -s /usr/local/git/bin/git-upload-pack /usr/bin/git-upload-pack 
$ ln -s /usr/local/git/bin/git-receive-pack /usr/bin/git-receive-pack 
```

创建一个git用户组和用户，用来运行git服务

```shell
$ groupadd git
$ useradd git -g git
$ passwd git #参数是用户名
$ su git  #切换git用户
```

## 在服务器上搭建Git仓库

### 创建仓库目录

我的仓库目录在`/srv/gitrepo`

```shell
$ cd /srv/gitrepo # gitrepo目录自己创建
$ git init blog.git --bare # 创建仓库目录
```

至此，一个服务器Git仓库就搭建好了，还没实现免密登陆，后面会讲到

# 使用TravisCI持续化部署

## 配置TravisCI

### 使用Github账号登陆TravisCI
[TravisCi]([https://travis-ci.org]),注意网站地址结尾是org（公开的），com结尾的是私有的，是收费的

### 添加你的仓库
![](https://cdn.ego1st.cn/postImg/Snipaste_2019-08-14_17-19-07.jpg)

### 配置你的仓库
点击`Setting` ，设置选项
![](https://cdn.ego1st.cn/postImg/Snipaste_2019-08-14_17-22-28.jpg)

### 在Github添加Access Token
`Setting`-->`Developer setting`-->`Personal access tokens`-->`Generate new token`
![](https://cdn.ego1st.cn/postImg/Snipaste_2019-08-14_17-27-04.jpg)除了删库，其他的都打上勾

### 在TravisCI设置中添加token

![](https://cdn.ego1st.cn/postImg/Snipaste_2019-08-14_17-31-40.jpg)

`name`自定义 ，`value`为Github上的`access Token`点击Add添加 

### 在你的本地博客目录下添加`.travis.yml`

具体配置如下

```yaml
language: node_js
node_js: lts/*
install:
- npm install
before_script:
script:
- hexo clean
- hexo g
after_script:
- cd ./public
- git init
- git config user.name "" # 你的Git名字
- git config user.email "" # 你的Git邮箱
- git add .
- git commit -m "Update docs with TRAVIS-CI" # conmmit信息
- git push --force --quiet "https://${myblog}@${GH_REF}" master:master

branches:
  only:
  - hexo # 监听hexo分支变化，具体把源文件提交到分支，请左转度娘
env:
  global:
  - GH_REF: github.com/EGo14T/ego14t.github.io.git
cache:
  yarn: true
  directories:
  - node_modules
before_install:
after_success:
addons:
  ssh_known_hosts: # 给Travis服务器添加你的VPS ip地址，以跳过询问
```

到这一步你已经可以自动部署你的博客到Github Pages了

## Travis免密登陆你的VPS

### 生成SSH密钥对

```shell
# 随便生成在哪都行，文件名也随意
$ ssh-keygen -f travis.key
```

把生成的公钥文件`e.g. travis.key.pub` 内容添加到VPS上的`~/.ssh/authorized_keys`中

```shell
$ vi ~/.ssh/authorized_keys #把公钥添加进去
```

### 使用Travis CI 加密工具加密私钥

这个步骤必须在Linux下执行！！！

这个步骤必须在Linux下执行！！！

这个步骤必须在Linux下执行！！！ 重要的事情说三遍

#### 安装加密工具

首先你要安装Ruby，具体安装，自己百度

```shell
#安装加密工具
$ sudo gem install travis	
```

#### 通过命令行登录 Travis 并加密文件：

```shell
# 交互式操作，使用 GitHub 账号密码登录
$ travis login --auto
# 加密完成后会在当前目录下生成一个 travis.key.enc 文件
# 会在你的 .travis.yml 文件里自动加上用于解密的 shell 语句
# 会自动格式化你的 .travis.yml 文件
$ travis encrypt-file travis.key -add
```

以上步骤建议在你的博客项目根目录进行

把你的博客项目push到刚才创建的VPS Git仓库中

为了能免密登陆自己的VPS服务器，把刚才的私钥也拷贝一份放到`C:\Users\用户名\.ssh`目录下，然后push项目

然后在本地把加密操作后的项目从VPS Git仓库中clone下来

## 使用GitHooks自动部署你的静态文件

首先要在`.travis.yml`文件中追加push到你的VPS Git仓库的命令

通过SSH的方式push

### 配置GitHooks

在你的VPS Git仓库中找到hooks目录，在里面创建`post-receive`文件

```shell
$ cd /srv/gitrepo/myblog.git/hooks
$ vim post-receive # 创建钩子文件
```

文件内容

```shell
#!/bin/sh

unset GIT_DIR
path=/www/wwwroot/myblog/ #你的网站根目录，也是个git仓库，把你的项目从仓库中clone到这个地方
cd $path
git fetch --all
git reset --hard origin/master
```

以上操作是在git用户下执行的

给脚本增加运行权限

```shell
chmod +x post-receive
```

创建完之后，运行一下看看有没有异常

```shell
$ ./post-receive
```

如果出现异常，请查看一下，网站根目录是否输入git用户，具体就是权限的问题

1. 必须保证git用户的根目录的文件夹权限为 755 
2. 必须保证git用户的根目录下的.ssh文件夹权限为 700 
3. 必须保证git用户的根目录下的.ssh文件夹中的authorized_keys文件的权限为 600

## 大功告成！！！

此时，你就可以写好博客然后push到Git仓库，TravisCI检测到你的分支发生变动，自动帮你执行`hexo g -d`的操作，然后把生成的文件提交Git仓库的master分支上，供Github Pages使用，还会提交一份到你的VPS Git仓库中，你的VPS Git仓库检测到有push行为，会触发Git Hooks，然后执行部署操作

有些地方描述的可能有些模糊，还请多去百度~~







