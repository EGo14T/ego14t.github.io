<p>博客已萌萌哒运行<span id="since"></span><span class="my-face">(●'◡'●)ﾉ♥</span></p>
<!--<p>{{ theme.footer.custom_text }}</p>-->
{% set current = date(Date.now(), "YYYY") %}
<p>© <span itemprop="copyrightYear">{{ current }}</span> {{ config.title }}.
    由 <a class="a-footer" href="https://hexo.io/" target="_blank" class="external" rel="nofollow">Hexo</a> 强力驱动.
    Theme By <a class="a-footer" href="https://github.com/DIYgod/hexo-theme-sagiri" target="_blank" class="external" rel="nofollow">Sagiri</a> v{{ theme.version }}.
    <a class="a-footer" href="{{ url_for(theme.footer.sitemap) }}" target="_blank">站点地图</a>. <span>{{ theme.footer.beian }}.</span>
</p>
<!--{{theme.footer.wangan}}-->

<p>Made with <i class="fa fa-heart throb" style="color: #d43f57;"></i> by <span class="author" itemprop="copyrightHolder">{{ theme.footer.copyright || config.author }}</span>. </p>
