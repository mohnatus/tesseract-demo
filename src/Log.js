function updateProgress(data) {
  if (data.status === 'done') {
    log.innerHTML = '';
    const pre = document.createElement('pre')
    pre.appendChild(document.createTextNode(data.data.text.replace(/\n\s*\n/g, '\n')))
    log.appendChild(pre)
  } else {
    if (log.firstChild && log.firstChild.status === data.status) {
      if('progress' in data){
        const progress = log.firstChild.querySelector('progress')
        progress.value = data.progress
      }
    } else {
        const line = document.createElement('div');
        line.status = data.status;
        const status = document.createElement('div')
        status.className = 'status'
        status.appendChild(document.createTextNode(data.status))
        line.appendChild(status)

        if('progress' in data){
            const progress = document.createElement('progress')
            progress.value = data.progress
            progress.max = 1
            line.appendChild(progress)
        }

        log.insertBefore(line, log.firstChild)
    }
  }
}

function StatusLine() {
  let el = document.createElement('div');
  el.className = 'state';
  let status = document.createElement('div');
  status.className = 'state__status';
  let progress = document.createElement('progress');
  progress.className = 'state__progress';
  progress.max = 1;
  el.appendChild(status);
  el.appendChild(progress);

  return {
    el,
    get status() {
      return this._status;
    },
    set status(value) {
      this._status = value;
      status.textContent = value;
    },
    set progress(value) {
      progress.value = value;
    }
  }
}

export function Log(el) {
  const line = StatusLine();

  return {
    clear: () => {
      line.status = null;
      el.innerHTML = '';
    },

    updateProgress: (status, progress) => {
      if (!line.status) {
        el.appendChild(line.el);
      }

      if (status !== line.status) {
        line.status = status;
      }
      line.progress = progress;
    },

    setResult: (text) => {
      text = text.replace(/\n\s*\n/g, '\n');
      let pre = document.createElement('pre');
      pre.innerHTML = text;
      el.appendChild(pre);
    }
  }
}
