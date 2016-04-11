# DOM编程与算法流程控制
## DOM编程
文档对象模型是独立于语言的，用于XML和HTML文档的程序接口。尽管DOM是个与语言无关的API，但是他在浏览器中的接口是用Javascript实现的，所以DOM就成为了现在Js编码的重要部分。

浏览器通常会把DOM和JS独立实现，比如IE就把JS的实现名为JScript，位于jscript.dll中；而DOM的实现在另一个库，名为mshtml.dll。比如Google的就是是用Webkit的WebCore库来渲染页面，js就是V8..等等

    所以天生就慢，因为两个独立的功能通过一处收费的桥相连，每次交互都得收费，所以应该尽量减少交互次数。

### DOM访问与修改
访问就已经得付出代价了，修改的代价更高，因为这得让浏览器重新计算页面的几何变化。如果是循环的修改的话代价更高。

    我们应该减少修改的次数，比如先用一个变量存下来，一次进行修改。

 - innerHTML与原生DOM

对于修改页面区域，一直有使用非标准但是支持良好的innerHTML还是使用createElement这种原生的DOM方法的争论，其实答案是相差无几。在除了最新的webkit之外(新版的恰恰相反)，innerHTML会更快一些。

 - 节点克隆

在需要重复的时候，克隆已有的节点会比新建稍微快一点点。老的浏览器提升的效果一般，最新的chrome下，快个5倍吧。

 - HTML集合

就是说document.getElementsByName(),document.getElementsByClassName(),document.getElementsByTagName(),以及document.images,document.links,document.forms和document.forms[0].elements返回的是HTML的集合。这东西是个伪数组，只提供了length，以及数字索引的访问，并没有数组的方法，当然我们可以用apply或者call来调用。

    重要的是，html集合与文档一直保持着连接，每次访问他的值的时候，都会重复执行查询的过程，这才是低效之源。
