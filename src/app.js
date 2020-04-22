import { FileInput } from './readFile';
import { Log } from './Log';
import defaultImage from './rus.png';
import { createWorker } from 'tesseract.js';
import { langs } from './langs';
import { DnD } from './DnD';

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
function onFileLoad(loadedFile) {
  const reader  = new FileReader();
  reader.onloadend = function () {
    setFile(reader.result);
  }
  reader.readAsDataURL(loadedFile);
}
function setFile(src) {
  file = src;
  preview.src = src;
}
input.addEventListener('change', () => {
  onFileLoad(input.files[0])
});
DnD(document.body, onFileLoad);
// Установка изображения по умолчанию
setFile(defaultImage);

// Кнопка Начать обработку
const start = document.getElementById('start');

// Лог
const log = Log(document.getElementById('log'));

// Функция распознавания текста
async function recognize(file, langs) {
  const worker = createWorker({
    logger: (data) => log.updateProgress(data.status, data.progress),
  });
  await worker.load();
  await worker.loadLanguage(langs);
  await worker.initialize(langs);
  const {
    data: { text },
  } = await worker.recognize(file);
  await worker.terminate();
  return text;
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
