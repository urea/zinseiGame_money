// script.js
document.addEventListener('DOMContentLoaded', () => {
    const playerSelect = document.getElementById('playerSelect');
    const amountInput = document.getElementById('amountInput');
    const okButton = document.getElementById('okButton');
    const historyTableBody = document.querySelector('#historyTable tbody');
    const playerBalanceArea = document.getElementById('players');
    const playerNumberSelect = document.getElementById('playerNumberSelect');
    const playerNameInputs = document.getElementById('playerNameInputs');
    const playerNumberLabel = document.querySelector('label[for="playerNumberSelect"]');
    //リセットボタン作成
    const resetButton = document.createElement('button');
    resetButton.textContent = 'リセット';
    resetButton.id = 'resetButton';
    document.body.insertBefore(resetButton, document.body.firstChild);

    //プレイヤー名入力欄の要素を取得
    const playerNameInputFields = document.querySelectorAll('.playerNameInput');
    //プレイヤー入力エリア
    const playerInputAreas = {
        '2': [document.getElementById('player1InputArea'), document.getElementById('player2InputArea')],
        '3': [document.getElementById('player1InputArea'), document.getElementById('player2InputArea'), document.getElementById('player3InputArea')],
        '4': [document.getElementById('player1InputArea'), document.getElementById('player2InputArea'), document.getElementById('player3InputArea'), document.getElementById('player4InputArea')],
        '5': [document.getElementById('player1InputArea'), document.getElementById('player2InputArea'), document.getElementById('player3InputArea'), document.getElementById('player4InputArea'), document.getElementById('player5InputArea')],
    };

    playerSelect.style.display = 'none';

    let numberOfPlayers = 2;
    let playerBalances = {};
    let history = [];
    let historyCount = 0;
    let selectedPlayer = 1;
    let playerNames = {};
    const defaultPlayerNames = {
        1: "プレイヤー1",
        2: "プレイヤー2",
        3: "プレイヤー3",
        4: "プレイヤー4",
        5: "プレイヤー5"
    };
    let isHistoryCreated = false;

    // ローカルストレージからデータを読み込む
    function loadDataFromLocalStorage() {
        const storedData = localStorage.getItem('gameData');
        if (storedData) {
            const data = JSON.parse(storedData);
            numberOfPlayers = data.numberOfPlayers;
            playerBalances = data.playerBalances;
            history = data.history;
            historyCount = data.historyCount;
            selectedPlayer = data.selectedPlayer;
            playerNames = data.playerNames;
            isHistoryCreated = data.isHistoryCreated;
        } else {
            // ローカルストレージにデータがない場合、playerNamesをデフォルト値で初期化
            for (let i = 1; i <= 5; i++) {
                playerNames[i] = defaultPlayerNames[i];
            }
        }
    }

    // ローカルストレージにデータを保存する
    function saveDataToLocalStorage() {
        const data = {
            numberOfPlayers: numberOfPlayers,
            playerBalances: playerBalances,
            history: history,
            historyCount: historyCount,
            selectedPlayer: selectedPlayer,
            playerNames: playerNames,
            isHistoryCreated: isHistoryCreated,
        };
        localStorage.setItem('gameData', JSON.stringify(data));
    }
    //初期化処理
    function resetGameData() {
        // 確認メッセージを表示
        if (confirm('本当にリセットしますか？')) {
            localStorage.removeItem('gameData');
            numberOfPlayers = 2;
            playerBalances = {};
            history = [];
            historyCount = 0;
            selectedPlayer = 1;
            playerNames = {};
            isHistoryCreated = false;

            // デフォルトのプレイヤー名を再設定
            for (let i = 1; i <= 5; i++) {
                playerNames[i] = defaultPlayerNames[i];
            }
            createPlayerBalanceDivs();
            updateHistoryTable();
            hideShowPlayerNameInputs(numberOfPlayers); //追加

            // プレイヤー人数のセレクトボックスを「2」に設定
            playerNumberSelect.value = "2";
        }
    }

    function toggleInitialSettingsVisibility() {
        if (isHistoryCreated) {
            playerNumberSelect.style.display = 'none';
            playerNumberLabel.style.display = 'none';
            playerNameInputs.style.display = 'none';
        } else {
            playerNumberSelect.style.display = 'block';
            playerNumberLabel.style.display = 'block';
            playerNameInputs.style.display = 'block';
        }
    }
    //プレイヤー名入力欄の表示・非表示
    function hideShowPlayerNameInputs(playerNumber) {
        for (const key in playerInputAreas) {
            playerInputAreas[key].forEach(area => {
                area.hidden = true;
            });
        }
        playerInputAreas[playerNumber].forEach(area => {
            area.hidden = false;
        });
    }

    function createPlayerBalanceDivs() {
        playerBalanceArea.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const playerBalanceDiv = document.createElement('div');
            playerBalanceDiv.classList.add('player');
            playerBalanceDiv.id = `player${i}`;
            playerBalanceDiv.textContent = `${playerNames[i] || defaultPlayerNames[i]}: ${playerBalances[i] || 0}`;
            playerBalanceDiv.dataset.playerNumber = i;
            playerBalanceArea.appendChild(playerBalanceDiv);

            playerBalanceDiv.addEventListener('click', () => {
                const playerNumber = playerBalanceDiv.dataset.playerNumber;
                amountInput.value = playerBalances[playerNumber] || 0;
                if (parseInt(playerNumber) > numberOfPlayers) {
                    selectedPlayer = null;
                }
                const selectedDivs = document.querySelectorAll('.player.selected');
                selectedDivs.forEach(div => div.classList.remove('selected'));
                const selectPlayerDiv = document.getElementById(`player${playerNumber}`);
                if (selectPlayerDiv) {
                    selectPlayerDiv.classList.add('selected');
                    selectedPlayer = parseInt(playerNumber);
                }
            });

            if (!(i in playerBalances)) {
                playerBalances[i] = 0;
            }
            if (i > numberOfPlayers) {
                playerBalanceDiv.style.display = 'none';
            } else {
                playerBalanceDiv.style.display = 'block';
            }
        }

        const player1Div = document.getElementById('player1');
        if (player1Div) {
            player1Div.classList.add('selected');
        }
        toggleInitialSettingsVisibility();
        // ローカルストレージに保存
        saveDataToLocalStorage();
    }

    playerNumberSelect.addEventListener('change', () => {
        numberOfPlayers = parseInt(playerNumberSelect.value);
        createPlayerBalanceDivs();
        hideShowPlayerNameInputs(numberOfPlayers); //追加
    });
    // 初期化処理
    // ローカルストレージからデータを読み込む
    loadDataFromLocalStorage();
    // 初期表示
    createPlayerBalanceDivs();
    //履歴の更新処理
    updateHistoryTable();
    //初期化
    hideShowPlayerNameInputs(numberOfPlayers);

    amountInput.addEventListener('focus', () => {
        amountInput.value = "";
    });

    // 各入力欄に対してイベントリスナーを設定
    playerNameInputFields.forEach(input => {
        input.addEventListener('focus', (event) => {
            // フォーカスされたときに全選択状態にする
            event.target.select();
        });
    });

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

    amountInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            okButton.click();
        }
    });

    okButton.addEventListener('click', () => {
        let amount;
        if (amountInput.value === "") {
            amountInput.value = "";
            return;
        } else {
            amount = parseInt(amountInput.value);
        }

        if (amount === 0) {
            amountInput.value = "";
            return;
        }

        if (selectedPlayer === null) {
            alert("プレイヤーを選択してください。");
            return;
        }

        playerBalances[selectedPlayer] += amount;
        const playerBalanceDiv = document.getElementById(`player${selectedPlayer}`);
        playerBalanceDiv.textContent = `${playerNames[selectedPlayer]}: ${playerBalances[selectedPlayer]}`;

        historyCount++;
        history.push({
            no: historyCount,
            player: `${playerNames[selectedPlayer]}`,
            amount: amount
        });
        isHistoryCreated = true;
        updateHistoryTable();

        const selectedDivs = document.querySelectorAll('.player.selected');
        selectedDivs.forEach(div => div.classList.remove('selected'));

        selectedPlayer++;
        if (selectedPlayer > numberOfPlayers) {
            selectedPlayer = 1;
        }

        const nextPlayerDiv = document.getElementById(`player${selectedPlayer}`);
        if (nextPlayerDiv) {
            nextPlayerDiv.classList.add('selected');
            amountInput.value = "";
            amountInput.focus();
        }
        // ローカルストレージに保存
        saveDataToLocalStorage();
    });

    function updateHistoryTable() {
        historyTableBody.innerHTML = '';
        const reversedHistory = [...history].reverse();
        reversedHistory.forEach((item, index) => {
            const row = historyTableBody.insertRow();
            const noCell = row.insertCell();
            const nameCell = row.insertCell();
            const moneyCell = row.insertCell();
            const deleteCell = row.insertCell();
            noCell.textContent = item.no;
            nameCell.textContent = item.player;
            moneyCell.textContent = item.amount;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.addEventListener('click', () => {
                const rowIndex = history.findIndex(h => h.no === item.no);
                if (rowIndex !== -1) {
                    const deletedHistory = history[rowIndex];
                    const deletedPlayer = Object.keys(playerNames).find(key => playerNames[key] === deletedHistory.player);
                    const deletedAmount = deletedHistory.amount;
                    playerBalances[deletedPlayer] -= deletedAmount;
                    const playerBalanceDiv = document.getElementById(`player${deletedPlayer}`);
                    playerBalanceDiv.textContent = `${playerNames[deletedPlayer]}: ${playerBalances[deletedPlayer]}`;
                    history.splice(rowIndex, 1);
                    updateHistoryTable();
                    if (history.length === 0) {
                        isHistoryCreated = false;
                    }
                    toggleInitialSettingsVisibility();
                    // ローカルストレージに保存
                    saveDataToLocalStorage();
                }
            });
            deleteCell.appendChild(deleteButton);
            toggleInitialSettingsVisibility();
        });
        toggleInitialSettingsVisibility();
        // ローカルストレージに保存
        saveDataToLocalStorage();
    }
    playerBalanceArea.addEventListener('click', (event) => {
        const clickedPlayerDiv = event.target.closest('.player');
        if (clickedPlayerDiv) {
            const selectedDivs = document.querySelectorAll('.player.selected');
            selectedDivs.forEach(div => div.classList.remove('selected'));
            clickedPlayerDiv.classList.add('selected');
            amountInput.focus();
            selectedPlayer = parseInt(clickedPlayerDiv.dataset.playerNumber);
            // ローカルストレージに保存
            saveDataToLocalStorage();
        }
    });
    // リセットボタンのイベントリスナー
    resetButton.addEventListener('click', () => {
        resetGameData();
    });
});
