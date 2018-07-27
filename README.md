markdown-image-git
---

### 功能用途

Upload image references to github

将 markdown 中的图片上传到 github 托管，`_images/VPC.png` => `https://raw.githubusercontent.com/wiviwiv/git-diff-a/master/_images/1532678118364_VPC.png`

### 使用方式

#### 命令行

```bash
npm i markdown-image-git -g
```

```
# 切换至目录

cd my-markdown

tree
    .
    ├── README.md
    └── _images

    1 directory, 1 file

# 开始同步
md_sync --token my-github-token -r wiviwiv/git-diff

```

- 使用配置文件

- config.json

```json

{
    "basePath": "/Users/wivwiv/docs/markdown-image-git",
    "doc": "README.md",
    "token": "my-github-token",
    "repos": "wiviwiv/git-diff",
    "branch": "master",
    "dir": "_images/markdown-image-git",
    "message": "form markdown-image-git"
}
```

`md_sync -c ./config.json`

- 可用参数：

`-c/--config`   使用配置文件

`-p/--path`     markdown 目录，默认当前目录

`-f/--file`     markdown 文件，默认 README.md

`-t/--token`    github token 详见 https://github.com/settings/tokens

`-r/--repos`    静态图片用户/仓库名如 wiviwiv/raw_images

`-b`            仓库分支，默认 master 

`-d`            图片在仓库中的目录，如 /images/markdown， 默认 _images

`-m/--message`  提交的 git 消息

`-H/--help`     显示帮助


#### 程序内

```js
const md = require()

md({
    basePath: '/Users/wivwiv/docs/markdown-image-git',
    doc: 'README.md',
    token: 'my-github-token',
    repos: 'wiviwiv/git-diff',
    branch: 'master',
    dir: '_images/markdown-image-git',
    message: 'form markdown-image-git'
})
```







### 支持语法

```bash
# 转换前
- README.md

VPC 拓扑图

![VPC ](_images/VPC.png)

# 转换后
- README.md

VPC 拓扑图

![VPC ](https://raw.githubusercontent.com/wiviwiv/git-diff-a/master/_images/1532678118364_VPC.png)
```


### 其他

- github token

[https://github.com/settings/tokens](https://github.com/settings/tokens)