let AV;

if (window.CONFIG.leancloud.enable) {
  AV = require('leancloud-storage');
  AV.init({
    appId: window.CONFIG.leancloud.appID,
    appKey: window.CONFIG.leancloud.appKey,
    serverURLs: 'https://leancloud.ego1st.cn',
  });
  window.AV = AV;
}
function leancloud () {

  if (window.CONFIG.leancloud.enable) {

    function showTime (Counter) {
      var query = new AV.Query(Counter);
      var entries = [];
      var $visitors = $(".leancloud_visitors");

      $visitors.each(function () {
        entries.push($(this).attr("id").trim());
      });

      query.containedIn('url', entries);
      query.find()
        .then(function (results) {
          var COUNT_CONTAINER_REF = '.leancloud-visitors-count';

          if (results.length === 0) {
            $visitors.find(COUNT_CONTAINER_REF).text(0);
            return;
          }

          for (var i = 0; i < results.length; i++) {
            var item = results[i];
            var url = item.get('url');
            var time = item.get('time');
            var element = document.getElementById(url);

            if (!$(element).find(COUNT_CONTAINER_REF).text()) {
              $(element).find(COUNT_CONTAINER_REF).text(time);
            }
          }
          for (var i = 0; i < entries.length; i++) {
            var url = entries[i];
            var element = document.getElementById(url);
            var countSpan = $(element).find(COUNT_CONTAINER_REF);
            if (countSpan.text() == '') {
              countSpan.text(0);
            }
          }
        })
    }

    function addCount (Counter) {
      var $visitors = $(".leancloud_visitors");
      var url = $visitors.attr('id').trim();
      var title = $visitors.attr('data-flag-title').trim();
      var query = new AV.Query(Counter);

      query.equalTo("url", url);
      query.find()
        .then(function (results) {
          if (results.length > 0) {
            var counter = results[0];
            counter.save(null, {
              fetchWhenSave: true
            });
            counter.increment("time");
            counter.save()
              .then(function (counter) {
                var $element = $(document.getElementById(url));
                $element.find('.leancloud-visitors-count').text(counter.get('time'));
              })
          } else {
            var newcounter = new Counter();
            /* Set ACL */
            var acl = new AV.ACL();
            acl.setPublicReadAccess(true);
            acl.setPublicWriteAccess(true);
            newcounter.setACL(acl);
            /* End Set ACL */
            newcounter.set("title", title);
            newcounter.set("url", url);
            newcounter.set("time", 1);
            newcounter.save()
              .then(function (newcounter) {
                var $element = $(document.getElementById(url));
                $element.find('.leancloud-visitors-count').text(newcounter.get('time'));
              })
              .then(function (newcounter, error) {
                console.log('Failed to create');
              });
          }
        })
    }

    $(function () {
      var Counter = AV.Object.extend("Counter");
      if ($('.leancloud_visitors').length == 1) {
        addCount(Counter);
      } else if ($('.post-title-link').length > 1) {
        showTime(Counter);
      }
    });
  }

}

module.exports = leancloud;
