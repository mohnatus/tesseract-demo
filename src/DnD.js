function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}
export function DnD(el, onLoad) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    el.addEventListener(eventName, preventDefaults, false)
  });
  ['dragenter', 'dragover'].forEach(eventName => {
    el.addEventListener(eventName, highlight, false)
  });
  el.addEventListener('dragleave', (e) => {
    if (e.toElement && e.toElement !== el && el.contains(e.toElement)) return;
    unhighlight();
  }, false);
  el.addEventListener('drop', (e) => {
    unhighlight();
    let files = e.dataTransfer.files;
    onLoad(files[0]);
  }, false)

  function highlight(e) {
    el.classList.add('highlight')
  }
  function unhighlight(e) {
    el.classList.remove('highlight')
  }
}
