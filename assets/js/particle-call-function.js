document.addEventListener("DOMContentLoaded",function(){const e=()=>window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";particlesJS.load("particles-js","/assets/json/particles.json",function(){console.log("callback - particles.js config loaded");const o=e(),c=pJSDom[0].pJS.particles;"dark"===o?(c.color.value="#ffffff",c.line_linked.color="#ffffff"):(c.color.value="#000000",c.line_linked.color="#000000"),pJSDom[0].pJS.fn.particlesRefresh()})});