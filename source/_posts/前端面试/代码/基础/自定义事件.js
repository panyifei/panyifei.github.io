// 很简单的自定义事件

function EventEmitter() {
  const events = {};
  const eventEmitter = {};
  eventEmitter.on = (key, action) => {
    if (events[key]) {
      events[key].push(action);
    } else {
      events[key] = [action];
    }
  }
  eventEmitter.off = (key) => {
    delete events[key];
  }
  eventEmitter.trigger = (key, params) => {
    if (events[key]) {
      events[key].forEach(func => {
        func(params);
      })
    }
    if (events['*'] && key !== '*') {
      events['*'].forEach(f => {
        f(params);
      })
    }
  }
  return eventEmitter;
}

var emitter = EventEmitter();

emitter.on('foo', function (e) {
  console.log('listening foo event 1', e);
});

emitter.on('foo', function (e) {
  console.log('listening foo event 2', e);
});

emitter.on('bar', function (e) {
  console.log('listening bar event', e);
});

// 监听全部事件
emitter.on('*', function (e) {
  console.log('listening all events');
});

emitter.trigger('foo', {
  name: 'John'
});
emitter.trigger('bar', {
  name: 'Sun'
});
emitter.trigger('*', {
  name: 'Sun'
});
emitter.off('foo');