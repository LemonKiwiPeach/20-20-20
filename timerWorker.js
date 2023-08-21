let timer = null;
let seconds = 0;
let breakTime = 0;

self.addEventListener('message', (e) => {
  switch (e.data.command) {
    case 'start':
      seconds = e.data.seconds;
      breakTime = e.data.breakTime;

      timer = setInterval(() => {
        if (seconds > 0) {
          seconds--;
        } else if (breakTime < 20) {
          breakTime++;
        } else {
          // Reset the timer and break time
          seconds = e.data.seconds;
          breakTime = e.data.breakTime;
        }

        self.postMessage({ seconds, breakTime });
      }, 1000);
      break;
    case 'stop':
      clearInterval(timer);
      break;
    default:
      break;
  }
});
