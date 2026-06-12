# LoRA 微调实践指南：任务 × Rank × 学习率 × 数据量

> 回答一个具体问题：**我这个任务，rank 设多大、学习率设多少、要多少数据？** 所有结论标注论文/官方文档出处，其中大量采用 2025 年 Thinking Machines（John Schulman 团队）的系统实验研究 *LoRA Without Regret*——这是截至目前对"LoRA 怎么配才能追平全参微调"最权威的实证回答。

---

## 一、五分钟搞懂 LoRA 在干什么

模型的每个权重矩阵 W（比如 4096×4096，约 1700 万个数）在微调时本来要全部更新。LoRA 的做法：**W 完全不动，旁边加一条"旁路"**——两个小矩阵 A（r×4096）和 B（4096×r）相乘形成增量：

```
输出 = W·x + (α/r)·B·A·x
       ↑冻结      ↑只训练这两个小矩阵
```

r 取 16 时，旁路参数只有原矩阵的 0.8%。训练完可以把 B·A 加回 W（merge，推理零开销），也可以不合并、做成几十 MB 的"插件"按需加载。

它为什么可行？理论解释是微调引起的权重变化是低秩的（Hu et al., 2021 [1]）；2025 年的更新解释更实用——**后训练（post-training）数据集承载的信息量本来就不大，LoRA 的参数容量装得下**（Schulman et al., 2025 [2]）。这一句是全文的钥匙，第三章展开。

---

## 二、2025 年的结论刷新：LoRA 什么时候等于全参微调

*LoRA Without Regret* [2] 用 14 个模型（Llama/Qwen 系）在 SFT 和 RL 两种范式下系统扫参，结论可以总结为"三个条件 + 一个等价定理"：

**满足以下三个条件时，LoRA 的最终效果与全参微调相同（不是接近，是学习曲线重合）：**

1. **挂在所有权重矩阵上，尤其是 MLP（和 MoE）层**。只挂注意力层（q,v）——即原始论文的推荐——显著落后，**即使把 rank 加大到参数量相同也补不回来**；而"只挂 MLP"与"全挂"效果几乎相同，说明 MLP 才是适配发生的主要场所（QLoRA 论文 [3] 和 Biderman et al. [4] 有一致发现）；
2. **可训练参数量超过数据集的信息量**（容量条件，第三章给计算方法）；
3. **学习率取全参微调最优值的 10 倍**。这个 10 倍关系在全部 14 个模型、SFT 和 RL 两种范式下一致成立——所以如果你知道某模型全参 SFT 的最优学习率是 2e-5，LoRA 直接从 2e-4 起步。

**两个附加发现：**

- **LoRA 对大 batch 更不耐受**：batch 增大时 LoRA 与全参的差距扩大，且加大 rank 也救不回来（这是 B·A 乘积参数化的固有性质）。实践上有效 batch 控制在 32 左右、不要上数百；
- **rank 越低，最优学习率略低**：实测 r=256 最优 2.5e-4，r=16 是 2.2e-4，r=1 是 1.2e-4——量级不变，但 r=8 以下时学习率往 1e-4 收。

---

## 三、Rank 怎么定：容量计算法 + 速查表

### 3.1 原理：把 rank 当"内存条容量"买

*LoRA Without Regret* [2] 给出可计算的判据：

- 神经网络每个参数约能存 **2 bit** 信息（Allen-Zhu & Li，《Physics of Language Models 3.3》[5] 的知识容量定律）；
- SFT 数据集的信息量上界约为 **每 token 1 bit**（首轮训练的总 log-loss 即数据集描述长度，LLM 数据约 1 bit/token [2]）；
- **判据：LoRA 可训练参数数 × 2 > 数据集 token 数 × 1，则容量不构成瓶颈**，LoRA 学习曲线与全参重合；超出容量则 loss 曲线在某一步"掉队"（不是到底，是变慢）。

### 3.2 算一遍给你看（7B/8B 模型，all-linear 挂载）

Llama-3.1-8B 全挂时每 +1 rank ≈ +300 万可训练参数 [2]。由此：

| rank | 可训练参数 | 容量上界（≈2bit/参数） | 大约能"装下"的 SFT 数据 |
|---|---|---|---|
| 8 | ~2400 万 | ~4800 万 bit | ~4800 万 token ≈ **10 万条均长 500 token 的样本** |
| 16 | ~4800 万 | ~9600 万 bit | ~20 万条 |
| 32 | ~9700 万 | ~1.9 亿 bit | ~40 万条 |
| 64 | ~1.9 亿 | ~3.9 亿 bit | ~80 万条 |
| 128 | ~3.9 亿 | ~7.7 亿 bit | ~160 万条 |

两个直接推论：

1. **绝大多数业务微调（几千~几万条）用 r=8~16 容量绰绰有余**——加大 rank 不会更好，只会更容易过拟合、更吃显存；
2. rank 要往上加的唯一正当理由是**数据量真的大**（十万条级以上），这与 Biderman et al. [4] 的发现一致：约 10 万条指令数据时高秩（r=256）才能追平全参。

### 3.3 RL 是特例：rank=1 就够

策略梯度类训练（PPO/GRPO）每个回合只提供 **O(1) bit** 信息（优势函数就一个标量），信息吸收量比 SFT 低约千倍 [2]。实测 rank-1 LoRA 即可追平全参 RL；后续研究（*Learning to Reason in 13 Parameters*, 2026 [6]）甚至把 GSM8K 上的 GRPO 训练压缩到 13 个参数仍达 91%。**做 GRPO/PPO 时 rank 给 1~8 即可，给大纯属浪费。**

### 3.4 alpha 与其他参数的固定法

- **alpha**：两种主流惯例任选其一并保持一致——①α=2r（Biderman et al. [4] 的最佳实践，LLaMA-Factory 常用）；②固定 α=32 不随 r 变（*LoRA Without Regret* 实验设置 [2]）。不要两头混用；
- **lora_dropout**：数据 <5k 条取 0.05~0.1，数据多取 0；
- **初始化**：默认即可（A 高斯、B 全零）；追求收敛速度可用 PiSSA [7]。

---

## 四、学习率怎么定（LoRA 专属细则）

主规则继承《选型指南》第八章，LoRA 专属要点：

1. **10 倍规则是铁律**：全参最优学习率 × 10 = LoRA 最优学习率，14 个模型上无一例外 [2]。SFT 全参标杆 2e-5（Llama 2 [8]）→ **LoRA SFT 默认 2e-4**（QLoRA 论文官方推荐值，≤13B [3]）；33B 以上降到 1e-4 [3]；
2. **低秩时收一点**：r≤8 时往 1e-4 靠（r=1 实测最优 1.2e-4 [2]）；
3. **阶段照常降档**：LoRA-DPO 用 5e-6 起（TRL 官方示例 [9]），LoRA-GRPO 用 5e-6~1e-5，不要把 SFT 的 2e-4 带进偏好/RL 阶段；
4. **有效 batch 保持 ≤32~64**，batch 翻几倍时学习率不要按线性缩放规则猛加——LoRA 的大 batch 损失补不回来 [2]。

---

## 五、任务场景全景表（核心交付：照表抄配置）

前提：7B~14B 基座、all-linear 挂载、cosine 调度、warmup 0.05。30B+ 基座学习率减半。

| 任务场景 | rank | 学习率 | 数据量（起效 → 舒适） | epoch | 场景特别注意 |
|---|---|---|---|---|---|
| **文本分类 / 意图识别** | 8 | 1e-4 ~ 4e-4（分类可取高位，LoRA 论文 GLUE 用 4e-4 [1]） | 每类 50 → 500 条 | 3~5 | 类别不平衡看 Macro-F1；标签词固定写法 |
| **信息抽取 / NER / 结构化输出** | 8~16 | 1e-4 ~ 2e-4 | 1k → 1 万条 | 2~3 | 输出 schema 在数据里必须 100% 一致；验收看字段级 EM |
| **风格写作 / 文案 / 话术** | 8~16 | 1e-4 ~ 2e-4 | 300 → 5k 条 | 2~3 | LoRA 最强场景；数据少开 NEFTune [10] 白赚提升 |
| **客服多轮对话** | 16 | 1e-4 ~ 2e-4 | 2k → 2 万条（含多轮 history） | 2~3 | 掺 1:1~1:5 通用数据防变傻；多轮数据用 sharegpt 格式 |
| **垂直领域问答（配 RAG）** | 16~32 | 1e-4 ~ 2e-4 | 5k → 5 万条 | 1~2 | LoRA 学"怎么答"，知识放 RAG；别指望 LoRA 记住知识（[4]，见下文红牌区） |
| **代码生成** | 32~64 | 2e-4，**必须扫参**（代码域对学习率最敏感 [4]） | 1 万 → 10 万条 | 1~2 | 数据量大才值得上高秩；评测用单元测试通过率 |
| **数学 / 长链推理蒸馏（R1 风格 CoT SFT）** | 32~64 | 1e-4 ~ 2e-4 | 1 万 → 10 万条长 CoT | 1~2 | 长样本吃容量（按 token 算账，见 3.2）；cutoff_len 开足 |
| **Agent / 工具调用（Function Call）** | 16~32 | 1e-4 | 2k → 2 万条带 function_call 轨迹 | 2 | 工具描述写进数据；负样本（不该调工具时不调）必须覆盖 |
| **多模态指令微调（LLaVA 类，LLM 部分挂 LoRA）** | 16~32 | 2e-4（LLaVA-1.5 官方 LoRA 配置用 2e-4 [11]） | 1 万 → 10 万条图文对 | 1 | projector 全参 + 视觉塔冻结 + LLM LoRA 的标准三件套 |
| **奖励模型 RM** | 8~16 | 1e-4 | 5k → 5 万偏好对 | 1 | 判别任务低秩足够 |
| **DPO / KTO 偏好对齐** | 16 | **5e-6**（TRL 官方示例 [9]），别带 SFT 学习率 | 2k → 5 万对 | 1 | 免参考模型（关 adapter 即参考 [9]）；防长度偏置 |
| **GRPO / GSPO / PPO（可验证奖励 RL）** | **1~8（真的够了 [2][6]）** | 5e-6 ~ 1e-5 | 几千个带判分器的 prompt | — | RL 信息量极低，rank 给大纯浪费；batch 同样别大；MoE 基座选 GSPO（Qwen3 同款，GRPO 长训在 MoE 上不稳）；框架用 EasyR1/TRL/veRL（LLaMA-Factory 本体不含 GRPO） |
| **长上下文扩展（32k+）** | 16~32 | 1e-4 | 几百 → 几千条长文档样本 | 1 | 配 RoPE/YaRN 调整 [12]；短数据混着训防短任务回退 |

### 红牌区（LoRA 不该接的活）

| 任务 | 为什么 | 正确做法 |
|---|---|---|
| 领域知识注入（GB 级语料 CPT） | 数据信息量远超 LoRA 容量；Biderman et al. [4]：CPT 场景 r=256 也追不平全参且差距随数据量扩大 | 全参/Freeze 做 CPT，或 RAG |
| 新语言 / 扩词表 | 新 token 的 embedding 是随机初始化，不在 LoRA 的"低秩增量"管辖范围 | 解冻 embedding+lm_head（可与 LoRA 并用） |
| 超大规模 SFT（百万条级）追极限 | 容量条件不满足时训练效率劣于全参 [2] | 全参，或按 3.2 的账把 rank 拉够并接受成本 |

---

## 六、可直接运行的配置模板（LLaMA-Factory）

以"客服多轮对话"为例，其他场景按第五章表替换三个参数（`lora_rank` / `learning_rate` / 数据集）即可：

```yaml
model_name_or_path: Qwen/Qwen2.5-7B-Instruct
stage: sft
do_train: true
finetuning_type: lora
lora_rank: 16
lora_alpha: 32          # 惯例①：α=2r；若固定 α=32 则换 rank 时不动它
lora_dropout: 0.05      # 数据 >5k 条可设 0
lora_target: all        # 铁律：全挂，尤其不能漏 MLP（gate/up/down）

dataset: my_dialog_data,alpaca_zh_demo   # 业务数据 + 通用数据防遗忘
template: qwen
cutoff_len: 4096
packing: true

output_dir: saves/qwen2.5-7b/lora/cs
per_device_train_batch_size: 2
gradient_accumulation_steps: 8           # 有效 batch=16，LoRA 不要堆大 batch
learning_rate: 2.0e-4                    # 全参最优(2e-5)×10
num_train_epochs: 2.0
lr_scheduler_type: cosine
warmup_ratio: 0.05
bf16: true
flash_attn: fa2

val_size: 0.05
eval_strategy: steps
eval_steps: 200
```

**调参顺序纪律**（一次只动一个，按收益排序）：

```
① 数据质量与多样性（永远第一）
② 学习率（U 形曲线，差 3 倍就可能从最优掉到不收敛）
③ epoch（盯 eval loss 拐点）
④ rank（仅当数据量按 3.2 的账确实超容量才加）
⑤ 其余（dropout、NEFTune、变体）
```

---

## 七、LoRA 专属故障诊断表

| 症状 | 诊断 | 出处/依据 |
|---|---|---|
| loss 几乎不降 | 学习率用了全参量级（1e-5 级）→ 升 10 倍；或 `lora_target` 只挂了 q,v → 改 all | 10 倍规则 [2]；attention-only 显著劣化 [2][4] |
| 效果明显差于预期，加 rank 没用 | 先查挂载层（漏 MLP 是最常见原因——加 rank 补不回来）；再查学习率 | [2] |
| 训到一半 loss 下降突然变慢 | 容量耗尽的典型曲线（数据量超出当前 rank 的容量） | 学习曲线"掉队"现象 [2]，按 3.2 重算 rank |
| 大 batch 后效果回退 | LoRA 对大 batch 的固有不耐受，加 rank 无效 | [2]，有效 batch 回到 ≤32~64 |
| 小数据高 rank 过拟合（eval loss 回升） | rank 给大了 → 降到 8~16，开 dropout 0.1 + NEFTune | [10] |
| merge 后线上效果和训练时不一致 | template 不一致，或 QLoRA 产物直接在 4-bit 上 merge | 应 merge 到 bf16 基座（《落地手册》9.1） |

---

## 八、实际落地容易漏掉的问题（训完之后才会撞上的坑）

前七章解决"怎么训好"，这一章解决"训好之后别翻车"——以下问题在训练阶段全部不可见，到部署和迭代时才爆发。

### 8.1 adapter 与基座是"强绑定"，必须一起做版本管理

adapter 学到的是**针对某一份具体权重的增量**。基座换了版本（哪怕是同名模型的权重修订、量化版本、甚至别人 merge 过的"同款"），adapter 的行为就不可预期。落地纪律：

- adapter 的版本记录里必须钉死：基座的精确标识（HF repo + revision/commit）、训练框架与 PEFT 版本、template 名称；
- 部署侧加载 adapter 前校验基座指纹（哪怕只是核对 config 的 hash），不要相信"名字一样就是一样"。

### 8.2 merge 与量化的顺序是单行道

```
正确：LoRA adapter ──merge──→ bf16 基座 ──再量化──→ GPTQ/AWQ 部署
错误：把 adapter merge 进已量化的模型（GPTQ/AWQ 权重不可直接吸收 bf16 增量）
错误：QLoRA 训完直接在 4-bit bnb 模型上 merge（误差被固化）
```

如果部署形态必须是"量化基座 + 不合并的 adapter"（多租户场景），那是另一条合法路线（vLLM 支持在量化基座上挂 LoRA），但**评测必须在这个最终形态上做**，不能拿 bf16 merge 版的盲测结果替代。

### 8.3 vLLM 多 adapter 部署的硬限制（vLLM 官方文档 [13]）

| 限制 | 内容 | 对策 |
|---|---|---|
| `max_lora_rank` 默认 16 | 高于它的 adapter 加载会失败 | 启动时设为所有 adapter 中的最大 rank |
| 设得过高有真实代价 | vLLM 按 `max_lora_rank` 预分配张量，过高导致显存浪费、零填充计算、L2 缓存命中率下降——官方文档明确：有 [16,32,64] 的 adapter 就设 64，不要设 256 | **训练时就把 rank 规划好**：同一服务池的 adapter 尽量统一 rank，这是训练阶段要替部署做的决定 |
| `modules_to_save` 不支持 | 训练时如果全参保存了 `lm_head`/`embed_tokens`（加特殊 token 的常见操作），该 adapter **无法以热插拔方式部署**，必须 merge 成完整模型单独部署 | 见 8.4 |
| 未合并 serving 有少量开销 | 旁路计算无法完全免费，高并发下吞吐略低于 merge 版 | 单业务独占模型就 merge；多租户共基座才用热插拔 |

### 8.4 "加几个特殊 token"是有连锁反应的决定

给工具调用、思维链标记等加新 special token，意味着必须训练 embedding 和 lm_head（`modules_to_save` 或 `additional_target`），连锁后果：adapter 体积从几十 MB 涨到 GB 级（embedding 是全参保存的）、失去 vLLM 热插拔资格（8.3）、与其他 adapter 共基座的能力作废。**决策原则：能用现有 token 组合表达的（如用文本标记 `<tool>` 字样而非新增 token id），就不要动词表**；确需动词表，按"merge 后独立部署"规划，别按多租户规划。

### 8.5 迭代不要"叠罗汉"：merge→再训→再 merge 是漂移之路

每轮 merge 都把上一轮的低秩增量固化进基座，下一轮 LoRA 又在偏移后的权重上学新增量——几轮之后模型行为漂移无法归因，且无法回滚到任意中间状态。正确的迭代姿势（与《落地手册》9.3 一致）：**数据累积、模型重训——每轮都从原始基座 + 全量最新数据训新 adapter**，基座永远干净，任何版本可复现。

SFT-LoRA 之后接 DPO 的衔接是这个问题的特例，TRL 官方文档 [9] 给出三种姿势：①SFT adapter merge 进基座，在新基座上挂新 adapter 做 DPO（最常用）；②同一 adapter 加载两份、用 `model_adapter_name`/`ref_adapter_name` 区分训练与参考（最省显存且无 merge 误差）；③两个完整模型实例（最浪费，不推荐）。

### 8.6 多个 LoRA 直接相加合并会"打架"

想把"客服 adapter + 工具调用 adapter"加在一起得到全能模型？naive 的权重相加会产生参数干扰，两个能力同时退化。学术上有专门的合并方法：**TIES-Merging**（Yadav et al., NeurIPS 2023 [14]，裁剪+符号对齐再合并）和 **DARE**（Yu et al., 2024 [15]，随机丢弃+缩放）能显著缓解，PEFT 的 `add_weighted_adapter` 已内置支持。但工程上的诚实建议：**合并多 adapter 是实验性手段，生产场景优先选"数据合并重训一个 adapter"或"多 adapter 路由各管各的"**，可控性高一个档次。

### 8.7 训练引擎和推理引擎算出来的不是同一个模型

transformers（训练评估）与 vLLM/SGLang（线上推理）在算子实现、KV cache、采样细节上存在数值差异，LoRA 旁路放大了这种敏感性。低成本保险：**上线前用部署引擎本体重跑一遍盲测集**，确认与训练侧评估结论一致——这一步发现过的问题包括 template 渲染差异、stop token 配置不同、未合并 adapter 的 dtype 不匹配。

### 8.8 小数据场景的 seed 方差大到能翻转结论

几百~几千条数据训 LoRA，换个随机种子盲测分差出 2~3 个点很常见。意味着：单次实验的 A/B 结论不可靠。纪律：关键决策（如"r=8 还是 r=16 好"）至少跑 2~3 个 seed 看均值；如果两个配置的差距小于 seed 方差，**结论是"没有差别"**，选省资源的那个。

### 8.9 adapter 的安全与合规三件事

1. **adapter 也会背出训练数据**：低秩不等于不记忆，PII（手机号、订单号）清洗在 LoRA 训练前同样必须做（《落地手册》第十章）；
2. **第三方 adapter 是供应链风险**：从 HF 下载的 adapter 可能植入后门行为（特定触发词改变输出），来路不明的 adapter 上线前过红线评测，等同对待不可信代码；
3. **adapter 是基座的衍生物**：对外分发 adapter 受基座许可证约束（Llama 系条款尤其要查），"我只发布了 adapter 没发布模型"不构成豁免。

---

## 九、参考文献

[1] Hu et al. *LoRA: Low-Rank Adaptation of Large Language Models*. ICLR 2022. [arXiv:2106.09685](https://arxiv.org/abs/2106.09685)

[2] Schulman & Thinking Machines Lab. *LoRA Without Regret*. Thinking Machines Connectionism, 2025-09. [thinkingmachines.ai/blog/lora](https://thinkingmachines.ai/blog/lora/)（10 倍学习率规则、all-layers/MLP 结论、容量判据、大 batch 不耐受、RL 低秩充分性的出处）

[3] Dettmers et al. *QLoRA: Efficient Finetuning of Quantized LLMs*. NeurIPS 2023. [arXiv:2305.14314](https://arxiv.org/abs/2305.14314)（学习率 2e-4/1e-4 官方推荐、all-linear 必要性）

[4] Biderman et al. *LoRA Learns Less and Forgets Less*. TMLR 2024. [arXiv:2405.09673](https://arxiv.org/abs/2405.09673)（CPT 不胜任、IFT 高秩追平、α=2r、学习率敏感性）

[5] Allen-Zhu & Li. *Physics of Language Models: Part 3.3, Knowledge Capacity Scaling Laws*. 2024. [arXiv:2404.05405](https://arxiv.org/abs/2404.05405)（每参数约 2 bit 的容量定律）

[6] *Learning to Reason in 13 Parameters*. 2026. [arXiv:2602.04118](https://arxiv.org/abs/2602.04118)（RL 极低容量需求的极端验证）

[7] Meng et al. *PiSSA: Principal Singular Values and Singular Vectors Adaptation*. NeurIPS 2024. [arXiv:2404.02948](https://arxiv.org/abs/2404.02948)

[8] Touvron et al. *Llama 2*. 2023. [arXiv:2307.09288](https://arxiv.org/abs/2307.09288)（全参 SFT 2e-5 标杆）

[9] Hugging Face TRL 官方文档. *PEFT Integration / DPO Trainer*. [huggingface.co/docs/trl/peft_integration](https://huggingface.co/docs/trl/peft_integration)（LoRA-DPO 学习率 5e-6 示例、免参考模型机制）

[10] Jain et al. *NEFTune: Noisy Embeddings Improve Instruction Finetuning*. ICLR 2024. [arXiv:2310.05914](https://arxiv.org/abs/2310.05914)

[11] Liu et al. *Improved Baselines with Visual Instruction Tuning*（LLaVA-1.5）. CVPR 2024. [arXiv:2310.03744](https://arxiv.org/abs/2310.03744)

[12] Peng et al. *YaRN: Efficient Context Window Extension of Large Language Models*. ICLR 2024. [arXiv:2309.00071](https://arxiv.org/abs/2309.00071)

[13] vLLM 官方文档. *LoRA Adapters*. [docs.vllm.ai/en/latest/features/lora](https://docs.vllm.ai/en/latest/features/lora/)（`max_lora_rank` 默认 16 与配置代价、`modules_to_save` 不支持、多 adapter 服务机制的出处）

[14] Yadav et al. *TIES-Merging: Resolving Interference When Merging Models*. NeurIPS 2023. [arXiv:2306.01708](https://arxiv.org/abs/2306.01708)

[15] Yu et al. *Language Models are Super Mario: Absorbing Abilities from Homologous Models as a Free Lunch*（DARE）. ICML 2024. [arXiv:2311.03099](https://arxiv.org/abs/2311.03099)
