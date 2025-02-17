// DarkPlasma_EnemyBook 2.0.6
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/01/04 2.0.6 セーブデータ作成後のゲームアップデートによるエネミーの増減に対応
 *            2.0.5 登録不可エネミーがコンプリート率計算に含まれる不具合を修正
 * 2020/12/31 2.0.4 レイアウト調整用インターフェース公開 ラベルが正しく表示されない不具合を修正
 * 2020/12/14 2.0.3 敵キャラの色調変更が適用されない不具合を修正
 * 2020/10/10 2.0.2 リファクタ
 * 2020/09/29 2.0.1 プラグインコマンドに説明を追加
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/30 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc モンスター図鑑
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param unknownData
 * @text 未確認要素表示名
 * @type string
 * @default ？？？？？？
 *
 * @param grayOutUnknown
 * @text 未確認要素グレー表示
 * @type boolean
 * @default false
 *
 * @param maskUnknownDropItem
 * @text 未確認ドロップ隠し
 * @type boolean
 * @default false
 *
 * @param enemyPercentLabel
 * @text 図鑑収集率ラベル
 * @type string
 * @default Enemy
 *
 * @param dropItemPercentLabel
 * @text ドロップ取得率ラベル
 * @type string
 * @default Drop Item
 *
 * @param displayDropRate
 * @text ドロップ率表示
 * @type boolean
 * @default false
 *
 * @param detailMode
 * @text 詳細モード設定
 *
 * @param enableDetailMode
 * @desc 詳細モードを有効にします。決定キーで詳細モードON/OFFを切り替えます。縦型デザイン時は無効になります
 * @text 詳細モード有効
 * @type boolean
 * @default false
 * @parent detailMode
 *
 * @param elementIcons
 * @desc 属性アイコンリストを設定します（順序はデータベースのタイプ設定に対応します）
 * @text 属性アイコンリスト
 * @type number[]
 * @default ["0", "76", "64", "65", "66", "67", "68", "69", "70", "71"]
 * @parent detailMode
 *
 * @param weakElementAndStateLabel
 * @desc 弱点属性/ステート/弱体のラベルを設定します
 * @text 弱点ラベル
 * @type string
 * @default 弱点属性/ステート/弱体
 * @parent detailMode
 *
 * @param resistElementAndStateLabel
 * @desc 耐性属性/ステート/弱体のラベルを設定します
 * @text 耐性ラベル
 * @type string
 * @default 耐性属性/ステート/弱体
 * @parent detailMode
 *
 * @param devideResistAndNoEffect
 * @desc 耐性属性/ステート/弱体と無効属性/ステート/弱体を分けて表示します
 * @text 耐性と無効を分ける
 * @type boolean
 * @default false
 * @parent detailMode
 *
 * @param noEffectElementAndStateLabel
 * @desc 無効属性/ステート/弱体のラベルを設定します
 * @text 無効ラベル
 * @type string
 * @default 無効属性/ステート/弱体
 * @parent detailMode
 *
 * @param excludeWeakStates
 * @desc 弱点ステートに表示しないステートを設定します
 * @text 弱点表示しないステート
 * @type state[]
 * @default []
 * @parent detailMode
 *
 * @param excludeResistStates
 * @desc 耐性/無効ステートに表示しないステートを設定します
 * @text 耐性表示しないステート
 * @type state[]
 * @default []
 * @parent detailMode
 *
 * @param debuffStatus
 * @text 弱体有効度の表示
 *
 * @param displayDebuffStatus
 * @text 有効弱体/耐性弱体を表示
 * @type boolean
 * @default true
 * @parent debuffStatus
 *
 * @param debuffStatusIcons
 * @text ステータス弱体アイコン
 * @type struct<DebuffStatusIcons>
 * @default {"mhp":"{\"small\":\"48\", \"large\":\"56\"}", "mmp":"{\"small\":\"49\", \"large\":\"57\"}", "atk":"{\"small\":\"50\", \"large\":\"58\"}", "def":"{\"small\":\"51\", \"large\":\"59\"}", "mat":"{\"small\":\"52\", \"large\":\"60\"}", "mdf":"{\"small\":\"53\", \"large\":\"61\"}", "agi":"{\"small\":\"54\", \"large\":\"62\"}", "luk":"{\"small\":\"55\", \"large\":\"63\"}"}
 * @parent debuffStatus
 *
 * @param debuffStatusThreshold
 * @text 弱体有効度閾値
 * @type struct<DebuffStatusThresholds>
 * @default {"weak":"{\"small\":\"100\", \"large\":\"150\"}", "resist":"{\"small\":\"100\", \"large\":\"50\"}"}
 * @parent debuffStatus
 *
 * @param verticalLayout
 * @desc ウィンドウ配置を縦型に変更する
 * @text 縦型レイアウト
 * @type boolean
 * @default false
 *
 * @param enableInBattle
 * @desc 戦闘中に図鑑ウィンドウを開けるかどうか
 * @text 戦闘中に開く
 * @type boolean
 * @default true
 *
 * @param openKeyInBattle
 * @desc 戦闘中に図鑑ウィンドウを開閉するためのボタン。戦闘中に開ける設定の場合のみ有効です
 * @text 図鑑ウィンドウボタン
 * @type select
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 * @default shift
 *
 * @command open enemyBook
 * @text 図鑑を開く
 * @desc 図鑑シーンを開きます。
 *
 * @command add to enemyBook
 * @text 図鑑に登録する
 * @desc 指定した敵キャラを図鑑に登録します。
 * @arg id
 * @text 敵キャラID
 * @type enemy
 *
 * @command remove from enemyBook
 * @text 図鑑から登録抹消する
 * @desc 指定した敵キャラを図鑑から登録抹消します。
 * @arg id
 * @text 敵キャラID
 * @type enemy
 *
 * @command complete enemyBook
 * @text 図鑑を完成させる
 * @desc 図鑑の内容を全開示します。
 *
 * @command clear enemyBook
 * @text 図鑑を初期化する
 * @desc 図鑑の内容を初期化します。
 *
 * @help
 * version: 2.0.6
 * このプラグインはYoji Ojima氏によって書かれたRPGツクール公式プラグインを元に
 * DarkPlasmaが改変を加えたものです。
 *
 * スクリプト:
 *   $gameSystem.percentCompleteEnemy() # 図鑑のエネミー遭遇達成率を取得する
 *   $gameSystem.percentCompleteDrop()  # 図鑑のドロップアイテム取得達成率を取得する
 *   SceneManager.push(Secne_EnemyBook) # 図鑑を開く
 *
 * 敵キャラのメモ:
 *   <desc1:なんとか>       # 説明１行目
 *   <desc2:かんとか>       # 説明２行目
 *   <book:no>              # 図鑑に載せない場合
 */
/*~struct~DebuffStatusIcons:
 * @param mhp
 * @text 最大HP弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"48", "large":"56"}
 *
 * @param mmp
 * @text 最大MP弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"49", "large":"57"}
 *
 * @param atk
 * @text 攻撃力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"50", "large":"58"}
 *
 * @param def
 * @text 防御力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"51", "large":"59"}
 *
 * @param mat
 * @text 魔法力弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"52", "large":"60"}
 *
 * @param mdf
 * @text 魔法防御弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"53", "large":"61"}
 *
 * @param agi
 * @text 敏捷性弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"54", "large":"62"}
 *
 * @param luk
 * @text 運弱体アイコン
 * @type struct<DebuffStatusIcon>
 * @default {"small":"55", "large":"63"}
 */
/*~struct~DebuffStatusThresholds:
 * @param weak
 * @desc 弱点弱体のアイコン表示判定の閾値。有効度がこれらの値よりも大ならアイコンを弱点弱体に表示
 * @text 弱点閾値
 * @type struct<DebuffStatusThreshold>
 * @default {"small":"100", "large":"150"}
 *
 * @param resist
 * @desc 耐性弱体のアイコン表示判定の閾値。有効度がこれらの値よりも小ならアイコンを耐性弱体に表示
 * @text 耐性閾値
 * @type struct<DebuffStatusThreshold>
 * @default {"small":"100", "large":"50"}
 */
/*~struct~DebuffStatusIcon:
 * @param small
 * @text 弱体アイコン（小）
 * @type number
 *
 * @param large
 * @text 弱体アイコン（大）
 * @type number
 */
/*~struct~DebuffStatusThreshold:
 * @param small
 * @text 閾値（小）
 * @type number
 *
 * @param large
 * @text 閾値（大）
 * @type number
 */
/*:en
 * @plugindesc Displays detailed statuses of enemies.
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param unknownData
 * @text Unknown Data
 * @type string
 * @default ??????
 *
 * @param grayOutUnknown
 * @text Gray out Unknown Enemy
 * @type boolean
 * @default false
 *
 * @param maskUnknownDropItem
 * @text Mask Unknown Drop Item
 * @type boolean
 * @default false
 *
 * @param enemyPercentLabel
 * @text Enemy Percent Label
 * @type string
 * @default Enemy
 *
 * @param dropItemPercentLabel
 * @text Drop Item Percent Label
 * @type string
 * @default Drop Item
 *
 * @param displayDropRate
 * @text Display Drop Rate
 * @type boolean
 * @default false
 *
 * @param detailMode
 * @text Detail Mode
 *
 * @param enableDetailMode
 * @desc Enable Ok button for display enemy detail.
 * @text Enable Detail Mode
 * @type boolean
 * @default false
 * @parent detailMode
 *
 * @param elementIcons
 * @desc Element Icons for weak and resist.(The order is corresponding to elements settings in database.)
 * @text Element Icons
 * @type number[]
 * @default ["0", "76", "64", "65", "66", "67", "68", "69", "70", "71"]
 * @parent detailMode
 *
 * @param weakElementAndStateLabel
 * @desc Label for weak elements and states.
 * @text Weak Label
 * @type string
 * @default Weak
 * @parent detailMode
 *
 * @param resistElementAndStateLabel
 * @desc Label for resist elements and states.
 * @text Resist Label
 * @type string
 * @default Resist
 * @parent detailMode
 *
 * @param devideResistAndNoEffect
 * @desc Display no effect elements and states apart from the resists.
 * @text Devide resist and no effect
 * @type boolean
 * @default false
 * @parent detailMode
 *
 * @param noEffectElementAndStateLabel
 * @desc Label for no effect elements and states.
 * @text No Effect Label
 * @type string
 * @default No Effect
 * @parent detailMode
 *
 * @param excludeWeakStates
 * @desc List for states not to display as weak states.
 * @text Exclude weak states
 * @type state[]
 * @default []
 * @parent detailMode
 *
 * @param excludeResistStates
 * @desc List for states not to display as resist states.
 * @text Exclude resist states
 * @type state[]
 * @default []
 * @parent detailMode
 *
 * @param debuffStatus
 * @text Debuff status
 *
 * @param displayDebuffStatus
 * @text Display debuff status
 * @type boolean
 * @default true
 * @parent debuffStatus
 *
 * @param debuffStatusIcons
 * @text Debuff Status Icons
 * @type struct<DebuffStatusIconsEn>
 * @default {"mhp":"{\"small\":\"48\", \"large\":\"56\"}", "mmp":"{\"small\":\"49\", \"large\":\"57\"}", "atk":"{\"small\":\"50\", \"large\":\"58\"}", "def":"{\"small\":\"51\", \"large\":\"59\"}", "mat":"{\"small\":\"52\", \"large\":\"60\"}", "mdf":"{\"small\":\"53\", \"large\":\"61\"}", "agi":"{\"small\":\"54\", \"large\":\"62\"}", "luk":"{\"small\":\"55\", \"large\":\"63\"}"}
 * @parent debuffStatus
 *
 * @param debuffStatusThreshold
 * @text Debuff Status Threshold
 * @type struct<DebuffStatusThresholdsEn>
 * @default {"weak":"{\"small\":\"100\", \"large\":\"150\"}", "resist":"{\"small\":\"100\", \"large\":\"50\"}"}
 * @parent debuffStatus
 *
 * @param verticalLayout
 * @desc Window layout to vertical
 * @text Vertical Layout
 * @type boolean
 * @default false
 *
 * @param enableInBattle
 * @desc Enable enemy book in battle
 * @text Enable In Battle
 * @type boolean
 * @default true
 *
 * @param openKeyInBattle
 * @desc Open key for enemy book window in battle
 * @text Open Key In Battle
 * @type select
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 * @default shift
 *
 * @command open enemyBook
 * @text open enemy book
 * @desc Open enemy book.
 *
 * @command add to enemyBook
 * @text add to enemy book
 * @desc Add enemy to book.
 * @arg id
 * @text enemy id
 * @type enemy
 *
 * @command remove from enemyBook
 * @text remove from enemy book
 * @desc Remove enemy from book.
 * @arg id
 * @text enemy id
 * @type enemy
 *
 * @command complete enemyBook
 * @text complete enemy book
 * @desc Complete enemy book.
 *
 * @command clear enemyBook
 * @text clear enemy book
 * @desc Clear enemy book.
 *
 * @help
 * version: 2.0.6
 * The original plugin is RMMV official plugin written by Yoji Ojima.
 * Arranged by DarkPlasma.
 *
 * Script:
 *   $gameSystem.percentCompleteEnemy() # Get percentage of enemy.
 *   $gameSystem.percentCompleteDrop()  # Get percentage of drop item.
 *   SceneManager.push(Secne_EnemyBook) # Open enemy book.
 *
 * Enemy Note:
 *   <desc1:foobar>         # Description text in the enemy book, line 1
 *   <desc2:blahblah>       # Description text in the enemy book, line 2
 *   <book:no>              # This enemy does not appear in the enemy book
 */
/*~struct~DebuffStatusIconsEn:
 * @param mhp
 * @text Debuff max hp icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"48", "large":"56"}
 *
 * @param mmp
 * @text Debuff max mp icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"49", "large":"57"}
 *
 * @param atk
 * @text Debuff attack icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"50", "large":"58"}
 *
 * @param def
 * @text Debuff defense icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"51", "large":"59"}
 *
 * @param mat
 * @text Debuff magical attack icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"52", "large":"60"}
 *
 * @param mdf
 * @text Debuff magical defense icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"53", "large":"61"}
 *
 * @param agi
 * @text Debuff agility icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"54", "large":"62"}
 *
 * @param luk
 * @text Debuff luck icons
 * @type struct<DebuffStatusIconEn>
 * @default {"small":"55", "large":"63"}
 */
/*~struct~DebuffStatusThresholdsEn:
 * @param weak
 * @desc Display debuff status icon as weak if debuff rate of the enemy is larger than this value.
 * @text Weak Threshold
 * @type struct<DebuffStatusThresholdEn>
 * @default {"small":"100", "large":"150"}
 *
 * @param resist
 * @desc Display debuff status icon as resist if debuff rate of the enemy is smaller than this value.
 * @text Resist Threshold
 * @type struct<DebuffStatusThresholdEn>
 * @default {"small":"100", "large":"50"}
 */
/*~struct~DebuffStatusIconEn:
 * @param small
 * @text Debuff status icon Lv1.
 * @type number
 *
 * @param large
 * @text Debuff status icon Lv2.
 * @type number
 */
/*~struct~DebuffStatusThresholdEn:
 * @param small
 * @text Threshold (small)
 * @type number
 *
 * @param large
 * @text Threshold (large)
 * @type number
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    unknownData: String(pluginParameters.unknownData || '？？？？？？'),
    grayOutUnknown: String(pluginParameters.grayOutUnknown || false) === 'true',
    maskUnknownDropItem: String(pluginParameters.maskUnknownDropItem || false) === 'true',
    enemyPercentLabel: String(pluginParameters.enemyPercentLabel || 'Enemy'),
    dropItemPercentLabel: String(pluginParameters.dropItemPercentLabel || 'Drop Item'),
    displayDropRate: String(pluginParameters.displayDropRate || false) === 'true',
    enableDetailMode: String(pluginParameters.enableDetailMode || false) === 'true',
    elementIcons: JSON.parse(
      pluginParameters.elementIcons || '["0", "76", "64", "65", "66", "67", "68", "69", "70", "71"]'
    ).map((e) => {
      return Number(e || 0);
    }),
    weakElementAndStateLabel: String(pluginParameters.weakElementAndStateLabel || '弱点属性/ステート/弱体'),
    resistElementAndStateLabel: String(pluginParameters.resistElementAndStateLabel || '耐性属性/ステート/弱体'),
    devideResistAndNoEffect: String(pluginParameters.devideResistAndNoEffect || false) === 'true',
    noEffectElementAndStateLabel: String(pluginParameters.noEffectElementAndStateLabel || '無効属性/ステート/弱体'),
    excludeWeakStates: JSON.parse(pluginParameters.excludeWeakStates || '[]').map((e) => {
      return Number(e || 0);
    }),
    excludeResistStates: JSON.parse(pluginParameters.excludeResistStates || '[]').map((e) => {
      return Number(e || 0);
    }),
    displayDebuffStatus: String(pluginParameters.displayDebuffStatus || true) === 'true',
    debuffStatusIcons: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        mhp: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.mhp || '{"small":"48", "large":"56"}'),
        mmp: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.mmp || '{"small":"49", "large":"57"}'),
        atk: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.atk || '{"small":"50", "large":"58"}'),
        def: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.def || '{"small":"51", "large":"59"}'),
        mat: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.mat || '{"small":"52", "large":"60"}'),
        mdf: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.mdf || '{"small":"53", "large":"61"}'),
        agi: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.agi || '{"small":"54", "large":"62"}'),
        luk: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.luk || '{"small":"55", "large":"63"}'),
      };
    })(
      pluginParameters.debuffStatusIcons ||
        '{"mhp":{"small":"48", "large":"56"}, "mmp":{"small":"49", "large":"57"}, "atk":{"small":"50", "large":"58"}, "def":{"small":"51", "large":"59"}, "mat":{"small":"52", "large":"60"}, "mdf":{"small":"53", "large":"61"}, "agi":{"small":"54", "large":"62"}, "luk":{"small":"55", "large":"63"}}'
    ),
    debuffStatusThreshold: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        weak: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.weak || '{"small":"100", "large":"150"}'),
        resist: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            small: Number(parsed.small || 0),
            large: Number(parsed.large || 0),
          };
        })(parsed.resist || '{"small":"100", "large":"50"}'),
      };
    })(
      pluginParameters.debuffStatusThreshold ||
        '{"weak":{"small":"100", "large":"150"}, "resist":{"small":"100", "large":"50"}}'
    ),
    verticalLayout: String(pluginParameters.verticalLayout || false) === 'true',
    enableInBattle: String(pluginParameters.enableInBattle || true) === 'true',
    openKeyInBattle: String(pluginParameters.openKeyInBattle || 'shift'),
  };

  const STATUS_NAMES = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];

  const PLUGIN_COMMAND_NAME = {
    OPEN: 'open enemyBook',
    ADD: 'add to enemyBook',
    REMOVE: 'remove from enemyBook',
    COMPLETE: 'complete enemyBook',
    CLEAR: 'clear enemyBook',
  };

  /**
   * 図鑑登録可能かどうか
   * @param {MZ.Enemy} enemy エネミーデータ
   * @return {boolean}
   */
  function isRegisterableEnemy(enemy) {
    return enemy && enemy.name && enemy.meta.book !== 'no';
  }

  /**
   * 図鑑登録可能なエネミー一覧
   * @return {MZ.Enemy[]}
   */
  function registerableEnemies() {
    return $dataEnemies.filter((enemy) => isRegisterableEnemy(enemy));
  }

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.OPEN, function () {
    SceneManager.push(Scene_EnemyBook);
  });

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.ADD, function (args) {
    $gameSystem.addToEnemyBook(Number(args.id));
  });

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.REMOVE, function (args) {
    $gameSystem.removeFromEnemyBook(Number(args.id));
  });

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.COMPLETE, function () {
    $gameSystem.completeEnemyBook();
  });

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR, function () {
    $gameSystem.clearEnemyBook();
  });

  class EnemyBook {
    /**
     * @param {EnemyBookPage[]} pages ページ一覧
     */
    constructor(pages) {
      this._pages = pages;
    }

    /**
     * 初期状態（何も登録されていない）図鑑を返す
     * @return {EnemyBook}
     */
    static initialBook() {
      return new EnemyBook(
        $dataEnemies.map((enemy) => {
          return isRegisterableEnemy(enemy)
            ? new EnemyBookPage(
                false,
                enemy.dropItems.map((_) => false)
              )
            : null;
        })
      );
    }

    /**
     * セーブデータからロードした際、ゲームアップデートによって
     * エネミーが増減していた場合に図鑑を合わせる
     * （減った場合、溢れたデータは捨てられることに注意）
     */
    flexPage() {
      if (this._pages.length < $dataEnemies.length) {
        this._pages = this._pages.concat(
          $dataEnemies.slice(this._pages.length).map((enemy) => {
            return isRegisterableEnemy(enemy)
              ? new EnemyBookPage(
                  false,
                  enemy.dropItems.map((_) => false)
                )
              : null;
          })
        );
      } else if (this._pages.length > $dataEnemies.length) {
        this._pages = this._pages.slice(0, $dataEnemies.length - 1);
      }
    }

    /**
     * エネミー登録率を百分率で返す
     * @return {number}
     */
    percentRegisteredEnemy() {
      const registerableEnemyCount = registerableEnemies().length;
      if (registerableEnemyCount === 0) {
        return 0;
      }
      const registeredEnemyCount = this._pages.filter((page) => page && page.isRegistered).length;
      return (100 * registeredEnemyCount) / registerableEnemyCount;
    }

    /**
     * ドロップアイテム登録率を百分率で返す
     * @return {number}
     */
    percentRegisteredDropItem() {
      const registerableDropItemCount = registerableEnemies().reduce(
        (previous, current) => previous + current.dropItems.length,
        0
      );
      if (registerableDropItemCount === 0) {
        return 0;
      }
      const registeredDropItemCount = this._pages
        .filter((page) => page && page.isRegistered)
        .reduce((previous, current) => {
          return previous + current.registeredDropItemCount();
        }, 0);
      return (100 * registeredDropItemCount) / registerableDropItemCount;
    }

    /**
     * 登録済みかどうか
     * @param {MZ.Enemy} enemy 敵データ
     */
    isRegistered(enemy) {
      if (enemy && this._pages[enemy.id]) {
        return this._pages[enemy.id].isRegistered;
      }
      return false;
    }

    /**
     * ドロップアイテムが登録済みかどうか
     * @param {MZ.Enemy} enemy 敵データ
     * @param {number} index ドロップアイテム番号
     */
    isDropItemRegistered(enemy, index) {
      if (enemy && this._pages[enemy.id]) {
        return this._pages[enemy.id].isDropItemRegistered(index);
      }
      return false;
    }

    /**
     * 図鑑に指定したエネミーを登録する
     * @param {number} enemyId 敵ID
     */
    register(enemyId) {
      if (this._pages[enemyId]) {
        this._pages[enemyId].register();
      }
    }

    /**
     * 図鑑に指定したエネミーのドロップアイテムを登録する
     * @param {number} enemyId 敵ID
     * @param {number} index ドロップアイテム番号
     */
    registerDropItem(enemyId, index) {
      if (this._pages[enemyId]) {
        this._pages[enemyId].registerDropItem(index);
      }
    }

    /**
     * 図鑑から指定したエネミーを登録解除する
     * @param {number} enemyId 敵ID
     */
    unregister(enemyId) {
      if (this._pages[enemyId]) {
        this._pages[enemyId].unregister();
      }
    }

    /**
     * 図鑑を完成させる
     */
    complete() {
      registerableEnemies().forEach((enemy) => {
        this.register(enemy.id);
        enemy.dropItems.forEach((_, index) => this.registerDropItem(enemy.id, index));
      });
    }

    /**
     * 図鑑を白紙に戻す
     */
    clear() {
      this._pages.filter((page) => page).forEach((page) => page.unregister());
    }
  }

  class EnemyBookPage {
    /**
     * @param {boolean} isRegistered 登録フラグ
     * @param {boolean[]} dropItems ドロップアイテムごとに登録フラグ
     */
    constructor(isRegistered, dropItems) {
      this._isRegistered = isRegistered;
      this._dropItems = dropItems;
    }

    get isRegistered() {
      return this._isRegistered;
    }

    isDropItemRegistered(index) {
      return this._dropItems[index];
    }

    registeredDropItemCount() {
      return this._dropItems.filter((dropItem) => dropItem).length;
    }

    register() {
      this._isRegistered = true;
    }

    registerDropItem(index) {
      this._dropItems[index] = true;
    }

    unregister() {
      this._isRegistered = false;
      this._dropItems = this._dropItems.map((_) => false);
    }
  }

  window[EnemyBook.name] = EnemyBook;
  window[EnemyBookPage.name] = EnemyBookPage;

  /**
   * 敵図鑑情報
   * Game_Systemからのみ直接アクセスされる
   * @type {EnemyBook}
   */
  let enemyBook = null;

  /**
   * エネミー図鑑シーン
   */
  class Scene_EnemyBook extends Scene_MenuBase {
    constructor() {
      super();
      this.initialize.apply(this, arguments);
    }

    create() {
      super.create();
      this._enemyBookWindows = new EnemyBookWindows(
        this.popScene.bind(this),
        this._windowLayer,
        this.percentWindowRect(),
        this.indexWindowRect(),
        this.statusWindowRect()
      );
    }

    /**
     * @return {Rectangle}
     */
    percentWindowRect() {
      return new Rectangle(
        0,
        0,
        settings.verticalLayout ? Graphics.boxWidth / 3 : Graphics.boxWidth,
        this.percentWindowHeight()
      );
    }

    /**
     * @return {number}
     */
    percentWindowHeight() {
      return this.calcWindowHeight(settings.verticalLayout ? 2 : 1, false);
    }

    /**
     * @return {Rectangle}
     */
    indexWindowRect() {
      return new Rectangle(0, this.percentWindowHeight(), this.indexWindowWidth(), this.indexWindowHeight());
    }

    /**
     * @return {number}
     */
    indexWindowWidth() {
      return settings.verticalLayout ? Math.floor(Graphics.boxWidth / 3) : Graphics.boxWidth;
    }

    /**
     * @return {number}
     */
    indexWindowHeight() {
      return settings.verticalLayout ? Graphics.boxHeight - this.percentWindowHeight() : this.calcWindowHeight(4, true);
    }

    /**
     * @return {Rectangle}
     */
    statusWindowRect() {
      const x = settings.verticalLayout ? this.indexWindowWidth() : 0;
      const y = settings.verticalLayout ? 0 : this.indexWindowHeight() + this.percentWindowHeight();
      return new Rectangle(x, y, Graphics.boxWidth - x, Graphics.boxHeight - y);
    }
  }

  window[Scene_EnemyBook.name] = Scene_EnemyBook;

  class EnemyBookWindows {
    /**
     *
     * @param {function} cancelHandler キャンセル時の挙動
     * @param {WindowLayer} parentLayer 親レイヤー
     */
    constructor(cancelHandler, parentLayer, percentWindowRect, indexWindowRect, statusWindowRect) {
      this._detailMode = false;
      this._percentWindow = new Window_EnemyBookPercent(percentWindowRect);
      this._indexWindow = new Window_EnemyBookIndex(indexWindowRect);
      this._indexWindow.setHandler('ok', this.toggleDetailMode.bind(this));
      this._indexWindow.setHandler('cancel', cancelHandler);
      this._statusWindow = new Window_EnemyBookStatus(statusWindowRect);
      parentLayer.addChild(this._percentWindow);
      parentLayer.addChild(this._indexWindow);
      parentLayer.addChild(this._statusWindow);
      this._indexWindow.setStatusWindow(this._statusWindow);
    }

    toggleDetailMode() {
      if (settings.verticalLayout) {
        return;
      }
      this._detailMode = !this._detailMode;
      this._indexWindow.setDetailMode(this._detailMode);
      this._statusWindow.setDetailMode(this._detailMode);
    }

    close() {
      this._percentWindow.hide();
      this._indexWindow.hide();
      this._indexWindow.deactivate();
      this._statusWindow.hide();
    }

    open() {
      this._percentWindow.show();
      this._indexWindow.show();
      this._indexWindow.activate();
      this._statusWindow.show();
    }

    isActive() {
      return this._indexWindow.active;
    }

    get indexWindow() {
      return this._indexWindow;
    }
  }

  /**
   * 登録率表示ウィンドウ
   */
  class Window_EnemyBookPercent extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this.refresh();
    }

    drawPercent() {
      const offset = 50;
      const width = settings.verticalLayout ? this.contentsWidth() : (Graphics.boxWidth >> 1) - offset;
      const percentWidth = this.textWidth('0000000');
      this.drawText(`${settings.enemyPercentLabel}:`, 0, 0, width - percentWidth);
      this.drawText(`${Number($gameSystem.percentCompleteEnemy()).toFixed(1)}％`, 0, 0, width, 'right');
      this.drawText(
        `${settings.dropItemPercentLabel}:`,
        settings.verticalLayout ? 0 : width + offset,
        settings.verticalLayout ? this.lineHeight() : 0,
        width - percentWidth
      );
      this.drawText(
        `${Number($gameSystem.percentCompleteDrop()).toFixed(1)}％`,
        settings.verticalLayout ? 0 : width + offset,
        settings.verticalLayout ? this.lineHeight() : 0,
        width,
        'right'
      );
    }

    refresh() {
      this.contents.clear();
      this.drawPercent();
    }
  }

  /**
   * エネミー図鑑目次
   */
  class Window_EnemyBookIndex extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this.refresh();
      this.setTopRow(Window_EnemyBookIndex.lastTopRow);
      this.select(Window_EnemyBookIndex.lastIndex);
      this.activate();
    }

    /**
     * @return {number}
     */
    maxCols() {
      return settings.verticalLayout ? 1 : 3;
    }

    /**
     * @return {number}
     */
    maxItems() {
      return this._list ? this._list.length : 0;
    }

    /**
     * @param {Window_EnemyBookStatus} statusWindow ステータスウィンドウ
     */
    setStatusWindow(statusWindow) {
      this._statusWindow = statusWindow;
      this.updateStatus();
    }

    update() {
      super.update();
      this.updateStatus();
    }

    updateStatus() {
      if (this._statusWindow) {
        const enemy = this._list[this.index()];
        this._statusWindow.setEnemy(enemy);
      }
    }

    makeItemList() {
      if (this._list) {
        return;
      }
      this._list = registerableEnemies();
    }

    refresh() {
      this.makeItemList();
      this.createContents();
      this.drawAllItems();
    }

    /**
     * @return {boolean}
     */
    isCurrentItemEnabled() {
      return this.isEnabled(this.index());
    }

    /**
     * @param {number} index インデックス
     * @return {boolean}
     */
    isEnabled(index) {
      const enemy = this._list[index];
      return $gameSystem.isInEnemyBook(enemy);
    }

    /**
     * @param {number} index インデックス
     */
    drawItem(index) {
      const enemy = this._list[index];
      const rect = this.itemRect(index);
      let name;
      if ($gameSystem.isInEnemyBook(enemy)) {
        name = enemy.name;
      } else {
        this.changePaintOpacity(!settings.grayOutUnknown);
        name = settings.unknownData;
      }
      this.drawText(name, rect.x, rect.y, rect.width);
      this.changePaintOpacity(true);
    }

    processHandling() {
      super.processHandling();
      if (this.active && $gameParty.inBattle() && Input.isTriggered(settings.openKeyInBattle)) {
        this.processCancel();
      }
    }

    processOk() {
      if (!settings.enableDetailMode || settings.verticalLayout) {
        return;
      }
      if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.callOkHandler();
      } else {
        this.playBuzzerSound();
      }
    }

    processCancel() {
      super.processCancel();
      Window_EnemyBookIndex.lastTopRow = this.topRow();
      Window_EnemyBookIndex.lastIndex = this.index();
    }

    /**
     * 詳細モードを切り替える
     * @param {boolean} mode 詳細モードONかOFFか
     */
    setDetailMode(mode) {
      this.height = this.fittingHeight(mode ? 1 : 4);
      this.setTopRow(this.row());
      this.refresh();
    }
  }

  Window_EnemyBookIndex.lastTopRow = 0;
  Window_EnemyBookIndex.lastIndex = 0;

  /**
   * 図鑑ステータスウィンドウ
   */
  class Window_EnemyBookStatus extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._enemy = null;
      this.setupEnemySprite(this.width, this.height);
      this._detailMode = false;
      this.refresh();
    }

    setupEnemySprite(width, height) {
      this._enemySprite = new Sprite();
      this._enemySprite.anchor.x = 0.5;
      this._enemySprite.anchor.y = 0.5;
      this._enemySprite.x = settings.verticalLayout ? width / 4 : width / 2 - 20;
      this._enemySprite.y = settings.verticalLayout ? height / 4 + this.lineHeight() : height / 2;
      this.addChildToBack(this._enemySprite);
    }

    contentsHeight() {
      const maxHeight =
        settings.enableDetailMode && !settings.verticalLayout
          ? Graphics.boxHeight - this.lineHeight(1) * 2
          : this.height;
      return maxHeight - this.itemPadding() * 2;
    }

    /**
     * @param {MZ.Enemy} enemy 敵キャラ情報
     */
    setEnemy(enemy) {
      if (this._enemy !== enemy) {
        this._enemy = enemy;
        this.refresh();
      }
    }

    update() {
      super.update();
      if (this._enemySprite.bitmap) {
        const bitmapHeight = this._enemySprite.bitmap.height;
        const contentsHeight = this.contents.height;
        let scale = 1;
        if (bitmapHeight > contentsHeight) {
          scale = contentsHeight / bitmapHeight;
        }
        this._enemySprite.scale.x = scale;
        this._enemySprite.scale.y = scale;
      }
    }

    refresh() {
      const enemy = this._enemy;
      this.contents.clear();

      if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
        this._enemySprite.bitmap = null;
        return;
      }

      const name = enemy.battlerName;
      const hue = enemy.battlerHue;
      let bitmap;
      if ($gameSystem.isSideView()) {
        bitmap = ImageManager.loadSvEnemy(name, hue);
      } else {
        bitmap = ImageManager.loadEnemy(name, hue);
      }
      this._enemySprite.bitmap = bitmap;
      this._enemySprite.setHue(enemy.battlerHue);

      this.resetTextColor();
      this.drawText(enemy.name, 0, 0);

      if (settings.verticalLayout) {
        this.drawPageWithVerticalLayout();
      } else if (this._detailMode) {
        this.drawPageWithDetailMode();
      } else {
        this.drawPage();
      }
    }

    drawPageWithVerticalLayout() {
      const enemy = this._enemy;
      const lineHeight = this.lineHeight();
      this.drawLevel(this.contentsWidth() / 2 + this.itemPadding() / 2, 0);
      this.drawStatus(this.contentsWidth() / 2 + this.itemPadding() / 2, lineHeight + this.itemPadding());

      this.drawExpAndGold(this.itemPadding(), lineHeight * 9 + this.itemPadding());

      const rewardsWidth = this.contentsWidth() / 2;
      const dropItemWidth = rewardsWidth;

      this.drawDropItems(0, lineHeight * 6 + this.itemPadding(), dropItemWidth);

      const weakAndResistWidth = this.contentsWidth() / 2;
      this._weakLines = 1;
      this._resistLines = 1;
      this.drawWeakElementsAndStates(0, lineHeight * 10 + this.itemPadding(), weakAndResistWidth);
      this.drawResistElementsAndStates(0, lineHeight * (11 + this._weakLines) + this.itemPadding(), weakAndResistWidth);
      if (settings.devideResistAndNoEffect) {
        this.drawNoEffectElementsAndStates(
          0,
          lineHeight * (12 + this._weakLines + this._resistLines) + this.itemPadding(),
          weakAndResistWidth
        );
      }

      const descWidth = 480;
      if (enemy.meta.desc1) {
        this.drawTextEx(enemy.meta.desc1, this.descriptionX(), this.descriptionY(), descWidth);
      }
      if (enemy.meta.desc2) {
        this.drawTextEx(enemy.meta.desc2, this.descriptionX(), this.descriptionY() + lineHeight, descWidth);
      }
    }

    drawPageWithDetailMode() {
      const enemy = this._enemy;
      const lineHeight = this.lineHeight();
      this.drawLevel(this.itemPadding(), lineHeight + this.itemPadding());
      this.drawStatus(this.itemPadding(), lineHeight * 2 + this.itemPadding());

      this.drawExpAndGold(this.itemPadding(), lineHeight * 10 + this.itemPadding());

      const dropItemWidth = 480;

      this.drawDropItems(this.contentsWidth() - dropItemWidth, lineHeight * 7 + this.itemPadding(), dropItemWidth);

      const weakAndResistWidth = 280;
      this._weakLines = 1;
      this._resistLines = 1;
      this.drawWeakElementsAndStates(
        this.contentsWidth() - weakAndResistWidth,
        lineHeight + this.itemPadding(),
        weakAndResistWidth
      );
      this.drawResistElementsAndStates(
        this.contentsWidth() - weakAndResistWidth,
        lineHeight * (2 + this._weakLines),
        weakAndResistWidth
      );
      if (settings.devideResistAndNoEffect) {
        this.drawNoEffectElementsAndStates(
          this.contentsWidth() - weakAndResistWidth,
          lineHeight * (4 + this._weakLines + this._resistLines),
          weakAndResistWidth
        );
      }

      const descWidth = 480;
      if (enemy.meta.desc1) {
        this.drawTextEx(enemy.meta.desc1, this.descriptionX(), this.descriptionY(), descWidth);
      }
      if (enemy.meta.desc2) {
        this.drawTextEx(enemy.meta.desc2, this.descriptionX(), this.descriptionY() + lineHeight, descWidth);
      }
    }

    /**
     * @return {number}
     */
    descriptionX() {
      return settings.verticalLayout
        ? settings.devideResistAndNoEffect
          ? this.contentsWidth() / 2 + this.itemPadding() / 2
          : 0
        : this.contentsWidth() - descWidth;
    }

    /**
     * @return {number}
     */
    descriptionY() {
      return settings.verticalLayout
        ? this.itemPadding() + this.lineHeight() * 14
        : this.itemPadding() + this.lineHeight() * 10;
    }

    drawPage() {
      const enemy = this._enemy;
      const lineHeight = this.lineHeight();
      this.drawLevel(this.contentsWidth() - 280, this.itemPadding());
      this.drawStatus(this.itemPadding(), lineHeight + this.itemPadding());

      const rewardsWidth = 280;
      this.drawExpAndGold(this.contentsWidth() - rewardsWidth, lineHeight + this.itemPadding());

      const dropItemWidth = rewardsWidth;
      this.drawDropItems(this.contentsWidth() - dropItemWidth, lineHeight * 3 + this.itemPadding(), dropItemWidth);

      const descWidth = 480;
      if (enemy.meta.desc1) {
        this.drawTextEx(
          enemy.meta.desc1,
          this.contentsWidth() - descWidth,
          this.itemPadding() + lineHeight * 7,
          descWidth
        );
      }
      if (enemy.meta.desc2) {
        this.drawTextEx(
          enemy.meta.desc2,
          this.contentsWidth() - descWidth,
          this.itemPadding() + lineHeight * 8,
          descWidth
        );
      }
    }

    /**
     * レベルを描画する
     * @param {number} x X座標
     * @param {number} y Y座標
     */
    drawLevel(x, y) {
      const enemy = this._enemy;
      if (enemy.level) {
        this.changeTextColor(this.systemColor());
        this.drawText(`Lv.`, x, y, 160);
        this.resetTextColor();
        this.drawText(enemy.level, x + 160, y, 60, 'right');
      }
    }

    /**
     * ステータスを描画する
     * @param {number} x X座標
     * @param {number} y Y座標
     */
    drawStatus(x, y) {
      const lineHeight = this.lineHeight();
      const enemy = this._enemy;
      for (var i = 0; i < 8; i++) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(i), x, y, 160);
        this.resetTextColor();
        this.drawText(enemy.params[i], x + 160, y, 60, 'right');
        y += lineHeight;
      }
    }

    /**
     * 経験値とゴールドを描画する
     * @param {number} x X座標
     * @param {number} y Y座標
     */
    drawExpAndGold(x, y) {
      const enemy = this._enemy;
      if (!settings.verticalLayout) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.exp, x, y, 160);
        this.resetTextColor();
        this.drawText(enemy.exp, x + 160, y, 60, 'right');

        this.changeTextColor(this.systemColor());
        this.drawText('お金', x, y + this.lineHeight(), 160);
        this.resetTextColor();
        this.drawText(enemy.gold, x + 160, y + this.lineHeight(), 60, 'right');
      } else {
        this.resetTextColor();
        this.drawText(enemy.exp, x, y);
        x += this.textWidth(enemy.exp) + 6;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.expA, x, y);
        x += this.textWidth(TextManager.expA + '  ');

        this.resetTextColor();
        this.drawText(enemy.gold, x, y);
        x += this.textWidth(enemy.gold) + 6;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.currencyUnit, x, y);
      }
    }

    /**
     * ドロップアイテムを描画する
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} rewardsWidth 報酬欄の横幅
     */
    drawDropItems(x, y, rewardsWidth) {
      const enemy = this._enemy;
      const lineHeight = this.lineHeight();
      const displayDropRate = settings.displayDropRate || this._detailMode;
      enemy.dropItems.forEach((dropItems, index) => {
        if (dropItems.kind > 0) {
          const dropRateWidth = this.textWidth('0000000');
          if ($gameSystem.isInEnemyBookDrop(enemy, index)) {
            const item = Game_Enemy.prototype.itemObject(dropItems.kind, dropItems.dataId);
            this.drawItemName(item, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
            this.drawDropRate(dropItems.denominator, x, y, rewardsWidth);
          } else {
            this.changePaintOpacity(!settings.grayOutUnknown);
            if (settings.maskUnknownDropItem) {
              this.resetTextColor();
              this.drawText(settings.unknownData, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
            } else {
              const item = Game_Enemy.prototype.itemObject(dropItems.kind, dropItems.dataId);
              this.drawItemName(item, x, y, displayDropRate ? rewardsWidth - dropRateWidth : rewardsWidth);
            }
            this.drawDropRate(dropItems.denominator, x, y, rewardsWidth);
            this.changePaintOpacity(true);
          }
          y += lineHeight;
        }
      });
    }

    /**
     * ドロップ率を描画する
     * @param {number} denominator 確率
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 横幅
     */
    drawDropRate(denominator, x, y, width) {
      if ((!settings.displayDropRate && !this._detailMode) || !denominator) {
        return;
      }
      const dropRate = Number(100 / denominator).toFixed(1);
      this.drawText(`${dropRate}％`, x, y, width, 'right');
    }

    /**
     * 指定した属性の有効度を返す
     * @param {number} elementId 属性ID
     * @return {number}
     */
    elementRate(elementId) {
      return this._enemy.traits
        .filter((trait) => trait.code === Game_BattlerBase.TRAIT_ELEMENT_RATE && trait.dataId === elementId)
        .reduce((r, trait) => r * trait.value, 1);
    }

    /**
     * 指定したステートの有効度を返す
     * @param {number} stateId ステートID
     * @return {number}
     */
    stateRate(stateId) {
      const isNoEffect = this._enemy.traits.find(
        (trait) => trait.code === Game_BattlerBase.TRAIT_STATE_RESIST && trait.dataId === stateId
      );
      if (isNoEffect) {
        return 0;
      }
      return this._enemy.traits
        .filter((trait) => trait.code === Game_BattlerBase.TRAIT_STATE_RATE && trait.dataId === stateId)
        .reduce((r, trait) => r * trait.value, 1);
    }

    /**
     * 指定したステータスの弱体有効度を返す
     * @param {number} statusId ステータスID
     * @return {number}
     */
    debuffRate(statusId) {
      return (
        this._enemy.traits
          .filter((trait) => trait.code === Game_BattlerBase.TRAIT_DEBUFF_RATE && trait.dataId === statusId)
          .reduce((r, trait) => r * trait.value, 1) * 100
      );
    }

    maxIconsPerLine() {
      return settings.verticalLayout ? 16 : 8;
    }

    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 横幅
     */
    drawWeakElementsAndStates(x, y, width) {
      const targetIcons = $dataSystem.elements
        .map((_, index) => index)
        .filter((elementId) => this.elementRate(elementId) > 1)
        .map((elementId) => settings.elementIcons[elementId])
        .concat(
          $dataStates
            .filter((state) => state && this.stateRate(state.id) > 1 && !this.isExcludedWeakState(state.id))
            .map((state) => state.iconIndex)
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            return settings.displayDebuffStatus && this.debuffRate(index) > settings.debuffStatusThreshold.weak.large;
          }).map((statusName) => settings.debuffStatusIcons[statusName].large)
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            const debuffRate = this.debuffRate(index);
            return (
              settings.displayDebuffStatus &&
              debuffRate <= settings.debuffStatusThreshold.weak.large &&
              debuffRate > settings.debuffStatusThreshold.weak.small
            );
          }).map((statusName) => settings.debuffStatusIcons[statusName].small)
        );
      this.changeTextColor(this.systemColor());
      this.drawText(settings.weakElementAndStateLabel, x, y, width);

      const iconBaseY = y + this.lineHeight();
      targetIcons.forEach((icon, index) => {
        this.drawIcon(
          icon,
          x + 32 * (index % this.maxIconsPerLine()),
          iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine())
        );
      });
      this._weakLines = Math.floor(targetIcons.length / (this.maxIconsPerLine() + 1)) + 1;
    }

    /**
     * 弱点に表示しないステートかどうか
     * @param {number} stateId ステートID
     * @return {boolean}
     */
    isExcludedWeakState(stateId) {
      return settings.excludeWeakStates.includes(stateId);
    }

    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 横幅
     */
    drawResistElementsAndStates(x, y, width) {
      const targetIcons = $dataSystem.elements
        .map((_, index) => index)
        .filter((elementId) => {
          const elementRate = this.elementRate(elementId);
          return elementRate < 1 && (!settings.devideResistAndNoEffect || elementRate > 0);
        })
        .map((elementId) => settings.elementIcons[elementId])
        .concat(
          $dataStates
            .filter((state) => {
              if (!state) {
                return false;
              }
              const stateRate = this.stateRate(state.id);
              return (
                stateRate < 1 &&
                !this.isExcludedResistState(state.id) &&
                (!settings.devideResistAndNoEffect || stateRate > 0)
              );
            })
            .map((state) => state.iconIndex)
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            const debuffRate = this.debuffRate(index);
            return (
              settings.displayDebuffStatus &&
              debuffRate < settings.debuffStatusThreshold.resist.large &&
              (!settings.devideResistAndNoEffect || debuffRate > 0)
            );
          }).map((statusName) => settings.debuffStatusIcons[statusName].large)
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            const debuffRate = this.debuffRate(index);
            return (
              settings.displayDebuffStatus &&
              debuffRate >= settings.debuffStatusThreshold.resist.large &&
              debuffRate < settings.debuffStatusThreshold.resist.small
            );
          }).map((statusName) => settings.debuffStatusIcons[statusName].small)
        );
      this.changeTextColor(this.systemColor());
      this.drawText(settings.resistElementAndStateLabel, x, y, width);

      const iconBaseY = y + this.lineHeight();
      targetIcons.forEach((icon, index) => {
        this.drawIcon(
          icon,
          x + 32 * (index % this.maxIconsPerLine()),
          iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine())
        );
      });
      this._resistLines = Math.floor(targetIcons.length / (this.maxIconsPerLine() + 1)) + 1;
    }

    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} width 横幅
     */
    drawNoEffectElementsAndStates(x, y, width) {
      const targetIcons = $dataSystem.elements
        .map((_, index) => index)
        .filter((elementId) => this.elementRate(elementId) <= 0)
        .map((elementId) => settings.elementIcons[elementId])
        .concat(
          $dataStates
            .filter((state) => state && this.stateRate(state.id) <= 0 && !this.isExcludedResistState(state.id))
            .map((state) => state.iconIndex)
        )
        .concat(
          STATUS_NAMES.filter((_, index) => {
            return settings.displayDebuffStatus && this.debuffRate(index) <= 0;
          }).map((statusName) => settings.debuffStatusIcons[statusName].large)
        );
      this.changeTextColor(this.systemColor());
      this.drawText(settings.noEffectElementAndStateLabel, x, y, width);

      const iconBaseY = y + this.lineHeight();
      targetIcons.forEach((icon, index) => {
        this.drawIcon(
          icon,
          x + 32 * (index % this.maxIconsPerLine()),
          iconBaseY + 32 * Math.floor(index / this.maxIconsPerLine())
        );
      });
    }

    /**
     * 耐性リストに表示しないステートかどうか
     * @param {number} stateId ステートID
     * @return {boolean}
     */
    isExcludedResistState(stateId) {
      return settings.excludeResistStates.includes(stateId);
    }

    setDetailMode(mode) {
      const y = mode ? this.fittingHeight(1) * 2 : this.fittingHeight(1) + this.fittingHeight(4);
      this.y = y;
      this.height = Graphics.boxHeight - y;
      this._detailMode = mode;
      this.refresh();
    }
  }

  window[Window_EnemyBookStatus.name] = Window_EnemyBookStatus;

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    enemyBook = EnemyBook.initialBook();
  };

  const _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function () {
    _Game_System_onBeforeSave.call(this);
    this._enemyBook = enemyBook;
  };

  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function () {
    _Game_System_onAfterLoad.call(this);
    if (this._enemyBook) {
      enemyBook = this._enemyBook;
      if ($gameSystem.versionId() !== $dataSystem.versionId) {
        enemyBook.flexPage();
      }
    } else {
      enemyBook = EnemyBook.initialBook();
    }
  };

  Game_System.prototype.addToEnemyBook = function (enemyId) {
    enemyBook.register(enemyId);
  };

  Game_System.prototype.addDropItemToEnemyBook = function (enemyId, dropIndex) {
    enemyBook.registerDropItem(enemyId, dropIndex);
  };

  Game_System.prototype.removeFromEnemyBook = function (enemyId) {
    enemyBook.unregister(enemyId);
  };

  Game_System.prototype.completeEnemyBook = function () {
    enemyBook.complete();
  };

  Game_System.prototype.clearEnemyBook = function () {
    enemyBook.clear();
  };

  Game_System.prototype.isInEnemyBook = function (enemy) {
    return enemyBook.isRegistered(enemy);
  };

  Game_System.prototype.isInEnemyBookDrop = function (enemy, dropIndex) {
    return enemyBook.isDropItemRegistered(enemy, dropIndex);
  };

  Game_System.prototype.percentCompleteEnemy = function () {
    return enemyBook.percentRegisteredEnemy();
  };

  Game_System.prototype.percentCompleteDrop = function () {
    return enemyBook.percentRegisteredDropItem();
  };

  const _Game_Troop_setup = Game_Troop.prototype.setup;
  Game_Troop.prototype.setup = function (troopId) {
    _Game_Troop_setup.call(this, troopId);
    this.members().forEach(function (enemy) {
      if (enemy.isAppeared()) {
        $gameSystem.addToEnemyBook(enemy.enemyId());
      }
    }, this);
  };

  const _Game_Enemy_appear = Game_Enemy.prototype.appear;
  Game_Enemy.prototype.appear = function () {
    _Game_Enemy_appear.call(this);
    $gameSystem.addToEnemyBook(this._enemyId);
  };

  const _Game_Enemy_transform = Game_Enemy.prototype.transform;
  Game_Enemy.prototype.transform = function (enemyId) {
    _Game_Enemy_transform.call(this, enemyId);
    $gameSystem.addToEnemyBook(enemyId);
  };

  Game_Enemy.prototype.dropItemLots = function (dropItem) {
    return dropItem.kind > 0 && Math.random() * dropItem.denominator < this.dropItemRate();
  };

  /**
   * ドロップアイテムリスト生成メソッド 上書き
   */
  Game_Enemy.prototype.makeDropItems = function () {
    return this.enemy().dropItems.reduce((accumlator, dropItem, index) => {
      if (this.dropItemLots(dropItem)) {
        $gameSystem.addDropItemToEnemyBook(this.enemy().id, index);
        return accumlator.concat(this.itemObject(dropItem.kind, dropItem.dataId));
      } else {
        return accumlator;
      }
    }, []);
  };

  const _Scene_Battle_createWindowLayer = Scene_Battle.prototype.createWindowLayer;
  Scene_Battle.prototype.createWindowLayer = function () {
    _Scene_Battle_createWindowLayer.call(this);
    if (settings.enableInBattle) {
      this._enemyBookLayer = new WindowLayer();
      this.addChild(this._enemyBookLayer);
    }
  };

  const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function () {
    _Scene_Battle_createAllWindows.call(this);
    if (settings.enableInBattle) {
      this.createEnemyBookWindows();
    }
  };

  const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
  Scene_Battle.prototype.createPartyCommandWindow = function () {
    _Scene_Battle_createPartyCommandWindow.call(this);
    if (settings.enableInBattle) {
      this._partyCommandWindow.setHandler('enemyBook', this.openEnemyBook.bind(this));
    }
  };

  const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function () {
    _Scene_Battle_createActorCommandWindow.call(this);
    if (settings.enableInBattle) {
      this._actorCommandWindow.setHandler('enemyBook', this.openEnemyBook.bind(this));
    }
  };

  const _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
  Scene_Battle.prototype.isAnyInputWindowActive = function () {
    return (
      _Scene_Battle_isAnyInputWindowActive.call(this) || (settings.enableInBattle && this._enemyBookWindows.isActive())
    );
  };

  Scene_Battle.prototype.inputtingWindow = function () {
    return this.inputWindows().find((inputWindow) => inputWindow.active);
  };

  Scene_Battle.prototype.inputWindows = function () {
    return [
      this._partyCommandWindow,
      this._actorCommandWindow,
      this._skillWindow,
      this._itemWindow,
      this._actorWindow,
      this._enemyWindow,
      this._enemyBookWindows.indexWindow,
    ];
  };

  Scene_Battle.prototype.createEnemyBookWindows = function () {
    this._enemyBookWindows = new EnemyBookWindows(
      this.closeEnemyBook.bind(this),
      this._enemyBookLayer,
      Scene_EnemyBook.prototype.percentWindowRect.call(this),
      Scene_EnemyBook.prototype.indexWindowRect.call(this),
      Scene_EnemyBook.prototype.statusWindowRect.call(this)
    );
    this.closeEnemyBook();
  };

  Scene_Battle.prototype.percentWindowHeight = function () {
    return Scene_EnemyBook.prototype.percentWindowHeight.call(this);
  };

  Scene_Battle.prototype.indexWindowWidth = function () {
    return Scene_EnemyBook.prototype.indexWindowWidth.call(this);
  };

  Scene_Battle.prototype.indexWindowHeight = function () {
    return Scene_EnemyBook.prototype.indexWindowHeight.call(this);
  };

  Scene_Battle.prototype.closeEnemyBook = function () {
    this._enemyBookWindows.close();
    if (this._returnFromEnemyBook) {
      this._returnFromEnemyBook.activate();
      this._returnFromEnemyBook = null;
    }
  };

  Scene_Battle.prototype.openEnemyBook = function () {
    this._returnFromEnemyBook = this.inputtingWindow();
    if (this._returnFromEnemyBook) {
      this._returnFromEnemyBook.deactivate();
    }
    this._enemyBookWindows.open();
  };

  const _Window_PartyCommand_processHandling = Window_PartyCommand.prototype.processHandling;
  Window_PartyCommand.prototype.processHandling = function () {
    _Window_PartyCommand_processHandling.call(this);
    if (this.isOpenAndActive()) {
      if (Input.isTriggered(settings.openKeyInBattle)) {
        this.processEnemyBook();
      }
    }
  };

  const _Window_ActorCommand_processHandling = Window_ActorCommand.prototype.processHandling;
  Window_ActorCommand.prototype.processHandling = function () {
    _Window_ActorCommand_processHandling.call(this);
    if (this.isOpenAndActive()) {
      if (Input.isTriggered(settings.openKeyInBattle)) {
        this.processEnemyBook();
      }
    }
  };

  Window_Command.prototype.processEnemyBook = function () {
    SoundManager.playCursor();
    this.updateInputData();
    this.callHandler('enemyBook');
  };
})();