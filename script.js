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
    }

    playerNumberSelect.addEventListener('change', () => {
        numberOfPlayers = parseInt(playerNumberSelect.value);
        createPlayerBalanceDivs();
    });
    for (let i = 1; i <= 5; i++) {
        playerNames[i] = defaultPlayerNames[i];
    }
    createPlayerBalanceDivs();

    amountInput.addEventListener('focus', () => {
        amountInput.value = "";
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
                }
            });
            deleteCell.appendChild(deleteButton);
            toggleInitialSettingsVisibility();
        });
        toggleInitialSettingsVisibility();
    }
    playerBalanceArea.addEventListener('click', (event) => {
        const clickedPlayerDiv = event.target.closest('.player');
        if (clickedPlayerDiv) {
            const selectedDivs = document.querySelectorAll('.player.selected');
            selectedDivs.forEach(div => div.classList.remove('selected'));
            clickedPlayerDiv.classList.add('selected');
            amountInput.focus();
            selectedPlayer = parseInt(clickedPlayerDiv.dataset.playerNumber);
        }
    });
});
