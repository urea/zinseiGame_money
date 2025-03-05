// script.js
document.addEventListener('DOMContentLoaded', () => {
    const playerSelect = document.getElementById('playerSelect');
    const amountInput = document.getElementById('amountInput');
    const okButton = document.getElementById('okButton');
    const historyTableBody = document.querySelector('#historyTable tbody');
    const playerBalanceArea = document.getElementById('players');
    const playerNumberSelect = document.getElementById('playerNumberSelect'); // 人数選択用の要素を取得
    const playerNameInputs = document.getElementById('playerNameInputs'); // プレイヤー名入力欄を囲む要素
    const playerNumberLabel = document.querySelector('label[for="playerNumberSelect"]'); // ★ 追加: 人数選択欄のラベル要素を取得

    // プルダウンを非表示にする
    playerSelect.style.display = 'none';

    // デフォルトのプレイヤー人数
    let numberOfPlayers = 2;

    let playerBalances = {}; // プレイヤーの残高を格納するオブジェクト
    let history = [];
    let historyCount = 0;
    let selectedPlayer = 1; // 選択中のプレイヤーを保持,初期値は1に変更
    // プレイヤー名を管理する配列
    let playerNames = {};
    // デフォルトのプレイヤー名
    const defaultPlayerNames = {
        1: "プレイヤー1",
        2: "プレイヤー2",
        3: "プレイヤー3",
        4: "プレイヤー4",
        5: "プレイヤー5"
    };
    //履歴が追加されたかどうかのフラグを追加
    let isHistoryCreated = false;
    // 初期表示の非表示制御を行う関数
    function toggleInitialSettingsVisibility() {
        //履歴が追加されたかのフラグによって表示、非表示を制御する。
        if (isHistoryCreated) {
            playerNumberSelect.style.display = 'none'; // 人数選択欄を非表示
            playerNumberLabel.style.display = 'none'; // ★ 追加: 人数選択欄のラベルを非表示
            playerNameInputs.style.display = 'none'; // プレイヤー名入力欄を非表示
        } else {
            playerNumberSelect.style.display = 'block'; // 人数選択欄を表示
            playerNumberLabel.style.display = 'block'; // ★ 追加: 人数選択欄のラベルを表示
            playerNameInputs.style.display = 'block'; // プレイヤー名入力欄を表示
        }
    }

    // プレイヤー人数に応じたプレイヤー要素を作成する関数
    function createPlayerBalanceDivs() {
        // 既存のプレイヤー要素を削除
        playerBalanceArea.innerHTML = '';

        // プレイヤー要素を作成
        for (let i = 1; i <= 5; i++) {
            const playerBalanceDiv = document.createElement('div');
            playerBalanceDiv.classList.add('player');
            playerBalanceDiv.id = `player${i}`;
            // playerBalanceDiv.textContent = `プレイヤー${i}: ${playerBalances[i] || 0}`;
            // プレイヤー名をセットする処理を追加
            playerBalanceDiv.textContent = `${playerNames[i] || defaultPlayerNames[i]}: ${playerBalances[i] || 0}`;
            playerBalanceDiv.dataset.playerNumber = i;
            playerBalanceArea.appendChild(playerBalanceDiv);

            playerBalanceDiv.addEventListener('click', () => {
                const playerNumber = playerBalanceDiv.dataset.playerNumber;
                amountInput.value = playerBalances[playerNumber] || 0;

                // 現在選択されているプレイヤーが人数を超えた場合、選択をリセットする
                if (parseInt(playerNumber) > numberOfPlayers) {
                    selectedPlayer = null;
                }
                // 選択状態をリセットする
                const selectedDivs = document.querySelectorAll('.player.selected');
                selectedDivs.forEach(div => div.classList.remove('selected'));
                //選択したプレイヤーを再選択する
                const selectPlayerDiv = document.getElementById(`player${playerNumber}`);
                if (selectPlayerDiv) {
                    selectPlayerDiv.classList.add('selected');
                    //選択中のプレイヤーを変更する
                    selectedPlayer = parseInt(playerNumber);
                }
            });

            // プレイヤー残高が初期化されていない場合は初期化
            if (!(i in playerBalances)) {
                playerBalances[i] = 0;
            }
            // プレイヤーが選択人数より大きいときは非表示にする
            if (i > numberOfPlayers) {
                playerBalanceDiv.style.display = 'none';
            } else {
                playerBalanceDiv.style.display = 'block';
            }
        }

        // デフォルトでプレイヤー1を選択
        const player1Div = document.getElementById('player1');
        if (player1Div) {
            player1Div.classList.add('selected');
            // selectedPlayer = "1"; // 選択中のプレイヤーを1に設定,削除
        }
        toggleInitialSettingsVisibility();
    }

    // 人数を変更する処理
    playerNumberSelect.addEventListener('change', () => {
        numberOfPlayers = parseInt(playerNumberSelect.value);
        createPlayerBalanceDivs();
    });

    // 初期化
    // プレイヤー名を初期化する処理を追加
    for (let i = 1; i <= 5; i++) {
        playerNames[i] = defaultPlayerNames[i];
    }
    createPlayerBalanceDivs();

    // 金額入力欄にフォーカスが当たったときに0を消す処理を追加
    amountInput.addEventListener('focus', () => {
        amountInput.value = "";
    });
    // プレイヤー名が変更されたときに合計欄を更新する処理
    playerNameInputs.addEventListener('input', (event) => {
        const target = event.target;
        if (target.classList.contains('playerNameInput')) {
            const playerNumber = target.id.replace('playerName', '');
            const playerBalanceDiv = document.getElementById(`player${playerNumber}`);
            if (playerBalanceDiv) {
                playerNames[playerNumber] = target.value;
                playerBalanceDiv.textContent = `${playerNames[playerNumber]}: ${playerBalances[playerNumber] || 0}`;
            }
        }
    });

    // 金額入力欄でEnterが押されたときにOKボタンの処理を実行
    amountInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            okButton.click();
        }
    });

    okButton.addEventListener('click', () => {
        // 金額入力欄が空の場合、0に設定
        // let amount = 0;
        //if (amountInput.value !== "") {
        //    amount = parseInt(amountInput.value);
        //}
        // parseIntを行う
        let amount;
        if (amountInput.value === "") {
            amountInput.value = "";
            return; // この時点で関数を抜ける
        } else {
            amount = parseInt(amountInput.value);
        }

        // 入力された金額が0の場合、未入力の場合処理を中断
        if (amount === 0) {
            amountInput.value = "";
            return; // この時点で関数を抜ける
        }

        if (selectedPlayer === null) {
            alert("プレイヤーを選択してください。");
            return;
        }
        // プレイヤー名の保存　：　プレイヤーが変更されたタイミングで、変更するようにしたので、不要となりました。
        // const playerNameInput = document.getElementById(`playerName${selectedPlayer}`);
        // if (playerNameInput) {
        //     playerNames[selectedPlayer] = playerNameInput.value;
        //     //プレイヤー名欄が変更されたので、表示を修正する。
        //     const playerBalanceDiv = document.getElementById(`player${selectedPlayer}`);
        //     playerBalanceDiv.textContent = `${playerNames[selectedPlayer]}: ${playerBalances[selectedPlayer]}`;
        // }


        playerBalances[selectedPlayer] += amount;
        const playerBalanceDiv = document.getElementById(`player${selectedPlayer}`);
        playerBalanceDiv.textContent = `${playerNames[selectedPlayer]}: ${playerBalances[selectedPlayer]}`;

        historyCount++;
        history.push({
            no: historyCount,
            player: `${playerNames[selectedPlayer]}`,//履歴テーブルに保存する内容を変更
            amount: amount
        });
        //履歴が作成されたかどうか判定する
        isHistoryCreated = true;
        updateHistoryTable();

        // 選択状態をリセットする
        const selectedDivs = document.querySelectorAll('.player.selected');
        selectedDivs.forEach(div => div.classList.remove('selected'));

        // 次のプレイヤーを選択する
        selectedPlayer++; // 次のプレイヤーへ
        if (selectedPlayer > numberOfPlayers) {
            selectedPlayer = 1; // 最初のプレイヤーに戻る
        }

        // 次のプレイヤーを選択状態にする
        const nextPlayerDiv = document.getElementById(`player${selectedPlayer}`);
        if (nextPlayerDiv) {
            nextPlayerDiv.classList.add('selected');
            amountInput.value = ""; //金額入力欄を空にする
            amountInput.focus(); // 金額入力欄にフォーカスを当てる
        }
    });

    function updateHistoryTable() {
        historyTableBody.innerHTML = ''; // テーブルをクリア
        const reversedHistory = [...history].reverse(); // 降順にソート

        reversedHistory.forEach((item, index) => {
            const row = historyTableBody.insertRow();
            const noCell = row.insertCell();
            const nameCell = row.insertCell();
            const moneyCell = row.insertCell();
            const deleteCell = row.insertCell(); // 削除ボタン用のセルを追加

            noCell.textContent = item.no;
            nameCell.textContent = item.player;//履歴の表示する内容を変更
            moneyCell.textContent = item.amount;

            // 削除ボタンを作成
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            // 削除ボタンがクリックされた時の処理
            deleteButton.addEventListener('click', () => {
                const rowIndex = history.findIndex(h => h.no === item.no);
                if (rowIndex !== -1) {
                    // 削除する履歴の情報を取得
                    const deletedHistory = history[rowIndex];
                    // const deletedPlayer = deletedHistory.player.replace('プレイヤー', ''); // "プレイヤー1" -> "1" //削除
                    const deletedPlayer = Object.keys(playerNames).find(key => playerNames[key] === deletedHistory.player);

                    const deletedAmount = deletedHistory.amount;

                    // 合計金額から削除する
                    playerBalances[deletedPlayer] -= deletedAmount;
                    // 削除するプレイヤーの合計金額欄を更新する。
                    const playerBalanceDiv = document.getElementById(`player${deletedPlayer}`);
                    playerBalanceDiv.textContent = `${playerNames[deletedPlayer]}: ${playerBalances[deletedPlayer]}`;
                    history.splice(rowIndex, 1); // 配列から削除
                    updateHistoryTable(); // テーブルを更新
                    //履歴が削除されたので、フラグをfalseに変更する
                    if (history.length === 0) {
                        isHistoryCreated = false;
                    }
                    toggleInitialSettingsVisibility();
                }
            });
            deleteCell.appendChild(deleteButton);
            toggleInitialSettingsVisibility();
        });
        //初期表示
        toggleInitialSettingsVisibility();
    }

    // プレイヤーの合計欄がクリックされたときの処理
    playerBalanceArea.addEventListener('click', (event) => {
        const clickedPlayerDiv = event.target.closest('.player');
        if (clickedPlayerDiv) {
            // 選択状態をリセットする
            const selectedDivs = document.querySelectorAll('.player.selected');
            selectedDivs.forEach(div => div.classList.remove('selected'));

            // クリックされた要素に選択状態のクラスを追加
            clickedPlayerDiv.classList.add('selected');

            // 金額入力欄にフォーカスを移動する
            amountInput.focus();
            //選択中のプレイヤーを変更する
            selectedPlayer = parseInt(clickedPlayerDiv.dataset.playerNumber);
        }
    });

});
