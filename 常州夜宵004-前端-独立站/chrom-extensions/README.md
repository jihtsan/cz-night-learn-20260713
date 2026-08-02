# AI 导航新标签页扩展

这个 Chrome Manifest V3 扩展会将现有的 React/Vite 导航站设为新标签页。扩展不复制业务源码，而是从 `../work-html` 生成最新的生产版本。

## 生成扩展

在当前目录运行：

```bash
pnpm run build
```

可加载的扩展会生成在 `dist/` 中。该目录是本地构建产物，不提交到 Git。

## 安装到 Chrome

1. 在 Chrome 地址栏输入 `chrome://extensions/`。
2. 打开右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本目录下的 `dist/` 文件夹。
5. 新建一个 Chrome 标签页即可使用。

## 更新扩展

网站修改后重新运行 `pnpm run build`，然后在 `chrome://extensions/` 中点击该扩展的“重新加载”。

## 权限说明

扩展只申请两个实时数据接口的访问权限：

- `api.github.com`：获取 GitHub 趋势项目。
- `itunes.apple.com`：获取 Apple Music 歌曲、封面和试听信息。

扩展不使用内容脚本、后台服务或浏览记录权限。
