### Freemarker分页

公司后台用的java，模板使用的是freemarker，一般分页都是写在后台的，这样打开了页面不用加载js就可以跳去想要的页面了，这里学习一下freemarker里面分页的写法

```html
<#-- 传入当前的页面和总共的页数 -->
<#macro pageNavigationOrg pageIndex pageCount>
    <#assign curPage = pageIndex>
    <#assign pageCount = pageCount>
<#--
    开始页 : 求最大值(当前页和2的差值 , 1)
-->
    <#if ((curPage - 2) > 1)>
        <#assign startPage = (curPage - 2)>
    <#else>
        <#assign startPage = 1>
    </#if>
<#--
    结束页 : 求最小值(开始页+4, 总页数)
-->
    <#if ((startPage + 4) < pageCount)>
        <#assign endPage = (startPage + 4)>
    <#else>
        <#assign endPage = pageCount>
    </#if>
<div class="pages">
<#--如果当前页大于第一页，输出上一页导航-->
    <#if (curPage > 1) >
        <#assign prePage = curPage-1>
        <a href="/staff/queryStaffByOrg?orgId=${orgId!''}&pageNumber=${prePage}" class="prev"
           title="上一页">上一页</a>
    </#if>
<#--开始输出页码导航-->
<#--
    如果开始页大于1 (表示当前页和2的差值大于1)
        先输出"第一页的link"和"..."
    否则跳过
        然后由遍历的过程输出第一页的链接
-->
    <#if (startPage > 1)>
        <a href="/staff/queryStaffByOrg?orgId=${orgId!''}&pageNumber=1" class="page-item item-number" title="1">1</a>
        <#if (startPage > 2)>
            <span class="page-item item-ellipsis">...</span>
        </#if>
    </#if>
<#--
    遍历输出开始页到结束页的链接
        如果是当前页，页码没有链接并且有自己的样式
-->
    <#if (startPage <= endPage)>
        <#list startPage..endPage as page>
            <a href="/staff/queryStaffByOrg?orgId=${orgId!''}&pageNumber=${page}" class="page-item item-number<#if curPage == page> cursor</#if>" title="${page}">${page}</a>
        </#list>
    </#if>
<#--
    如果endPage < pageCount 	(表示结束页是startPage + 8，否则endPage = pageCount)
        1.先判断是否小于最后一页的前一页,如果是先输出"..."，否则跳过
        2.单独输出最后一页
    否则跳过
        实质上在上面的遍历的过程中已经输出了最后一页的链接
-->
    <#if (endPage < pageCount)>
        <#if (endPage < pageCount - 1)>
            <span class="page-item item-ellipsis">...</span>
        </#if>
        <a href="/staff/queryStaffByOrg?orgId=${orgId!''}&pageNumber=${pageCount}" class="page-item item-number" title="${pageCount}">${pageCount}</a>
    </#if>
<#--如果当前页小于总页数，输出下一页导航-->
    <#if (curPage < pageCount)>
        <#assign nextPage = curPage+1>
        <a href="/staff/queryStaffByOrg?orgId=${orgId!''}&pageNumber=${pageCount}" data-pg="${nextPage}" class="next"
           title="下一页">下一页</a>
    </#if>
<#--结束输出页码导航-->
</div>
</#macro>
```

就是说先根据与1和pageCount的比较来判断定下了一个startPage和endPage，这是决定中间的输出的，然后前面的`...`和后面的`...`这两个值是他们分别与1和pageCount来单独比较的，而`上一页和`下一页`是单独判断是否展示的。原来自己看了下分页，也就是这么简单的事情而已  (●'◡'●)ﾉ♥
