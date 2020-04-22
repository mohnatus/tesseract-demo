import Tesseract from 'tesseract.js';
import { langs } from './langs';
import { Log } from './Log';
import { DnD } from './DnD';
import defaultImage from './rus.png';

// Переменная для хранения выбранного файла
let file;

// Селект для выбора языков
const langsSelect = document.getElementById('langs');
langs.forEach((lang) => {
  const option = document.createElement('option');
  option.textContent = lang.text;
  option.value = lang.value;
  langsSelect.appendChild(option);
});

// Инпут для загрузки файлов и активация drag-n-drop зоны
const preview = document.getElementById('preview');
const input = document.getElementById('file');
function createPreview(loadedFile) {
  const reader = new FileReader();
  reader.onloadend = function () {
    preview.src = reader.result;
  };
  reader.readAsDataURL(loadedFile);
}
input.addEventListener('change', () => {
  file = input.files[0];
  createPreview(file);
});
DnD(document.body, (loadedFile) => {
  file = loadedFile;
  createPreview(file);
});
// Установка изображения по умолчанию
file = preview.src = defaultImage;

// Кнопка Начать обработку
const start = document.getElementById('start');

// Лог
const log = Log(document.getElementById('log'));

// Функция распознавания текста
function recognize(file, langs) {
  return Tesseract.recognize(file, langs, {
    logger: (data) => {
      console.log('Progress:', data);
      log.updateProgress(data.status, data.progress);
    },
  }).then((data) => {
    console.log('Result:', data);
    return data.data.text;
  });
}

// Начать обработку по клику на кнопку
start.addEventListener('click', () => {
  // Заблокировать кнопку
  start.disabled = true;

  log.clear();

  recognize(file, langsSelect.value)
    .then((data) => {
      // По окончании обработки вывести результат
      log.clear();
      log.setResult(data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // Разблокировать кнопку
      start.disabled = false;
    });
});
