02.常用信息2
    a.AI插件
        a.说明
            名称：Claude Code Chat
            艾特文件：搜索框，模糊搜索
            恢复检查：restore checkpoint
            对话模式：只需要勾选Plan Mode，它会老老实实只讨论、不写
            模型模式：Think / Think Hard / Think Harder / Ultrathink
            授权所有权限：右上角设置 -> Enable Yolo Mode (Auto allow all permissions)
        b.优点
            无需终端：优雅的聊天界面即可完成所有交互，告别命令行。
            恢复检查点：随时撤销更改，回溯到任意历史版本
            MCP 服务器支持：内置完整的 Model Context Protocol 服务器管理
            对话历史：自动保存并管理全部会话与历史记录
            VS Code 原生集成：深度嵌入 VS Code，完美适配主题与侧边栏
            规划与思考模式：“先规划后执行”及可配置的思考模式，带来更优结果
            智能文件/图片上下文 & 自定义命令：可引用任意文件、粘贴图片或截图，并创建自定义命令
            模型选择：按需切换 Opus、Sonnet 或默认模型
            Windows / WSL 支持：兼容原生 Windows 与 WSL 环境
        c.缺点
            1.无法同时跑多个任务。而这是我的刚需。
            2.部分功能有bug，不是特别流畅，比如刚刚提到的历史记录恢复功能。
            3.无法使用Claude Code在7月底刚刚推出的Sub Agents功能。
        d.可视化设置MCP
            点击对话框下方的'MCP'按钮，可以完全可视化的方式选择MCP，不需要任何命令行。
            我建议你全部添加它默认列表里的全部MCP，因为这些真的对开发过程很有帮助。
    b.AI分析url
        a.问数据
            https://www.toolify.ai/self-api/v1/top/month-top?page=1&per_page=200&direction=desc&order_by=growth
            阅读这个网址，全部内容装到上下文里，然后回答我问题：本月访问量100万~300万之间,月度增长超过50万有哪些
        b.分析数据细节
            它们流量是怎么来的？
        c.结合自己的项目来提问
            再结合我的项目问问题，当前打开的项目是我的Raphael AI，https://raphael.app
            这是一款全球火爆的免费文生图、图生图的产品。就算是用户不注册不登录，也可以不限数量地生成图片。
            我打算问问看，我们这个产品，可以从榜单分析中，得到哪些启发？
        d.让Claude Code推荐值得关注的产品
            再问问看，榜单有啥异常值，值得我特别关注的产品？
            仔细看榜单,还有哪些比较异常的情况,为我做新产品提供依据,尤其关注很创新的产品
    c.AI安装mcp
        a.坐标
            找到世界顶级的Claude Code Sub Agents到底在哪儿，https://github.com/wshobson/agents
        b.安装
            https://github.com/wshobson/agents
            把这些Agents 全部安装到我的 ClaudeCodeClI里，跳过重复的
        c.结果
            稍等片刻，它全部安装完了，一共帮我安装了73个Agent！
            这个任务，一共消耗了超过300K Token，总时长30分钟。
    d.AI提交日志
        a.方式1
            第一步：精准选择待提交文件
            无即便是我们并行开了很多个Claude Code/Codex、分别在编辑多个文件，我们也可以精准选择本次需要提交哪些内容。
            方法是：在已更改文件文件区域(Changes)，找到具体文件，点击文件名后面的加号(+)， 可把修改记录放到暂存区(Staged Changes)
            如果点歪了，可以到Staged Changes区域找到文件，点文件后面的减号 ( - )， 重新把一个文件放回到Changes区域
            -------------------------------------------------------------------------------------------------
            第二步：点击AI自动生成代码提交信息
            确保需要提交的文件在Staged Changes区域后，点击 VS Code / Cursor 提供的自动生成Git记录按钮。
            示例：下图编号2的红圈。
            由于在第一步，我们已经精准选定了所有当前需求相关的文件，此时生成的提交记录，会非常精确。
        b.方式2
            让Claude Code帮你提交，请打开Bypass permission，提前授予Claude Code所有权限
            -------------------------------------------------------------------------------------------------
            帮我提交代码，只提交和本次修改内容有关的文件，提交记录写规范点，用中文
            -------------------------------------------------------------------------------------------------
            注意观察它的操过过程： Claude Code 会自动把本次功能所涉及的文件，放到Staged Changes区域。 （当然，它是通过命令行的形式，而不是点击按钮）
            然后，再进行了代码提交。=Claude Code只提交了本次功能相关的部分、写了规范的提交记录； 把和本次修改无关的内容，继续留到了Changes区域。

03.常用信息3
    a.AI操作自己
        a.别名
            使用 claude --dangerously-skip-permissions 来提前授予claude code一切权限
            alias ai="claude --dangerously-skip-permissions"
        b.安装mcp
            我现在的IP地址是哪个国家
            升级我的claude code到最新版本，并且告诉我最新版本更新了啥
            给我的claude code安装mcp magicdesign，你自己上网搜索想办法搞定
            列出已安装的 MCP；根据我的使用场景给出推荐清单并自动安装；把每个 MCP 的用途、主要命令、典型风险写成一页 MCP-README.md。
        c.AnyVoice产品
            @modelcontextprotocol/server-filesystem - 文件系统操作
            @modelcontextprotocol/server-github - GitHub 集成
            @modelcontextprotocol/server-postgres - PostgreSQL 数据库操作
            @modelcontextprotocol/server-aws-kb - AWS 知识库（用于 S3 存储）
            @modelcontextprotocol/server-fetch - 网络请求
            @modelcontextprotocol/server-shell - Shell 命令执行
        d.自然语言，精准定位历史聊天
            在我最近20条操作claude code记录当中，有一个是关于数据库性能的，是哪一条，找出来，恢复对话，我要继续聊
            然后我就可以继续对话了，继续完成今天早上还没完成的任务了。
    b.AI丝滑操作
        a.多开
            使用Cursor或者VS Code作为IDE，安装官方插件，保证Claude Code可以和IDE协同。
            打开Bypassing Permissions模式，提前授予Claude Code一切所需权限，完全解放双手。
            同时打开3个Claude Code，复杂任务，使用ultrathink，杜绝AI偷懒的可能性。
            (注：这是Claude Code内部的魔法口令，可以让它不考虑预算、尽情思考。）
        b.贴图
            需要让Claude Code看图时，使用Ctrl+V (而不是command+V) 可以贴图。
            contenxt7和browsermcp两大MCP，可以加快网站类产品的开发效率
        c.查看历史聊天记录
            使用 /resume 可以查看历史聊天，或者接着聊。
            再打开LIVE TOKEN USAGE MONITOR，实时查看Claude Code省了多少钱
        d.Cursor+ClaudeCode
            1.Cursor 安装 ClaudeCode
            2.在 IDE connected 状态下，如果Claude Code修改了文件，它会使用IDE的其他功能，如修改预览
            3.上文提到的按钮，连续点3下，就能打开3个，虽然可以同时打开多个
            4.但只有你最后打开的那一个，可以和IDE保持协同。
            5.保持和IDE协同的那一个，会出现绿色的小圈和IDE connected
        e.使用其他模型进行规划
            Claude Code 有一个内置的规划模式，当你按两次 Shift+Tab 时触发。在这种模式下，Claude 不会写入你的文件系统。
            不过我个人喜欢用另一个模型进行规划，只是为了增加一些变化。
            在过去的几周里，我一直在直接使用 Google AI Studio 中的 Gemini 2.5 Pro。
        f.使用语音输入
            像 Superwhisper 这样的应用程序使得听写提示变得非常容易。我发现当我想写一个更长的提示时这非常有效，因为它会更快地将想法从我的脑海中提取出来。
            这对任何 LLM 输入字段都非常有效，因为 LLM 通常可以理解你的意思，即使转录很差且充满错误。
            在国内，我们可以使用豆包电脑版；豆包电脑版是可以当成语音输入法来使用的，它的能力超过一切其他语音输入法！
        g.使用 Git 进行版本控制
            我在 Claude Code 中缺少的一个功能是制作自动文件系统快照的能力。
            我经常遇到 Claude 变得有点过于激进并开始在我不想要的时候进行大规模更改的情况。
            如果这发生在我已经得到一些好的更改之后，这可能会搞乱工作目录。
            为了规避这个问题，我开始早期和经常地暂存（即 git add）更改。
            如果我在一轮后满意，我通常会暂存所有内容，这样我就知道我可以稍后轻松地恢复到它。
        h.使用 Git Worktree
            我对 Claude Code 如此着迷，以至于我现在在我的机器上为我工作的每个主要项目至少有两个工作树。
            这允许我让 Claude 在同一个仓库中处理两个不同的问题。
            设置也很容易！就像创建一个分支，但代码将在不同的目录中。在你的 git 仓库内运行：
            git worktree add ../tailwindcss.com-2 chore/upgrade-next
            瞧，你现在有另一个工作目录让 Claude Code 尽情发挥。
    c.AI搭配对话
        a.思路
            在项目中，同时打开Claude Code和Codex，你甚至可以用一个模型让他自己左右脑互博
            1.让Claude Code出方案
            2.把方案发给Codex进行评审，挑刺
            3.把Codex挑刺的内容发给Claude Code，问它是否同意（往往会同意）。如果同意，开始补充计划；如果不同意，把为什么不同意，复制给Codex，问问它的看法
            4.两者对方案达成共识后，让Claude Code写代码
            5.让Codex对代码进行Review，重复步骤3
            6.两者对代码达成共识后，提交代码
        b.实战
            背景：我让Claude Code完成了creem支付的接入，改动比较大，想让Codex进行检查
            思路：我告诉Codex一个git提交的ID (Commit ID)，让它自己去检查
            A问：这个git提交8fcae5eaac3f8a022025a82c1330de4f99bf4268 是我写的creem支付代码，请你检查，结合creem官方文档，看看我们写对没，是否有疏漏
            B答：这是别人对git提交8fcae5eaac3f8a022025a82c1330de4f99bf4268 的代码审核，你同意它的看法吗? 请你独立思考，多上网搜索调研
        c.结论
            Claude Code正在对审核意见内容进行逐一核实
            Claude Code同意了一部分Codex的观点，并且做了一些补充
            接下来我让他俩‘左右互搏’几轮，直到完全达成一致！

04.常用信息4
    a.AI项目思路
        a.和Claude Code沟通新需求时，用飞书文档写需求，做到「任何人看都没有歧义」。需求描述超过1000字，图文并茂，然后复制给Claude Code
            尝试让Claude Code直接写代码，是新手最容易犯的第一个错误。特别容易把代码改成屎山。
            一定要意识到：如果代码成了屎山，这不是Claude Code的问题，是你的问题。
            新手并容易不知道自己是否把需求描述得没有歧义，他们会倾向于甩锅给AI。
        b.新需求首次沟通时，末尾强调 「不要急着写代码！先理解需求，给出实现思路，我们先讨论，看还有啥需要我决策的点？」
            尝试让Claude Code直接写代码，是新手最容易犯的第二个错误
            有同学问题我，为什么不用Plan Mode？ 是的，Plan Mode可以得到类似的效果，但是，切换模式有点麻烦了。我喜欢提前授予Claude Code一切权限，解放双手。
            一般而言，新需求，需要反复讨论3～5轮，直到Claude Code完全找不出来下一个需要你决策的点，我们再让它开始写代码。
            我尽量打码敏感信息，给大家展示一下一部分讨论过程。可以看出，我的回复是非常长的，事无巨细。这是从飞书文档里复制粘贴出来的。
            完全讨论清楚后，只需要回复「同意」或者「开始」
        c.涉及界面需求时：快速纸上画布局，然后让Claude Code用ASCII画出来，最后提醒它拆分控件
            A.关于画草图，最快的是在纸上画，也可以在Excalidraw上画，怎么快怎么来。无论怎么画，Claude Code都能明白你的意思。
            B.关于ASCII画图，你可以让Claude Code出3~5种不同的布局，然后你来选择。
            C.最后，在开始编码前，强调让Claude Code仔细理解项目结构，尽可能合理地拆分控件、并把控件放到合适的位置。这也是新手常见坑，如果不做强调，Claude Code可能会写出来单文件很大的控件。
    b.AI界面设计
        a.思路
            截图
            让它使用Playwright MCP查看当前情况（可选）
            让它用ASCII画出来布局
        b.完整的指令如下
            我新上的功能, Hero区域, 你有什么建议吗?
            我要世界顶级的交互设计,简洁、专业.你拥有我所有代码的阅读权限,
            以及，这是线上地址https://raphael.app/background-remover
            你可以使用playwright mcp访问它，和代码对比查看
            你可以提出5种不同的方案,使用ASCII画出来,和我讨论
        c.操作过程
            收到指令后，Claude Code按照指令，查看我的相关代码、并且打开浏览器查看了当前效果，辅助它理解
            接下来，Claude Code使用ASCII画出了5个方案
            Claude Code做出了推荐，给出了推荐理由，如下图所示。
            五分钟后，Claude Code已经写完了雏形，然后它自己打开了浏览器，开始检查。如下图所示。
    c.一键去除前端设计AI味
        a.说明
            摆脱看吐了的紫色渐变的官方方案来了
        b.操作
            1.安装 plugin：/plugin marketplace add https://github.com/anthropics/claude-code
            2.选择 claude-code-plugins
            3.选择 frontend-design 安装
            最后如果没有明确调用 frontend-design，可能需要提示词关联就行。

05.常用信息5
    a.目标
        让 Codex 连续工作 8 小时的问题，上下文都不会爆掉！
        让 Claude Code 去当监工监督 Codex 干活
    b.步骤
        1.首先要让 Codex 生成一个任务的 TODO List，就是那种能一步步完成的
        2.然后让 Codex 更新 Agents md 文件，加上说明，如果输入 continue，要读取 TODO 文件，去选取任务，执行后更新 TODO
        3.让 Claude Code 去执行命令：export TERM=xterm && codex exec "continue to next task" --full-auto
    c.提示词
        帮我在当前目录下，新开一个agent，使用 export TERM=xterm && codex exec "continue to next task" --full-auto 命令开启一个 codex 进程,
        注意观察任务执行情况，如果当前任务完成(任务运行时间较长，可以多等一会)，就结束进程，然后重新开个agent运行相同指令让它继续
        注意每次打开codex和监控它运行都调用一个新agent (Task Tool)来执行这个操作以避免主agent上下文太长
    d.工作原理
        也就是 Claude Code 去启动 codex 并传入提示词 "continue to next task"
        并且监控 codex 的执行，如果当前任务完成了，就杀掉进程，重新执行上面的指令下一个任务。
        由于每次都是新的 session，所以 codex 的上下文每次用的不多，不会爆掉。
        -----------------------------------------------------------------------------------------------------
        那么怎么保证 Claude Code 的 Context 不爆掉呢？毕竟codex输出的信息也不少
        答案就是让 Claude Code 每次去启动 codex 和监控 codex 执行的时候，都起一个子 Agent，
        这样每个子 Agent 都有独立的上下文，主 Agent 只有子Agent完成的上下文，占用空间极小。
        Sub agents主要是用做上下文管理的，它的特点是不携带主线程的上下文，也不会把自己的上下文吐给主线程
        -----------------------------------------------------------------------------------------------------
        在启动一个sub agent 的时候，展开详情（Ctrl+R） 可以看到主线程写了什么 Prompt 给 sub agent，多看两个 就会更了解它究竟在干什么
        sub agents 可以并行用，在 explore-plan-code-test 这个官方推荐的工作流里，可以在explore/plan/test 阶段强制要求并行，在 code 这个阶段只用串行
        因为他有不携带上下文的特点，所以当你需要携带上下文的时候，你就不能用sub agents 了，比如它中间读了个文件，如果你需要这个文件在上下文里面，那么只能在主线程里串行执行
    e.注意事项
        监控 codex 执行这任务理论上来说 Gemini cli和 Codex cli 也能做，但是我没成功。
        另外也没办法真的 8 小时，Claude Code 会偷懒，执行一会就会自行中断，即使没用多少上下文，
        暂时还没解决这个问题，但是思路可以借鉴一下，如果有更好办法，欢迎留言交流。
        -----------------------------------------------------------------------------------------------------
        这个思路可以用在 Claude Code 上，把里面的 Codex 换成 Claude Code 就行，本质上就是一个 Manager 监控 Worker 干活。
        要点：
        1.Worker 要有 TODO List，并且 Agents/Claude Code MD 要有引导，这样每次固定提示词（continue）能继续任务
        2.Worker 要开子进程避免上下文爆掉
        3.Manager 去管理 Worker 干活要开子 Agent，避免 Manager 的上下文爆掉
        -----------------------------------------------------------------------------------------------------
        为什么要用 AI 去监督 AI 干活而不是脚本：
        1.探索各种可能性
        2.这样用 AI 监测，比脚本的好处是：
        简单易行（但是费 Tokens）
        可以根据任务执行的结果动态处理， Prompt 可以不是固定的
        -----------------------------------------------------------------------------------------------------
        Claude Code 虽然上下文不会爆掉，但是用量会爆
        Claude Code 有个特别的工具叫 Task tool，本质就是一个子 Agent，它可以有独立的上下文，所以哪怕它用了很多token，但也不会占用多少主Agent的上下文空间

06.常用信息6
    a.讲解顺序
        a.说明
            1.Claude 生态里到底有几块「积木」？
            2.Skills：让 Claude 真正「学会干活」
            3.Prompts：依然是主角，但天生是一次性的
            4.Projects：给每一个重要主题一个「专属上下文空间」
            5.Subagents：给每个子任务配一个「专职 AI 同事」
            6.MCP：把所有外部系统接成一张网
            7.一个完整的「研究 Agent」案例：这几块积木怎么拼在一起？
            8.官方 FAQ 里的几个关键信息
            9.实际上手：不同类型用户怎么用 Skills
            10.作为 AI 产品创业者，我自己的一个判断
        b.Skills的工作流程大致是
            1.环境启动 → 扫描 Skills 目录
            2.读取所有 SKILL/.md 的 frontmatter（元数据）
            3.保持 ~100 tokens 的元数据在上下文中
            4.用户输入 → 匹配 description
            5.相关 Skill 被触发 → 加载完整的 SKILL/.md
            6.按需加载 references/ 和 assets/
            注意：如果想在其他客户端使用 Skills，目前还是很局限的，只能是粘贴复制 SKILL/.md 的文本进去
            注意：不能自动加载更多的 references 和 assets，需要的话还得手动给到。但也不是说不行。
            注意：不过这个机制不难实现，就看各个客户端要不要跟进了。
        c.Claude Skills 原理有所谓的三层
            层级 1: 元数据（始终在上下文中）
              ├─ name: 技能名称
              └─ description: 触发条件（~100 词）
            层级 2: http://SKILL.md 主体（触发后加载）
            └─ 核心工作流程指令（<5000 词）
            层级 3: 打包资源（按需加载）
              ├─ scripts/    → 可执行代码（不占上下文）
              ├─ references/ → 参考文档（需要时读取）
              └─ assets/     → 输出资源（直接使用）
            -------------------------------------------------------------------------------------------------
            层级1 (元数据)：100词 × 10个技能 = 1000词
            层级2 (主体)：仅触发的技能加载 ≈ 3000词
            层级3 (资源)：脚本执行不占token，文档按需加载
            效果: 同样的上下文预算，支持 10x 更多的专业能力
    b.Claude 生态里到底有几块「积木」？
        a.先把名字捋顺，否则后面全是雾
            Prompts：你在对话框里敲给 Claude 的那一段话
            Skills：一个个「能力文件夹」，里面是可复用的流程、脚本和资源
            Projects：带自己知识库和历史记录的「项目空间」
            Subagents：专门干某件事的小助手，像「子 AI」
            MCP（Model Context Protocol）：把 Claude 接到你各种外部工具和数据源上的「通用连接层」
        b.如果用一句人话总结
            Prompts 是“当场吩咐一句”，
            Skills 是“把做事的方法写进操作手册”，
            Projects 是“给 AI 搭一个项目档案室”，
            Subagents 是“请来一堆专职的 AI 同事”，
            MCP 是“打通所有外部系统的总线”。
    c.Skills：让 Claude 真正「学会干活」
        a.Skills 是什么？
            a.说明
                官方定义是：Skills 是一些文件夹，里面放着指令、脚本和资源，当 Claude 觉得当前任务需要它时，就会动态加载。Claude
                你可以把它想象成：给 Claude 写的一本本“岗位说明书 + SOP + 工具包”。
            b.说明
                比如一个「品牌规范 Skill」，里面可以写清楚：
                品牌主色、辅色、渐变怎么用
                标题字体、正文字体分别是什么
                PPT 的版式有哪些固定模板
                LOGO 在任何地方出现的尺寸和留白规则
                不允许出现的低级审美错误
            c.说明
                以后你再让 Claude「帮我写一份路演 PPT」，它会自动套用这套规范，不需要你每次重新科普一遍品牌手册。
        b.Skills 在后台是怎么工作的？这里有个很有意思的设计：渐进披露（progressive disclosure），大致流程是这样的
            a.先读“封面简介”
                Claude 会先扫描所有可用 Skills 的「元数据」——几句描述，大约 100 tokens 左右。
                目的只是判断：这个 Skill 跟当前任务有没有关系。
            b.觉得相关，再读“说明书正文”
                一旦判断相关，它才会加载整个 Skill 的详细说明（SKILL.md），官网提到上限大约是 5k tokens，这里面通常是：
                步骤、流程
                注意事项
                输出格式要求
                风格偏好等
            c.真的需要代码时，才加载脚本和文件
                有些 Skill 还会带脚本或参考文件（比如模板、示例）。
                只有在真正需要执行相关操作时，Claude 才会把这些东西「拎进上下文」。
            d.这个设计的意义在于
                你可以给 Claude 装很多 Skills，
                但不会一上来就把上下文撑爆，
                它只会在需要的时候，把需要的那一本“手册”翻开。
        c.什么时候应该用 Skills？官方给了三个典型场景
            a.组织级工作流
                品牌规范
                法务／合规流程
                各种标准化文档模板、
            b.某个专业领域的「经验总结」
                Excel 公式、常用数据分析套路
                PDF 处理的流程
                安全审计、代码 Review 的标准
            c.个人偏好 & 习惯
                你的笔记结构
                你的代码风格
                你的研究方法
            d.一句话
                任何你不想一遍遍重新解释的东西，都可以长久地写进 Skill。
    d.Prompts：依然是主角，但天生是一次性的，依然是日常交互的主角，但不适合作为「长期记忆」
        a.Prompts 是什么？
            a.说明
                这个大家都熟：Prompts 就是你在对话里用自然语言给 Claude 下的那些指令，是实时的、对话式的、一次性的。Claude
            b.比如
                「帮我总结这篇文章」
                「把刚才那段话的语气改得更专业一点」
                「帮我分析一下这份数据，看有什么趋势」
                「用项目符号重新排版一下」
            c.说明
                甚至可以是非常完整的一段复杂 prompt，比如官方举的「请你对这段代码做一个完整的安全审计」，
                后面跟了详细的检查项、严重程度定义、修复建议要求等等。
        b.Prompts 的局限在哪里？
            a.Claude 官方直接说了
                Prompt 是你和模型交互的主要方式，但它不会在不同对话之间自动保留。
            b.也就是说
                你今天费心写了一个很长的「代码安全审计」提示词
                明天开新对话，还得重新粘一遍
                换个项目、换个窗口，又得重来
            c.于是他们给出一个很自然的建议
                如果你发现自己在多个对话里反复敲同一类 Prompt，那就该把它升级成 Skill 了。
                比如这些典型句型：
                「请按照 OWASP 标准对这段代码做安全审计」
                「请总是给出‘高层摘要 + 关键发现 + 建议’这三个结构」
                这类东西，适合写进 Skill，变成「永远的工作方式」，而不是「今天一时想起来的提示词」。
                官方也推荐你先看他们的 prompt library、最佳实践、以及一个「智能 Prompt 生成器」，这个就不展开了。
    e.Projects：给每一个重要主题一个「专属上下文空间」
        a.Projects 是什么？
            在 Claude 的付费方案里，Projects 是一个个独立的工作区：
            有自己的聊天记录
            有自己的知识库
            有自己的「项目级」指令
            每个 Project 有一个大上下文窗口（官方说是 200K tokens 级别），你可以往里面上传各种文档、资料，让 Claude 在这个空间下工作。
            当知识量很多的时候，Claude 会自动切换成类似 RAG 的模式，把项目知识进行检索，整体可扩到原来上下文的 10 倍左右。
        b.什么时候适合用 Projects？
            a.官方建议
                a.需要长期存在的背景知识
                    某个产品线
                    某个大客户
                    某个长期课题
                b.需要把不同工作分“项目隔离”
                    Q4 产品发布
                    某一场活动运营
                    某一轮融资材料
                c.团队协作（Team / Enterprise）
                    共享历史对话
                    共享知识库
                    项目级的自定义指令
                    这个项目里，所有输出都要偏「To B、专业、严谨」
                    另一个项目里可以更轻松一点
            b.官方例子
                建一个「Q4 Product Launch」项目，把市场研究、竞品分析、产品规格都扔进去，以后在这个项目里的所有对话都会自动带着这些背景。
        c.Projects 和 Skills 的区别
            这一点很关键。官方一句话概括得非常好：
            Projects 解决的是「你要知道什么」（背景知识）。
            Skills 解决的是「你要怎么做事」（流程方法）。
            换个比喻：
            Project 像「整个项目的档案室＋学习资料」
            Skill 像「公司内部的一份份标准操作手册」
            Project 是局部的——只在这个项目空间里生效。
            Skill 是全局可用——任何对话、任何项目，只要相关，都能调出来用。
    f.Subagents：给每个子任务配一个「专职 AI 同事」
        a.Subagents 是什么？
            在 Claude Code 和 Claude Agent SDK 里，你可以创建很多「子代理（subagents）」。它们具备：
            自己的上下文窗口
            自己的系统提示
            自己的一组工具权限
            你可以把它们理解成：
            Subagents = 一个个岗位明确、权限有限、职责清晰的 AI 员工。
        b.Subagents 适合干什么？
            a.官方给了4类典型用途
                a.任务专业化
                    专门做代码审查
                    专门生成单元测试
                    专门做安全审计
                b.上下文的拆分
                    主对话保持干净
                    把“重活”丢给 subagent 做
                c.并行处理
                    一个 subagent 做市场调研
                    另一个做技术分析
                    再一个做文档整理
                d.工具权限隔离
                    某些 subagent 只有只读权限
                    它永远不能写入、不能删东西
            b.例子
                建一个「代码审查 subagent」，
                只给它 Read / Grep / Glob 权限，不给 Write / Edit。
                每次代码有改动，Claude 会自动把审查任务丢给它，
                这样就能保证有安全审查，而不会误改代码。
        c.Subagents 和 Skills 怎么配合？
            a.官方推荐
                多对多
                一个 subagent 可以使用多个 Skills（例如语言规范、领域 Best Practice）
                多个 subagent 也可以共享某些 Skills（比如统一的写作规范 Skill）
            b.你可以这样理解
                Skill 更像“知识＋流程”；
                Subagent 更像“带着这些知识/流程去执行任务的具体人”。
    g.MCP：把所有外部系统接成一张网
        a.MCP 是什么？
            Model Context Protocol（MCP）是一个开放协议，用来把 AI 助手接到各种外部系统上。
            简单理解：
            你不用再给每个系统写一套单独的集成，
            只要对接 MCP，就可以用统一方式连接各种数据源和工具。
            官方举的典型连接对象：
            外部数据源：Google Drive、Slack、GitHub、数据库等
            业务工具：CRM、项目管理系统
            开发环境：本地文件、IDE、版本控制
            自研系统：你们自己公司的内部平台
            你把这些系统包装成一个个 MCP server，Claude 作为 MCP client 去连它们。
        b.MCP 和 Skills 怎么配合？
            非常重要的一点是：
            MCP 负责“接通数据和工具”，
            Skills 负责“告诉 Claude 要怎么用这些数据和工具”。
            比如：
            MCP：让 Claude 能访问你的数据库
            Skill：规定「查询时必须先按日期过滤」「查询结果要按某种格式输出」
            MCP：连接你的 Excel 文件
            Skill：规定「生成报表时必须使用哪些公式」「怎么排版」
            未来比较理想的状态是：
            每接入一个新系统（MCP），
            最好配一套相应的使用说明和流程（Skill）。
    h.这些东西是怎么拼在一起的？一个「研究 Agent」的完整例子
        a.第一步：建一个 Project——「竞争情报」
            把下面这些东西都扔进去：
            行业报告、市场分析
            竞争对手的产品文档
            CRM 里的用户反馈
            你们之前写过的研究总结
            并且加一段项目级指令：
            分析竞品时要站在我们自家产品战略的视角，
            尤其关注差异化机会和新兴趋势，
            给出的结论要带证据、要可执行建议。Claude
        b.第二步：用 MCP 接数据源
            打开几个 MCP server：
            Google Drive：访问共享研究文档
            GitHub：看竞品的开源仓库
            Web 搜索：查实时的市场信息
        c.第三步：创建一个「竞争分析 Skill」
            比如叫 competitive-analysis，里面可以包含：
            公司内部 GDrive 的目录结构
            搜索时的最佳实践
            先从哪个目录下手
            优先看最近 6 个月的文档
            最终确认「权威版本」的方式
            一个标准化的研究工作流：
            明确研究主题
            在对应的目录里组合关键词搜索
            选 3–5 个最新 / 最关键文档
            和战略文档交叉引用
            输出时标注来源文件名和日期
            这就是一个非常典型的「流程型 Skill」。
        d.第四步：配置 Subagents（在 Claude Code / SDK 里）
            比如两个子代理：
            a.market-researcher
                优先使用权威来源（Gartner/Forrester 等）
                关注市场份额、增长率、融资情况
                需要给出带引用和置信度的结论
                负责：市场趋势、行业报告、竞品定位
                工具：Read、Grep、Web-search
                系统提示里写清楚：
            b.technical-analyst
                分析技术栈、架构模式
                评估可扩展性和性能
                找出技术优势和短板，并给出对你有用的启示
                负责：技术架构、实现方式、工程决策
                工具：Read、Bash、Grep
                系统提示：
        e.第五步：调用这个 Agent
            你现在问 Claude：
            「帮我分析一下我们前三个主要竞品最近发布的 AI 功能，它们是怎么定位的？我们有哪些可利用的空档？」
            背后到底会发生什么？（重点来了）
            a.Project 上下文加载
                Claude 拿到你之前上传的研究文档、战略文档
            b.MCP 联通数据
                去 GDrive 里找最新竞品材料
                去 GitHub 拉开源仓库
                用 Web 搜索补实时信息
            c.Skill 启用
                用 competitive-analysis 这个 Skill 提供的工作流框架来组织分析
            d.Subagents 并行工作
                market-researcher 去研究市场定位
                technical-analyst 看技术实现
            e.你通过 Prompt 微调方向
                比如补一句：「重点关注医疗行业的企业客户」
            f.最终，你拿到的是一份
                有来源
                有结构
                有可执行建议
                又符合你战略视角的竞品研报。
            这就是「几块积木组合起来」的威力。
    i.官方 FAQ 里的关键点
        a.Skills 是怎么保持「高效」的？
            靠的就是前面说的「渐进披露」：
            先扫 metadata
            再按需加载完整说明
            有代码和文件再按需加载
            所以你可以放心地给 Claude 装很多 Skills，它不会一开始就被上下文压垮。
        b.Skills vs Subagents：什么时候用哪个？
            a.用 Skills
                当你希望「任何 Claude 实例」都能加载某种能力，比如安全审计流程、数据分析方法
            b.用 Subagents
                当你需要一个完整的「小代理」，自己带上下文、带工具权限，能独立跑完整工作流
            c.最推荐的姿势是
                Subagent ＋ Skills 组合使用。
                让一个专职“代码审查 subagent”去调用「语言特定 best practice Skill」，
                相当于给这个小同事配一堆教材。
        c.Skills vs Prompts：什么时候该升级？
            a.用 Prompts
                一次性指令、即时交互、补充上下文
            b.用 Skills
                当你有一套流程／专业经验，需要反复使用
                当你希望 Claude 能自己判断「什么时候应该套这套流程」
            c.比较理想的模式是
                用 Skills 打地基，用 Prompts 在每次任务上做具体微调。
        d.Skills vs Projects：核心差别是什么？
            官方原话的对比非常精炼：
            a.Projects
                「这是你需要知道的东西」（知识、文档、背景）
                总是在项目里加载
            b.Skills
                「这是你应该怎么做事」（流程、代码、方法）
                动态按需加载，节省上下文
            你可以把它记成一句话：
            Project = 知识场景，Skill = 能力模组。
        e.Subagents 能不能用 Skills？
            答案是：可以，而且非常推荐。
            在 Claude Code 和 Agent SDK 里，Subagent 可以和主 Agent 一样使用 Skills。
            比如：
            python-developer subagent
            用 pandas-analysis Skill 按你团队习惯来做数据处理
            documentation-writer subagent
            用 technical-writing Skill 固定 API 文档的写法和格式
    j.如何开始上手 Skills？
        a.如果你是 Claude.ai 网页用户
            在 Settings → Features 里把 Skills 打开
            去 claude.ai/projects 创建你的第一个项目
            在一个具体分析任务里尝试「Project + Skill」联合使用
        b.如果你是 API 开发者
            去看文档里关于 Skills endpoint 的部分（支持通过 API 管理 Skills）
            打开官方的「skills cookbook」仓库，看他们给的 Skill 示例
        c.如果你是 Claude Code 用户
            通过插件市场安装 Skills
            同样可以参考「skills cookbook」，照着抄一遍先跑起来
    k.作为 AI 产品创业者，我的一个小结论
        a.你的差异化，将越来越体现在 Skills 设计上
            把领域经验、工作流、组织规范，沉淀成一套 Skills 库
            这是你产品的护城河，而不仅仅是“调了哪个大模型”
        b.你的产品架构，会越来越像「Agent 积木组合」
            某个功能 = 若干 Project + Skills + Subagents + MCP 的组合
            未来甚至可以对外开放自己的 Skill Store
        c.你的团队，迟早需要一个“Skill Engineer / AI Workflow Architect”角色
            不再只是写 prompt 的人
            而是真正负责「把经验变成可复用的 AI 工作流」的人
        b.说明
            现在很多人还沉迷在“写花式 Prompt”，但从 Skills / Projects / MCP / Subagents 这套组合来看，趋势已经非常明显了：
            做 AI 产品，如果只停留在 Prompt 层，就是停留在 Demo 层；要往真正的“业务系统”走，就绕不开流程工程和 Skill 设计。
            我自己现在已经用 Skills 做很多件事：
            一个是「写公众号 Skill」，比如标题怎么写、导语怎么设计、配图比例怎么选，都写死在里面；
            一个是「代码性能分析Skill」，性能涉及到很多方面，比如数据库设计（索引、事务等）、Redis和数据库的配合、代码中的算法和架构等等、缓存策略等等，单独靠MCP或Subagent是很难完成的，需要一整套流程。
            一个是「产品更新日志 Skill」，我只管往里丢 changelog，它会自动帮我改成对用户友好的版本。
            一个是「产品idea头脑风暴Skill」，我有新的idea的时候，不再是直接问ChatGPT，而是有一个特定的流程。
            一个是「域名讨论Skill」，做新产品时，想域名是一个头疼的事，可以通过Skill来找到后选域名、查询是否可用
