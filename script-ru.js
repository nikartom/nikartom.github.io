const layerButton = document.querySelector('.layer-key');
const layerStatus = document.querySelector('#layer-status');
const actionStatus = document.querySelector('#action-status');
const deckKeys = [...document.querySelectorAll('.deck-key')];

let activeLayer = 'a';

function updateLayer() {
  const layerName = activeLayer.toUpperCase();
  layerButton.setAttribute('aria-pressed', String(activeLayer === 'b'));
  layerButton.querySelector('strong').textContent = `Слой ${layerName}`;
  layerStatus.textContent = layerName;

  deckKeys.forEach((key) => {
    if (key === layerButton) return;
    const action = key.dataset[activeLayer];
    if (!action) return;
    key.querySelector('strong').textContent = shortLabel(action);
    key.setAttribute('aria-label', `${key.dataset.key}: ${action}`);
  });

  actionStatus.textContent = activeLayer === 'a' ? 'NumLock выключен' : 'NumLock включён';
}

function shortLabel(action) {
  const labels = {
    'Сцена «Заставка»': 'Заставка',
    'Сцена «Игра»': 'Игра',
    'Сцена «Общение»': 'Общение',
    'Остановить трансляцию': 'Стоп',
    'Переключить веб-камеру': 'Камера',
    'Сохранить повтор': 'Повтор',
    'Предыдущий трек': 'Назад',
    'Воспроизведение или пауза': 'Пуск',
    'Уменьшить громкость': 'Звук −',
    'Увеличить громкость': 'Звук +',
    'Выключить микрофон': 'Микрофон',
    'Звук компьютера': 'Звук ПК',
    'Включить звуковой эффект': 'Эффект',
    'Переключить сцену': 'Сцена',
    'Показать или скрыть источник': 'Источник',
    'Выключить вход OBS': 'Микс OBS',
    'Начать запись': 'Запись',
    'Автоматизация подготовки стрима': 'Сценарий',
    'Клавиатурный макрос': 'Макрос',
    'Автоматизация запуска стрима': 'В эфир',
    'Сцена «Скоро вернусь»': 'Вернусь',
    'Отключить весь звук': 'Тишина',
    'Открыть браузер': 'Браузер',
    'Открыть Discord': 'Discord',
    'Панель стрима': 'Панель',
    'Открыть папку': 'Папка',
    'Звуковой эффект': 'Эффект',
    'Запустить OBS': 'OBS',
    'Запустить Discord': 'Discord',
    'Отключить звук': 'Тишина',
    'Следующий трек': 'Дальше',
    'Открыть сайт': 'Сайт',
    'Открыть файл': 'Файл',
    'Открыть приложение': 'Программа',
    'Рабочий профиль': 'Работа',
    'Игровой профиль': 'Игра',
    'Изменить профиль': 'Изменить',
    'Переключить профиль': 'Профиль',
    'Главная сцена': 'Главная',
    'Приостановить перехват': 'Пауза'
  };

  return labels[action] || action;
}

deckKeys.forEach((key) => {
  key.addEventListener('click', () => {
    if (key === layerButton) {
      activeLayer = activeLayer === 'a' ? 'b' : 'a';
      updateLayer();
      return;
    }

    const action = key.dataset[activeLayer];
    key.classList.add('is-fired');
    actionStatus.textContent = action;
    window.setTimeout(() => key.classList.remove('is-fired'), 180);
  });
});

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

updateLayer();
