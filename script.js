const $ = (selector) => { return document.querySelectorAll(selector); }

let playerNum = 0;
const chipState = {};

let firstPlayer = 1;
let actionNum = -1;
let maxBedMoney = 200;

const foldPlayerList = [];

function createTable(num, money) {
  for (let i=0;i<num; i++) {
    chipState[i+1] = {'hand': money, 'table': 0}
  }
  chipState[1]['hand'] = money - 100;
  chipState[2]['hand'] = money - 200;
  chipState[1]['table'] = 100;
  chipState[2]['table'] = 200;

  resetTable();
}

function resetTable() {
  console.log(chipState);
  console.log(Object.keys(chipState).length);
  for (let i=0; i<playerNum; i++) {
    const targetCell = $('.chip_table')[Math.trunc(i / 5)].querySelectorAll('tr')[i % 5 + 1];
    targetCell.querySelectorAll('td > p')[0].innerText = Object.keys(chipState)[i];
    targetCell.querySelectorAll('td > p')[1].innerText = chipState[i+1]['hand'];
    targetCell.querySelectorAll('td > p')[2].innerText = chipState[i+1]['table'];
  }

  actionNum += 1;
  while (1){
    const playerIndex = (firstPlayer + actionNum - 1) % playerNum + 1;
    if (foldPlayerList.indexOf(playerIndex) >= 0) {
      actionNum += 1;
    } else {
      break;
    }
  }
}

$('.call_btn')[0].addEventListener('click' , () => {
  const playerIndex = (firstPlayer + actionNum - 1) % playerNum + 1;
  console.log(playerIndex);
  if (chipState[playerIndex]['table'] < maxBedMoney) {
    const defMoney = maxBedMoney - chipState[playerIndex]['table'];
    chipState[playerIndex]['hand'] -= defMoney;
    chipState[playerIndex]['table'] += defMoney;
  }
  resetTable();
});
$('.raise_btn')[0].addEventListener('click' , () => {
  $('.board_outer')[0].dataset.sceen = 'raise_setting';
  $('.raise_setting')[0].style.display = 'flex';

  $('.display_max_money')[0].innerText = maxBedMoney;
});
$('.raise_decision')[0].addEventListener('click' , () => {
  const playerIndex = (firstPlayer + actionNum - 1) % playerNum + 1;
  const raiseMoney = Number($('.bed_money')[0].value);
  console.log(playerIndex);
  const defMoney = raiseMoney - chipState[playerIndex]['table'];
  chipState[playerIndex]['hand'] -= defMoney;
  chipState[playerIndex]['table'] += defMoney;
  maxBedMoney = raiseMoney;

  resetTable();
  $('.board_outer')[0].dataset.sceen = '';
  $('.raise_setting')[0].style.display = 'none';
});
$('.fold_btn')[0].addEventListener('click' , () => {
  const playerIndex = (firstPlayer + actionNum - 1) % playerNum + 1;
  foldPlayerList.push(playerIndex);
  resetTable();
});

$('.game_set_btn')[0].addEventListener('click', () => {
  $('.board_outer')[0].dataset.sceen = 'game_set_setting';
  $('.winner_setting')[0].style.display = 'flex';
})
$('.game_set_decision')[0].addEventListener('click' , () => {
  let allBedMoney = 0;
  for (let i=0; i<playerNum; i++) {
    allBedMoney += chipState[i+1]['table'];
    chipState[i+1]['table'] = 0

    if (i === firstPlayer) {
      chipState[i+1]['table'] = 100;
      chipState[i+1]['hand'] -= 100;
    } else if (i === firstPlayer + 1) {
      chipState[i+1]['table'] = 200;
      chipState[i+1]['hand'] -= 200;
    }
  }
  const winnerPlayer = Number($('.winner_player')[0].value);
  chipState[winnerPlayer]['hand'] += allBedMoney;
  
  foldPlayerList.length = 0;
  firstPlayer += 1;
  actionNum = -1;

  resetTable();
  $('.board_outer')[0].dataset.sceen = '';
  $('.winner_setting')[0].style.display = 'none';
})

document.addEventListener('DOMContentLoaded', () => {
  $('.setting_decision')[0].addEventListener('click',() => {
    playerNum = Number($('.player_num')[0].value);
    const firstMoney = Number($('.first_money')[0].value);
    createTable(playerNum, firstMoney);
    $('.board_outer')[0].dataset.sceen = "";
    $('.first_setting')[0].style.display = 'none';
  });

  if ($('.board_outer')[0].dataset.sceen === 'first_setting') {
    console.log(8);
    
    $('.first_setting')[0].style.display = 'flex';
  }
})
