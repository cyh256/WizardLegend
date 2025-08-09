// 游戏数据
const gameData = {
  gold: 100,
  inventory: {},
  selectedHeroes: [],
  playerTeam: [],
  enemyTeam: [],
  currentTurn: 'player',
  currentPlayerIdx: 0,
  currentEnemyIdx: 0,
  battleActive: false,
  isBossBattle: false,
  unlockedHeroes: ['geralt', 'yennefer'], // 初始解锁的角色
  battleWins: 0,
  bossWins: 0,
  achievements: {},
  equipment: {},
  // 新增功能数据
  soundEnabled: true,
  heroExperience: {}, // 角色经验值
  heroLevels: {},     // 角色等级
  battleFormation: 'default', // 战斗队形
  battleStrategy: 'balanced', // 战斗策略
  completedAchievements: [], // 已完成成就
  statistics: { // 统计数据
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    skillsUsed: 0,
    itemsUsed: 0,
    perfectWins: 0, // 无伤胜利
    consecutiveWins: 0,
    maxConsecutiveWins: 0,
    goldEarned: 0,
    goldSpent: 0
  }
};

// 角色数据 - 重新设计为人物形象
const heroes = [
  {
    id: 'geralt',
    name: '杰洛特',
    sprite: '🧙‍♂️',
    spriteHurt: '😵',
    desc: '白狼猎魔人，剑术精湛',
    hp: 120, mp: 60, attack: 20, defense: 12,
    skills: [
      { name: '银剑斩击', cost: 15, type: 'single', effect: 'high_damage', icon: '⚔️' },
      { name: '昆恩法印', cost: 20, type: 'self', effect: 'shield', icon: '🛡️' }
    ]
  },
  {
    id: 'yennefer',
    name: '叶奈法',
    sprite: '🧙‍♀️',
    spriteHurt: '😵',
    desc: '强大的女术士，精通魔法',
    hp: 80, mp: 100, attack: 25, defense: 8,
    skills: [
      { name: '混沌之球', cost: 25, type: 'all_enemy', effect: 'magic_damage', icon: '🔮' },
      { name: '治疗术', cost: 20, type: 'single_ally', effect: 'heal', icon: '💚' }
    ]
  },
  {
    id: 'dandelion',
    name: '丹德里恩',
    sprite: '🎭',
    spriteHurt: '😵',
    desc: '游吟诗人，鼓舞人心',
    hp: 100, mp: 80, attack: 15, defense: 10,
    skills: [
      { name: '激励之歌', cost: 18, type: 'all_ally', effect: 'buff_attack', icon: '🎵' },
      { name: '魅惑', cost: 22, type: 'single_enemy', effect: 'charm', icon: '💫' }
    ]
  },
  {
    id: 'triss',
    name: '特莉丝',
    sprite: '👩‍🦰',
    spriteHurt: '😵',
    desc: '火焰女术士，温柔而强大',
    hp: 90, mp: 90, attack: 22, defense: 9,
    unlockCondition: { battleWins: 5 },
    unlockText: '获得5场战斗胜利后解锁',
    skills: [
      { name: '烈焰风暴', cost: 24, type: 'all_enemy', effect: 'fire_damage', icon: '🔥' },
      { name: '护盾术', cost: 16, type: 'single_ally', effect: 'defense_buff', icon: '✨' }
    ]
  },
  {
    id: 'vesemir',
    name: '维瑟米尔',
    sprite: '🧓',
    spriteHurt: '😵',
    desc: '资深猎魔人，经验丰富',
    hp: 130, mp: 40, attack: 25, defense: 15,
    unlockCondition: { bossWins: 2 },
    unlockText: '击败2个Boss后解锁',
    skills: [
      { name: '猎魔剑术', cost: 18, type: 'single', effect: 'critical_strike', icon: '⚔️' },
      { name: '经验传授', cost: 25, type: 'all_ally', effect: 'exp_boost', icon: '📚' }
    ]
  },
  {
    id: 'ciri',
    name: '希里',
    sprite: '👩‍⚔️',
    spriteHurt: '😵',
    desc: '时空之女，拥有古老血脉',
    hp: 110, mp: 70, attack: 30, defense: 12,
    unlockCondition: { bossWins: 5 },
    unlockText: '击败5个Boss后解锁',
    skills: [
      { name: '时空斩击', cost: 30, type: 'all_enemy', effect: 'time_slash', icon: '⚡' },
      { name: '瞬移', cost: 20, type: 'self', effect: 'teleport', icon: '💫' }
    ]
  },
  {
    id: 'regis',
    name: '雷吉斯',
    sprite: '🧛‍♂️',
    spriteHurt: '😵',
    desc: '高等吸血鬼，杰洛特的盟友',
    hp: 100, mp: 80, attack: 28, defense: 10,
    unlockCondition: { gold: 500 },
    unlockText: '拥有500金币后解锁',
    skills: [
      { name: '吸血攻击', cost: 22, type: 'single', effect: 'life_steal', icon: '🩸' },
      { name: '蝙蝠群', cost: 28, type: 'all_enemy', effect: 'bat_swarm', icon: '🦇' }
    ]
  }
];

// 敌人数据 - 平衡调整，增加更多种类
const enemies = [
  // 弱小怪物 - 适合新手
  {
    name: '野狼',
    sprite: '🐺',
    spriteHurt: '💀',
    hp: 50, attack: 12, defense: 3,
    description: '森林中的普通野狼，行动敏捷'
  },
  {
    name: '哥布林',
    sprite: '👺',
    spriteHurt: '💀',
    hp: 45, attack: 10, defense: 2,
    description: '胆小的绿皮小怪，群居生活'
  },
  {
    name: '毒蜘蛛',
    sprite: '🕷️',
    spriteHurt: '💀',
    hp: 40, attack: 14, defense: 1,
    description: '携带剧毒的巨型蜘蛛'
  },
  {
    name: '腐烂僵尸',
    sprite: '🧟',
    spriteHurt: '💀',
    hp: 60, attack: 11, defense: 4,
    description: '行动缓慢的不死生物'
  },
  {
    name: '暗影老鼠',
    sprite: '🐭',
    spriteHurt: '💀',
    hp: 35, attack: 8, defense: 2,
    description: '被黑暗力量感染的巨鼠'
  },
  
  // 中等怪物 - 平衡战斗
  {
    name: '食尸鬼',
    sprite: '🧟‍♂️',
    spriteHurt: '💀',
    hp: 70, attack: 13, defense: 5,
    description: '嗜血的食腐怪物'
  },
  {
    name: '狼人',
    sprite: '🐺',
    spriteHurt: '☠️',
    hp: 85, attack: 16, defense: 6,
    description: '月圆之夜的恐怖变身者'
  },
  {
    name: '水鬼',
    sprite: '👻',
    spriteHurt: '💀',
    hp: 65, attack: 15, defense: 3,
    description: '沼泽深处的亡灵'
  },
  {
    name: '骷髅战士',
    sprite: '💀',
    spriteHurt: '☠️',
    hp: 75, attack: 14, defense: 8,
    description: '不知疲倦的骸骨卫兵'
  },
  {
    name: '森林精灵',
    sprite: '🧚‍♀️',
    spriteHurt: '💀',
    hp: 55, attack: 18, defense: 4,
    description: '被腐化的自然守护者'
  },
  {
    name: '岩石魔像',
    sprite: '🗿',
    spriteHurt: '💀',
    hp: 90, attack: 12, defense: 12,
    description: '古老的石头守卫'
  },
  {
    name: '邪恶法师',
    sprite: '🧙‍♂️',
    spriteHurt: '💀',
    hp: 60, attack: 20, defense: 4,
    description: '掌握黑暗魔法的堕落法师'
  },
  
  // 强力怪物 - 挑战性
  {
    name: '恶魔',
    sprite: '👹',
    spriteHurt: '☠️',
    hp: 95, attack: 18, defense: 7,
    description: '来自地狱的邪恶存在'
  },
  {
    name: '吸血鬼',
    sprite: '🧛‍♂️',
    spriteHurt: '💀',
    hp: 80, attack: 19, defense: 5,
    description: '永生的血族贵族'
  },
  {
    name: '怨灵',
    sprite: '👻',
    spriteHurt: '☠️',
    hp: 55, attack: 22, defense: 2,
    description: '充满怨念的强大灵体'
  },
  {
    name: '巨魔',
    sprite: '👹',
    spriteHurt: '☠️',
    hp: 110, attack: 16, defense: 10,
    description: '力大无穷的山地巨怪'
  },
  {
    name: '恶龙幼崽',
    sprite: '🐉',
    spriteHurt: '☠️',
    hp: 100, attack: 20, defense: 8,
    description: '幼年巨龙，已显凶性'
  },
  
  // 特殊怪物 - 独特能力
  {
    name: '影子刺客',
    sprite: '🥷',
    spriteHurt: '💀',
    hp: 65, attack: 24, defense: 3,
    description: '来无影去无踪的暗杀者'
  },
  {
    name: '元素精灵',
    sprite: '🔥',
    spriteHurt: '💀',
    hp: 70, attack: 17, defense: 6,
    description: '火焰元素的化身'
  },
  {
    name: '守护雕像',
    sprite: '🗿',
    spriteHurt: '💀',
    hp: 120, attack: 10, defense: 15,
    description: '古代遗迹的石质守护者'
  },
  {
    name: '诅咒娃娃',
    sprite: '🪆',
    spriteHurt: '💀',
    hp: 50, attack: 16, defense: 5,
    description: '被邪恶诅咒操控的玩偶'
  },
  {
    name: '黑暗骑士',
    sprite: '⚔️',
    spriteHurt: '💀',
    hp: 85, attack: 17, defense: 9,
    description: '堕落的英勇骑士'
  }
];

// Boss数据 - 平衡调整后的Boss怪物
const bosses = [
  {
    name: '恐怖领主',
    sprite: '👹',
    spriteHurt: '☠️',
    hp: 200, attack: 22, defense: 12,
    skills: ['暗黑冲击', '恐惧咆哮', '生命汲取'],
    description: '来自地狱深渊的恶魔领主，拥有强大的黑暗力量！'
  },
  {
    name: '死亡骑士',
    sprite: '☠️',
    spriteHurt: '💀',
    hp: 220, attack: 20, defense: 15,
    skills: ['死亡之握', '灵魂收割', '亡灵复生'],
    description: '已故的传奇骑士，被黑暗力量复活的不死战士！'
  },
  {
    name: '古龙霸主',
    sprite: '🐉',
    spriteHurt: '☠️',
    hp: 250, attack: 25, defense: 10,
    skills: ['龙息烈焰', '龙鳞护盾', '天空俯冲'],
    description: '统治天空的古老巨龙，火焰依然炽热！'
  },
  {
    name: '虚空之眼',
    sprite: '👁️',
    spriteHurt: '💀',
    hp: 180, attack: 28, defense: 8,
    skills: ['虚空凝视', '精神控制', '现实扭曲'],
    description: '来自异次元的神秘存在，拥有诡异的力量！'
  },
  {
    name: '冰霜女王',
    sprite: '❄️',
    spriteHurt: '☠️',
    hp: 210, attack: 21, defense: 13,
    skills: ['冰封世界', '暴风雪', '冰刺突袭'],
    description: '永恒冬天的统治者，美丽而危险！'
  },
  {
    name: '森林守护者',
    sprite: '🌳',
    spriteHurt: '💀',
    hp: 240, attack: 18, defense: 16,
    skills: ['自然愤怒', '藤蔓缠绕', '生命恢复'],
    description: '被腐化的古老森林守护神，愤怒而强大！'
  },
  {
    name: '机械巨兽',
    sprite: '🤖',
    spriteHurt: '💀',
    hp: 260, attack: 24, defense: 14,
    skills: ['能量炮', '自我修复', '超载爆发'],
    description: '失控的古代战争机器，钢铁与魔法的结合！'
  }
];

// 商店物品 - 扩展装备系统
const shopItems = [
  // 消耗品
  {
    id: 'health_potion',
    name: '生命药水',
    icon: '🧪',
    desc: '恢复50点生命值',
    price: 30,
    type: 'consumable',
    effect: { hp: 50 }
  },
  {
    id: 'mana_potion',
    name: '魔法药水',
    icon: '💙',
    desc: '恢复30点魔法值',
    price: 25,
    type: 'consumable',
    effect: { mp: 30 }
  },
  {
    id: 'super_health_potion',
    name: '高级生命药水',
    icon: '🍷',
    desc: '恢复100点生命值',
    price: 60,
    type: 'consumable',
    effect: { hp: 100 }
  },
  {
    id: 'super_mana_potion',
    name: '高级魔法药水',
    icon: '🔮',
    desc: '恢复60点魔法值',
    price: 50,
    type: 'consumable',
    effect: { mp: 60 }
  },
  
  // 武器系列
  {
    id: 'rusty_sword',
    name: '生锈铁剑',
    icon: '🗡️',
    desc: '攻击力+3',
    price: 40,
    type: 'weapon',
    effect: { attack: 3 }
  },
  {
    id: 'steel_sword',
    name: '精钢剑',
    icon: '⚔️',
    desc: '攻击力+5',
    price: 80,
    type: 'weapon',
    effect: { attack: 5 }
  },
  {
    id: 'silver_sword',
    name: '银制长剑',
    icon: '🗡️',
    desc: '攻击力+8',
    price: 150,
    type: 'weapon',
    effect: { attack: 8 }
  },
  {
    id: 'enchanted_blade',
    name: '魔法刀刃',
    icon: '⚔️',
    desc: '攻击力+12',
    price: 250,
    type: 'weapon',
    effect: { attack: 12 }
  },
  {
    id: 'dragon_sword',
    name: '屠龙宝剑',
    icon: '🗡️',
    desc: '攻击力+15',
    price: 400,
    type: 'weapon',
    effect: { attack: 15 }
  },
  
  // 防具系列
  {
    id: 'cloth_robe',
    name: '布袍',
    icon: '👘',
    desc: '防御力+2',
    price: 35,
    type: 'armor',
    effect: { defense: 2 }
  },
  {
    id: 'leather_armor',
    name: '皮甲',
    icon: '🦺',
    desc: '防御力+4',
    price: 70,
    type: 'armor',
    effect: { defense: 4 }
  },
  {
    id: 'chain_mail',
    name: '锁子甲',
    icon: '🛡️',
    desc: '防御力+6',
    price: 120,
    type: 'armor',
    effect: { defense: 6 }
  },
  {
    id: 'plate_armor',
    name: '板甲',
    icon: '🛡️',
    desc: '防御力+9',
    price: 200,
    type: 'armor',
    effect: { defense: 9 }
  },
  {
    id: 'dragon_scale_armor',
    name: '龙鳞甲',
    icon: '🛡️',
    desc: '防御力+12',
    price: 350,
    type: 'armor',
    effect: { defense: 12 }
  },
  
  // 饰品系列
  {
    id: 'power_ring',
    name: '力量之戒',
    icon: '💍',
    desc: '攻击力+3，防御力+1',
    price: 100,
    type: 'accessory',
    effect: { attack: 3, defense: 1 }
  },
  {
    id: 'vitality_amulet',
    name: '生命护符',
    icon: '📿',
    desc: '生命值+20',
    price: 120,
    type: 'accessory',
    effect: { hp: 20 }
  },
  {
    id: 'mana_crystal',
    name: '魔力水晶',
    icon: '💎',
    desc: '魔法值+15',
    price: 100,
    type: 'accessory',
    effect: { mp: 15 }
  },
  {
    id: 'guardian_pendant',
    name: '守护吊坠',
    icon: '🔱',
    desc: '防御力+4，生命值+10',
    price: 180,
    type: 'accessory',
    effect: { defense: 4, hp: 10 }
  },
  {
    id: 'berserker_band',
    name: '狂战士臂环',
    icon: '💪',
    desc: '攻击力+6，生命值-5',
    price: 160,
    type: 'accessory',
    effect: { attack: 6, hp: -5 }
  },
  
  // 强化材料
  {
    id: 'enhancement_stone',
    name: '强化石',
    icon: '💎',
    desc: '用于装备强化',
    price: 50,
    type: 'enhancement',
    effect: {}
  },
  {
    id: 'master_enhancement',
    name: '大师强化石',
    icon: '💠',
    desc: '高级装备强化材料',
    price: 150,
    type: 'enhancement',
    effect: {}
  },
  {
    id: 'legendary_stone',
    name: '传说强化石',
    icon: '⭐',
    desc: '终极强化材料',
    price: 300,
    type: 'enhancement',
    effect: {}
  }
];

// 成就系统配置
const achievements = [
  {
    id: 'first_victory',
    name: '初战告捷',
    desc: '赢得第一场战斗',
    icon: '🏆',
    condition: { battleWins: 1 },
    reward: { gold: 50 },
    unlocked: false
  },
  {
    id: 'battle_master',
    name: '战斗大师',
    desc: '赢得10场战斗',
    icon: '⚔️',
    condition: { battleWins: 10 },
    reward: { gold: 200 },
    unlocked: false
  },
  {
    id: 'boss_slayer',
    name: 'Boss终结者',
    desc: '击败3个Boss',
    icon: '👑',
    condition: { bossWins: 3 },
    reward: { gold: 300 },
    unlocked: false
  },
  {
    id: 'perfect_warrior',
    name: '完美战士',
    desc: '获得5次无伤胜利',
    icon: '💫',
    condition: { perfectWins: 5 },
    reward: { gold: 250 },
    unlocked: false
  },
  {
    id: 'combo_master',
    name: '连胜之王',
    desc: '获得10连胜',
    icon: '🔥',
    condition: { maxConsecutiveWins: 10 },
    reward: { gold: 400 },
    unlocked: false
  },
  {
    id: 'rich_merchant',
    name: '富甲一方',
    desc: '拥有1000金币',
    icon: '💎',
    condition: { gold: 1000 },
    reward: { gold: 500 },
    unlocked: false
  },
  {
    id: 'skill_master',
    name: '技能大师',
    desc: '使用100次技能',
    icon: '🔮',
    condition: { skillsUsed: 100 },
    reward: { gold: 150 },
    unlocked: false
  },
  {
    id: 'collector',
    name: '收藏家',
    desc: '解锁所有角色',
    icon: '👥',
    condition: { unlockedHeroes: 7 },
    reward: { gold: 1000 },
    unlocked: false
  }
];

// 战斗队形配置
const battleFormations = {
  default: {
    name: '默认队形',
    desc: '标准战斗排列',
    bonus: {}
  },
  defensive: {
    name: '防御队形',
    desc: '提升防御力',
    bonus: { defense: 2 }
  },
  aggressive: {
    name: '进攻队形',
    desc: '提升攻击力',
    bonus: { attack: 3 }
  },
  magical: {
    name: '法术队形',
    desc: '提升魔法效果',
    bonus: { mp: 10 }
  }
};

// 战斗策略配置
const battleStrategies = {
  balanced: {
    name: '平衡策略',
    desc: '攻守平衡',
    aiPriority: 'balanced'
  },
  aggressive: {
    name: '积极进攻',
    desc: '优先攻击敌人',
    aiPriority: 'attack'
  },
  defensive: {
    name: '稳健防守',
    desc: '优先防御和治疗',
    aiPriority: 'defense'
  },
  tactical: {
    name: '战术配合',
    desc: '优先使用技能',
    aiPriority: 'skills'
  }
};

// 音效系统
const audioSystem = {
  clickSound: null,
  battleSound: null,
  skillSound: null,
  victorySound: null,
  
  init() {
    this.clickSound = document.getElementById('clickSound');
    this.battleSound = document.getElementById('battleSound');
    this.skillSound = document.getElementById('skillSound');
    this.victorySound = document.getElementById('victorySound');
  },
  
  play(soundName) {
    if (!gameData.soundEnabled) return;
    const sound = this[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {}); // 静默处理播放失败
    }
  }
};

// 加载系统
function showLoading(text = '加载中...') {
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = overlay.querySelector('.loading-text');
  loadingText.textContent = text;
  overlay.classList.remove('hidden');
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.add('hidden');
}

// 界面切换函数（带动画）
function showMainMenu() {
  audioSystem.play('clickSound');
  showLoading('返回主菜单...');
  
  setTimeout(() => {
    hideAllScreens();
    const mainMenu = document.getElementById('mainMenu');
    mainMenu.style.display = 'flex';
    mainMenu.classList.add('screen-transition');
    hideLoading();
    
    // 移除动画类
    setTimeout(() => {
      mainMenu.classList.remove('screen-transition');
    }, 600);
  }, 300);
}

function showCharacterSelect(battleType = 'normal') {
  audioSystem.play('clickSound');
  showLoading('准备角色选择...');
  
  setTimeout(() => {
    hideAllScreens();
    gameData.isBossBattle = (battleType === 'boss');
    
    const characterSelect = document.getElementById('characterSelect');
    characterSelect.style.display = 'block';
    characterSelect.classList.add('screen-transition');
    
    // 更新标题
    const title = document.querySelector('.select-title');
    if (gameData.isBossBattle) {
      title.textContent = '选择你的战士 - Boss挑战模式 (必须选择3个角色)';
      title.style.color = '#ff4444';
    } else {
      title.textContent = '选择你的战士 (可选择1-3个角色)';
      title.style.color = '#ffd700';
    }
    
    renderHeroSelection();
    hideLoading();
    
    // 移除动画类
    setTimeout(() => {
      characterSelect.classList.remove('screen-transition');
    }, 600);
  }, 300);
}

function showShop() {
  hideAllScreens();
  document.getElementById('shopInterface').style.display = 'block';
  showShopTab('items');
}

function showShopTab(tab) {
  // 更新标签状态
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  if (tab === 'items') {
    document.getElementById('shopGrid').style.display = 'grid';
    document.getElementById('enhanceArea').style.display = 'none';
    renderShop();
  } else if (tab === 'enhance') {
    document.getElementById('shopGrid').style.display = 'none';
    document.getElementById('enhanceArea').style.display = 'block';
    renderEnhancement();
  }
}

function showBattleArena() {
  hideAllScreens();
  document.getElementById('battleArena').style.display = 'block';
}

function hideAllScreens() {
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('characterSelect').style.display = 'none';
  document.getElementById('shopInterface').style.display = 'none';
  document.getElementById('battleArena').style.display = 'none';
  document.getElementById('heroGallery').style.display = 'none';
  document.getElementById('battleSettings').style.display = 'none';
}

// 战斗设置界面
function showBattleSettings() {
  audioSystem.play('clickSound');
  hideAllScreens();
  
  const settingsScreen = document.getElementById('battleSettings');
  settingsScreen.style.display = 'block';
  settingsScreen.classList.add('screen-transition');
  
  renderBattleSettings();
  
  // 移除动画类
  setTimeout(() => {
    settingsScreen.classList.remove('screen-transition');
  }, 600);
}

function renderBattleSettings() {
  // 渲染队形选择
  const formationGrid = document.getElementById('formationGrid');
  formationGrid.innerHTML = '';
  
  Object.entries(battleFormations).forEach(([key, formation]) => {
    const formationItem = document.createElement('div');
    formationItem.className = 'formation-item' + (gameData.battleFormation === key ? ' selected' : '');
    formationItem.innerHTML = `
      <div class="formation-name">${formation.name}</div>
      <div class="formation-desc">${formation.desc}</div>
    `;
    formationItem.onclick = () => selectFormation(key);
    formationGrid.appendChild(formationItem);
  });
  
  // 渲染策略选择
  const strategyGrid = document.getElementById('strategyGrid');
  strategyGrid.innerHTML = '';
  
  Object.entries(battleStrategies).forEach(([key, strategy]) => {
    const strategyItem = document.createElement('div');
    strategyItem.className = 'strategy-item' + (gameData.battleStrategy === key ? ' selected' : '');
    strategyItem.innerHTML = `
      <div class="strategy-name">${strategy.name}</div>
      <div class="strategy-desc">${strategy.desc}</div>
    `;
    strategyItem.onclick = () => selectStrategy(key);
    strategyGrid.appendChild(strategyItem);
  });
  
  // 更新音效设置
  document.getElementById('soundToggle').checked = gameData.soundEnabled;
}

function selectFormation(formationKey) {
  audioSystem.play('clickSound');
  gameData.battleFormation = formationKey;
  renderBattleSettings();
  
  // 显示选择反馈
  const formation = battleFormations[formationKey];
  addTempMessage(`选择了 ${formation.name}：${formation.desc}`);
}

function selectStrategy(strategyKey) {
  audioSystem.play('clickSound');
  gameData.battleStrategy = strategyKey;
  renderBattleSettings();
  
  // 显示选择反馈
  const strategy = battleStrategies[strategyKey];
  addTempMessage(`选择了 ${strategy.name}：${strategy.desc}`);
}

function toggleSound() {
  gameData.soundEnabled = !gameData.soundEnabled;
  if (gameData.soundEnabled) {
    audioSystem.play('clickSound');
    addTempMessage('音效已启用');
  } else {
    addTempMessage('音效已关闭');
  }
}

function addTempMessage(message) {
  // 创建临时消息提示
  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8);
    color: #ffd700;
    padding: 15px 25px;
    border-radius: 10px;
    z-index: 10000;
    font-size: 1.2em;
    border: 2px solid #ffd700;
    animation: fadeInOut 2s ease forwards;
  `;
  messageDiv.textContent = message;
  
  // 添加CSS动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(messageDiv);
  
  // 2秒后移除
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }, 2000);
}

// 角色选择渲染
function renderHeroSelection() {
  const grid = document.getElementById('heroesGrid');
  grid.innerHTML = '';
  
  heroes.forEach((hero, idx) => {
    const isUnlocked = isHeroUnlocked(hero);
    const isSelected = gameData.selectedHeroes.includes(idx);
    
    const card = document.createElement('div');
    card.className = 'hero-card' + 
      (isSelected ? ' selected' : '') + 
      (!isUnlocked ? ' locked' : '');
    
    let statsHtml = '';
    if (isUnlocked) {
      statsHtml = `
        <div class="hero-stats">
          <div>💖 生命: ${hero.hp}</div>
          <div>💙 魔法: ${hero.mp}</div>
          <div>⚔️ 攻击: ${hero.attack}</div>
          <div>🛡️ 防御: ${hero.defense}</div>
        </div>
      `;
    } else {
      statsHtml = `
        <div class="unlock-condition">${hero.unlockText}</div>
      `;
    }
    
    card.innerHTML = `
      <div class="hero-avatar">${isUnlocked ? hero.sprite : '🔒'}</div>
      <div class="hero-name">${isUnlocked ? hero.name : '???'}</div>
      <div class="hero-desc">${isUnlocked ? hero.desc : '未解锁角色'}</div>
      ${statsHtml}
    `;
    
    if (isUnlocked) {
      card.onclick = () => selectHero(idx);
    }
    
    grid.appendChild(card);
  });
  
  updateStartButton();
}

// 检查角色是否解锁
function isHeroUnlocked(hero) {
  if (!hero.unlockCondition) return true; // 默认角色
  if (gameData.unlockedHeroes.includes(hero.id)) return true;
  
  const condition = hero.unlockCondition;
  if (condition.battleWins && gameData.battleWins >= condition.battleWins) return true;
  if (condition.bossWins && gameData.bossWins >= condition.bossWins) return true;
  if (condition.gold && gameData.gold >= condition.gold) return true;
  
  return false;
}

// 检查并解锁新角色
function checkUnlocks() {
  let newUnlocks = [];
  
  heroes.forEach(hero => {
    if (!gameData.unlockedHeroes.includes(hero.id) && isHeroUnlocked(hero)) {
      gameData.unlockedHeroes.push(hero.id);
      newUnlocks.push(hero.name);
    }
  });
  
  if (newUnlocks.length > 0) {
    addLog(`🎉 解锁新角色：${newUnlocks.join('、')}！`, 'logPanel');
  }
  
  updateMenuStats();
}

function selectHero(idx) {
  if (gameData.selectedHeroes.includes(idx)) {
    gameData.selectedHeroes = gameData.selectedHeroes.filter(i => i !== idx);
  } else {
    if (gameData.selectedHeroes.length < 3) {
      gameData.selectedHeroes.push(idx);
    }
  }
  renderHeroSelection();
}

function updateStartButton() {
  const btn = document.getElementById('startBattleBtn');
  if (gameData.isBossBattle) {
    // Boss模式仍然需要3个角色
    btn.disabled = gameData.selectedHeroes.length !== 3;
    btn.textContent = gameData.selectedHeroes.length === 3 ? '⚔️ 挑战Boss' : `⚔️ 选择角色 (${gameData.selectedHeroes.length}/3)`;
  } else {
    // 普通模式支持1-3个角色
    btn.disabled = gameData.selectedHeroes.length === 0;
    btn.textContent = gameData.selectedHeroes.length > 0 ? `⚔️ 进入战斗 (${gameData.selectedHeroes.length}vs${gameData.selectedHeroes.length})` : '⚔️ 选择角色';
  }
}

// 商店渲染
function renderShop() {
  const grid = document.getElementById('shopGrid');
  grid.innerHTML = '';
  
  shopItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shop-item';
    const canAfford = gameData.gold >= item.price;
    card.innerHTML = `
      <div class="item-icon">${item.icon}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-desc">${item.desc}</div>
      <div class="item-price">💰 ${item.price} 金币</div>
      <button class="buy-btn" ${!canAfford ? 'disabled' : ''} onclick="buyItem('${item.id}')">
        ${canAfford ? '购买' : '金币不足'}
      </button>
    `;
    grid.appendChild(card);
  });
}

function buyItem(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  if (!item || gameData.gold < item.price) return;
  
  gameData.gold -= item.price;
  gameData.inventory[itemId] = (gameData.inventory[itemId] || 0) + 1;
  
  // 如果是装备，初始化强化等级
  if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
    if (!gameData.equipment[itemId]) {
      gameData.equipment[itemId] = { level: 0, bonus: 0 };
    }
  }
  
  addLog(`购买了 ${item.name}！`);
  renderShop();
  updateGoldDisplay();
}

// 装备强化系统
function renderEnhancement() {
  const equipmentList = document.getElementById('equipmentList');
  equipmentList.innerHTML = '';
  
  const equipmentItems = shopItems.filter(item => 
    (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') && 
    gameData.inventory[item.id] > 0
  );
  
  if (equipmentItems.length === 0) {
    equipmentList.innerHTML = '<div style="text-align: center; color: #aaa;">暂无可强化的装备</div>';
    return;
  }
  
  equipmentItems.forEach(item => {
    const enhancement = gameData.equipment[item.id] || { level: 0, bonus: 0 };
    const maxLevel = 10;
    const enhanceCost = Math.floor(item.price * 0.3 * (enhancement.level + 1));
    const canEnhance = gameData.gold >= enhanceCost && 
                      enhancement.level < maxLevel &&
                      gameData.inventory['enhancement_stone'] > 0;
    
    const div = document.createElement('div');
    div.className = 'equipment-item' + (enhancement.level > 0 ? ' enhanced' : '');
    div.innerHTML = `
      <div class="item-icon">${item.icon}</div>
      <div class="item-name">${item.name}</div>
      <div class="enhance-level">+${enhancement.level} (${enhancement.bonus}点加成)</div>
      <div class="item-desc">${item.desc}</div>
      <div class="item-price">强化费用: ${enhanceCost} 金币 + 1强化石</div>
      <button class="enhance-btn" ${!canEnhance ? 'disabled' : ''} onclick="enhanceEquipment('${item.id}')">
        ${enhancement.level >= maxLevel ? '已满级' : '强化'}
      </button>
    `;
    equipmentList.appendChild(div);
  });
}

function enhanceEquipment(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  const enhancement = gameData.equipment[itemId] || { level: 0, bonus: 0 };
  const enhanceCost = Math.floor(item.price * 0.3 * (enhancement.level + 1));
  
  if (gameData.gold < enhanceCost || 
      gameData.inventory['enhancement_stone'] < 1 || 
      enhancement.level >= 10) {
    return;
  }
  
  // 强化成功率
  const successRate = Math.max(0.5, 1 - enhancement.level * 0.1);
  const isSuccess = Math.random() < successRate;
  
  gameData.gold -= enhanceCost;
  gameData.inventory['enhancement_stone']--;
  
  if (isSuccess) {
    enhancement.level++;
    const bonusIncrease = Math.floor(Object.values(item.effect)[0] * 0.5);
    enhancement.bonus += bonusIncrease;
    gameData.equipment[itemId] = enhancement;
    
    addLog(`✨ ${item.name} 强化成功！等级提升至 +${enhancement.level}！`);
  } else {
    addLog(`💥 ${item.name} 强化失败！材料被消耗。`);
  }
  
  renderEnhancement();
  updateGoldDisplay();
}

// 战斗系统
function startBattle() {
  audioSystem.play('battleSound');
  showLoading('准备战斗...');
  
  setTimeout(() => {
    // 生成玩家队伍（包含等级加成）
    gameData.playerTeam = gameData.selectedHeroes.map(idx => {
      const hero = heroes[idx];
      const levelBonus = getHeroLevelBonus(hero.id);
      const formationBonus = battleFormations[gameData.battleFormation].bonus;
      
      return {
        ...hero,
        level: getHeroLevel(hero.id),
        curHp: hero.hp + levelBonus.hp,
        curMp: hero.mp + levelBonus.mp,
        maxHp: hero.hp + levelBonus.hp,
        maxMp: hero.mp + levelBonus.mp,
        attack: hero.attack + levelBonus.attack + (formationBonus.attack || 0),
        defense: hero.defense + levelBonus.defense + (formationBonus.defense || 0),
        isHurt: false,
        isAttacking: false,
        buffs: { attack: 0, defense: 0, shield: 0 }
      };
    });
  
  // 生成敌方队伍
  gameData.enemyTeam = [];
  if (gameData.isBossBattle) {
    // Boss战：生成一个强大的Boss
    const bossIdx = Math.floor(Math.random() * bosses.length);
    const boss = bosses[bossIdx];
    gameData.enemyTeam.push({
      ...boss,
      curHp: boss.hp,
      maxHp: boss.hp,
      isHurt: false,
      isAttacking: false,
      buffs: { attack: 0, defense: 0 },
      isBoss: true,
      skillCooldowns: {}
    });
    addLog(`💀 警告！强大的Boss ${boss.name} 出现了！`, 'logPanel');
    addLog(`📖 ${boss.description}`, 'logPanel');
  } else {
    // 普通战斗：生成等量敌人
    for (let i = 0; i < gameData.playerTeam.length; i++) {
      const idx = Math.floor(Math.random() * enemies.length);
      const enemy = enemies[idx];
      gameData.enemyTeam.push({
        ...enemy,
        curHp: enemy.hp,
        maxHp: enemy.hp,
        isHurt: false,
        isAttacking: false,
        buffs: { attack: 0, defense: 0 }
      });
    }
  }
  
    gameData.currentTurn = 'player';
    gameData.currentPlayerIdx = 0;
    gameData.currentEnemyIdx = 0;
    gameData.battleActive = true;
    
    showBattleArena();
    renderBattleField();
    updateGoldDisplay();
    addLog('⚔️ 战斗开始！', 'logPanel');
    hideLoading();
    nextTurn();
  }, 800);
}

function renderBattleField() {
  // 渲染玩家队伍
  const playerSide = document.getElementById('playerSide');
  playerSide.innerHTML = '';
  
  // 根据队伍大小设置布局类
  const playerCount = gameData.playerTeam.length;
  playerSide.className = 'team-side';
  if (playerCount === 3) {
    playerSide.classList.add('triangle');
  } else if (playerCount === 2) {
    playerSide.classList.add('two-formation');
  } else if (playerCount === 1) {
    playerSide.classList.add('single-formation');
  }
  
  gameData.playerTeam.forEach((fighter, idx) => {
    const fighterDiv = document.createElement('div');
    fighterDiv.className = 'fighter';
    
    // 根据位置添加位置类
    if (playerCount === 3) {
      if (idx === 0) fighterDiv.classList.add('pos-top');
      else if (idx === 1) fighterDiv.classList.add('pos-bottom-left');
      else if (idx === 2) fighterDiv.classList.add('pos-bottom-right');
    } else if (playerCount === 2) {
      if (idx === 0) fighterDiv.classList.add('pos-top');
      else fighterDiv.classList.add('pos-bottom');
    }
    
    const hpPercent = (fighter.curHp / fighter.maxHp) * 100;
    const mpPercent = fighter.maxMp > 0 ? (fighter.curMp / fighter.maxMp) * 100 : 0;
    
    fighterDiv.innerHTML = `
      <div class="fighter-sprite${fighter.isHurt ? ' hurt' : ''}${fighter.isAttacking ? ' attacking' : ''}${gameData.currentPlayerIdx === idx && gameData.currentTurn === 'player' ? ' active' : ''}">${fighter.isHurt ? fighter.spriteHurt : fighter.sprite}</div>
      <div class="fighter-info">
        <div class="fighter-name">${fighter.name} ${fighter.level ? `Lv.${fighter.level}` : ''}</div>
        <div class="stat-bar"><div class="stat-fill hp-fill" style="width: ${hpPercent}%"></div></div>
        <div style="font-size: 0.8em;">💖 ${fighter.curHp}/${fighter.maxHp}</div>
        ${fighter.maxMp > 0 ? `
          <div class="stat-bar"><div class="stat-fill mp-fill" style="width: ${mpPercent}%"></div></div>
          <div style="font-size: 0.8em;">💙 ${fighter.curMp}/${fighter.maxMp}</div>
        ` : ''}
      </div>
    `;
    playerSide.appendChild(fighterDiv);
  });
  
  // 渲染敌方队伍
  const enemySide = document.getElementById('enemySide');
  enemySide.innerHTML = '';
  
  // 根据队伍大小设置布局类
  const enemyCount = gameData.enemyTeam.length;
  enemySide.className = 'team-side';
  if (enemyCount === 3) {
    enemySide.classList.add('triangle');
  } else if (enemyCount === 2) {
    enemySide.classList.add('two-formation');
  } else if (enemyCount === 1) {
    enemySide.classList.add('single-formation');
  }
  
  gameData.enemyTeam.forEach((fighter, idx) => {
    const fighterDiv = document.createElement('div');
    fighterDiv.className = 'fighter';
    
    // 根据位置添加位置类
    if (enemyCount === 3) {
      if (idx === 0) fighterDiv.classList.add('pos-top');
      else if (idx === 1) fighterDiv.classList.add('pos-bottom-left');
      else if (idx === 2) fighterDiv.classList.add('pos-bottom-right');
    } else if (enemyCount === 2) {
      if (idx === 0) fighterDiv.classList.add('pos-top');
      else fighterDiv.classList.add('pos-bottom');
    }
    
    const hpPercent = (fighter.curHp / fighter.maxHp) * 100;
    
    fighterDiv.innerHTML = `
      <div class="fighter-sprite${fighter.isHurt ? ' hurt' : ''}${fighter.isAttacking ? ' attacking' : ''}${gameData.currentEnemyIdx === idx && gameData.currentTurn === 'enemy' ? ' active' : ''}">${fighter.isHurt ? fighter.spriteHurt : fighter.sprite}</div>
      <div class="fighter-info">
        <div class="fighter-name">${fighter.name}</div>
        <div class="stat-bar"><div class="stat-fill hp-fill" style="width: ${hpPercent}%"></div></div>
        <div style="font-size: 0.8em;">💖 ${fighter.curHp}/${fighter.maxHp}</div>
      </div>
    `;
    enemySide.appendChild(fighterDiv);
  });
}

function nextTurn() {
  if (!gameData.battleActive) return;
  
  // 检查胜负
  if (isTeamDefeated(gameData.playerTeam)) {
    addLog('💀 战斗失败！', 'logPanel');
    gameData.statistics.consecutiveWins = 0; // 重置连胜
    gameData.battleActive = false;
    setTimeout(() => showMainMenu(), 3000);
    return;
  }
  if (isTeamDefeated(gameData.enemyTeam)) {
    audioSystem.play('victorySound');
    
    // 检查是否无伤胜利
    const isPerfectWin = gameData.playerTeam.every(p => p.curHp === p.maxHp);
    if (isPerfectWin) {
      gameData.statistics.perfectWins++;
      addLog('✨ 完美胜利！无人受伤！', 'logPanel');
    }
    
    if (gameData.isBossBattle) {
      gameData.bossWins++;
      gameData.statistics.consecutiveWins++;
      addLog('👑 Boss战胜利！', 'logPanel');
      
      // Boss战奖励
      const goldReward = 100 + Math.floor(Math.random() * 50);
      gameData.gold += goldReward;
      gameData.statistics.goldEarned += goldReward;
      addLog(`💰 获得 ${goldReward} 金币奖励！`, 'logPanel');
      
      // Boss战经验奖励
      giveExperience(150);
      
    } else {
      gameData.battleWins++;
      gameData.statistics.consecutiveWins++;
      addLog('🎉 战斗胜利！', 'logPanel');
      
      // 普通战斗奖励
      const goldReward = 30 + Math.floor(Math.random() * 20);
      gameData.gold += goldReward;
      gameData.statistics.goldEarned += goldReward;
      addLog(`💰 获得 ${goldReward} 金币奖励！`, 'logPanel');
      
      // 普通战斗经验奖励
      giveExperience(50);
    }
    
    // 更新最大连胜记录
    if (gameData.statistics.consecutiveWins > gameData.statistics.maxConsecutiveWins) {
      gameData.statistics.maxConsecutiveWins = gameData.statistics.consecutiveWins;
    }
    
    updateGoldDisplay();
    checkUnlocks();
    checkAchievements();
    gameData.battleActive = false;
    setTimeout(() => showMainMenu(), 3000);
    return;
  }
  
  if (gameData.currentTurn === 'player') {
    // 跳过已倒下的角色
    while (gameData.currentPlayerIdx < gameData.playerTeam.length && 
           gameData.playerTeam[gameData.currentPlayerIdx].curHp <= 0) {
      gameData.currentPlayerIdx++;
    }
    if (gameData.currentPlayerIdx >= gameData.playerTeam.length) {
      gameData.currentTurn = 'enemy';
      gameData.currentEnemyIdx = 0;
      setTimeout(nextTurn, 800);
      return;
    }
    renderBattleField();
    renderPlayerActions();
  } else {
    // 敌方回合
    while (gameData.currentEnemyIdx < gameData.enemyTeam.length && 
           gameData.enemyTeam[gameData.currentEnemyIdx].curHp <= 0) {
      gameData.currentEnemyIdx++;
    }
    if (gameData.currentEnemyIdx >= gameData.enemyTeam.length) {
      gameData.currentTurn = 'player';
      gameData.currentPlayerIdx = 0;
      setTimeout(nextTurn, 800);
      return;
    }
    renderBattleField();
    setTimeout(() => {
      enemyAction(gameData.currentEnemyIdx);
    }, 1000);
  }
}

function renderPlayerActions() {
  const panel = document.getElementById('actionPanel');
  panel.innerHTML = '';
  
  const currentFighter = gameData.playerTeam[gameData.currentPlayerIdx];
  
  // 攻击按钮
  const attackBtn = document.createElement('button');
  attackBtn.className = 'action-btn';
  attackBtn.textContent = '⚔️ 攻击';
  attackBtn.onclick = () => showTargetSelection('attack');
  panel.appendChild(attackBtn);
  
  // 技能按钮
  const skillBtn = document.createElement('button');
  skillBtn.className = 'action-btn';
  skillBtn.textContent = '🔮 技能';
  skillBtn.onclick = () => showSkillSelection();
  panel.appendChild(skillBtn);
  
  // 物品按钮
  const itemBtn = document.createElement('button');
  itemBtn.className = 'action-btn';
  itemBtn.textContent = '🎒 物品';
  itemBtn.onclick = () => showItemSelection();
  panel.appendChild(itemBtn);
}

function showTargetSelection(actionType) {
  const panel = document.getElementById('actionPanel');
  panel.innerHTML = '<div style="color: #ffd700; margin-bottom: 10px;">选择目标：</div>';
  
  gameData.enemyTeam.forEach((enemy, idx) => {
    if (enemy.curHp > 0) {
      const btn = document.createElement('button');
      btn.className = 'action-btn';
      btn.textContent = `${enemy.name}`;
      btn.onclick = () => {
        if (actionType === 'attack') {
          playerAttack(gameData.currentPlayerIdx, idx);
        }
      };
      panel.appendChild(btn);
    }
  });
  
  const backBtn = document.createElement('button');
  backBtn.className = 'action-btn';
  backBtn.textContent = '🔙 返回';
  backBtn.onclick = () => renderPlayerActions();
  panel.appendChild(backBtn);
}

function showSkillSelection() {
  const panel = document.getElementById('actionPanel');
  panel.innerHTML = '<div style="color: #ffd700; margin-bottom: 10px;">选择技能：</div>';
  
  const currentFighter = gameData.playerTeam[gameData.currentPlayerIdx];
  currentFighter.skills.forEach((skill, idx) => {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.disabled = currentFighter.curMp < skill.cost;
    btn.textContent = `${skill.icon} ${skill.name} (${skill.cost}MP)`;
    btn.onclick = () => useSkill(gameData.currentPlayerIdx, idx);
    panel.appendChild(btn);
  });
  
  const backBtn = document.createElement('button');
  backBtn.className = 'action-btn';
  backBtn.textContent = '🔙 返回';
  backBtn.onclick = () => renderPlayerActions();
  panel.appendChild(backBtn);
}

function showItemSelection() {
  const panel = document.getElementById('actionPanel');
  panel.innerHTML = '<div style="color: #ffd700; margin-bottom: 10px;">使用物品：</div>';
  
  const consumables = ['health_potion', 'mana_potion'];
  let hasItems = false;
  
  consumables.forEach(itemId => {
    if (gameData.inventory[itemId] > 0) {
      hasItems = true;
      const item = shopItems.find(i => i.id === itemId);
      const btn = document.createElement('button');
      btn.className = 'action-btn';
      btn.textContent = `${item.icon} ${item.name} (${gameData.inventory[itemId]})`;
      btn.onclick = () => useItem(itemId);
      panel.appendChild(btn);
    }
  });
  
  if (!hasItems) {
    const noItemsDiv = document.createElement('div');
    noItemsDiv.textContent = '没有可用物品';
    noItemsDiv.style.color = '#aaa';
    panel.appendChild(noItemsDiv);
  }
  
  const backBtn = document.createElement('button');
  backBtn.className = 'action-btn';
  backBtn.textContent = '🔙 返回';
  backBtn.onclick = () => renderPlayerActions();
  panel.appendChild(backBtn);
}

function playerAttack(attackerIdx, targetIdx) {
  const attacker = gameData.playerTeam[attackerIdx];
  const target = gameData.enemyTeam[targetIdx];
  
  attacker.isAttacking = true;
  renderBattleField();
  
  setTimeout(() => {
    const damage = Math.max(1, (attacker.attack + attacker.buffs.attack) - (target.defense + target.buffs.defense) + Math.floor(Math.random() * 5));
    target.curHp = Math.max(0, target.curHp - damage);
    target.isHurt = true;
    attacker.isAttacking = false;
    
    addLog(`${attacker.name} 攻击 ${target.name}，造成 ${damage} 点伤害！`, 'logPanel');
    renderBattleField();
    
    setTimeout(() => {
      target.isHurt = false;
      renderBattleField();
      gameData.currentPlayerIdx++;
      nextTurn();
    }, 600);
  }, 400);
}

function useSkill(heroIdx, skillIdx) {
  const hero = gameData.playerTeam[heroIdx];
  const skill = hero.skills[skillIdx];
  
  if (hero.curMp < skill.cost) return;
  
  audioSystem.play('skillSound');
  gameData.statistics.skillsUsed++;
  
  hero.curMp -= skill.cost;
  hero.isAttacking = true;
  renderBattleField();
  
  setTimeout(() => {
    executeSkillEffect(hero, skill);
    hero.isAttacking = false;
    renderBattleField();
    
    setTimeout(() => {
      gameData.currentPlayerIdx++;
      nextTurn();
    }, 800);
  }, 400);
}

function executeSkillEffect(caster, skill) {
  // 创建技能特效
  createSkillEffect(skill);
  
  switch(skill.effect) {
    case 'high_damage':
      // 银剑斩击 - 单体高伤
      showSkillTargetSelection(caster, skill, 'single_enemy');
      break;
    case 'magic_damage':
    case 'fire_damage':
      // 混沌之球/烈焰风暴 - 群体魔法伤害
      gameData.enemyTeam.forEach(enemy => {
        if (enemy.curHp > 0) {
          const damage = Math.max(1, Math.floor(caster.attack * 1.3) + Math.floor(Math.random() * 10));
          enemy.curHp = Math.max(0, enemy.curHp - damage);
          enemy.isHurt = true;
        }
      });
      addLog(`${caster.name} 使用 ${skill.name}，魔法火焰吞噬了所有敌人！`, 'logPanel');
      setTimeout(() => {
        gameData.enemyTeam.forEach(e => e.isHurt = false);
        renderBattleField();
      }, 800);
      break;
    case 'heal':
      // 治疗术 - 单体治疗
      showSkillTargetSelection(caster, skill, 'single_ally');
      break;
    case 'buff_attack':
      // 激励之歌 - 全队攻击加成
      gameData.playerTeam.forEach(ally => {
        if (ally.curHp > 0) ally.buffs.attack += 6;
      });
      addLog(`${caster.name} 使用 ${skill.name}，激昂的旋律让全队战意高涨！`, 'logPanel');
      break;
    case 'shield':
      // 昆恩法印 - 自身护盾
      caster.buffs.shield = 30;
      addLog(`${caster.name} 使用 ${skill.name}，金色护盾环绕周身！`, 'logPanel');
      break;
    case 'charm':
      // 魅惑 - 单体控制
      showSkillTargetSelection(caster, skill, 'single_enemy_charm');
      break;
    case 'defense_buff':
      // 护盾术 - 单体防御提升
      showSkillTargetSelection(caster, skill, 'single_ally_defense');
      break;
  }
}

// 创建技能特效
function createSkillEffect(skill) {
  const battleArena = document.getElementById('battleArena');
  const effect = document.createElement('div');
  effect.className = 'skill-effect';
  
  // 根据技能类型设置特效
  switch(skill.effect) {
    case 'magic_damage':
      effect.textContent = '🔮✨💫';
      effect.classList.add('magic');
      break;
    case 'fire_damage':
      effect.textContent = '🔥💥🌟';
      effect.classList.add('fire');
      break;
    case 'heal':
      effect.textContent = '💚✨🌟';
      effect.classList.add('heal');
      break;
    case 'buff_attack':
      effect.textContent = '🎵⭐💫';
      effect.classList.add('buff');
      break;
    case 'shield':
      effect.textContent = '🛡️✨💎';
      effect.classList.add('buff');
      break;
    case 'high_damage':
      effect.textContent = '⚔️💥⚡';
      effect.classList.add('fire');
      break;
    case 'charm':
      effect.textContent = '💫💖✨';
      effect.classList.add('magic');
      break;
    default:
      effect.textContent = '✨💫⭐';
      effect.classList.add('magic');
  }
  
  // 随机位置
  effect.style.left = Math.random() * 80 + 10 + '%';
  effect.style.top = Math.random() * 60 + 20 + '%';
  
  battleArena.appendChild(effect);
  
  // 1秒后移除特效
  setTimeout(() => {
    if (effect.parentNode) {
      effect.parentNode.removeChild(effect);
    }
  }, 1000);
}

// 创建针对性技能特效（针对特定目标）
function createTargetedSkillEffect(skill, target, effectType) {
  const battleArena = document.getElementById('battleArena');
  
  // 创建多层特效
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const effect = document.createElement('div');
      effect.className = 'targeted-skill-effect';
      
      // 根据特效类型设置
      switch(effectType) {
        case 'heal':
          effect.innerHTML = `
            <div class="effect-ring heal-ring"></div>
            <div class="effect-particles">💚✨🌟💫⭐</div>
            <div class="effect-text">+HEAL</div>
          `;
          effect.classList.add('heal-effect');
          break;
        case 'attack':
          effect.innerHTML = `
            <div class="effect-ring attack-ring"></div>
            <div class="effect-particles">⚔️💥⚡🔥💨</div>
            <div class="effect-text">CRITICAL!</div>
          `;
          effect.classList.add('attack-effect');
          break;
        case 'defense':
          effect.innerHTML = `
            <div class="effect-ring defense-ring"></div>
            <div class="effect-particles">🛡️✨💎🌟⭐</div>
            <div class="effect-text">SHIELD+</div>
          `;
          effect.classList.add('defense-effect');
          break;
        case 'charm':
          effect.innerHTML = `
            <div class="effect-ring charm-ring"></div>
            <div class="effect-particles">💫💖✨🦋💕</div>
            <div class="effect-text">CHARMED</div>
          `;
          effect.classList.add('charm-effect');
          break;
        default:
          effect.innerHTML = `
            <div class="effect-ring magic-ring"></div>
            <div class="effect-particles">✨💫⭐🌟💎</div>
            <div class="effect-text">MAGIC!</div>
          `;
          effect.classList.add('magic-effect');
      }
      
      // 定位到目标角色附近
      effect.style.position = 'absolute';
      effect.style.left = '50%';
      effect.style.top = '50%';
      effect.style.transform = 'translate(-50%, -50%)';
      effect.style.pointerEvents = 'none';
      effect.style.zIndex = '1000';
      
      battleArena.appendChild(effect);
      
      // 2秒后移除特效
      setTimeout(() => {
        if (effect.parentNode) {
          effect.parentNode.removeChild(effect);
        }
      }, 2000);
    }, i * 200);
  }
}

// 扩展目标选择功能
function showSkillTargetSelection(caster, skill, targetType) {
  const panel = document.getElementById('actionPanel');
  panel.innerHTML = `<div style="color: #ffd700; margin-bottom: 10px;">选择 ${skill.name} 的目标：</div>`;
  
  if (targetType === 'single_enemy' || targetType === 'single_enemy_charm') {
    gameData.enemyTeam.forEach((enemy, idx) => {
      if (enemy.curHp > 0) {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = `${enemy.name}`;
        btn.onclick = () => {
          if (targetType === 'single_enemy') {
            // 高伤害攻击
            const damage = Math.max(1, Math.floor(caster.attack * 1.8) + Math.floor(Math.random() * 12));
            enemy.curHp = Math.max(0, enemy.curHp - damage);
            enemy.isHurt = true;
            addLog(`${caster.name} 使用 ${skill.name}，银光闪过，对${enemy.name}造成${damage}点致命伤害！`, 'logPanel');
            
            // 创建攻击特效
            createTargetedSkillEffect(skill, enemy, 'attack');
            
          } else if (targetType === 'single_enemy_charm') {
            // 魅惑效果
            enemy.buffs.attack -= 8;
            addLog(`${caster.name} 使用 ${skill.name}，${enemy.name}被迷惑了，攻击力大幅下降！`, 'logPanel');
            
            // 创建魅惑特效
            createTargetedSkillEffect(skill, enemy, 'charm');
          }
          renderBattleField();
          setTimeout(() => {
            enemy.isHurt = false;
            renderBattleField();
            
            // 继续下一回合
            gameData.currentPlayerIdx++;
            nextTurn();
          }, 600);
        };
        panel.appendChild(btn);
      }
    });
  } else if (targetType === 'single_ally' || targetType === 'single_ally_defense') {
    gameData.playerTeam.forEach((ally, idx) => {
      if (ally.curHp > 0) {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = `${ally.name}`;
        btn.onclick = () => {
          if (targetType === 'single_ally') {
            // 治疗效果
            const heal = Math.floor(caster.attack * 1.2) + 25;
            ally.curHp = Math.min(ally.maxHp, ally.curHp + heal);
            addLog(`${caster.name} 使用 ${skill.name}，绿光笼罩，为${ally.name}恢复了${heal}点生命！`, 'logPanel');
            
            // 创建治疗特效
            createTargetedSkillEffect(skill, ally, 'heal');
            
          } else if (targetType === 'single_ally_defense') {
            // 防御提升
            ally.buffs.defense += 8;
            addLog(`${caster.name} 使用 ${skill.name}，魔法护甲保护着${ally.name}！`, 'logPanel');
            
            // 创建防御特效
            createTargetedSkillEffect(skill, ally, 'defense');
          }
          renderBattleField();
          
          // 继续下一回合
          setTimeout(() => {
            gameData.currentPlayerIdx++;
            nextTurn();
          }, 800);
        };
        panel.appendChild(btn);
      }
    });
  }
  
  // 添加返回按钮
  const backBtn = document.createElement('button');
  backBtn.className = 'action-btn';
  backBtn.textContent = '🔙 返回';
  backBtn.onclick = () => renderPlayerActions();
  panel.appendChild(backBtn);
}

function useItem(itemId) {
  if (gameData.inventory[itemId] <= 0) return;
  
  const item = shopItems.find(i => i.id === itemId);
  const currentFighter = gameData.playerTeam[gameData.currentPlayerIdx];
  
  audioSystem.play('clickSound');
  gameData.statistics.itemsUsed++;
  
  if (item.effect.hp) {
    currentFighter.curHp = Math.min(currentFighter.maxHp, currentFighter.curHp + item.effect.hp);
  }
  if (item.effect.mp) {
    currentFighter.curMp = Math.min(currentFighter.maxMp, currentFighter.curMp + item.effect.mp);
  }
  
  gameData.inventory[itemId]--;
  addLog(`${currentFighter.name} 使用了 ${item.name}！`, 'logPanel');
  renderBattleField();
  
  gameData.currentPlayerIdx++;
  nextTurn();
}

function enemyAction(enemyIdx) {
  const enemy = gameData.enemyTeam[enemyIdx];
  const alivePlayers = gameData.playerTeam.filter(p => p.curHp > 0);
  
  if (alivePlayers.length === 0) return;
  
  enemy.isAttacking = true;
  renderBattleField();
  
  // Boss有概率使用特殊技能
  if (enemy.isBoss && Math.random() < 0.4) {
    setTimeout(() => {
      useBossSkill(enemy, alivePlayers);
    }, 400);
  } else {
    // 普通攻击
    const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    
    setTimeout(() => {
      const damage = Math.max(1, enemy.attack - target.defense + Math.floor(Math.random() * 8));
      target.curHp = Math.max(0, target.curHp - damage);
      target.isHurt = true;
      enemy.isAttacking = false;
      
      addLog(`${enemy.name} 攻击 ${target.name}，造成 ${damage} 点伤害！`, 'logPanel');
      renderBattleField();
      
      setTimeout(() => {
        target.isHurt = false;
        renderBattleField();
        gameData.currentEnemyIdx++;
        nextTurn();
      }, 600);
    }, 400);
  }
}

// Boss技能系统
function useBossSkill(boss, alivePlayers) {
  const skillIdx = Math.floor(Math.random() * boss.skills.length);
  const skillName = boss.skills[skillIdx];
  
  // 创建Boss技能特效
  createBossSkillEffect(skillName);
  
  boss.isAttacking = false;
  
  switch(skillName) {
    case '暗黑冲击':
    case '死亡之握':
    case '龙息烈焰':
    case '能量炮':
      // 群体高伤技能
      alivePlayers.forEach(player => {
        const damage = Math.max(1, Math.floor(boss.attack * 1.2) + Math.floor(Math.random() * 10));
        player.curHp = Math.max(0, player.curHp - damage);
        player.isHurt = true;
      });
      addLog(`💀 ${boss.name} 使用了 ${skillName}，造成强力的群体伤害！`, 'logPanel');
      break;
    case '恐惧咆哮':
    case '精神控制':
    case '虚空凝视':
      // 削弱玩家属性
      alivePlayers.forEach(player => {
        player.buffs.attack -= 5;
        player.buffs.defense -= 3;
      });
      addLog(`😱 ${boss.name} 使用了 ${skillName}，全队陷入恐惧状态！`, 'logPanel');
      break;
    case '生命汲取':
    case '亡灵复生':
    case '生命恢复':
    case '自我修复':
      // 恢复Boss生命
      const heal = Math.floor(boss.maxHp * 0.1);
      boss.curHp = Math.min(boss.maxHp, boss.curHp + heal);
      addLog(`🩸 ${boss.name} 使用了 ${skillName}，恢复了 ${heal} 点生命！`, 'logPanel');
      break;
    case '冰封世界':
    case '暴风雪':
      // 冰冻效果+伤害
      alivePlayers.forEach(player => {
        const damage = Math.floor(boss.attack * 0.8);
        player.curHp = Math.max(0, player.curHp - damage);
        player.buffs.attack -= 3;
        player.isHurt = true;
      });
      addLog(`❄️ ${boss.name} 使用了 ${skillName}，寒冰刺骨！`, 'logPanel');
      break;
    case '自然愤怒':
    case '藤蔓缠绕':
      // 自然系技能
      alivePlayers.forEach(player => {
        const damage = Math.floor(boss.attack * 0.9);
        player.curHp = Math.max(0, player.curHp - damage);
        player.buffs.attack -= 2;
        player.isHurt = true;
      });
      addLog(`🌿 ${boss.name} 使用了 ${skillName}，自然之力束缚着敌人！`, 'logPanel');
      break;
    case '超载爆发':
      // 机械系爆发技能
      alivePlayers.forEach(player => {
        const damage = Math.floor(boss.attack * 1.3);
        player.curHp = Math.max(0, player.curHp - damage);
        player.isHurt = true;
      });
      addLog(`⚡ ${boss.name} 使用了 ${skillName}，机械过载造成爆炸伤害！`, 'logPanel');
      break;
    default:
      // 默认强力攻击
      const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const damage = Math.max(1, Math.floor(boss.attack * 1.1) + Math.floor(Math.random() * 8));
      target.curHp = Math.max(0, target.curHp - damage);
      target.isHurt = true;
      addLog(`⚡ ${boss.name} 使用了 ${skillName}，对 ${target.name} 造成 ${damage} 点伤害！`, 'logPanel');
  }
  
  renderBattleField();
  
  setTimeout(() => {
    gameData.playerTeam.forEach(p => p.isHurt = false);
    renderBattleField();
    gameData.currentEnemyIdx++;
    nextTurn();
  }, 800);
}

// Boss技能特效
function createBossSkillEffect(skillName) {
  const battleArena = document.getElementById('battleArena');
  const effect = document.createElement('div');
  effect.className = 'skill-effect';
  effect.style.fontSize = '4em';
  
  switch(skillName) {
    case '暗黑冲击':
    case '死亡之握':
      effect.textContent = '💀⚡☠️';
      effect.classList.add('magic');
      break;
    case '龙息烈焰':
    case '烈焰风暴':
      effect.textContent = '🔥🐉💥';
      effect.classList.add('fire');
      break;
    case '冰封世界':
    case '暴风雪':
      effect.textContent = '❄️🌪️💎';
      effect.classList.add('ice');
      break;
    case '恐惧咆哮':
    case '精神控制':
      effect.textContent = '😱💀👁️';
      effect.classList.add('magic');
      break;
    default:
      effect.textContent = '💀⚡☠️';
      effect.classList.add('magic');
  }
  
  effect.style.left = '50%';
  effect.style.top = '30%';
  effect.style.transform = 'translateX(-50%)';
  
  battleArena.appendChild(effect);
  
  setTimeout(() => {
    if (effect.parentNode) {
      effect.parentNode.removeChild(effect);
    }
  }, 1200);
}

function isTeamDefeated(team) {
  return team.every(member => member.curHp <= 0);
}

function addLog(message, panelId = 'logPanel') {
  const panel = document.getElementById(panelId);
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = message;
  panel.appendChild(entry);
  panel.scrollTop = panel.scrollHeight;
}

function updateGoldDisplay() {
  const goldElement = document.getElementById('goldAmount');
  if (goldElement) {
    goldElement.textContent = gameData.gold;
  }
  updateMenuStats();
}

function updateMenuStats() {
  const menuGold = document.getElementById('menuGold');
  const menuBattleWins = document.getElementById('menuBattleWins');
  const menuBossWins = document.getElementById('menuBossWins');
  
  if (menuGold) menuGold.textContent = gameData.gold;
  if (menuBattleWins) menuBattleWins.textContent = gameData.battleWins;
  if (menuBossWins) menuBossWins.textContent = gameData.bossWins;
}

// 经验值和升级系统
function giveExperience(baseExp) {
  gameData.playerTeam.forEach(hero => {
    const heroId = hero.id;
    
    // 初始化经验值和等级
    if (!gameData.heroExperience[heroId]) gameData.heroExperience[heroId] = 0;
    if (!gameData.heroLevels[heroId]) gameData.heroLevels[heroId] = 1;
    
    // 获得经验值
    const expGained = baseExp + Math.floor(Math.random() * 20);
    gameData.heroExperience[heroId] += expGained;
    addLog(`${hero.name} 获得 ${expGained} 经验值！`, 'logPanel');
    
    // 检查是否升级
    checkLevelUp(heroId);
  });
}

function checkLevelUp(heroId) {
  const currentLevel = gameData.heroLevels[heroId];
  const currentExp = gameData.heroExperience[heroId];
  const expNeeded = getExpNeeded(currentLevel);
  
  if (currentExp >= expNeeded) {
    gameData.heroLevels[heroId]++;
    gameData.heroExperience[heroId] -= expNeeded;
    
    const heroName = heroes.find(h => h.id === heroId)?.name || heroId;
    addLog(`🎉 ${heroName} 升级到 ${gameData.heroLevels[heroId]} 级！`, 'logPanel');
    
    // 可以继续检查是否还能升级
    if (gameData.heroExperience[heroId] >= getExpNeeded(gameData.heroLevels[heroId])) {
      checkLevelUp(heroId);
    }
  }
}

function getExpNeeded(level) {
  return level * 100 + (level - 1) * 50; // 升级所需经验值递增
}

function getHeroLevel(heroId) {
  return gameData.heroLevels[heroId] || 1;
}

function getHeroLevelBonus(heroId) {
  const level = getHeroLevel(heroId);
  const bonus = Math.floor((level - 1) * 2); // 每级+2属性点
  return {
    hp: bonus * 5,
    mp: bonus * 3,
    attack: bonus,
    defense: bonus
  };
}

// 成就系统
function checkAchievements() {
  achievements.forEach(achievement => {
    if (achievement.unlocked || gameData.completedAchievements.includes(achievement.id)) {
      return;
    }
    
    let unlocked = false;
    const condition = achievement.condition;
    
    // 检查各种成就条件
    if (condition.battleWins && gameData.battleWins >= condition.battleWins) unlocked = true;
    if (condition.bossWins && gameData.bossWins >= condition.bossWins) unlocked = true;
    if (condition.gold && gameData.gold >= condition.gold) unlocked = true;
    if (condition.perfectWins && gameData.statistics.perfectWins >= condition.perfectWins) unlocked = true;
    if (condition.maxConsecutiveWins && gameData.statistics.maxConsecutiveWins >= condition.maxConsecutiveWins) unlocked = true;
    if (condition.skillsUsed && gameData.statistics.skillsUsed >= condition.skillsUsed) unlocked = true;
    if (condition.unlockedHeroes && gameData.unlockedHeroes.length >= condition.unlockedHeroes) unlocked = true;
    
    if (unlocked) {
      achievement.unlocked = true;
      gameData.completedAchievements.push(achievement.id);
      
      // 给予成就奖励
      if (achievement.reward.gold) {
        gameData.gold += achievement.reward.gold;
        gameData.statistics.goldEarned += achievement.reward.gold;
      }
      
      addLog(`🏆 成就解锁：${achievement.name}！获得 ${achievement.reward.gold || 0} 金币！`, 'logPanel');
      audioSystem.play('victorySound');
    }
  });
}

// 角色图鉴功能
function showHeroesGallery() {
  hideAllScreens();
  document.getElementById('heroGallery').style.display = 'block';
  renderHeroGallery();
}

function renderHeroGallery() {
  const gallery = document.getElementById('galleryGrid');
  gallery.innerHTML = '';
  
  heroes.forEach((hero, idx) => {
    const isUnlocked = isHeroUnlocked(hero);
    
    const card = document.createElement('div');
    card.className = 'gallery-card' + (isUnlocked ? ' unlocked' : ' locked');
    
    let skillsHtml = '';
    if (isUnlocked) {
      skillsHtml = hero.skills.map(skill => 
        `<div class="skill-item">${skill.icon} ${skill.name}</div>`
      ).join('');
    } else {
      skillsHtml = '<div class="skill-item locked-skill">🔒 技能未解锁</div>';
    }
    
    card.innerHTML = `
      <div class="gallery-header">
        <div class="gallery-avatar ${isUnlocked ? '' : 'locked-avatar'}">${isUnlocked ? hero.sprite : '🔒'}</div>
        <div class="gallery-status">${isUnlocked ? '✅ 已拥有' : '❌ 未拥有'}</div>
      </div>
      <div class="gallery-info">
        <div class="gallery-name">${isUnlocked ? hero.name : '???'}</div>
        <div class="gallery-desc">${isUnlocked ? hero.desc : '未解锁角色'}</div>
        ${isUnlocked ? `
          <div class="gallery-stats">
            <div class="stat-row">💖 生命: ${hero.hp} | 💙 魔法: ${hero.mp}</div>
            <div class="stat-row">⚔️ 攻击: ${hero.attack} | 🛡️ 防御: ${hero.defense}</div>
          </div>
          <div class="gallery-skills">
            <div class="skills-title">🔮 技能列表：</div>
            ${skillsHtml}
          </div>
        ` : `
          <div class="unlock-info">
            <div class="unlock-condition">${hero.unlockText || '默认角色'}</div>
          </div>
        `}
      </div>
    `;
    
    gallery.appendChild(card);
  });
}

function showAchievements() {
  let achievementText = '🏆 详细成就系统 🏆\n\n';
  
  // 统计信息
  achievementText += '📊 游戏统计:\n';
  achievementText += `⚔️ 战斗胜利: ${gameData.battleWins} 次\n`;
  achievementText += `👹 Boss击败: ${gameData.bossWins} 次\n`;
  achievementText += `💫 完美胜利: ${gameData.statistics.perfectWins} 次\n`;
  achievementText += `🔥 最高连胜: ${gameData.statistics.maxConsecutiveWins} 次\n`;
  achievementText += `🔮 技能使用: ${gameData.statistics.skillsUsed} 次\n`;
  achievementText += `💰 当前金币: ${gameData.gold}\n`;
  achievementText += `👥 已解锁角色: ${gameData.unlockedHeroes.length}/${heroes.length}\n\n`;
  
  // 成就列表
  achievementText += '🎖️ 成就进度:\n';
  achievements.forEach(achievement => {
    const isCompleted = gameData.completedAchievements.includes(achievement.id);
    const status = isCompleted ? '✅ 已完成' : '❌ 未完成';
    achievementText += `${achievement.icon} ${achievement.name} - ${status}\n`;
    achievementText += `   ${achievement.desc}\n`;
    if (!isCompleted) {
      // 显示进度
      const condition = achievement.condition;
      if (condition.battleWins) {
        achievementText += `   进度: ${gameData.battleWins}/${condition.battleWins}\n`;
      } else if (condition.bossWins) {
        achievementText += `   进度: ${gameData.bossWins}/${condition.bossWins}\n`;
      } else if (condition.perfectWins) {
        achievementText += `   进度: ${gameData.statistics.perfectWins}/${condition.perfectWins}\n`;
      } else if (condition.maxConsecutiveWins) {
        achievementText += `   进度: ${gameData.statistics.maxConsecutiveWins}/${condition.maxConsecutiveWins}\n`;
      } else if (condition.skillsUsed) {
        achievementText += `   进度: ${gameData.statistics.skillsUsed}/${condition.skillsUsed}\n`;
      } else if (condition.gold) {
        achievementText += `   进度: ${gameData.gold}/${condition.gold}\n`;
      }
    }
    achievementText += '\n';
  });
  
  alert(achievementText);
}



// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化音效系统
  audioSystem.init();
  
  // 隐藏初始加载遮罩
  setTimeout(() => {
    hideLoading();
  }, 1000);
  
  updateMenuStats();
  showMainMenu();
});
