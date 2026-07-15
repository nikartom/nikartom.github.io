const isRussian = document.documentElement.lang.toLowerCase().startsWith('ru');
const language = isRussian ? 'ru' : 'en';
const broadcast = document.querySelector('#broadcast');
const sceneName = document.querySelector('#scene-name');
const actionToast = document.querySelector('#action-toast');
const soundWave = document.querySelector('.sound-wave');
const micState = document.querySelector('#mic-state');
const desktopState = document.querySelector('#desktop-state');
const liveLabel = document.querySelector('#live-label');
const liveTimer = document.querySelector('#live-timer');
const layerStatus = document.querySelector('#layer-status');
const layerButton = document.querySelector('.layer-key');
const deckKeys = Array.from(document.querySelectorAll('.deck-key'));
const iconBase = isRussian ? '../assets/icons/' : './assets/icons/';

const actionIcons = {
  layer: 'layers-2',
  starting: 'play',
  gameplay: 'gamepad-2',
  chatting: 'message-circle',
  brb: 'monitor-off',
  home: 'panels-top-left',
  webcam: 'video',
  replay: 'rotate-ccw',
  previous: 'skip-back',
  play: 'play',
  next: 'skip-back',
  'volume-down': 'volume-1',
  'volume-up': 'volume-2',
  'master-mute': 'mic-off',
  mic: 'mic',
  desktop: 'monitor-speaker',
  sound: 'music-2',
  record: 'circle-dot',
  routine: 'workflow',
  macro: 'keyboard',
  live: 'radio-tower',
  'launch-obs': 'radio',
  'launch-discord': 'headphones',
  dashboard: 'panels-top-left',
  website: 'globe',
  file: 'folder-open',
  app: 'app-window',
  work: 'settings-2',
  profile: 'layers-2',
  edit: 'settings-2',
  'switch-profile': 'layers-2',
  pause: 'power'
};

const copy = {
  en: {
    layer: 'LAYER',
    scenes: {starting: 'Starting soon', gameplay: 'Gameplay', chatting: 'Just chatting', brb: 'Be right back'},
    on: 'ON',
    off: 'MUTED',
    preview: 'PREVIEW',
    live: 'LIVE',
    desktopOn: '−8 dB',
    desktopOff: 'MUTED',
    ready: 'Ready — press a key',
    actions: {
      starting: 'Scene switched · Starting soon',
      gameplay: 'Scene switched · Gameplay',
      chatting: 'Scene switched · Just chatting',
      brb: 'Scene switched · Be right back',
      home: 'Scene switched · Home',
      webcamOn: 'Webcam is visible',
      webcamOff: 'Webcam is hidden',
      micOn: 'Microphone is live',
      micOff: 'Microphone muted',
      desktopOn: 'Desktop audio restored',
      desktopOff: 'Desktop audio muted',
      recordOn: 'Recording started',
      recordOff: 'Recording stopped',
      liveOn: 'You are live!',
      liveOff: 'Stream ended · back to preview',
      replay: 'Replay buffer saved',
      sound: 'Sound effect played',
      volumeUp: 'Desktop volume · up',
      volumeDown: 'Desktop volume · down',
      masterOn: 'All audio restored',
      masterOff: 'All audio muted',
      previous: 'Previous track',
      play: 'Playback toggled',
      next: 'Next track',
      routine: 'Routine started · setting up the stream',
      routineDone: 'Routine complete · you are live',
      macro: 'Keyboard macro sent',
      launchObs: 'OBS Studio launched',
      launchDiscord: 'Discord launched',
      dashboard: 'Stream dashboard opened',
      website: 'Website opened',
      file: 'File opened',
      app: 'Application opened',
      work: 'Work profile selected',
      profile: 'Game profile selected',
      edit: 'Profile editor opened',
      switchProfile: 'Profile switched',
      pause: 'Key capture paused'
    },
    short: {
      previous: 'PREV', play: 'PLAY', 'volume-down': 'VOL −', mic: 'MIC', desktop: 'AUDIO',
      sound: 'SFX', 'volume-up': 'VOL +', gameplay: 'SCENE', webcam: 'SOURCE',
      record: 'REC', routine: 'ROUTINE', macro: 'MACRO', live: 'GO LIVE', brb: 'BRB',
      'master-mute': 'MUTE', 'launch-obs': 'OBS', 'launch-discord': 'DISCORD',
      dashboard: 'DASHBOARD', next: 'NEXT', website: 'WEBSITE', file: 'FILE', app: 'APP',
      work: 'WORK', profile: 'PROFILE', edit: 'EDIT', 'switch-profile': 'PROFILE',
      home: 'HOME', pause: 'PAUSE'
    }
  },
  ru: {
    layer: 'СЛОЙ',
    scenes: {starting: 'Заставка', gameplay: 'Игра', chatting: 'Общение', brb: 'Скоро вернусь'},
    on: 'ВКЛ',
    off: 'ВЫКЛ',
    preview: 'ПРЕВЬЮ',
    live: 'ЭФИР',
    desktopOn: '−8 дБ',
    desktopOff: 'ВЫКЛ',
    ready: 'Готово — нажмите клавишу',
    actions: {
      starting: 'Сцена переключена · Заставка',
      gameplay: 'Сцена переключена · Игра',
      chatting: 'Сцена переключена · Общение',
      brb: 'Сцена переключена · Скоро вернусь',
      home: 'Сцена переключена · Главная',
      webcamOn: 'Веб-камера включена',
      webcamOff: 'Веб-камера скрыта',
      micOn: 'Микрофон включён',
      micOff: 'Микрофон выключен',
      desktopOn: 'Звук компьютера включён',
      desktopOff: 'Звук компьютера выключен',
      recordOn: 'Запись началась',
      recordOff: 'Запись остановлена',
      liveOn: 'Вы в эфире!',
      liveOff: 'Эфир завершён · включено превью',
      replay: 'Буфер повтора сохранён',
      sound: 'Звуковой эффект запущен',
      volumeUp: 'Громкость компьютера · выше',
      volumeDown: 'Громкость компьютера · ниже',
      masterOn: 'Весь звук включён',
      masterOff: 'Весь звук выключен',
      previous: 'Предыдущий трек',
      play: 'Воспроизведение переключено',
      next: 'Следующий трек',
      routine: 'Сценарий запущен · готовим эфир',
      routineDone: 'Сценарий завершён · вы в эфире',
      macro: 'Клавиатурный макрос выполнен',
      launchObs: 'OBS Studio запущена',
      launchDiscord: 'Discord запущен',
      dashboard: 'Панель стрима открыта',
      website: 'Сайт открыт',
      file: 'Файл открыт',
      app: 'Программа открыта',
      work: 'Рабочий профиль выбран',
      profile: 'Игровой профиль выбран',
      edit: 'Редактор профиля открыт',
      switchProfile: 'Профиль переключён',
      pause: 'Перехват клавиш приостановлен'
    },
    short: {
      previous: 'НАЗАД', play: 'ПУСК', 'volume-down': 'ЗВУК −', mic: 'МИК', desktop: 'ЗВУК ПК',
      sound: 'ЭФФЕКТ', 'volume-up': 'ЗВУК +', gameplay: 'СЦЕНА', webcam: 'ИСТОЧНИК',
      record: 'ЗАПИСЬ', routine: 'СЦЕНАРИЙ', macro: 'МАКРОС', live: 'В ЭФИР', brb: 'ВЕРНУСЬ',
      'master-mute': 'ТИШИНА', 'launch-obs': 'OBS', 'launch-discord': 'DISCORD',
      dashboard: 'ПАНЕЛЬ', next: 'ДАЛЬШЕ', website: 'САЙТ', file: 'ФАЙЛ', app: 'ПРОГРАММА',
      work: 'РАБОТА', profile: 'ПРОФИЛЬ', edit: 'ИЗМЕНИТЬ', 'switch-profile': 'ПРОФИЛЬ',
      home: 'ГЛАВНАЯ', pause: 'ПАУЗА'
    }
  }
}[language];

let activeLayer = 'a';
let cameraOff = false;
let micMuted = false;
let desktopMuted = false;
let recording = false;
let streaming = false;
let liveSeconds = 0;
let liveInterval = null;
let toastTimeout = null;
let soundTimeout = null;
let routineRun = 0;

function showToast(message, duration) {
  window.clearTimeout(toastTimeout);
  actionToast.textContent = message;
  actionToast.classList.add('is-visible');
  toastTimeout = window.setTimeout(function () {
    actionToast.classList.remove('is-visible');
  }, duration || 1700);
}

function setScene(scene, message) {
  const target = scene === 'home' ? 'gameplay' : scene;
  broadcast.dataset.scene = target;
  sceneName.textContent = scene === 'home' ? (isRussian ? 'Главная' : 'Home') : copy.scenes[target];
  showToast(message || copy.actions[target]);
}

function syncToggleKeys() {
  deckKeys.forEach(function (key) {
    const action = getKeyAction(key);
    if (action === 'webcam') key.setAttribute('aria-pressed', String(!cameraOff));
    if (action === 'mic') key.setAttribute('aria-pressed', String(!micMuted));
    if (action === 'desktop') key.setAttribute('aria-pressed', String(!desktopMuted));
    if (action === 'record') key.setAttribute('aria-pressed', String(recording));
    if (action === 'live') key.setAttribute('aria-pressed', String(streaming));
  });
}

function setCamera(isOff, announce) {
  cameraOff = isOff;
  broadcast.classList.toggle('is-camera-off', cameraOff);
  syncToggleKeys();
  if (announce !== false) showToast(cameraOff ? copy.actions.webcamOff : copy.actions.webcamOn);
}

function setMic(isMuted, announce) {
  micMuted = isMuted;
  broadcast.classList.toggle('is-mic-muted', micMuted);
  micState.textContent = micMuted ? copy.off : copy.on;
  syncToggleKeys();
  if (announce !== false) showToast(micMuted ? copy.actions.micOff : copy.actions.micOn);
}

function setDesktop(isMuted, announce) {
  desktopMuted = isMuted;
  desktopState.textContent = desktopMuted ? copy.desktopOff : copy.desktopOn;
  syncToggleKeys();
  if (announce !== false) showToast(desktopMuted ? copy.actions.desktopOff : copy.actions.desktopOn);
}

function setRecording(isRecording, announce) {
  recording = isRecording;
  broadcast.classList.toggle('is-recording', recording);
  syncToggleKeys();
  if (announce !== false) showToast(recording ? copy.actions.recordOn : copy.actions.recordOff);
}

function formatTimer(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainder = String(seconds % 60).padStart(2, '0');
  return minutes + ':' + remainder;
}

function updateTimer() {
  liveTimer.textContent = formatTimer(liveSeconds);
  liveTimer.setAttribute('datetime', 'PT' + liveSeconds + 'S');
}

function setStreaming(isStreaming, announce) {
  streaming = isStreaming;
  broadcast.classList.toggle('is-live', streaming);
  liveLabel.textContent = streaming ? copy.live : copy.preview;
  window.clearInterval(liveInterval);
  if (streaming) {
    liveSeconds = 0;
    updateTimer();
    liveInterval = window.setInterval(function () {
      liveSeconds += 1;
      updateTimer();
    }, 1000);
  } else {
    liveSeconds = 0;
    updateTimer();
  }
  syncToggleKeys();
  if (announce !== false) showToast(streaming ? copy.actions.liveOn : copy.actions.liveOff);
}

function playSoundEffect() {
  window.clearTimeout(soundTimeout);
  soundWave.classList.remove('is-playing');
  void soundWave.offsetWidth;
  soundWave.classList.add('is-playing');
  soundTimeout = window.setTimeout(function () {
    soundWave.classList.remove('is-playing');
  }, 1100);
  showToast(copy.actions.sound);
}

function runRoutine() {
  routineRun += 1;
  const thisRun = routineRun;
  showToast(copy.actions.routine, 2300);
  setMic(false, false);
  window.setTimeout(function () {
    if (routineRun !== thisRun) return;
    setCamera(false, false);
    setScene('gameplay', isRussian ? 'Шаг 2/4 · камера включена' : 'Step 2/4 · webcam on');
  }, 550);
  window.setTimeout(function () {
    if (routineRun !== thisRun) return;
    setRecording(true, false);
    showToast(isRussian ? 'Шаг 3/4 · запись запущена' : 'Step 3/4 · recording started');
  }, 1100);
  window.setTimeout(function () {
    if (routineRun !== thisRun) return;
    setStreaming(true, false);
    showToast(copy.actions.routineDone, 2500);
  }, 1750);
}

function getKeyAction(key) {
  return key.dataset.action || key.dataset['action' + activeLayer.toUpperCase()];
}

function updateKeyIcon(key, action) {
  let icon = key.querySelector('.key-icon');
  if (!icon) {
    icon = document.createElement('img');
    icon.className = 'key-icon';
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    key.insertBefore(icon, key.querySelector('strong'));
  }
  icon.src = iconBase + (actionIcons[action] || 'power') + '.svg';
  key.classList.toggle('key-icon-next', action === 'next');
}

function fireAction(action) {
  switch (action) {
    case 'starting':
    case 'gameplay':
    case 'chatting':
    case 'brb':
    case 'home':
      setScene(action);
      break;
    case 'webcam':
      setCamera(!cameraOff);
      break;
    case 'mic':
      setMic(!micMuted);
      break;
    case 'desktop':
      setDesktop(!desktopMuted);
      break;
    case 'record':
      setRecording(!recording);
      break;
    case 'live':
      setStreaming(!streaming);
      break;
    case 'replay':
      showToast(copy.actions.replay);
      break;
    case 'sound':
      playSoundEffect();
      break;
    case 'volume-up':
      setDesktop(false, false);
      showToast(copy.actions.volumeUp);
      break;
    case 'volume-down':
      showToast(copy.actions.volumeDown);
      break;
    case 'master-mute':
      setMic(!micMuted, false);
      setDesktop(!desktopMuted, false);
      showToast(micMuted || desktopMuted ? copy.actions.masterOff : copy.actions.masterOn);
      break;
    case 'routine':
      runRoutine();
      break;
    case 'previous':
    case 'play':
    case 'next':
      showToast(copy.actions[action]);
      break;
    case 'launch-obs':
      showToast(copy.actions.launchObs);
      break;
    case 'launch-discord':
      showToast(copy.actions.launchDiscord);
      break;
    case 'switch-profile':
      showToast(copy.actions.switchProfile);
      break;
    default:
      showToast(copy.actions[action] || (isRussian ? 'Действие выполнено' : 'Action complete'));
  }
}

function updateLayer() {
  const layerName = activeLayer.toUpperCase();
  layerStatus.textContent = layerName;
  layerButton.setAttribute('aria-pressed', String(activeLayer === 'b'));
  layerButton.querySelector('strong').textContent = copy.layer + ' ' + layerName;

  deckKeys.forEach(function (key) {
    if (!key.dataset.actionA) return;
    const action = getKeyAction(key);
    const label = copy.short[action] || action.toUpperCase();
    key.querySelector('strong').textContent = label;
    updateKeyIcon(key, action);
    key.setAttribute('aria-label', key.querySelector('small').textContent + ': ' + label);
  });

  showToast(isRussian ? 'Слой ' + layerName + ' включён' : 'Layer ' + layerName + ' active');
  syncToggleKeys();
}

deckKeys.forEach(function (key) {
  const action = getKeyAction(key);
  updateKeyIcon(key, action);
  const spokenLabel = key.dataset['label' + (isRussian ? 'Ru' : 'En')] || copy.short[action] || action;
  key.setAttribute('aria-label', key.querySelector('small').textContent + ': ' + spokenLabel);

  key.addEventListener('click', function () {
    key.classList.add('is-fired');
    window.setTimeout(function () { key.classList.remove('is-fired'); }, 160);

    if (key === layerButton) {
      activeLayer = activeLayer === 'a' ? 'b' : 'a';
      updateLayer();
      return;
    }

    fireAction(getKeyAction(key));
  });
});

layerButton.setAttribute('aria-label', copy.layer + ' A');

const keyboardAliases = {
  NumpadDivide: 'Divide',
  NumpadMultiply: 'Multiply',
  NumpadSubtract: 'Subtract',
  NumpadAdd: 'Add',
  NumpadDecimal: 'Decimal'
};

document.addEventListener('keydown', function (event) {
  const target = event.target;
  if (target && (target.matches('input, textarea, select') || target.isContentEditable)) return;
  const code = keyboardAliases[event.code] || event.code;
  const key = deckKeys.find(function (candidate) { return candidate.dataset.key === code; });
  if (!key) return;
  event.preventDefault();
  key.click();
});

document.querySelectorAll('.faq-list details').forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach(function (other) {
      if (other !== item) other.open = false;
    });
  });
});

syncToggleKeys();
window.setTimeout(function () { showToast(copy.ready, 2200); }, 450);
