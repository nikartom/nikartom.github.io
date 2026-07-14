const layerButton = document.querySelector('.layer-key');
const layerStatus = document.querySelector('#layer-status');
const actionStatus = document.querySelector('#action-status');
const deckKeys = [...document.querySelectorAll('.deck-key')];

let activeLayer = 'a';

function updateLayer() {
  const layerName = activeLayer.toUpperCase();
  layerButton.setAttribute('aria-pressed', String(activeLayer === 'b'));
  layerButton.querySelector('strong').textContent = `Layer ${layerName}`;
  layerStatus.textContent = layerName;

  deckKeys.forEach((key) => {
    if (key === layerButton) return;
    const action = key.dataset[activeLayer];
    if (!action) return;
    key.querySelector('strong').textContent = shortLabel(action);
    key.setAttribute('aria-label', `${key.dataset.key}: ${action}`);
  });

  actionStatus.textContent = `NumLock ${activeLayer === 'a' ? 'off' : 'on'}`;
}

function shortLabel(action) {
  const labels = {
    'Starting Soon': 'Starting',
    'Just Chatting': 'Chatting',
    'Stop stream': 'Stop',
    'Toggle webcam': 'Webcam',
    'Save replay': 'Replay',
    'Previous track': 'Previous',
    'Play or pause': 'Play',
    'Volume down': 'Vol −',
    'Volume up': 'Vol +',
    'Microphone mute': 'Mic',
    'Desktop audio': 'Desktop',
    'Play sound effect': 'Sound FX',
    'Switch scene': 'Scene',
    'Toggle source': 'Source',
    'Mute OBS input': 'OBS Mic',
    'Start recording': 'Record',
    'Stream setup automation': 'Routine',
    'Keyboard macro': 'Macro',
    'Go live automation': 'Go live',
    'BRB scene': 'BRB',
    'Master mute': 'Mute',
    'Stream dashboard': 'Dashboard',
    'Open folder': 'Folder',
    'Open website': 'Website',
    'Open file': 'File',
    'Open app': 'App',
    'Work profile': 'Work',
    'Game profile': 'Game',
    'Edit profile': 'Edit',
    'Switch profile': 'Profile',
    'Home scene': 'Home',
    'Pause capture': 'Pause',
    'Next track': 'Next',
    'Launch OBS': 'OBS',
    'Launch Discord': 'Discord'
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
