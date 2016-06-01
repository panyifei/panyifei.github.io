---
layout: default
title: {{ site.name }}
---
# 输入框js验证函数

## 功能

手机浏览器下`保证`7位数值的输入，包括小数点，这个的处理安全的过分了，因为边界情况太多了，无论是手机型号，还有输入法

## 代码解释

```html
    <input type="number" class="amount J-total-amount" autocomplete="off" maxlength="7">
```

配合js代码使用，就万无一失了，有详细的代码注释，主要是用了一些正则的检验,这里还是有坑的...

```javascript
        //单单监听input不能达到效果，边界的不一定可以搞定
        self.inputSelectionSupported = $('input').hasOwnProperty('selectionStart');
        //fix firefox 下面的小bug
        if(/Firefox\/(\S+)/.test(window.navigator.userAgent)){
            els.forEach(function(value,index,array){
                array[index].type = 'text';
            });
        }
        inputs.on('input', function () {
            //input是在输入框改变更新了数值之后才出发
            sanitizeInput(this);
        }).on('keypress', function (e) {
            //keypress是在输入框改变之前就触发了
            //之所以监听keypress是因为keyup，keydown有些情况下获得的key不标准
            var code = e.key || e.keyCode;
            var key = String.fromCharCode(code);
            if (!code) return;
            if ([8, 37, 39].indexOf(code) >= 0) return;  // backspace, left, right
            //这个东西firefox下为true
            if (self.inputSelectionSupported) {
                // strict test
                var endArr = this.value.split('');
                endArr.splice(this.selectionStart, this.selectionEnd - this.selectionStart, key);
                var endValue = endArr.join('');
                var endNumber = parseFloat(endValue);
                if (!/^\d*\.?\d{0,2}$/.test(endValue)) {
                    e.preventDefault();
                } else if (isNaN(endNumber) || endNumber < 0) {
                    e.preventDefault();
                }
            } else {
                // fallback to week test
                if (key === '.') {
                    if (this.value.indexOf('.') >= 0) {
                        e.preventDefault();
                    }
                } else if (!/^\d$/.test(key)) {
                    e.preventDefault();
                }
            }
        });
        var sanitizeInput = function (input) {
            var sanitized = input.value;
            if (sanitized.length === 0) {
                //iosbug，直接点击文字的话会输入成功，拿不到input.value
                //小米bug，上面的“-”也能直接输入成功，拿不到input.value
                input.value = '';
                return;
            }
            var modified = false;
            // 长度限制
            if (sanitized.length > 7) {
                sanitized = sanitized.substr(0, 7);
                modified = true;
            }
            // 非法字符处理
            // 将非数字，非.的用空字符串替换
            var mreg = /[^\d\.]/g;
            if (mreg.test(sanitized)) {
                sanitized = sanitized.replace(mreg, '');
                modified = true;
            }
            // 多小数点处理
            // 这里的正则就是分组捕获了
            var preg = /(\d*\.\d*)\.(\d*)/g;
            while (preg.test(sanitized)) {
                sanitized = sanitized.replace(preg, '$1$2');
                modified = true;
            }
            // 去头部0
            var zreg = /^0+(\d+)/;
            if (zreg.test(sanitized)) {
                sanitized = sanitized.replace(zreg, '$1');
                modified = true;
            }
            // 小数点精度处理
            // 这里的正则就是判断是否小数点有三位
            var floatEnd = sanitized.match(/\d*\.(\d{3,})/);
            if (floatEnd) {
                floatEnd = floatEnd[1];
                sanitized = sanitized.slice(0, 2-floatEnd.length);
                modified = true;
            }
            if (modified) {
                input.value = sanitized;
            }
        };
```
