# Prototype,原型链,继承
- function都是由prototype的，指向一个对象，注意全局函数并没有prototype。
- object指向原型对像的只有__proto__这个属性，并且并不规范，之后chrome，ff等几个实现了，这个东西可以用来向上层遍历。原型对象会有一个contructor，指向构造函数。
- Object.getPrototypeOf可以拿来向上查找原型链，但这是ES6的特性。
- Object.prototype的原型是null，这个本身是个特殊的对象，是个原型对象指向null的特殊对象。
