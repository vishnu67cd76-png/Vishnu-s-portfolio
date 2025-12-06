(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /**
   * Header toggle
   */
  const headerToggleBtn = $(".header-toggle");
  function headerToggle() {
    const header = $("#header");
    if (!header || !headerToggleBtn) return;
    header.classList.toggle("header-show");
    headerToggleBtn.classList.toggle("bi-list");
    headerToggleBtn.classList.toggle("bi-x");
  }
  if (headerToggleBtn) headerToggleBtn.addEventListener("click", headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  $$("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if ($(".header-show")) {
        headerToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  $$(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      const parent = this.parentNode;
      if (!parent) return;
      parent.classList.toggle("active");
      if (parent.nextElementSibling) {
        parent.nextElementSibling.classList.toggle("dropdown-active");
      }
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = $("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = $(".scroll-top");
  function toggleScrollTop() {
    if (!scrollTop) return;
    if (window.scrollY > 100) {
      scrollTop.classList.add("active");
    } else {
      scrollTop.classList.remove("active");
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (window.AOS && typeof AOS.init === "function") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate Pure Counter
   */
  if (window.PureCounter) {
    try {
      new PureCounter();
    } catch (e) {
      // ignore
    }
  }

  /**
   * Animate the skills items on reveal
   */
  if (window.Waypoint) {
    $$(".skills-animation").forEach((item) => {
      new Waypoint({
        element: item,
        offset: "80%",
        handler: function () {
          let progress = item.querySelectorAll(".progress .progress-bar");
          progress.forEach((el) => {
            el.style.width = el.getAttribute("aria-valuenow") + "%";
          });
        },
      });
    });
  }

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox === "function") {
    try {
      GLightbox({
        selector: ".glightbox",
      });
    } catch (e) {
      // ignore
    }
  }

  /**
   * Init isotope layout and filters
   */
  $$(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    const container = isotopeItem.querySelector(".isotope-container");
    if (!container) return;

    if (window.imagesLoaded && window.Isotope) {
      imagesLoaded(container, function () {
        initIsotope = new Isotope(container, {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        });
      });
    }

    const filterLinks = isotopeItem.querySelectorAll(".isotope-filters li");
    filterLinks.forEach(function (filters) {
      filters.addEventListener(
        "click",
        function () {
          const active = isotopeItem.querySelector(".isotope-filters .filter-active");
          if (active) active.classList.remove("filter-active");
          this.classList.add("filter-active");
          if (initIsotope && typeof initIsotope.arrange === "function") {
            initIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
          }
          if (typeof aosInit === "function") {
            aosInit();
          }
        },
        false
      );
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (!window.Swiper) return;
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let configEl = swiperElement.querySelector(".swiper-config");
      if (!configEl) return;
      let config;
      try {
        config = JSON.parse(configEl.innerHTML.trim());
      } catch (e) {
        return;
      }

      if (swiperElement.classList.contains("swiper-tab")) {
        if (typeof window.initSwiperWithCustomPagination === "function") {
          window.initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function () {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop || "0px";
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop, 10),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = $$(".navmenu a");
  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        document.querySelectorAll(".navmenu a.active").forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();

/* ===== EmailJS integration (do not remove) ===== */
(function(){
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // keep UI same, and prevent default submit

    // read values (IDs from step 2)
    const name = document.getElementById("from_name").value.trim();
    const email = document.getElementById("from_email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const message = document.getElementById("message").value.trim();

    // basic required fields check
    if (!name || !email || !message) {
      alert("Please fill your name, email and message.");
      return;
    }

    // simple email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // basic mobile validation (optional but recommended)
    if (mobile && (mobile.length < 7 || mobile.length > 15)) {
      alert("Please enter a valid mobile number.");
      return;
    }

    // send via EmailJS (your service + template)
    emailjs.send("service_553ukdk", "template_1pzynqm", {
      from_name: name,
      from_email: email,
      mobile: mobile,
      message: message
    }).then(function(response) {
      // keep feedback simple and non-intrusive so UI stays same
      alert("Message sent successfully. Thank you!");
      form.reset();
    }, function(error) {
      console.error("EmailJS error:", error);
      alert("Failed to send message. Please try again later.");
    });
  });
})();
