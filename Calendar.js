const init = {
  monList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayList: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  today: new Date(),
  monForChange: new Date().getMonth(),
  activeDate: new Date(),
  getFirstDay: (yy, mm) => new Date(yy, mm, 1),
  getLastDay: (yy, mm) => new Date(yy, mm + 1, 0),
  nextMonth: function () {
    let d = new Date();
    d.setDate(1);
    d.setMonth(++this.monForChange);
    this.activeDate = d;
    return d;
  },
  prevMonth: function () {
    let d = new Date();
    d.setDate(1);
    d.setMonth(--this.monForChange);
    this.activeDate = d;
    return d;
  },
  addZero: (num) => (num < 10) ? '0' + num : num, //"월"을 두자릿수로 설정
  activeDTag: null,
  getIndex: function (node) {
    let index = 0;
    while (node = node.previousElementSibling) {
      index++;
    }
    return index;
  }
};

const calBody = document.querySelector('.cal-body');
const btnNext = document.querySelector('.btn-cal.next');
const btnPrev = document.querySelector('.btn-cal.prev');

/**
 * @param {number} date
 * @param {number} dayIn
*/
function loadDate (date, dayIn) {
  document.querySelector('.cal-date').textContent = date;
  document.querySelector('.cal-day').textContent = init.dayList[dayIn];
}

/**
 * @param {date} fullDate
 */
function loadYYMM (fullDate) {
  let yy = fullDate.getFullYear();
  let mm = fullDate.getMonth();
  let judgemm = init.addZero(mm+1);
  let judgeJpYear = yy.toString().concat(judgemm);
  let jp; //和暦
  let firstDay = init.getFirstDay(yy, mm);
  let lastDay = init.getLastDay(yy, mm);
  let markToday;  //현재 날짜
  if (mm === init.today.getMonth() && yy === init.today.getFullYear()) {
    markToday = init.today.getDate();
  }

  //일본 연호
  if (Number(judgeJpYear) > 201903){
    jp = yy - 2018;
    jp = '(令和' + jp + ')年';
  }else if (yy > 1988) {//平成
    jp = yy - 1988;
    jp = '(平成' + jp + ')年';
  }else if (yy > 1925) {//昭和
    jp = yy - 1925;
    jp = '(昭和' + jp + ')年';
  }else if (yy > 1911) {//大正
    jp = yy - 1911;
    jp = '(大正' + jp + ')年';
  }else if (yy > 1867) {//明治
    jp = yy - 1867;
    jp = '(明治' + jp + ')年';
  }else{               //該当なし
    jp = '';
  }

  document.querySelector('.cal-month').textContent = init.monList[mm];
  document.querySelector('.cal-year').textContent = yy;
  document.querySelector('.cal-jpYear').textContent = jp;

  let trtd = '';
  let startCount;
  let countDay = 0;
  for (let i = 0; i < 6; i++) {
    trtd += '<tr>';
    for (let j = 0; j < 7; j++) {
      if (i === 0 && !startCount && j === firstDay.getDay()) {
        startCount = 1;
      }
      if (!startCount) {
        trtd += '<td>'
      } else {
        let fullDate = yy + '.' + init.addZero(mm + 1) + '.' + init.addZero(countDay + 1);
        trtd += '<td class="day';
        //토일 색깔 지정해주기
        if(j==0) trtd += ' sun';
        else if(j==6) trtd += ' sat';
        else ;
        trtd += (markToday && markToday === countDay + 1) ? ' today" ' : '"';
        trtd += ` data-date="${countDay + 1}" data-fdate="${fullDate}"`;
        trtd += '>';
      }
      trtd += (startCount) ? ++countDay : '';
      if (countDay === lastDay.getDate()) { 
        startCount = 0; 
      }
      trtd += '</td>';
    }
    trtd += '</tr>';
  }
  calBody.innerHTML = trtd;
}

loadYYMM(init.today);
loadDate(init.today.getDate(), init.today.getDay());

btnNext.addEventListener('click', () => loadYYMM(init.nextMonth()));
btnPrev.addEventListener('click', () => loadYYMM(init.prevMonth()));

calBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('day')) {
    if (init.activeDTag) {
      init.activeDTag.classList.remove('day-active');
    }
    let day = Number(e.target.textContent);
    loadDate(day, e.target.cellIndex);
    e.target.classList.add('day-active');
    init.activeDTag = e.target;
  }
});