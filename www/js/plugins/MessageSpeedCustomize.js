//============================================= ============================
// MessageSpeedCustomize.js
// ------------------------------------------------ ----------------------------
// (C)2016 トリアコンタン
// このソフトウェアは MIT ライセンスの下でリリースされています。
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------ ----------------------------
// バージョン
// 1.3.0 2019/12/27 瞬間表示の利用可否をゲーム中にスイッチ変更できるようにしました
// 1.2.3 2018/11/28 BugFixWaitOfTextEnd.jsと組み合わせたとき、収集の動作がおかしな問題を修正
// 1.2.2 2018/07/22 瞬間表示機能が有効なとき、\!を使用すると以後のメッセージまで瞬間表示されてしまう問題を修正
// 1.2.1 2017/12/30 パラメータの型指定機能に対応し、ヘルプの記述を修正
// 1.2.0 2016/11/05 ノベルゲーム総合プラグインから、メッセージ表示速度を調整する制御文字を流用
// 1.1.2 2016/07/24複数行「\>」が指定している場合もデフォルトと同じ動作をするよう修正
// 1.1.1 2016/07/23 制御文字「\>\<」が指定されている場合、好きを優先するよう修正
// 1.1.0 2016/07/12 文章の表示中に決定キーまたは左クリックで文章を瞬間表示する機能を追加
// 1.0.0 2016/04/12 初版
// ------------------------------------------------ ----------------------------
// [ブログ] : https://triacontane.blogspot.jp/
// [ツイッター]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//============================================= ============================

/*:
 * @plugindesc メッセージ速度のカスタマイズ
 * @author トリアコンタン
 *
 * @param VariableSpeed
 * @desc メッセージ速度の変数番号
 * @デフォルト 1
 * @型変数
 *
 * @param RapidShowSwitch
 * @desc トリガーされた場合の高速表示 (ON/OFF)
 * @デフォルト 0
 * @type スイッチ
 *
 * @help メッセージ速度のカスタマイズ
 * 0 : 高速
 * 1 : 通常
 * 2... : ゆっくり
 *
 * このプラグインは MIT ライセンスの下でリリースされています。
 */
/*:ジャ
 * @plugindesc メッセージ速度調整プラグイン
 * @author トリアコンタン
 *
 * @param 表示速度変数
 * @desc メッセージ表示速度を格納する変数の番号
 * @デフォルト 1
 * @型変数
 *
 * @param 瞬間表示スイッチ
 * @desc 指定した番号のスイッチがONになっているとき、文章の表示中に決定ボタンや左クリックで文章を瞬時に表示します。
 * @デフォルト 0
 * @type スイッチ
 *
 * @help メッセージ表示速度を調整します。
 * パラメータで指定した番号の変数に対して以下の値を代入してください。
 * 0 : 瞬間表示
 * 1 : 通常と同様の表示速度
 ※2以上：指定したフレーム間隔で一文字を表示します。
 *
 * ※ パラメータで指定するのは表示速度自体ではなく
 * 表示速度を取得する変数の値です。
 * 変数値が大きければ少ないほどゆっくりと表示されます。
 *
 * ※ 公開中の「オプション任意項目作成プラグイン」と組み合わせれば
 * 対象の変数をオプション画面から操作できます。
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CustomizeConfigItem.js
 *
 * 制御文字「\ms[n]」を利用すると、そのメッセージ中のみ表示速度を
 * 任意の値に設定することができます。一時的にメッセージ表示速度を変更したい場合に
 *有効です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 * 作者に不正で転、再配布が可能で、利用形態（商用、18禁利用等）
 * についても制限はありません。
 * このプラグインはもうあなたのものです。
 */

（関数 （） {
    「厳密に使用する」;
    var pluginName = 'MessageSpeedCustomize';

    var getParamNumber = function(paramNames, min, max) {
        変数値 = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = 無限大;
        (parseInt(value, 10) || 0).clamp(min, max); を返します。
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            変数名 = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) は名前を返します。
        }
        ヌルを返します。
    };

    //============================================= ============================
    // パラメータの取得と整形
    //============================================= ============================
    var paramVariableSpeed = getParamNumber(['VariableSpeed', '表示速度変数'], 1, 5000);
    var paramRapidShowSwitch = getParamNumber(['RapidShowSwitch', '瞬間表示スイッチ'], 1, 5000);

    //============================================= ============================
    // ウィンドウ_メッセージ
    // メッセージの表示間隔を調整します。
    //============================================= ============================
    var _Window_Message_clearFlags = Window_Message.prototype.clearFlags;
    Window_Message.prototype.clearFlags = function() {
        _Window_Message_clearFlags.apply(これ、引数);
        this._tempMessageSpeed = null;
        this._showAll = false;
    };

    var _Window_Message_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if ($gameSwitches.value(paramRapidShowSwitch) && this._textState &&
            this.isTriggered() && !this.pause) {
            this._showAll = true;
        }
        return _Window_Message_updateWait.apply(this, arguments);
    };

    var _Window_Message_updateMessage = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        var speed = this.getMessageSpeed();
        if (this._textState && !this._lineShowFast) {
            if (速度 <= 0 || this._showAll) {
                this._showFast = true;
            } 他の場合 (!this.isEndOfText(this._textState)) {
                this._waitCount = 速度 - 1;
            }
        }
        return _Window_Message_updateMessage.apply(this, arguments);
    };

    var _Window_Message_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(これ、引数);
        this._showAll = false;
    };

    Window_Message.prototype.getMessageSpeed = function() {
        this._tempMessageSpeed を返す !== null ? this._tempMessageSpeed : $gameVariables.value(paramVariableSpeed);
    };

    Window_Message.prototype.setTempMessageSpeed = function(speed) {
        if (速度 >= 0) {
            this._tempMessageSpeed = 速度;
            if (速度 > 0) this._showFast = false;
        } そうしないと {
            this._tempMessageSpeed = null;
        }
    };

    var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (コード === '>') this._waitCount = 0;
        スイッチ (コード) {
            ケース「MS」:
                this.setTempMessageSpeed(this.obtainEscapeParam(textState));
                ブレーク;
            デフォルト：
                _Window_Message_processEscapeCharacter.apply(これ、引数);
        }
    };
})();
