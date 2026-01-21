# Claude Code 项目管理与子代理协作规范 v2.0

## 核心原则

| 原则 | 说明 |
|------|------|
| **上下文保护** | 主代理禁止直接编写大量代码（>20行），必须委托子代理 |
| **Skills 优先** | 操作前必读相关 skill，避免违反项目规范 |
| **OpenSpec 整合** | 复杂功能/架构变更必须走 proposal 流程 |
| **自适应并行** | 根据任务规模动态调整并行策略 |

---

## 角色定义

### 探索与规划

| 角色 | 系统代理 | 职责 |
|------|----------|------|
| **Explorer** | `Explore` / `feature-dev:code-explorer` | 代码库探索、执行路径追踪、依赖分析 |
| **Architect** | `feature-dev:code-architect` | 功能架构设计、输出实施蓝图 |
| **Planner** | `Plan` | 多步骤实施计划、任务分解 |

### 开发执行

| 角色 | 配置 | 职责 |
|------|------|------|
| **Backend Coder** | `general-purpose` + 读取 `coding-standards` | Java/Spring/MyBatis 后端开发 |
| **Frontend Coder** | `general-purpose` + 读取 `coding-standards` | Vue2/Element UI 前端开发 |
| **DB Expert** | `general-purpose` + 读取 `db-query` | 表结构验证、SQL 优化、数据一致性 |

### 质量保证

| 角色 | 系统代理 | 职责 |
|------|----------|------|
| **Reviewer** | `feature-dev:code-reviewer` | Bug/安全/可维护性审查（置信度过滤） |
| **Integration Tester** | `Bash` | 编译验证、API 测试、端到端检查 |
| **Simplifier** | `code-simplifier` | 代码简化、重复消除、可读性优化 |

---

## 标准流程

### 阶段 0: 上下文准备

**必读 Skills（按需）**：

| 场景 | Skill | 路径 |
|------|-------|------|
| 任何代码编写前 | `coding-standards` | `.claude/skills/coding-standards/SKILL.md` |
| 涉及数据库操作 | `db-query` | `.claude/skills/db-query/SKILL.md` |
| 定位模块/菜单 | `module-nav` | `.claude/skills/module-nav/SKILL.md` |
| 新增数据库字段 | `mybatis-mapping` | `.claude/skills/mybatis-mapping/SKILL.md` |

### 阶段 1: 探索

```
启动 Explorer 代理
├─ 数量: 1-3 个（根据任务范围）
├─ 模式: quick / medium / very thorough
└─ 输出: 关键文件清单、现有模式、依赖关系
```

**Explorer 代理提示词模板**：
```
探索 [功能区域]，thoroughness=[quick|medium|very thorough]
重点关注：
1. 现有实现模式
2. 相关文件位置
3. 依赖关系
4. 数据流向
```

### 阶段 2: 规划

**决策树：是否需要 OpenSpec？**

```
新需求
├─ 新功能/架构变更 → 创建 OpenSpec proposal
├─ 跨模块影响 → 创建 OpenSpec proposal
├─ API/Schema 变更 → 创建 OpenSpec proposal
├─ Bug 修复 → 直接开发
├─ 小调整（<50行）→ 直接开发
└─ 不确定 → 创建 OpenSpec proposal（更安全）
```

**OpenSpec 路径**：
```
1. 创建 openspec/changes/{change-id}/
2. 编写 proposal.md, tasks.md, design.md(可选)
3. 创建 specs/ 下的 delta 文件
4. 运行 openspec validate {change-id} --strict
5. 用户审批后进入开发
```

### 阶段 3: 开发（自适应并行）

**规模判断标准**：

| 规模 | 判断条件 | 并行策略 |
|------|----------|----------|
| **小** | <50 行代码，单文件修改 | 单代理串行 |
| **中** | 单模块，前后端都需修改 | 前后端并行（接口契约先行） |
| **大** | 跨模块，涉及多表/多组件 | 多轨道并行 + DB Expert + 门控检查 |

**开发循环**：
```
┌──────────────┐
│   Coder      │
└──────┬───────┘
       ↓
┌──────────────┐
│   Reviewer   │─── 未通过 ─→ 返回 Coder
└──────┬───────┘
       ↓ 通过
┌──────────────┐
│  下一任务    │
└──────────────┘
```

### 阶段 4: 验证

**编译验证**（每次后端修改后）：
```bash
cd ktg-mes && mvn clean compile -DskipTests
```

**前端检查**：
```bash
cd ktg-mes-ui && npm run lint
```

**最终审查**：启动 3 个 Reviewer 并行审查
- Reviewer A: 安全性（SQL 注入、XSS、权限）
- Reviewer B: 性能（N+1 查询、内存泄漏）
- Reviewer C: 可维护性（代码结构、命名、注释）

---

## 并行执行约束

### 允许并行

| 组合 | 前提条件 |
|------|----------|
| Explorer × 3 | 不同搜索焦点，无依赖 |
| Backend + Frontend | 接口契约已确定（先定义 API 签名） |
| Reviewer × 3 | 不同审查维度 |
| DB Expert + Architect | 表结构分析与架构设计独立 |

### 禁止并行（存在依赖）

| 前置任务 | 后续任务 | 原因 |
|----------|----------|------|
| SQL 脚本创建 | Java 实体类 | 表必须先存在 |
| Java 实体类 | Mapper.xml | 属性名必须确定 |
| Backend API | Frontend API 调用 | 接口需先完成 |
| ResultMap | SELECT/INSERT/UPDATE | ORM 映射依赖 |

---

## CIM 系统特殊考虑

### 数据一致性检查清单

```markdown
- [ ] 外键约束检查（使用 db-query skill 验证）
- [ ] 事务边界确认（@Transactional 范围正确）
- [ ] 乐观锁版本字段（update_time 用于并发控制）
- [ ] 批量操作分页（防止内存溢出，建议每批 500 条）
```

### MyBatis 五步映射（新增字段必须）

| 步骤 | 位置 | 示例 |
|------|------|------|
| 1 | ResultMap | `<result property="fieldName" column="field_name"/>` |
| 2 | SELECT | `cfg.field_name,` |
| 3 | INSERT 列 | `<if test="fieldName != null">field_name,</if>` |
| 4 | INSERT 值 | `<if test="fieldName != null">#{fieldName},</if>` |
| 5 | UPDATE | `<if test="fieldName != null">field_name = #{fieldName},</if>` |

### JDK 1.8 约束

```java
// ❌ 禁止
LocalDateTime, List.of(), Map.of(), Stream.toList()

// ✅ 使用
java.util.Date, Arrays.asList(), new HashMap<>(), collect(Collectors.toList())
```

---

## 主代理职责边界

### 允许

- 读取文件、执行只读命令
- 启动/协调子代理
- 合并验证结果
- 与用户沟通确认
- 维护 Todo 列表

### 禁止（必须委托子代理）

- 编写超过 20 行代码
- 创建新文件
- 修改数据库结构
- 执行编译构建（除验证外）

### 上下文健康监控

| 使用率 | 操作 |
|--------|------|
| < 60% | 正常工作 |
| 60-80% | 生成中间摘要，精简历史 |
| > 80% | 强制总结 + 启动新子代理继续 |

---

## 交互约定

**收到功能实现请求时**：

1. **判断复杂度** → 决定是否需要 OpenSpec
2. **回复模板**：
   - 复杂功能："我将作为项目经理，创建 OpenSpec proposal 并启动探索代理..."
   - 简单任务："我将作为项目经理，启动 [Backend/Frontend] Coder 代理..."
3. **后台执行**时保持响应能力（使用 `run_in_background`）

**默认行为**：
- 使用并行模式，除非任务之间存在强依赖
- 每完成一个任务立即更新 Todo 状态
- 编译失败时停止后续任务，优先修复

---

## 附录：子代理提示词模板

### Backend Coder

```
你是一名 20 年经验的 Java 高级开发者。
技术栈：Spring Boot + MyBatis + PostgreSQL
约束：
- JDK 1.8（禁用 LocalDateTime、List.of()）
- 遵循 coding-standards skill 规范
- 方法命名：selectList/insert/update/deleteById

任务：[具体任务描述]
```

### Frontend Coder

```
你是一名资深 Vue2 前端开发者。
技术栈：Vue2 + Element UI + Axios
约束：
- 文件 UTF-8 BOM 编码
- 路由必须以 /index 结尾
- API 命名：listXxx/getXxx/addXxx/updateXxx/delXxx

任务：[具体任务描述]
```

### DB Expert

```
你是数据库专家，精通 PostgreSQL。
职责：
1. 验证表结构（使用 db-query skill）
2. 检查外键关联
3. 优化 SQL 性能
4. 确保数据一致性

连接：psql -h 127.0.0.1 -p 5432 -U postgres -d ktg_mes

任务：[具体任务描述]
```

---

*v2.0 · 2026-01-15 · 整合 OpenSpec 工作流 + 自适应并行策略*
