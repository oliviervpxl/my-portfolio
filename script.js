/* =========================
   Nav preview (desktop hover)
   ========================= */
(() => {
    const previewBox = document.querySelector(".preview-box");
    const navLinks = document.querySelectorAll(".nav-circle a");

    if (!previewBox || navLinks.length === 0) return;

    navLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            const content = link.dataset.preview;
            if (!content) return;
            previewBox.textContent = content;
            previewBox.classList.add("show");
        });

        link.addEventListener("mouseleave", () => {
            previewBox.classList.remove("show");
        });
    });
})();


/* =========================
   Hamburger toggle (.nav-circle)
   ========================= */
(() => {
    const nav = document.querySelector(".nav-circle");
    const btn = document.querySelector(".nav-toggle");
    if (!nav || !btn) return;

    btn.addEventListener("click", () => {
        nav.classList.toggle("collapsed");
        const expanded = !nav.classList.contains("collapsed");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
    });

    // Optional: close menu when clicking a link (mobile UX)
    nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            if (window.matchMedia("(max-width: 900px)").matches) {
                nav.classList.add("collapsed");
                btn.setAttribute("aria-expanded", "false");
            }
        });
    });
})();

/* =========================
   Ultra-dim toggle (persist)
   ========================= */
(() => {
    const btn = document.getElementById("dimToggle");
    if (!btn) return;

    const KEY = "ultraDim";

    const apply = (on) => {
        document.body.setAttribute("data-dim", on ? "1" : "0");
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.textContent = on ? "Normal" : "Dim";
    };

    const saved = localStorage.getItem(KEY);
    apply(saved === "1");

    btn.addEventListener("click", () => {
        const isOn = document.body.getAttribute("data-dim") === "1";
        const next = !isOn;
        localStorage.setItem(KEY, next ? "1" : "0");
        apply(next);
    });
})();

/* =========================
   DOMContentLoaded features
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
    /* -------------------------
       Back to top (optional)
       ------------------------- */
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        const toggleBtn = () => {
            if (window.scrollY > 400) backToTop.classList.add("show");
            else backToTop.classList.remove("show");
        };
        toggleBtn();
        window.addEventListener("scroll", toggleBtn, { passive: true });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* -------------------------
       Toast helper (optional)
       ------------------------- */
    const toast = document.getElementById("toast");
    let toastTimer = null;

    const showToast = (msg = "Copied ✅") => {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
    };

    /* -------------------------
       Copy buttons (optional)
       Use: <button data-copy="text">Copy</button>
       ------------------------- */
    document.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const value = btn.getAttribute("data-copy") || "";
            if (!value) return;

            try {
                await navigator.clipboard.writeText(value);
                showToast("Copied ✅");
            } catch {
                // fallback for older browsers
                const t = document.createElement("textarea");
                t.value = value;
                document.body.appendChild(t);
                t.select();
                document.execCommand("copy");
                t.remove();
                showToast("Copied ✅");
            }
        });
    });

    /* =========================
       Interactive Terminal (single instance)
       Requires:
         #terminalOut
         #terminalInput
       ========================= */
    const out = document.getElementById("terminalOut");
    const input = document.getElementById("terminalInput");
    if (!out || !input) return; // terminal not present on this page

    const reduced =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const routes = {
        home: "index.html",
        about: "about.html",
        skills: "skills.html",
        education: "projects.html",
        music: "otherinterests.html",
        cv: "cv.html",
        contact: "contact.html",
        terminal: "terminal.html",
    };

    const profile = {
        name: "Olivier Vleeschouwers",
        title: "System & Network Engineer (in training)",
        email: "oliviervleeschouwers@icloud.com",
        github: "https://github.com/oliviervpxl",
        linkedin: "https://www.linkedin.com/in/olivier-vleeschouwers",
        skillsTop: [
            "Windows Server",
            "Linux",
            "Active Directory",
            "Networking",
            "Automation",
            "Virtualization/Cloud (basic)",
        ],
        focus: "Cloud + Automation",
        response: "< 24h",
        internship: "Yes",
    };

    // uptime since first visit (persist)
    const bootKey = "portfolio_boot_ts";
    const now = Date.now();
    const bootTs = Number(localStorage.getItem(bootKey)) || now;
    localStorage.setItem(bootKey, String(bootTs));

    const fmtDays = (ms) => Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));

    // output helpers
    const line = (text, cls = "term-out") => {
        const div = document.createElement("div");
        div.className = `term-line ${cls}`.trim();
        div.textContent = text;
        out.appendChild(div);
        out.scrollTop = out.scrollHeight;
    };

    const promptLine = (cmd) => {
        const div = document.createElement("div");
        div.className = "term-line";
        div.innerHTML = `<span class="term-prompt">$ </span><span class="term-cmd"></span>`;
        out.appendChild(div);
        div.querySelector(".term-cmd").textContent = cmd;
        out.scrollTop = out.scrollHeight;
    };

    const clear = () => {
        out.innerHTML = "";
    };

    const openRoute = (key) => {
        line(`Opening ${key}…`);
        setTimeout(() => {
            window.location.href = routes[key];
        }, reduced ? 0 : 450);
    };

    // command lists
    const sections = Object.keys(routes); // includes terminal
    const baseCommands = [
        "help",
        "ls",
        "whoami",
        "skills",
        "contact",
        "status",
        "clear",
        "ping",
        "uptime",
        "neofetch",
        "sudo",
        "man",
    ];

    // history
    const history = [];
    let histIndex = -1;

    const tokenize = (s) => s.trim().split(/\s+/).filter(Boolean);

    const printHelp = () => {
        line("commands:", "term-strong");
        line("  help                show available commands");
        line("  ls [ -l ]            list sections");
        line("  whoami               about me");
        line("  skills [--top]       show top skills or open skills page");
        line("  contact              show contact details");
        line("  status               availability / response time / focus");
        line("  ping <target>        simulate ping");
        line("  uptime               portfolio uptime");
        line("  neofetch             system summary");
        line("  man <topic>          mini manual");
        line("  clear                clear terminal");
        line("");
        line("sections:", "term-strong");
        line(`  ${sections.join(" | ")}`);
        line("");
        line("tip: type a section name to open it (e.g. 'skills')");
    };

    const printLs = (longMode) => {
        if (!longMode) {
            line(sections.join("  "));
            return;
        }
        line("drwxr-xr-x  home");
        line("drwxr-xr-x  about");
        line("drwxr-xr-x  skills");
        line("drwxr-xr-x  education");
        line("drwxr-xr-x  music");
        line("-rw-r--r--  cv.pdf");
        line("drwxr-xr-x  contact");
        line("drwxr-xr-x  terminal");
    };

    const printWhoami = () => {
        line(profile.name);
        line(profile.title);
    };

    const printContact = () => {
        line(profile.email);
        line(profile.github);
        line(profile.linkedin);
    };

    const printStatus = () => {
        line("System status:", "term-strong");
        line(`  availability      ✔ Available for internship: ${profile.internship}`);
        line(`  response_time     ${profile.response}`);
        line(`  current_focus     ${profile.focus}`);
    };

    const printSkillsTop = () => {
        profile.skillsTop.forEach((s) => line(`• ${s}`));
    };

    const printUptime = () => {
        line(`portfolio up for ${fmtDays(Date.now() - bootTs)} day(s)`);
    };

    const printNeofetch = () => {
        line("OS:        PortfolioOS");
        line("Host:      GitHub Pages");
        line("Kernel:    JS 1.0");
        line(`Uptime:    ${fmtDays(Date.now() - bootTs)} day(s)`);
        line("Shell:     web-terminal");
        line("Theme:     glass");
    };

    const printPing = (target) => {
        const t = target || "olivier.dev";
        line(`PING ${t} (127.0.0.1): 56 data bytes`);
        const times = [3, 2, 4, 2].map((x) => x + Math.floor(Math.random() * 3));
        times.forEach((ms, i) =>
            line(`64 bytes from 127.0.0.1: icmp_seq=${i + 1} ttl=64 time=${ms} ms`)
        );
        line(`--- ${t} ping statistics ---`);
        line("4 packets transmitted, 4 received, 0% packet loss");
    };

    const printMan = (topic) => {
        const t = (topic || "").toLowerCase();
        if (!t) {
            line("usage: man <topic>");
            return;
        }

        const manuals = {
            olivier: [
                "NAME",
                "  Olivier Vleeschouwers",
                "",
                "DESCRIPTION",
                "  IT student focused on system & network administration.",
                "  Interested in stability, automation, and scalable infrastructure.",
                "",
                "SEE ALSO",
                "  skills, status, contact, cv",
            ],
            skills: [
                "NAME",
                "  skills --top",
                "",
                "DESCRIPTION",
                "  Shows key skills. Type 'skills' to open the Skills page.",
            ],
            status: [
                "NAME",
                "  status",
                "",
                "DESCRIPTION",
                "  Shows availability, response time, and current focus.",
            ],
            contact: [
                "NAME",
                "  contact",
                "",
                "DESCRIPTION",
                "  Shows email + GitHub + LinkedIn.",
            ],
        };

        const page =
            manuals[t] ||
            ["No manual entry for this topic.", "Try: man olivier | man skills | man status | man contact"];

        page.forEach((l) => line(l));
    };

    const sudo = () => {
        line("Password:");
        line("Permission denied. Nice try 🙂");
    };

    // router
    const runCommand = (raw) => {
        const cmd = raw.trim();
        if (!cmd) return;

        const parts = tokenize(cmd);
        const head = (parts[0] || "").toLowerCase();

        // open section if user types it
        if (routes[head]) {
            openRoute(head);
            return;
        }

        switch (head) {
            case "help":
                printHelp();
                break;

            case "ls":
                printLs(parts.includes("-l"));
                break;

            case "whoami":
                printWhoami();
                break;

            case "skills":
                if (parts.includes("--top")) printSkillsTop();
                else openRoute("skills");
                break;

            case "contact":
                printContact();
                break;

            case "status":
                printStatus();
                break;

            case "clear":
                clear();
                break;

            case "uptime":
                printUptime();
                break;

            case "neofetch":
                printNeofetch();
                break;

            case "ping":
                printPing(parts[1]);
                break;

            case "sudo":
                sudo();
                break;

            case "man":
                printMan(parts[1]);
                break;

            default:
                line(`Command not found: ${head}`);
                line(`Type 'help' for options.`);
                break;
        }
    };

    // autocomplete (TAB)
    const autocomplete = () => {
        const v = input.value.trim().toLowerCase();
        if (!v) return;

        const manTopics = ["olivier", "skills", "status", "contact"];
        const pool = [...baseCommands, ...sections, ...manTopics];

        const matches = pool.filter((x) => x.startsWith(v));
        if (matches.length === 1) {
            input.value = matches[0];
            return;
        }
        if (matches.length > 1) {
            line(matches.join("  "));
        }
    };

    // history nav
    const historyUp = () => {
        if (history.length === 0) return;
        if (histIndex === -1) histIndex = history.length - 1;
        else histIndex = Math.max(0, histIndex - 1);
        input.value = history[histIndex];
    };

    const historyDown = () => {
        if (history.length === 0) return;
        if (histIndex === -1) return;
        histIndex = Math.min(history.length, histIndex + 1);
        input.value = histIndex === history.length ? "" : history[histIndex];
        if (histIndex === history.length) histIndex = -1;
    };

    // boot
    line("Welcome.");
    line("Type 'help' to navigate. (TAB = autocomplete, ↑/↓ = history)");
    line("");

    // handlers
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = input.value;
            if (!cmd.trim()) return;

            history.push(cmd);
            if (history.length > 50) history.shift();
            histIndex = -1;

            promptLine(cmd);
            input.value = "";
            runCommand(cmd);
        }

        if (e.key === "Tab") {
            e.preventDefault();
            autocomplete();
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            historyUp();
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            historyDown();
        }
    });

    // focus input when clicking terminal
    out.closest(".terminal")?.addEventListener("click", () => input.focus());
});
// Mobile/tablet: start nav collapsed by default
(() => {
    const nav = document.querySelector(".nav-circle");
    const btn = document.querySelector(".nav-toggle");
    if (!nav || !btn) return;

    const mq = window.matchMedia("(max-width: 900px)");

    const apply = () => {
        if (mq.matches) {
            nav.classList.add("collapsed");
            btn.setAttribute("aria-expanded", "false");
        } else {
            nav.classList.remove("collapsed");
            btn.setAttribute("aria-expanded", "true");
        }
    };

    apply();
    mq.addEventListener?.("change", apply);
})();
