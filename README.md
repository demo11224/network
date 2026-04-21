# M 域入口智能体 · 高保真交互 Demo

一个面向企业内网 M 域的「入口智能体」高保真前端 Demo。通过「对话 + 富组件卡片 + 动态能力看板」的组合，在视觉和交互上对传统「对话 + 表单」模式进行降维打击。

## 技术栈

- Vite + React 18 + TypeScript
- Tailwind CSS（内置 Shadcn 风格的 UI 原语：`Button` / `Card` / `Select` / `Badge` / `InlineEdit`）
- Framer Motion（几乎所有过渡、状态切换、列表排序都走 Motion）
- Lucide React（图标）

> 为了保证离线可用，未强依赖 `@radix-ui`，而是用极简 Tailwind + Framer Motion 自封装了科技风的原语组件。

## 启动

```bash
npm install
npm run dev
```

默认会在 `http://localhost:5173` 启动。

## 亮点演示场景

### 场景 A · 一键打车

在输入框键入 **"我要去沈阳新城打车"** → 聊天区先弹出 `正在进行意图路由...` 微标签，1s 后变为绿色 `匹配成功：企业用车服务`，同时在气泡上方以极小字呈现「思考过程」。随后 AI 回复一张 **富交互打车卡片**，出发地 / 目的地 / 乘车人数等字段全部支持 **Inline Edit**（点击即变输入框，回车保存）。点击 **"确认叫车"** 后卡片进入 "派单中" 状态，同时右侧 Dynamic Inspector 切出 **行程时间轴**，派单成功后卡片内展示司机信息。

### 场景 B · 差旅报销

输入 **"帮我报销这周的差旅费"** → AI 引导上传发票。点击输入框左下的回形针图标即可模拟上传（前端 mock 了 OCR 解析过程，依次展示 `上传中 → 解析中 → 完成`）。随后自动生成一张 **报销单据卡片**，金额、商户、日期等信息已回填。点击 **"提交审批"** 后，卡片盖上半透明的 "流转中" 印章水印，右侧 Inspector 同步展示 **OA 审批链路树**。

### 场景 C · 智能体广场 · 沙箱身份模拟

切换左侧 Tab 到 **智能体广场**，页面顶部有 **身份沙箱模拟** 下拉：

- 选 **研发工程师** → `网络故障闭环处理`、`EOMS 工单助手` 等会高亮并跃迁到首屏
- 选 **财务专员** → `财务报销`、`IT 发票通` 高亮前置
- 所有卡片通过 Framer Motion `layout` 属性实现平滑重排序动效

## 微交互清单

- AI 文字流式输出（逐字打字，标点处有停顿）
- 卡片 `hover` 轻微 Y 轴上浮 + 阴影加深
- 意图路由标签状态迁移带 `AnimatePresence`
- Tab 切换 / 路由 / 侧边栏高亮 / 下拉菜单 都基于 Motion 实现
- Inline Edit 字段聚焦时带品牌色光晕
- 流转中印章旋转弹入
- 输入框自建议（气泡 chips）

## 目录

```
src/
  App.tsx                 # 应用外壳 + Tab 切换
  app/Sidebar.tsx         # 左侧导航
  components/
    ui/                   # 基础原语（Button/Card/Select/Badge/InlineEdit）
    Typewriter.tsx        # 流式输出组件
  workbench/              # Tab 1 · 工作台
    Workbench.tsx         # 非对称双栏
    ChatStream.tsx
    Composer.tsx
    Inspector.tsx         # 右侧 Dynamic Inspector
    messages/             # 所有富卡片消息
    useWorkbench.ts       # 状态机（意图识别 / 订单流转 / OA 审批）
  plaza/Plaza.tsx         # Tab 2 · 智能体广场 + 身份沙箱
```
