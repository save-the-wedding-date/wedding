const util = (() => {
    const timer = () => {
        const el = document.getElementById("date");
        if (!el) return;

        const countDownDate = new Date(el.getAttribute("data-date").replace(" ", "T")).getTime();

        const tick = () => {
            const distance = Math.abs(countDownDate - Date.now());
            document.getElementById("day").textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById("hour").textContent = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            document.getElementById("minute").textContent = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            document.getElementById("seconds").textContent = Math.floor((distance % (1000 * 60)) / 1000);
        };

        tick();
        setInterval(tick, 1000);
    };

    const play = (btn) => {
        if (btn.getAttribute("data-status") !== "true") {
            btn.setAttribute("data-status", "true");
            audio.play();
            btn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
        } else {
            btn.setAttribute("data-status", "false");
            audio.pause();
            btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
        }
    };

    const openinvite = async (button) => {
        button.disabled = true;
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.overflowY = "auto";

        const welcome = document.getElementById("welcome");
        welcome.classList.add("is-hiding");

        const musicBtn = document.getElementById("music");
        musicBtn.classList.add("is-visible");
        audio.play().catch(() => {});
        timer();
        observeReveals();

        setTimeout(() => welcome.remove(), 700);

        if (typeof confetti === "function") {
            await confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.75 },
                colors: ["#735b2e", "#e8c84a", "#f2f0ea", "#8a9a6b"],
            });
        }
    };

    const modal = (img) => {
        const modalEl = document.getElementById("image-modal");
        const modalImg = document.getElementById("image-modal-img");
        if (!modalEl || !modalImg) return;
        modalImg.src = img.src;
        modalImg.alt = img.alt || "";
        modalEl.classList.add("is-open");
    };

    const closeModal = () => {
        const modalEl = document.getElementById("image-modal");
        if (modalEl) modalEl.classList.remove("is-open");
    };

    const observeReveals = () => {
        const nodes = document.querySelectorAll("[data-reveal]");
        if (!("IntersectionObserver" in window)) {
            nodes.forEach((n) => n.classList.add("is-visible"));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18 }
        );

        nodes.forEach((n) => io.observe(n));
    };

    return { openinvite, play, modal, closeModal };
})();

const audio = (() => {
    let audioEl = null;

    const singleton = () => {
        if (!audioEl) {
            audioEl = new Audio();
            audioEl.src = document.getElementById("music").getAttribute("data-url");
            audioEl.loop = true;
            audioEl.volume = 1;
            audioEl.load();
        }
        return audioEl;
    };

    return {
        play: () => singleton().play(),
        pause: () => singleton().pause(),
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const modalEl = document.getElementById("image-modal");
    if (modalEl) {
        modalEl.addEventListener("click", (e) => {
            if (e.target === modalEl || e.target.classList.contains("modal-close")) {
                util.closeModal();
            }
        });
    }
});
