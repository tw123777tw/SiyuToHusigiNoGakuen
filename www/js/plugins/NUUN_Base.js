/*:----------------------------------------------- ------------------------------------
 * NUUN_Base.js
 * 
 ※ Copyright (C) 2020 ヌンヌン
 ※本ソフトウェアはMIT Licenseで公開されています。
 * http://opensource.org/licenses/mit-license.php
 * ------------------------------------------------- ------------------------------------
 * 
 */ 
/*:
 * @ターゲットMZ
 * @plugindesc 共通処理
 * @author ヌウン
 * @バージョン 1.1.4
 * 
 * @助けて
 * 共通処理を行うベースプラグインです。
 * プラグインリストの上に配置してください。
 * 
 * 利用規約
 * このプラグインはMITライセンスで配布されています。
 * 
 * 更新履歴
 ※2021/5/15 Ver.1.1.4
 * ウィンドウスキンをウィンドウごとに設定できる処理を追加。
 ※2021/5/8 Ver.1.1.3
 * 処理を一部修正。
 ※2021/5/7 Ver.1.1.2
 * 構造体の取得処理を追加。
 ※2021/4/23 Ver.1.1.1
 * 画像の今指定の処理を追加。
 ※2021/3/14 Ver.1.1.0
 * 画像の今指定の処理を追加。
 ※2020/12/31 Ver.1.0.0
 *初版
 * 
 */
var インポート済み = インポート済み || {};
Imported.NUUN_Base = true;
const NUUN_Base_Ver = 114;

(() => {
const パラメータ = PluginManager.parameters('NUUN_Base');

関数 structureData(params) {
  JSON.parse(JSON.stringify(params, function(key, value)) を返す {
    {
        JSON.parse(値)を返す;
    } キャッチ (e) {
        {
            eval(値)を返す;
        } キャッチ (e) {
            戻り値;
        }
    }
  }));
}

DataManager.nuun_structureData = function(params){
  パラメータを返す ? 構造データ（パラメータ）：[];
};

const _Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
Scene_Boot.prototype.onDatabaseLoaded = function() {
  _Scene_Boot_onDatabaseLoaded.call(this);
  DataManager.nuun_Data();
};

DataManager.nuun_Data = function(){
  DataManager.nuun_DataObject($dataActors, 1);
  DataManager.nuun_DataObject($dataEnemies, 7);
};

DataManager.nuun_DataObject = 関数 (オブジェクト、コード){
  for(let i = 1; i <= object.length; i++){
    if (object[i]) {
      if(コード=== 1) {
        DataManager.nuun_loadDataActors(object[i]);
      } 他の場合 (コード === 7) {
        DataManager.nuun_loadDataEnemies(object[i]);
      }
    }
  }
};

DataManager.nuun_loadDataActors = function(deta){
};

DataManager.nuun_loadDataEnemies = function(deta){
};

ImageManager.nuun_backGround = 関数 (ファイル名) {
  this.loadBitmap("img/nuun_background/", ファイル名)を返す;
};

ImageManager.nuun_actorPictures = 関数 (ファイル名) {
  return this.loadBitmap("img/nuun_actorpictures/", ファイル名);
};

ImageManager.nuun_LoadPictures = 関数 (ファイル名) {
  this.loadBitmap("img/", filename)を返す;
};

const _Window_Selectable_drawItemBackground = Window_Selectable.prototype.drawItemBackground;
Window_Selectable.prototype.drawItemBackground = function(index) {
  if (!this._contentsBackVisible) {
    _Window_Selectable_drawItemBackground.call(this, index);
  }
};

const _Window_Base_initialize = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(rect) {
  _Window_Base_initialize.call(this, rect);
  this._userWindowSkin = null;
};

const _Window_Base_loadWindowskin = Window_Base.prototype.loadWindowskin;
Window_Base.prototype.loadWindowskin = function() {
  if (this._userWindowSkin) {
    this.windowskin = ImageManager.loadSystem(this._userWindowSkin);
  } そうしないと {
    _Window_Base_loadWindowskin.call(this);
  } 
};

})();