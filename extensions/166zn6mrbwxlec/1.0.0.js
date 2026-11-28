// 03A 教研助手（独立版）——标准 Scratch 3 扩展，可在 03A / TurboWarp / 其他标准编辑器加载。
// 由 03A 内置版（_src/scratch-vm/src/extensions/03a-teacher-helper.js）生成：依赖替换为 Scratch API + 内联常量。
(function (Scratch) {
'use strict';
const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const Cast = Scratch.Cast;
const MathUtil = {clamp: (n, min, max) => Math.min(Math.max(n, min), max)};
const log = console;
const Runtime = {PROJECT_START: 'PROJECT_START', PROJECT_STOP_ALL: 'PROJECT_STOP_ALL', RUNTIME_DISPOSED: 'RUNTIME_DISPOSED'};
const Thread = {STATUS_DONE: 'STATUS_DONE'};
const Variable = {SCALAR_TYPE: 'scalar', LIST_TYPE: 'list'};
const STAGE_NAME = 'Stage';
const EDGE_NAME = '_edge_';
const MOUSE_NAME = '_mouse_';

// ---- 原版菜单数据 ----
const BLOCK_MENU = [
    ['motion_movesteps', '运动：移动()步'], ['motion_turnright', '运动：右转()度'],
    ['motion_turnleft', '运动：左转()度'], ['motion_goto', '运动：移到()'],
    ['motion_gotoxy', '运动：移到x:()y:()'], ['motion_glideto', '运动：在()秒内滑行到()'],
    ['motion_glidesecstoxy', '运动：在()秒内滑行到x:()y:()'], ['motion_pointindirection', '运动：面向()方向'],
    ['motion_pointtowards', '运动：面向()'], ['motion_changexby', '运动：将x坐标增加()'],
    ['motion_setx', '运动：将x坐标设为()'], ['motion_changeyby', '运动：将y坐标增加()'],
    ['motion_sety', '运动：将y坐标设为()'], ['motion_ifonedgebounce', '运动：碰到边缘就反弹'],
    ['motion_setrotationstyle', '运动：将旋转方式设为()'], ['looks_sayforsecs', '外观：说()()秒'],
    ['looks_say', '外观：说()'], ['looks_thinkforsecs', '外观：思考()()秒'],
    ['looks_think', '外观：思考()'], ['looks_switchcostumeto', '外观：换成()造型'],
    ['looks_nextcostume', '外观：下一个造型'], ['looks_switchbackdropto', '外观：换成()背景'],
    ['looks_nextbackdrop', '外观：下一个背景'], ['looks_changesizeby', '外观：将大小增加()'],
    ['looks_setsizeto', '外观：将大小设为()'], ['looks_changeeffectby', '外观：将()特效增加()'],
    ['looks_seteffectto', '外观：将()特效设定为()'], ['looks_cleargraphiceffects', '外观：清除图形特效'],
    ['looks_show', '外观：显示'], ['looks_hide', '外观：隐藏'],
    ['looks_gotofrontback', '外观：移到最()'], ['looks_goforwardbackwardlayers', '外观：()层'],
    ['sound_playuntildone', '声音：播放声音()等待播完'], ['sound_play', '声音：播放声音()'],
    ['sound_stopallsounds', '声音：停止所有声音'], ['sound_changevolumeby', '声音：将音量增加()'],
    ['sound_setvolumeto', '声音：将音量设为()'], ['event_whenflagclicked', '事件：当绿旗被点击'],
    ['event_whenkeypressed', '事件：当按下()键'], ['event_whenthisspriteclicked', '事件：当角色被点击'],
    ['event_whenbackdropswitchesto', '事件：当背景换成()'], ['event_whenbroadcastreceived', '事件：当接收到()'],
    ['event_broadcast', '事件：广播()'], ['event_broadcastandwait', '事件：广播()并等待'],
    ['control_wait', '控制：等待()秒'], ['control_repeat', '控制：重复执行()次'],
    ['control_forever', '控制：重复执行'], ['control_if', '控制：如果()那么'],
    ['control_if_else', '控制：如果()那么否则'], ['control_wait_until', '控制：等待()'],
    ['control_repeat_until', '控制：重复执行直到()'], ['control_stop', '控制：停止()'],
    ['control_start_as_clone', '控制：当作为克隆体启动时'], ['control_create_clone_of', '控制：克隆()'],
    ['control_delete_this_clone', '控制：删除此克隆体'], ['sensing_touchingobject', '侦测：碰到()?'],
    ['sensing_touchingcolor', '侦测：碰到颜色()?'], ['sensing_distanceto', '侦测：到()的距离'],
    ['sensing_askandwait', '侦测：询问()并等待'], ['sensing_answer', '侦测：回答'],
    ['sensing_keypressed', '侦测：按下()键?'], ['sensing_mousedown', '侦测：按下鼠标?'],
    ['sensing_timer', '侦测：计时器'], ['sensing_resettimer', '侦测：计时器归零'],
    ['operator_add', '运算：()+()'], ['operator_subtract', '运算：()-()'],
    ['operator_multiply', '运算：()*()'], ['operator_divide', '运算：()/()'],
    ['operator_random', '运算：在()和()之间取随机数'], ['operator_gt', '运算：()>()'],
    ['operator_lt', '运算：()<()'], ['operator_equals', '运算：()=()'],
    ['operator_and', '运算：()与()'], ['operator_or', '运算：()或()'],
    ['operator_not', '运算：()不成立'], ['operator_join', '运算：连接()和()'],
    ['operator_mod', '运算：()除以()的余数'], ['operator_round', '运算：四舍五入()'],
    ['data_setvariableto', '变量：将()设为()'], ['data_changevariableby', '变量：将()增加()'],
    ['data_addtolist', '列表：将()加入()'], ['data_deleteoflist', '列表：删除()的第()项'],
    ['data_insertatlist', '列表：在()的第()项前插入()'], ['data_replaceitemoflist', '列表：将()的第()项替换为()'],
    ['data_itemoflist', '列表：()的第()项'], ['data_lengthoflist', '列表：()的项目数'],
    ['data_listcontainsitem', '列表：()包含()?'], ['procedures_definition', '自制积木：定义'],
    ['procedures_call', '自制积木：调用']
];
const OUTER_MENU = [
    ['control_repeat', '重复执行()次'], ['control_forever', '重复执行'],
    ['control_if', '如果()那么'], ['control_if_else', '如果()那么否则'],
    ['control_repeat_until', '重复执行直到()']
];
const KEY_MENU = [
    ['space', '空格'], ['left arrow', '←'], ['right arrow', '→'],
    ['up arrow', '↑'], ['down arrow', '↓'], ['enter', '回车']
].concat('abcdefghijklmnopqrstuvwxyz0123456789'.split('').map(c => [c, c]));
const KEYMAP = {
    space: ' ', 'left arrow': 'ArrowLeft', 'right arrow': 'ArrowRight',
    'up arrow': 'ArrowUp', 'down arrow': 'ArrowDown', enter: 'Enter'
};
const PROPERTY_MENU = [
    ['x', 'x坐标'], ['y', 'y坐标'], ['direction', '方向'], ['size', '大小'],
    ['costumeNumber', '造型编号（舞台为背景编号）'], ['costumeName', '造型名称（舞台为背景名称）'],
    ['visible', '是否显示'], ['volume', '音量'], ['layer', '图层'], ['timer', '计时器']
];
const EFFECT_MENU = [
    ['color', '颜色'], ['fisheye', '鱼眼'], ['whirl', '漩涡'],
    ['pixelate', '像素化'], ['mosaic', '马赛克'], ['brightness', '亮度'], ['ghost', '虚像']
];
const PEN_MENU = [['down', '是否落下'], ['size', '粗细'], ['color', '颜色']];
const ARG_INDEX_MENU = [['1', '第 1 个'], ['2', '第 2 个'], ['3', '第 3 个']];
const ASSET_TYPE_MENU = [['costume', '造型'], ['sound', '声音']];
const CODE_COUNT_MENU = [['blocks', '积木总数'], ['scripts', '脚本数']];
const CHECKPOINT_PROPERTIES = ['x', 'y', 'direction', 'size', 'costumeNumber', 'volume'];

// opcode → 参数名列表（执行记录用）
const OPCODE_ARGS = {
    motion_goto: ['TO'], motion_gotoxy: ['X', 'Y'], motion_glideto: ['SECS', 'TO'],
    motion_glidesecstoxy: ['SECS', 'X', 'Y'], motion_pointtowards: ['TOWARDS'],
    looks_sayforsecs: ['MESSAGE', 'SECS'], looks_thinkforsecs: ['MESSAGE', 'SECS'],
    looks_switchcostumeto: ['COSTUME'], looks_switchbackdropto: ['BACKDROP'],
    looks_changeeffectby: ['EFFECT', 'CHANGE'], looks_seteffectto: ['EFFECT', 'VALUE'],
    looks_gotofrontback: ['FRONT_BACK'], looks_goforwardbackwardlayers: ['FORWARD_BACKWARD', 'NUM'],
    sound_play: ['SOUND_MENU'], sound_playuntildone: ['SOUND_MENU'],
    control_create_clone_of: ['CLONE_OPTION'],
    data_setvariableto: ['VARIABLE', 'VALUE'], data_changevariableby: ['VARIABLE', 'VALUE'],
    data_addtolist: ['ITEM', 'LIST'], data_deleteoflist: ['INDEX', 'LIST'],
    data_insertatlist: ['ITEM', 'INDEX', 'LIST'], data_replaceitemoflist: ['INDEX', 'LIST', 'ITEM'],
    data_itemoflist: ['INDEX', 'LIST'], data_lengthoflist: ['LIST'],
    data_listcontainsitem: ['LIST', 'ITEM'],
    operator_add: ['NUM1', 'NUM2'], operator_subtract: ['NUM1', 'NUM2'],
    operator_multiply: ['NUM1', 'NUM2'], operator_divide: ['NUM1', 'NUM2'],
    operator_random: ['FROM', 'TO'], operator_gt: ['OPERAND1', 'OPERAND2'],
    operator_lt: ['OPERAND1', 'OPERAND2'], operator_equals: ['OPERAND1', 'OPERAND2'],
    operator_join: ['STRING1', 'STRING2'], operator_mod: ['NUM1', 'NUM2'],
    sensing_askandwait: ['QUESTION'], event_broadcast: ['BROADCAST_OPTION'],
    event_broadcastandwait: ['BROADCAST_OPTION']
};
const SAY_OPCODES = ['looks_say', 'looks_sayforsecs', 'looks_think', 'looks_thinkforsecs'];
const BROADCAST_OPCODES = ['event_broadcast', 'event_broadcastandwait'];
const SOUND_OPCODES = ['sound_play', 'sound_playuntildone'];
const COSTUME_OPCODES = ['looks_switchcostumeto'];
const BACKDROP_OPCODES = ['looks_switchbackdropto'];

const toMenuItem = pairs => pairs.map(pair => ({text: pair[1], value: pair[0]}));
const round4 = n => Math.round(1e4 * n) / 1e4;

class TeacherHelper {
    constructor (runtime) {
        this.runtime = runtime;
        this.ojScore = 0;
        this._resetJudgeState();
        this._resetRecords();
        this._pressedKeys = new Set();
        this._questionPending = false;
        this._questionAskedSinceAnswer = false;
        this.runtime.on('QUESTION', question => {
            this._questionPending = (question !== null);
            if (question !== null) this._questionAskedSinceAnswer = true;
        });
        this.runtime.on(Runtime.PROJECT_START, () => {
            this._resetJudgeState();
            this._resetRecords();
        });
        this.runtime.on(Runtime.PROJECT_STOP_ALL, () => this._releaseAllKeys());
        this.runtime.on(Runtime.RUNTIME_DISPOSED, () => {
            this._stopJudgeWatcher();
            this._releaseAllKeys();
            this._resetJudgeState();
            this._resetRecords();
            this._questionPending = false;
        });
        this._installExecutionRecorder();
        this.runtime.startTeacherJudge = () => this.startJudge();
    }

    getInfo () {
        const spriteArg = {type: ArgumentType.STRING, menu: 'spriteMenu', defaultValue: STAGE_NAME};
        return {
            id: 'teacherHelper',
            name: '教研助手',
            menuIconURI: null,
            blockIconURI: null,
            color1: '#FF8C1A',
            color2: '#DB6E00',
            blocks: [
                {opcode: 'whenJudgeStart', text: '当开始判题', blockType: BlockType.EVENT, isEdgeActivated: false},
                {opcode: 'startStudentProgram', text: '启动学生程序', blockType: BlockType.COMMAND},
                {opcode: 'waitStudentStop', text: '等待学生程序结束 最多 [SECS] 秒', blockType: BlockType.COMMAND,
                    arguments: {SECS: {type: ArgumentType.NUMBER, defaultValue: 8}}},
                {opcode: 'waitUntil', text: '等待直到 [CONDITION] 最多 [SECS] 秒', blockType: BlockType.COMMAND,
                    arguments: {CONDITION: {type: ArgumentType.BOOLEAN}, SECS: {type: ArgumentType.NUMBER, defaultValue: 5}}},
                {opcode: 'waitFrames', text: '等待 [FRAMES] 帧', blockType: BlockType.COMMAND,
                    arguments: {FRAMES: {type: ArgumentType.NUMBER, defaultValue: 2}}},
                {opcode: 'lastWaitTimedOut', text: '上次等待是否超时?', blockType: BlockType.BOOLEAN},
                {opcode: 'isStudentRunning', text: '学生程序正在运行?', blockType: BlockType.BOOLEAN},
                {opcode: 'stopStudentProgram', text: '停止学生程序', blockType: BlockType.COMMAND},
                {opcode: 'clearRecords', text: '清空运行记录', blockType: BlockType.COMMAND},
                '---',
                {opcode: 'pressKey', text: '按键 [KEY] 持续 [SECS] 秒', blockType: BlockType.COMMAND,
                    arguments: {KEY: {type: ArgumentType.STRING, menu: 'keyMenu', defaultValue: 'space'},
                        SECS: {type: ArgumentType.NUMBER, defaultValue: 0.3}}},
                {opcode: 'keyDown', text: '按下按键 [KEY]', blockType: BlockType.COMMAND,
                    arguments: {KEY: {type: ArgumentType.STRING, menu: 'keyMenu', defaultValue: 'space'}}},
                {opcode: 'keyUp', text: '松开按键 [KEY]', blockType: BlockType.COMMAND,
                    arguments: {KEY: {type: ArgumentType.STRING, menu: 'keyMenu', defaultValue: 'space'}}},
                {opcode: 'clickSprite', text: '点击角色 [SPRITE]', blockType: BlockType.COMMAND,
                    arguments: {SPRITE: spriteArg}},
                {opcode: 'moveMouse', text: '鼠标移到 x: [X] y: [Y]', blockType: BlockType.COMMAND,
                    arguments: {X: {type: ArgumentType.NUMBER, defaultValue: 0}, Y: {type: ArgumentType.NUMBER, defaultValue: 0}}},
                {opcode: 'dragSprite', text: '拖动角色 [SPRITE] 到 x: [X] y: [Y]', blockType: BlockType.COMMAND,
                    arguments: {SPRITE: spriteArg, X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}}},
                {opcode: 'answerQuestion', text: '回答 [TEXT]', blockType: BlockType.COMMAND,
                    arguments: {TEXT: {type: ArgumentType.STRING, defaultValue: '你好'}}},
                '---',
                {opcode: 'getProperty', text: '角色 [SPRITE] 的 [PROPERTY]', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, PROPERTY: {type: ArgumentType.STRING, menu: 'propertyMenu', defaultValue: 'x'}}},
                {opcode: 'getVariable', text: '角色 [SPRITE] 的变量 [NAME]', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '我的变量'}}},
                {opcode: 'hasVariable', text: '角色 [SPRITE] 是否有变量 [NAME] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '我的变量'}}},
                {opcode: 'hasList', text: '角色 [SPRITE] 是否有列表 [NAME] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '列表'}}},
                {opcode: 'getListLength', text: '角色 [SPRITE] 的列表 [NAME] 的长度', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '列表'}}},
                {opcode: 'getListItem', text: '角色 [SPRITE] 的列表 [NAME] 的第 [INDEX] 项', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '列表'},
                        INDEX: {type: ArgumentType.NUMBER, defaultValue: 1}}},
                {opcode: 'getListContents', text: '角色 [SPRITE] 的列表 [NAME] 的内容', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '列表'}}},
                {opcode: 'getSayingText', text: '角色 [SPRITE] 当前说的话', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg}},
                {opcode: 'isTouching', text: '角色 [SPRITE] 碰到 [OBJECT] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, OBJECT: {type: ArgumentType.STRING, menu: 'touchMenu', defaultValue: EDGE_NAME}}},
                {opcode: 'isTouchingColor', text: '角色 [SPRITE] 碰到颜色 [COLOR] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, COLOR: {type: ArgumentType.COLOR}}},
                {opcode: 'getEffect', text: '角色 [SPRITE] 的图像特效 [EFFECT]', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, EFFECT: {type: ArgumentType.STRING, menu: 'effectMenu', defaultValue: 'ghost'}}},
                {opcode: 'getPenState', text: '角色 [SPRITE] 的画笔 [PEN]', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, PEN: {type: ArgumentType.STRING, menu: 'penMenu', defaultValue: 'down'}}},
                {opcode: 'getDistance', text: '角色 [SPRITE] 到 [OBJECT] 的距离', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, OBJECT: {type: ArgumentType.STRING, menu: 'distanceMenu', defaultValue: MOUSE_NAME}}},
                {opcode: 'getCloneCount', text: '角色 [SPRITE] 的克隆体数量', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg}},
                '---',
                {opcode: 'saveCheckpoint', text: '保存检查点 [NAME]', blockType: BlockType.COMMAND,
                    arguments: {NAME: {type: ArgumentType.STRING, defaultValue: '检查点1'}}},
                {opcode: 'getCheckpointChange', text: '检查点 [NAME] 后角色 [SPRITE] 的 [PROPERTY] 变化量', blockType: BlockType.REPORTER,
                    arguments: {NAME: {type: ArgumentType.STRING, defaultValue: '检查点1'}, SPRITE: spriteArg,
                        PROPERTY: {type: ArgumentType.STRING, menu: 'propertyMenu', defaultValue: 'x'}}},
                {opcode: 'isVariableChanged', text: '检查点 [NAME] 后角色 [SPRITE] 的变量 [VARNAME] 是否改变?', blockType: BlockType.BOOLEAN,
                    arguments: {NAME: {type: ArgumentType.STRING, defaultValue: '检查点1'}, SPRITE: spriteArg,
                        VARNAME: {type: ArgumentType.STRING, defaultValue: '我的变量'}}},
                {opcode: 'isNearly', text: '[A] 约等于 [B] 误差 [TOLERANCE]', blockType: BlockType.BOOLEAN,
                    arguments: {A: {type: ArgumentType.STRING, defaultValue: '0'}, B: {type: ArgumentType.STRING, defaultValue: '0'},
                        TOLERANCE: {type: ArgumentType.NUMBER, defaultValue: 0.01}}},
                '---',
                {opcode: 'spriteExists', text: '角色 [NAME] 是否存在?', blockType: BlockType.BOOLEAN,
                    arguments: {NAME: {type: ArgumentType.STRING, defaultValue: '角色1'}}},
                {opcode: 'hasAsset', text: '角色 [SPRITE] 是否有 [ASSET_TYPE] [NAME] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, ASSET_TYPE: {type: ArgumentType.STRING, menu: 'assetTypeMenu', defaultValue: 'costume'},
                        NAME: {type: ArgumentType.STRING, defaultValue: '造型1'}}},
                {opcode: 'countBlocks', text: '角色 [SPRITE] 中积木 [BLOCK] 的数量', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, BLOCK: {type: ArgumentType.STRING, menu: 'blockMenu', defaultValue: 'motion_movesteps'}}},
                {opcode: 'isBlockInside', text: '角色 [SPRITE] 中积木 [BLOCK] 是否在 [OUTER] 内?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, BLOCK: {type: ArgumentType.STRING, menu: 'blockMenu', defaultValue: 'motion_movesteps'},
                        OUTER: {type: ArgumentType.STRING, menu: 'outerMenu', defaultValue: 'control_repeat'}}},
                {opcode: 'isBlockAfter', text: '角色 [SPRITE] 中积木 [BLOCK] 后面是否跟着 [BLOCK2] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, BLOCK: {type: ArgumentType.STRING, menu: 'blockMenu', defaultValue: 'motion_movesteps'},
                        BLOCK2: {type: ArgumentType.STRING, menu: 'blockMenu', defaultValue: 'looks_say'}}},
                {opcode: 'hasProcedure', text: '角色 [SPRITE] 是否定义自制积木 [NAME] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '我的积木'}}},
                {opcode: 'countProcedureCalls', text: '角色 [SPRITE] 调用自制积木 [NAME] 的次数', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '我的积木'}}},
                {opcode: 'countAllBlocks', text: '角色 [SPRITE] 的 [CODE_COUNT]', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, CODE_COUNT: {type: ArgumentType.STRING, menu: 'codeCountMenu', defaultValue: 'blocks'}}},
                {opcode: 'hasOrphanBlocks', text: '角色 [SPRITE] 是否有散落的积木?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg}},
                '---',
                {opcode: 'getExecuteCount', text: '角色 [SPRITE] 执行积木 [BLOCK] 的次数', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, BLOCK: {type: ArgumentType.STRING, menu: 'blockMenu', defaultValue: 'motion_movesteps'}}},
                {opcode: 'getLastArg', text: '角色 [SPRITE] 最后一次执行积木 [BLOCK] 的参数 [INDEX]', blockType: BlockType.REPORTER,
                    arguments: {SPRITE: spriteArg, BLOCK: {type: ArgumentType.STRING, menu: 'blockMenu', defaultValue: 'motion_movesteps'},
                        INDEX: {type: ArgumentType.STRING, menu: 'argIndexMenu', defaultValue: '1'}}},
                {opcode: 'hasArgValue', text: '角色 [SPRITE] 执行积木 [BLOCK] 时参数 [INDEX] 是否为 [VALUE] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, BLOCK: {type: ArgumentType.STRING, menu: 'blockMenu', defaultValue: 'motion_movesteps'},
                        INDEX: {type: ArgumentType.STRING, menu: 'argIndexMenu', defaultValue: '1'},
                        VALUE: {type: ArgumentType.STRING, defaultValue: '10'}}},
                {opcode: 'hasSaid', text: '角色 [SPRITE] 是否说过 [TEXT] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, TEXT: {type: ArgumentType.STRING, defaultValue: '你好'}}},
                {opcode: 'hasPlayedSound', text: '角色 [SPRITE] 是否播放过声音 [NAME] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '喵'}}},
                {opcode: 'hasSwitchedCostume', text: '角色 [SPRITE] 是否切换过造型 [NAME] ?', blockType: BlockType.BOOLEAN,
                    arguments: {SPRITE: spriteArg, NAME: {type: ArgumentType.STRING, defaultValue: '造型1'}}},
                {opcode: 'hasSwitchedBackdrop', text: '舞台是否切换过背景 [NAME] ?', blockType: BlockType.BOOLEAN,
                    arguments: {NAME: {type: ArgumentType.STRING, defaultValue: '背景1'}}},
                {opcode: 'hasBroadcast', text: '是否发送过广播 [NAME] ?', blockType: BlockType.BOOLEAN,
                    arguments: {NAME: {type: ArgumentType.STRING, defaultValue: '消息1'}}},
                '---',
                {opcode: 'scoreIf', text: '评分项 [DESC] 满分 [MAX] 如果 [CONDITION]', blockType: BlockType.COMMAND,
                    arguments: {DESC: {type: ArgumentType.STRING, defaultValue: '评分项1'},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 10}, CONDITION: {type: ArgumentType.BOOLEAN}}},
                {opcode: 'scoreValue', text: '评分项 [DESC] 得分 [SCORE]', blockType: BlockType.COMMAND,
                    arguments: {DESC: {type: ArgumentType.STRING, defaultValue: '评分项2'},
                        SCORE: {type: ArgumentType.NUMBER, defaultValue: 5}}},
                {opcode: 'getTotalScore', text: '当前总分', blockType: BlockType.REPORTER},
                {opcode: 'submitTotalScore', text: '提交总分', blockType: BlockType.COMMAND}
            ],
            menus: {
                spriteMenu: {acceptReporters: true, items: 'getSpriteMenu'},
                touchMenu: {acceptReporters: true, items: 'getTouchMenu'},
                distanceMenu: {acceptReporters: true, items: 'getDistanceMenu'},
                propertyMenu: {acceptReporters: false, items: toMenuItem(PROPERTY_MENU)},
                keyMenu: {acceptReporters: true, items: toMenuItem(KEY_MENU)},
                blockMenu: {acceptReporters: false, items: toMenuItem(BLOCK_MENU)},
                outerMenu: {acceptReporters: false, items: toMenuItem(OUTER_MENU)},
                effectMenu: {acceptReporters: false, items: toMenuItem(EFFECT_MENU)},
                penMenu: {acceptReporters: false, items: toMenuItem(PEN_MENU)},
                argIndexMenu: {acceptReporters: false, items: toMenuItem(ARG_INDEX_MENU)},
                assetTypeMenu: {acceptReporters: false, items: toMenuItem(ASSET_TYPE_MENU)},
                codeCountMenu: {acceptReporters: false, items: toMenuItem(CODE_COUNT_MENU)}
            }
        };
    }

    // ---- 判题 ----
    startJudge () {
        this._stopJudgeWatcher();
        this._resetJudgeState();
        const threads = this.runtime.startHats('teacherHelper_whenJudgeStart') || [];
        if (threads.length === 0) return threads;
        this._judgeWatcher = setInterval(() => {
            if (!threads.some(t => !t.isKilled && t.status !== Thread.STATUS_DONE &&
                    this.runtime.threads.indexOf(t) !== -1)) {
                this._stopJudgeWatcher();
                if (!this._submitted) this._submitResult();
            }
        }, 50);
        return threads;
    }

    _stopJudgeWatcher () {
        if (this._judgeWatcher) {
            clearInterval(this._judgeWatcher);
            this._judgeWatcher = null;
        }
    }

    // ---- 学生程序控制 ----
    startStudentProgram (args, util) {
        this._stopStudentThreads(util);
        this._disposeStudentClones(util);
        this.runtime.emit(Runtime.PROJECT_STOP_ALL);
        this._questionPending = false;
        this._questionAskedSinceAnswer = false;
        this.runtime.ioDevices.clock.resetProjectTimer();
        const judgeSprite = util.target.sprite;
        const studentTargets = this.runtime.executableTargets.filter(t => t.sprite !== judgeSprite);
        studentTargets.forEach(t => {
            t.onStopAll();
            t.clearEdgeActivatedValues();
            t.onGreenFlag();
        });
        for (let i = studentTargets.length - 1; i >= 0; i--) {
            this.runtime.startHats('event_whenflagclicked', null, studentTargets[i]);
        }
    }

    waitStudentStop (args, util) {
        if (util.stackTimerNeedsInit()) {
            util.startStackTimer(Math.max(0, 1000 * Cast.toNumber(args.SECS)));
            util.stackFrame.idleFrames = 0;
            util.yield();
            return;
        }
        if (this._getStudentThreads(util).length === 0) {
            util.stackFrame.idleFrames++;
            if (util.stackFrame.idleFrames >= 2) {
                this._lastWaitTimedOut = false;
                return;
            }
        } else {
            util.stackFrame.idleFrames = 0;
        }
        if (util.stackTimerFinished()) {
            this._lastWaitTimedOut = true;
        } else {
            util.yield();
        }
    }

    waitUntil (args, util) {
        if (util.stackTimerNeedsInit()) {
            util.startStackTimer(Math.max(0, 1000 * Cast.toNumber(args.SECS)));
        }
        if (Cast.toBoolean(args.CONDITION)) {
            this._lastWaitTimedOut = false;
        } else if (util.stackTimerFinished()) {
            this._lastWaitTimedOut = true;
        } else {
            util.yield();
        }
    }

    waitFrames (args, util) {
        const frame = util.stackFrame;
        if (typeof frame.framesLeft === 'undefined') {
            frame.framesLeft = Math.max(0, Math.round(Cast.toNumber(args.FRAMES)));
        }
        if (frame.framesLeft <= 0) return;
        frame.framesLeft--;
        util.yieldTick();
    }

    lastWaitTimedOut () {
        return this._lastWaitTimedOut;
    }

    isStudentRunning (args, util) {
        return this._getStudentThreads(util).length > 0;
    }

    stopStudentProgram (args, util) {
        this._stopStudentThreads(util);
        this._releaseAllKeys();
    }

    clearRecords () {
        this._resetRecords();
    }

    _getStudentThreads (util) {
        return this.runtime.threads.filter(t => !t.isKilled && !t.updateMonitor &&
            t.status !== Thread.STATUS_DONE && !this._isJudgeThread(t, util));
    }

    _isJudgeThread (thread, util) {
        return thread === util.thread || thread.target.sprite === util.target.sprite;
    }

    _stopStudentThreads (util) {
        this._getStudentThreads(util).forEach(t => this.runtime._stopThread(t));
    }

    _disposeStudentClones (util) {
        const judgeSprite = util.target.sprite;
        this.runtime.targets.filter(t => !t.isOriginal && t.sprite !== judgeSprite).forEach(t => {
            this.runtime.disposeTarget(t);
            this.runtime.stopForTarget(t);
        });
    }

    // ---- 按键 ----
    pressKey (args, util) {
        const frame = util.stackFrame;
        if (util.stackTimerNeedsInit()) {
            frame.key = Cast.toString(args.KEY).toLowerCase();
            util.startStackTimer(Math.max(0, 1000 * Cast.toNumber(args.SECS)));
            util.yield();
            this._pressedKeys.add(frame.key);
            this._postKey(frame.key, true);
            return;
        }
        if (util.stackTimerFinished()) {
            this._postKey(frame.key, false);
            this._pressedKeys.delete(frame.key);
        } else {
            util.yield();
        }
    }

    keyDown (args) {
        const key = Cast.toString(args.KEY).toLowerCase();
        this._pressedKeys.add(key);
        this._postKey(key, true);
    }

    keyUp (args) {
        const key = Cast.toString(args.KEY).toLowerCase();
        this._pressedKeys.delete(key);
        this._postKey(key, false);
    }

    _postKey (key, isDown) {
        this.runtime.ioDevices.keyboard.postData({key: KEYMAP[key] || key, isDown: isDown});
    }

    _releaseAllKeys () {
        if (this._pressedKeys) {
            this._pressedKeys.forEach(key => this._postKey(key, false));
            this._pressedKeys.clear();
        }
    }

    // ---- 鼠标 ----
    clickSprite (args, util) {
        const mouse = this.runtime.ioDevices.mouse;
        const frame = util.stackFrame;
        if (!frame.clicked) {
            const target = this._getTarget(args.SPRITE);
            if (!target) return;
            if (target.isStage) {
                this._moveMouseTo(0, 0);
            } else {
                this._moveMouseTo(target.x, target.y);
            }
            frame.clicked = true;
            util.yield();
            mouse._isDown = true;
            mouse._activateClickHats(target);
            return;
        }
        mouse._isDown = false;
    }

    moveMouse (args) {
        this._moveMouseTo(Cast.toNumber(args.X), Cast.toNumber(args.Y));
    }

    dragSprite (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target || target.isStage) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        this._moveMouseTo(x, y);
        target.startDrag();
        target.setXY(x, y, true);
        target.stopDrag();
    }

    _moveMouseTo (x, y) {
        const px = Math.max(0.001, MathUtil.clamp(x, -240, 240) + 240);
        const py = Math.max(0.001, 180 - MathUtil.clamp(y, -180, 180));
        this.runtime.ioDevices.mouse.postData({x: px, y: py, canvasWidth: 480, canvasHeight: 360});
    }

    // ---- 回答 ----
    answerQuestion (args, util) {
        if (util.stackTimerNeedsInit()) util.startStackTimer(5000);
        if (this._questionPending) {
            this._questionPending = false;
            this._questionAskedSinceAnswer = false;
            this.runtime.emit('ANSWER', Cast.toString(args.TEXT));
            if (!this._questionAskedSinceAnswer) this.runtime.emit('QUESTION', null);
        } else if (!util.stackTimerFinished()) {
            util.yield();
        }
    }

    // ---- 侦测 ----
    getProperty (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return '';
        switch (Cast.toString(args.PROPERTY)) {
        case 'x': return target.isStage ? 0 : round4(target.x);
        case 'y': return target.isStage ? 0 : round4(target.y);
        case 'direction': return target.isStage ? 0 : target.direction;
        case 'size': return target.isStage ? 100 : Math.round(target.size);
        case 'costumeNumber': return target.currentCostume + 1;
        case 'costumeName': {
            const costumes = target.getCostumes();
            const costume = costumes[target.currentCostume];
            return costume ? costume.name : '';
        }
        case 'visible': return !!target.isStage || target.visible;
        case 'volume': return target.volume;
        case 'layer': return target.getLayerOrder();
        case 'timer': return this.runtime.ioDevices.clock.projectTimer();
        default: return '';
        }
    }

    getVariable (args) {
        const variable = this._lookupVariable(args, Variable.SCALAR_TYPE);
        return variable ? variable.value : '';
    }

    hasVariable (args) {
        return !!this._lookupVariable(args, Variable.SCALAR_TYPE);
    }

    hasList (args) {
        return !!this._lookupVariable(args, Variable.LIST_TYPE);
    }

    getListLength (args) {
        const variable = this._lookupVariable(args, Variable.LIST_TYPE);
        return variable ? variable.value.length : 0;
    }

    getListItem (args) {
        const variable = this._lookupVariable(args, Variable.LIST_TYPE);
        if (!variable) return '';
        const index = Cast.toNumber(args.INDEX);
        if (index < 1 || index > variable.value.length) return '';
        const item = variable.value[Math.floor(index) - 1];
        return typeof item === 'undefined' ? '' : item;
    }

    getListContents (args) {
        const variable = this._lookupVariable(args, Variable.LIST_TYPE);
        return variable ? variable.value.join(' ') : '';
    }

    getSayingText (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target || target.isStage) return '';
        const looks = target.getCustomState('Scratch.looks');
        return looks && looks.text ? looks.text : '';
    }

    isTouching (args) {
        const target = this._getTarget(args.SPRITE);
        return !(!target || target.isStage) && target.isTouchingObject(Cast.toString(args.OBJECT));
    }

    isTouchingColor (args) {
        const target = this._getTarget(args.SPRITE);
        return !(!target || target.isStage) && target.isTouchingColor(Cast.toRgbColorList(args.COLOR));
    }

    getEffect (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target || target.isStage) return 0;
        const effect = Cast.toString(args.EFFECT);
        return target.effects && target.effects.hasOwnProperty(effect) ? target.effects[effect] : 0;
    }

    getPenState (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return '';
        const pen = target.getCustomState('Scratch.pen');
        if (!pen) return Cast.toString(args.PEN) !== 'down' && 0;
        switch (Cast.toString(args.PEN)) {
        case 'down': return !!pen.penDown;
        case 'size': return pen.penAttributes ? pen.penAttributes.diameter : 0;
        case 'color': return round4(pen.color || 0);
        default: return '';
        }
    }

    getDistance (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target || target.isStage) return 10000;
        let x;
        let y;
        const object = Cast.toString(args.OBJECT);
        if (object === MOUSE_NAME) {
            x = this.runtime.ioDevices.mouse.getScratchX();
            y = this.runtime.ioDevices.mouse.getScratchY();
        } else {
            const other = this._getTarget(object);
            if (!other || other.isStage) return 10000;
            x = other.x;
            y = other.y;
        }
        const dx = target.x - x;
        const dy = target.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getCloneCount (args) {
        const target = this._getTarget(args.SPRITE);
        return !target || target.isStage ? 0 : target.sprite.clones.length - 1;
    }

    // ---- 检查点 ----
    saveCheckpoint (args) {
        const properties = new Map();
        const variables = new Map();
        this.runtime.targets.forEach(target => {
            if (!target.isOriginal) return;
            const key = this._getRecordKey(target);
            properties.set(key, {
                x: target.x, y: target.y, direction: target.direction,
                size: target.size, costumeNumber: target.currentCostume + 1,
                volume: target.volume, visible: target.visible
            });
            for (const id in target.variables) {
                if (!target.variables.hasOwnProperty(id)) continue;
                const variable = target.variables[id];
                variables.set(`${key}\u0000${variable.name}`, JSON.stringify(variable.value));
            }
        });
        this._checkpoints.set(Cast.toString(args.NAME), {properties: properties, variables: variables});
    }

    getCheckpointChange (args) {
        const checkpoint = this._checkpoints.get(Cast.toString(args.NAME));
        const target = this._getTarget(args.SPRITE);
        if (!checkpoint || !target) return 0;
        const saved = checkpoint.properties.get(this._getRecordKey(target));
        const property = Cast.toString(args.PROPERTY);
        if (!saved || CHECKPOINT_PROPERTIES.indexOf(property) === -1) return 0;
        return round4(Cast.toNumber(this.getProperty(args)) - Cast.toNumber(saved[property]));
    }

    isVariableChanged (args) {
        const checkpoint = this._checkpoints.get(Cast.toString(args.NAME));
        const target = this._getTarget(args.SPRITE);
        if (!checkpoint || !target) return false;
        const name = Cast.toString(args.VARNAME);
        const variable = target.lookupVariableByNameAndType(name, Variable.SCALAR_TYPE);
        if (!variable) return false;
        const owner = target.variables.hasOwnProperty(variable.id) ? target : this.runtime.getTargetForStage();
        const saved = checkpoint.variables.get(`${this._getRecordKey(owner)}\u0000${name}`);
        return typeof saved === 'undefined' || saved !== JSON.stringify(variable.value);
    }

    isNearly (args) {
        const a = Cast.toNumber(args.A);
        const b = Cast.toNumber(args.B);
        const tolerance = Cast.toNumber(args.TOLERANCE);
        return Math.abs(a - b) <= tolerance;
    }

    // ---- 代码结构 ----
    spriteExists (args) {
        const target = this._getTarget(args.NAME);
        return !!target && !target.isStage;
    }

    hasAsset (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return false;
        const name = Cast.toString(args.NAME);
        if (Cast.toString(args.ASSET_TYPE) === 'sound') {
            return target.getSounds().some(sound => sound.name === name);
        }
        return target.getCostumeIndexByName(name) !== -1;
    }

    _getBlocksByOpcode (target, opcode) {
        const blocks = target.blocks._blocks;
        return Object.keys(blocks).map(id => blocks[id])
            .filter(block => block.opcode === opcode && !block.shadow);
    }

    countBlocks (args) {
        const target = this._getTarget(args.SPRITE);
        return target ? this._getBlocksByOpcode(target, Cast.toString(args.BLOCK)).length : 0;
    }

    _isInBranch (block, childId) {
        const inputs = block.inputs;
        return (!!inputs.SUBSTACK && inputs.SUBSTACK.block === childId) ||
            (!!inputs.SUBSTACK2 && inputs.SUBSTACK2.block === childId);
    }

    isBlockInside (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return false;
        const outer = Cast.toString(args.OUTER);
        const allBlocks = target.blocks._blocks;
        return this._getBlocksByOpcode(target, Cast.toString(args.BLOCK)).some(block => {
            let current = block;
            while (current.parent && allBlocks[current.parent]) {
                const parentBlock = allBlocks[current.parent];
                if (parentBlock.opcode === outer && this._isInBranch(parentBlock, current.id)) return true;
                current = parentBlock;
            }
            return false;
        });
    }

    isBlockAfter (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return false;
        const allBlocks = target.blocks._blocks;
        const nextOpcode = Cast.toString(args.BLOCK2);
        return this._getBlocksByOpcode(target, Cast.toString(args.BLOCK)).some(block => {
            let current = allBlocks[block.next];
            while (current) {
                if (current.opcode === nextOpcode) return true;
                current = allBlocks[current.next];
            }
            return false;
        });
    }

    _procedureName (name) {
        return Cast.toString(name).replace(/%[nbs]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    _matchProcedure (prototype, name) {
        if (!prototype || !prototype.mutation) return false;
        if (!prototype.mutation.proccode) return false;
        return this._procedureName(prototype.mutation.proccode) === this._procedureName(name);
    }

    hasProcedure (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return false;
        const allBlocks = target.blocks._blocks;
        return Object.keys(allBlocks).some(id =>
            allBlocks[id].opcode === 'procedures_prototype' &&
            this._matchProcedure(allBlocks[id], args.NAME));
    }

    countProcedureCalls (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return 0;
        return this._getBlocksByOpcode(target, 'procedures_call')
            .filter(block => this._matchProcedure(block, args.NAME)).length;
    }

    countAllBlocks (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return 0;
        const allBlocks = target.blocks._blocks;
        const ids = Object.keys(allBlocks).filter(id => !allBlocks[id].shadow);
        if (Cast.toString(args.CODE_COUNT) === 'scripts') {
            return ids.filter(id => allBlocks[id].topLevel).length;
        }
        return ids.length;
    }

    hasOrphanBlocks (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return false;
        const allBlocks = target.blocks._blocks;
        return Object.keys(allBlocks).some(id =>
            allBlocks[id].topLevel && !allBlocks[id].shadow &&
            !this.runtime.getIsHat(allBlocks[id].opcode));
    }

    // ---- 执行记录 ----
    getExecuteCount (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return 0;
        const counts = this._executeCounts.get(this._getRecordKey(target));
        return counts && counts.get(Cast.toString(args.BLOCK)) || 0;
    }

    getLastArg (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return '';
        const records = this._getArgRecords(target, [Cast.toString(args.BLOCK)]);
        if (records.length === 0) return '';
        const arg = records[records.length - 1][Cast.toNumber(args.INDEX) - 1];
        return typeof arg === 'undefined' ? '' : arg;
    }

    hasArgValue (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return false;
        const index = Cast.toNumber(args.INDEX) - 1;
        return this._getArgRecords(target, [Cast.toString(args.BLOCK)])
            .some(record => typeof record[index] !== 'undefined' && Cast.compare(record[index], args.VALUE) === 0);
    }

    hasSaid (args) {
        const target = this._getTarget(args.SPRITE);
        if (!target) return false;
        const text = Cast.toString(args.TEXT).trim().toLowerCase();
        return this._getArgRecords(target, SAY_OPCODES)
            .some(record => Cast.toString(record[0]).toLowerCase().indexOf(text) !== -1);
    }

    hasPlayedSound (args) {
        return this._recordsHaveName(this._getTarget(args.SPRITE), SOUND_OPCODES, args.NAME);
    }

    hasSwitchedCostume (args) {
        return this._recordsHaveName(this._getTarget(args.SPRITE), COSTUME_OPCODES, args.NAME);
    }

    hasSwitchedBackdrop (args) {
        return this._recordsHaveName(null, BACKDROP_OPCODES, args.NAME);
    }

    hasBroadcast (args) {
        return this._recordsHaveName(null, BROADCAST_OPCODES, args.NAME);
    }

    // ---- 评分 ----
    scoreIf (args) {
        const max = Cast.toNumber(args.MAX);
        this._setScore(args.DESC, Cast.toBoolean(args.CONDITION) ? max : 0, max);
    }

    scoreValue (args) {
        this._setScore(args.DESC, args.SCORE);
    }

    getTotalScore () {
        return this._getTotalScore();
    }

    submitTotalScore () {
        this._submitResult();
    }

    _setScore (desc, score, max) {
        const item = {desc: Cast.toString(desc), score: Cast.toNumber(score)};
        if (typeof max !== 'undefined') item.max = Cast.toNumber(max);
        this._scoreItems.set(item.desc, item);
    }

    _getTotalScore () {
        let total = 0;
        this._scoreItems.forEach(item => {
            total += item.score;
        });
        return total;
    }

    // 03Aeditor: 收集全部 target 编译出的 JS 代码（编译器模式缓存，与调试器"代码"标签同源）
    _collectJsCode () {
        const chunks = [];
        const targets = this.runtime.targets || [];
        for (const target of targets) {
            const cache = target.blocks && target.blocks._cache && target.blocks._cache.compiledScripts;
            if (!cache) continue;
            const codes = [];
            for (const blockId of Object.keys(cache)) {
                const entry = cache[blockId];
                if (!entry || !entry.success || !entry.value) continue;
                const parts = [];
                const starting = entry.value.startingFunction;
                if (starting) parts.push(starting.toString());
                const procedures = entry.value.procedures || {};
                for (const key of Object.keys(procedures)) {
                    if (procedures[key] && typeof procedures[key].toString === 'function') {
                        parts.push(`// procedure: ${key}\n${procedures[key].toString()}`);
                    }
                }
                if (parts.length > 0) codes.push(`// ${blockId}\n${parts.join('\n\n')}`);
            }
            if (codes.length > 0) {
                chunks.push(`// ===== ${target.getName()} =====\n${codes.join('\n\n')}`);
            }
        }
        return chunks.join('\n\n');
    }

    _submitResult () {
        this._submitted = true;
        const result = {
            score: this._getTotalScore(),
            items: Array.from(this._scoreItems.values()).map(item => Object.assign({}, item))
        };
        // 03Aeditor: 判题结果附带学生作品编译出的 JS 代码（保存/提交以 JS 代码为准）
        try {
            const jsCode = this._collectJsCode();
            if (jsCode) result.code = jsCode;
        } catch (e) { /* ignore */ }
        this.ojScore = result.score;
        this.runtime.ojScore = result.score;
        this.runtime.emit('TEACHER_JUDGE_RESULT', result);
        // 原版在此调 OJ 后端 teachingConfig.submitResult；03A 无对应后端，本地化（仅 emit）
        const cfg = typeof window === 'undefined' ? null : window.teachingConfig;
        if (cfg && typeof cfg.submitResult === 'function') {
            try {
                cfg.submitResult(result);
            } catch (e) {
                log.warn('teacherHelper submit failed', e);
            }
        }
    }

    // ---- 内部 ----
    _installExecutionRecorder () {
        const runtime = this.runtime;
        if (runtime._teacherHelperRecorderInstalled) return;
        runtime._teacherHelperRecorderInstalled = true;
        const getOriginal = runtime.getOpcodeFunction.bind(runtime);
        const cache = new Map();
        runtime.getOpcodeFunction = opcode => {
            const original = getOriginal(opcode);
            if (typeof original !== 'function') return original;
            let wrapper = cache.get(original);
            if (!wrapper) {
                wrapper = (args, util) => {
                    try {
                        this._recordExecution(opcode, args, util);
                    } catch (e) {
                        log.warn('teacherHelper record failed', e);
                    }
                    return original(args, util);
                };
                cache.set(original, wrapper);
            }
            return wrapper;
        };
        runtime.targets.forEach(target => target.blocks.resetCache());
        if (runtime.flyoutBlocks) runtime.flyoutBlocks.resetCache();
    }

    _recordExecution (opcode, args, util) {
        const target = util && util.target;
        if (!target || !target.sprite) return;
        const key = target.isStage ? STAGE_NAME : target.sprite.name;
        let counts = this._executeCounts.get(key);
        if (!counts) {
            counts = new Map();
            this._executeCounts.set(key, counts);
        }
        counts.set(opcode, (counts.get(opcode) || 0) + 1);
        let argMap = this._executeArgs.get(key);
        if (!argMap) {
            argMap = new Map();
            this._executeArgs.set(key, argMap);
        }
        let records = argMap.get(opcode);
        if (!records) {
            records = [];
            argMap.set(opcode, records);
        }
        if (records.length >= 200) return;
        const argNames = OPCODE_ARGS[opcode] || Object.keys(args).sort();
        const values = argNames.map(name => this._argToValue(args[name]));
        const last = records[records.length - 1];
        if (last && last.join('\u0000') === values.join('\u0000')) return;
        records.push(values);
    }

    _argToValue (value) {
        if (value === null || typeof value === 'undefined') return '';
        if (typeof value === 'object') return Cast.toString(value.name || value.id || '');
        return Cast.toString(value).slice(0, 100);
    }

    _getArgRecords (target, opcodes) {
        const maps = target ?
            [this._executeArgs.get(this._getRecordKey(target))] :
            Array.from(this._executeArgs.values());
        const result = [];
        maps.forEach(map => {
            if (!map) return;
            opcodes.forEach(opcode => {
                const records = map.get(opcode);
                if (records) result.push(...records);
            });
        });
        return result;
    }

    _recordsHaveName (target, opcodes, name) {
        const search = Cast.toString(name).trim().toLowerCase();
        return this._getArgRecords(target, opcodes)
            .some(record => record.some(arg => arg.trim().toLowerCase() === search));
    }

    _lookupVariable (args, type) {
        const target = this._getTarget(args.SPRITE);
        return target && target.lookupVariableByNameAndType(Cast.toString(args.NAME), type) || null;
    }

    _getTarget (name) {
        const text = Cast.toString(name);
        if (text === STAGE_NAME || text === '舞台') return this.runtime.getTargetForStage();
        return this.runtime.getSpriteTargetByName(text) || null;
    }

    _getRecordKey (target) {
        return target.isStage ? STAGE_NAME : target.sprite.name;
    }

    getSpriteMenu () {
        return [{text: '舞台', value: STAGE_NAME}].concat(this._getSpriteNames());
    }

    getTouchMenu () {
        return [{text: '边缘', value: EDGE_NAME}, {text: '鼠标指针', value: MOUSE_NAME}]
            .concat(this._getSpriteNames());
    }

    getDistanceMenu () {
        return [{text: '鼠标指针', value: MOUSE_NAME}].concat(this._getSpriteNames());
    }

    _getSpriteNames () {
        return this.runtime.targets.filter(t => t.isOriginal && !t.isStage).map(t => t.getName());
    }

    _resetJudgeState () {
        this._scoreItems = new Map();
        this._submitted = false;
        this._questionPending = false;
        this._questionAskedSinceAnswer = false;
    }

    _resetRecords () {
        this._executeCounts = new Map();
        this._executeArgs = new Map();
        this._checkpoints = new Map();
        this._lastWaitTimedOut = false;
    }
}



// ---- 注册（标准 3 代 API）----
const __runtime = (Scratch.vm && Scratch.vm.runtime) ? Scratch.vm.runtime : null;
if (__runtime) {
    Scratch.extensions.register(new TeacherHelper(__runtime));
} else {
    console.warn('03A 教研助手：Scratch.vm.runtime 不可用，扩展未注册');
}
})(Scratch);
