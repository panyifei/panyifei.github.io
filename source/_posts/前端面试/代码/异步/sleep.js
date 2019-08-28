// sleep
function sleep(cb, time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  });
}

async function sleepAsync {
  await sleep(1000);
  console.log('code');
}

function sleep(callback, time) {
  if (typeof callback === 'function')
    setTimeout(callback, time)
}

function sleep(time) {
  function* gen() {
    yield new Promise((resolve, reject) => {
      setTimeout(resolve, time)
    });
  }
  return gen().next().value;
}