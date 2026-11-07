document.addEventListener("DOMContentLoaded", () => {

    // Dark mode toggle
    const darkToggle = document.getElementById("dark-mode-toggle");

    // Turn dark mode on/off and update the button text
    function setDarkMode(isDark) {
        document.body.classList.toggle("dark-mode", isDark);
        if (darkToggle) {
            darkToggle.textContent = isDark ? "☀️ Toggle Light Mode" : "🌙 Toggle Dark Mode";
        }
    }

    // Use the saved choice if there is one, otherwise follow the device setting
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem("theme");
    } catch (e) {
        // Storage can be blocked (e.g. private browsing); just use the default
    }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);

    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark-mode");
            setDarkMode(isDark);
            // Remember the choice for next visit
            try {
                localStorage.setItem("theme", isDark ? "dark" : "light");
            } catch (e) {
                // Ignore if storage is unavailable
            }
        });
    }

    // Mobile menu toggle
    const menuBtn = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            if (nav.classList.contains("active")) {
                // Closing: faster animation
                nav.classList.remove("active");
                nav.classList.add("closing");
                menuBtn.textContent = "☰ Menu";

                // Wait for transition to finish before cleaning up
                nav.addEventListener("transitionend", function handler(event) {
                    // Only clean up after the max-height transition ends
                    if (event.propertyName === "max-height") {
                        nav.classList.remove("closing");
                        nav.removeEventListener("transitionend", handler);
                    }
                });
            } else {
                // Opening: slower animation
                nav.classList.add("active");
                menuBtn.textContent = "✖ Close";
            }
        });

        // Smooth scrolling with menu close
        document.querySelectorAll("#main-nav a").forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();

                const target = document.querySelector(this.getAttribute("href"));

                // Only close menu if we're in mobile mode
                if (window.innerWidth < 768) {
                    nav.classList.remove("active");
                    menuBtn.textContent = "☰ Menu"; // reset button text
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: "smooth"
                        });
                    }, 0);
                }
                else{
                    target.scrollIntoView({behavior: "smooth"});
                }

                
            });
        });

    }

    // Back to top button: show it once the user scrolls down
    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
        const updateBackToTop = () => {
            backToTop.classList.toggle("visible", window.scrollY > 400);
        };
        window.addEventListener("scroll", updateBackToTop, { passive: true });
        updateBackToTop();

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Highlight the nav link for the section currently on screen
    const navLinks = document.querySelectorAll("#main-nav a");
    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window && navLinks.length && sections.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle("current", link.getAttribute("href") === "#" + entry.target.id);
                    });
                }
            });
        }, {
            // A section counts as "current" when it crosses the middle of the screen
            rootMargin: "-45% 0px -50% 0px"
        });

        sections.forEach(section => observer.observe(section));
    }

});