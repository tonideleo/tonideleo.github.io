---
permalink: /assets/js/remark42-setup.js
---

function determineRemark42Theme() {
  {% if site.enable_darkmode %}
    let theme =
      localStorage.getItem("theme") ||
      document.documentElement.getAttribute("data-theme") ||
      "system";

    if (theme === "dark") return "dark";
    if (theme === "light") return "light";

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  {% else %}
    return "light";
  {% endif %}
}

(function setupRemark42() {
  // Clean up existing instance for Turbo SPA navigation
  if (window.REMARK42) {
    window.REMARK42.destroy();
  }

  window.remark_config = {
    host: "{{ site.remark42.host }}",
    site_id: "{{ site.remark42.site_id | default: 'remark' }}",
    url: window.location.origin + window.location.pathname,
    theme: determineRemark42Theme(),
    locale: "{{ site.remark42.locale | default: 'en' }}",
    show_email_subscription: {% if site.remark42.show_email_subscription %}true{% else %}false{% endif %},
    show_rss_subscription: {% if site.remark42.show_rss_subscription %}true{% else %}false{% endif %},
    no_footer: {% if site.remark42.no_footer %}true{% else %}false{% endif %},
    max_shown_comments: {{ site.remark42.max_shown_comments | default: 15 }},
    components: ["embed"],
  };

  // Load Remark42 embed script
  !function(e, n) {
    for (var o = 0; o < e.length; o++) {
      var r = n.createElement("script"),
        c = ".js",
        d = n.head || n.body;
      "noModule" in r ? ((r.type = "module"), (c = ".mjs")) : (r.async = !0);
      r.defer = !0;
      r.src = remark_config.host + "/web/" + e[o] + c;
      d.appendChild(r);
    }
  }(remark_config.components || ["embed"], document);
})();
