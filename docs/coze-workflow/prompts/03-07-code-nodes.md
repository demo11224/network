# 节点 3 / 节点 7：代码节点脚本（JavaScript 伪代码，可直接改造为 Coze 代码节点）

> 扣子的代码节点支持 JS / Python。此处给出 JS 版本；迁移 Python 只是语法等价替换。

---

## 节点 3：证据聚合与术语白名单构建

```javascript
// 入参
//   node1: {symptom_system_std, candidate_procs, candidate_functions, extracted_keywords}
//   arch_hits: [{id, metadata, content}, ...]   // 来自 KB_ARCH 召回
//   proc_hits: [{id, metadata, content}, ...]   // 来自 KB_PROC 召回
//   case_hits: [{id, metadata, content}, ...]   // 来自 KB_CASE 召回
// 出参
//   evidence: {arch, procs, cases}
//   terms_whitelist: string[]

async function main({ params }) {
  const { node1, arch_hits, proc_hits, case_hits } = params;

  const dedupe = (arr, keyFn) => {
    const seen = new Set();
    const out = [];
    for (const x of arr) {
      const k = keyFn(x);
      if (!seen.has(k)) { seen.add(k); out.push(x); }
    }
    return out;
  };

  const arch = dedupe(arch_hits, h => `${h.metadata.system_name}#${h.metadata.arch_type}`)
    .map(h => ({
      system: h.metadata.system_name,
      arch_type: h.metadata.arch_type,
      components: h.metadata.components || [],
      functions: h.metadata.functions || [],
      content: h.content,
      slice_id: `KB_ARCH#${h.metadata.system_name}#${h.metadata.arch_type}`
    }));

  const procs = dedupe(proc_hits, h => h.metadata.proc_id)
    .map(h => ({
      proc_id: h.metadata.proc_id,
      proc_name: h.metadata.proc_name,
      involved_systems: h.metadata.involved_systems || [],
      abnormal_phases: h.metadata.abnormal_phases || [],
      interfaces: h.metadata.interfaces || [],
      content: h.content,
      slice_id: `KB_PROC#${h.metadata.proc_id}`
    }));

  const cases = dedupe(case_hits, h => h.metadata.fault_id)
    .map(h => ({
      fault_id: h.metadata.fault_id,
      表征系统: h.metadata.表征系统,
      根因系统: h.metadata.根因系统,
      根因分类: h.metadata.根因分类,
      关联业务流程: h.metadata.关联业务流程,
      涉及系统: h.metadata.涉及系统 || [],
      标签: h.metadata.标签 || [],
      关键词: h.metadata.关键词 || [],
      content: h.content,
      slice_id: `KB_CASE#${h.metadata.fault_id}`
    }));

  // 构造术语白名单：从切片元数据 + 内容里抽
  const whitelist = new Set();

  arch.forEach(a => {
    whitelist.add(a.system);
    (a.components || []).forEach(c => whitelist.add(c));
    (a.functions || []).forEach(f => whitelist.add(f));
  });
  procs.forEach(p => {
    (p.involved_systems || []).forEach(s => whitelist.add(s));
    (p.interfaces || []).forEach(i => whitelist.add(i));
  });
  cases.forEach(c => {
    whitelist.add(c.表征系统);
    whitelist.add(c.根因系统);
    (c.涉及系统 || []).forEach(s => whitelist.add(s));
  });

  // 从内容正文里正则抽"接口名 / 机房 / 集群"
  const patterns = [
    /[A-Z][A-Z0-9_]{4,}/g,                    // 接口名如 ZJ_IRMS_OCP_RECONFIG_PORT
    /[金华石桥萧山浙中].{0,8}DC\d+/g,          // 机房
    /[\u4e00-\u9fa5]+集群/g,                  // 各类集群
    /[\u4e00-\u9fa5]+模块/g                   // 业务模块
  ];
  const allText = [...arch, ...procs, ...cases].map(x => x.content).join("\n");
  patterns.forEach(re => {
    (allText.match(re) || []).forEach(t => whitelist.add(t.trim()));
  });

  return {
    evidence: { arch, procs, cases },
    terms_whitelist: Array.from(whitelist).filter(Boolean).sort()
  };
}
```

---

## 节点 7：输出组装 + 术语白名单后置校验

```javascript
// 入参
//   node1, evidence, terms_whitelist, graph_mermaid, graph_nodes, graph_edges,
//   ranked_suspects, investigation_plan
// 出参
//   {json_report, markdown_report}

async function main({ params }) {
  const {
    node1, evidence, terms_whitelist,
    graph_mermaid, graph_nodes, graph_edges,
    ranked_suspects, investigation_plan
  } = params;

  const whitelistSet = new Set(terms_whitelist);

  // 校验：找出所有"出现了但不在白名单"的名字
  const uncovered = new Set();
  const scanNames = arr => arr.forEach(x => {
    if (x && typeof x === "string" && x.length > 1 && !whitelistSet.has(x)) uncovered.add(x);
  });
  (graph_nodes || []).forEach(n => scanNames([n.name]));
  (ranked_suspects || []).forEach(r => scanNames([r.node]));
  (investigation_plan || []).forEach(layer =>
    (layer.actions || []).forEach(a => scanNames([a.object]))
  );

  // 组装相似案例 Top-5
  const similar_cases = (evidence.cases || []).slice(0, 5).map(c => ({
    fault_id: c.fault_id,
    表征系统: c.表征系统,
    根因系统: c.根因系统,
    根因分类: c.根因分类,
    关联业务流程: c.关联业务流程,
    标签: c.标签
  }));

  const json_report = {
    normalized: node1,
    similar_cases,
    triage_graph_mermaid: graph_mermaid,
    ranked_suspects,
    investigation_plan,
    uncovered: Array.from(uncovered)
  };

  // 渲染 Markdown
  const md = [];
  md.push(`# 故障排查建议`);
  md.push(``);
  md.push(`## 1. 输入标准化 & 相似历史案例`);
  md.push(`- 表征系统：${node1.symptom_system_std}`);
  md.push(`- 候选业务流程：${(node1.candidate_procs || []).join(", ")}`);
  md.push(`- 候选功能：${(node1.candidate_functions || []).join(", ")}`);
  md.push(`- 关键词：${(node1.extracted_keywords || []).join(", ")}`);
  md.push(``);
  md.push(`**相似历史案例 Top-${similar_cases.length}：**`);
  similar_cases.forEach(c => {
    md.push(`- \`${c.fault_id}\` 表征=${c.表征系统} / 根因=${c.根因系统}（${c.根因分类}） / 流程=${c.关联业务流程}`);
  });
  md.push(``);
  md.push(`## 2. 排查调用链`);
  md.push("```mermaid");
  md.push(graph_mermaid);
  md.push("```");
  md.push(``);
  md.push(`## 3. 嫌疑环节概率排名`);
  (ranked_suspects || []).forEach(r => {
    md.push(`${r.rank}. **${r.node}** — 概率=${r.probability}`);
    md.push(`   - 依据：${r.reason}`);
    if ((r.evidence_case_ids || []).length) md.push(`   - 案例：${r.evidence_case_ids.join(", ")}`);
  });
  md.push(``);
  md.push(`## 4. 分层排查计划`);
  (investigation_plan || []).forEach(layer => {
    md.push(`### ${layer.layer}`);
    (layer.actions || []).forEach(a => {
      md.push(`- **对象**：${a.object}（${a.priority_hint || ""}）`);
      md.push(`  - 检查项：${(a.check_items || []).join("; ")}`);
      (a.commands || []).forEach(cmd => {
        md.push("  - 命令/SQL：");
        md.push("    ```");
        md.push("    " + cmd);
        md.push("    ```");
      });
      md.push(`  - 责任方：${a.responsible || "-"}`);
      md.push(`  - 证据来源：${(a.source || []).join(", ")}`);
    });
  });
  if (uncovered.size) {
    md.push(``);
    md.push(`## 5. 知识库未覆盖项（请补充 KB）`);
    Array.from(uncovered).forEach(u => md.push(`- \`${u}\``));
  }

  return { json_report, markdown_report: md.join("\n") };
}
```

---

## 节点 2a/2b/2c 的召回参数（供在扣子知识库节点里配置）

| 节点 | 知识库 | 元数据硬过滤表达式 | 语义 Query | TopK |
| --- | --- | --- | --- | --- |
| 2a | KB_ARCH | `system_name == {{node1.symptom_system_std}}` | `{{input.symptom_desc}} + {{node1.extracted_keywords}}` | 3 |
| 2b | KB_PROC | `involved_systems CONTAINS {{node1.symptom_system_std}}`；或 `proc_id IN {{node1.candidate_procs}}` | `{{input.symptom_desc}} + {{node1.candidate_functions}}` | 3 |
| 2c | KB_CASE | `表征系统 CONTAINS {{node1.symptom_system_std}}` | `{{node1.extracted_keywords}} + {{input.symptom_desc}}` | 5 |

> 回退策略：若任一路返回 0 条，则把元数据过滤条件放宽为"仅语义召回"，并把该情况写入 `evidence.meta.fallback = true`，最终由节点 7 汇总到 `uncovered` 提示区。
