// Project data repository for dynamic modal injection
const projectData = {
    workspace: {
        category: "Clinical Imaging Systems",
        title: "Advanced Visualization Workspace (Philips ISP 13)",
        company: "Sutherland Healthcare Solutions - Philips India",
        timeline: "04/2025 - Present",
        overview: "An enterprise-scale clinical visualization and analysis platform (Philips IntelliSpace Portal 13). It provides clinicians and radiologists with AI-powered diagnostic tools to access, process, and analyze CT, MRI, and nuclear medicine scans across hospital networks, fully complying with DICOM standards.",
        keyResults: [
            "Integrated first-party and third-party AI-powered diagnostic applications into a unified, modular plug-and-play workspace architecture.",
            "Optimized rendering pipelines for high-resolution medical imaging (CT/MRI/NM), increasing Nuclear Medicine display speeds by 35%.",
            "Incorporated AI uncertainty quantification alongside diagnostic outputs to improve radiological decision confidence and workflow efficiency.",
            "Streamlined collaborative workflows between radiologists and referring physicians, reducing diagnostic delays."
        ],
        technologies: ["C#", "WPF", ".NET Framework", "XAML", "DICOM", "AI Integration", "Multithreading", "WCF"]
    },
    aidt: {
        category: "Process Automation & Analytics",
        title: "Automation Identification Diagnostic Tool (AIDT)",
        company: "Accenture",
        timeline: "08/2020 - 04/2025",
        overview: "A proprietary desktop diagnostic and activity-recording agent developed by Accenture. It records and analyzes user desktop workflows to automatically identify manual, repetitive tasks suitable for robotic process automation (RPA), creating optimized process blueprints.",
        keyResults: [
            "Engineered the desktop recording agent (C#, WPF) to track user clicks, keystrokes, and application logs during workflow sessions.",
            "Developed process-mining algorithms to parse session log data, automatically pinpointing predictable BPO/F&A workflows for automation.",
            "Generated structured process blueprints that accelerated transition from human-only processes to automated RPA workflows.",
            "Designed secure data capture mechanisms ensuring sensitive client desktop telemetry was encrypted and sanitized before analysis."
        ],
        technologies: ["C#", "WPF", ".NET Core", "Process Mining", "Data Encryption", "Activity Recording", "XML/JSON"]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // 2. Navbar Scrolling Effects
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 3. Mobile Navigation Drawer Menu Toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            const isOpen = navMenu.classList.contains("open");
            mobileToggle.innerHTML = isOpen 
                ? '<i data-lucide="x"></i>' 
                : '<i data-lucide="menu"></i>';
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
        });

        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
                if (typeof lucide !== "undefined") {
                    lucide.createIcons();
                }
            });
        });
    }

    // 4. Scroll Reveal Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll(".fade-in-up");
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("appear");
                observer.unobserve(entry.target); // Stop observing once animate is done
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // 5. Scroll Spy: Highlight Active Nav Link
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    // Initialize premium animations & effects
    initCustomCursor();
    initTypingAnimation();
});

// 6. Project Details Modal Functions
function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    const modal = document.getElementById("projectModal");
    const modalBody = document.getElementById("modalBody");

    // Construct modal HTML content
    let techPillsHtml = data.technologies.map(tech => `<span class="modal-tech-pill">${tech}</span>`).join("");
    let bulletsHtml = data.keyResults.map(bullet => `<li>${bullet}</li>`).join("");

    modalBody.innerHTML = `
        <div class="modal-header-section">
            <span class="modal-category">${data.category}</span>
            <h3 class="modal-title-h text-gradient">${data.title}</h3>
            <div class="modal-meta-row">
                <div class="modal-meta-item">
                    <i data-lucide="briefcase"></i>
                    <span>${data.company}</span>
                </div>
                <div class="modal-meta-item">
                    <i data-lucide="calendar"></i>
                    <span>${data.timeline}</span>
                </div>
            </div>
        </div>
        <div class="modal-body-section">
            <h4>Project Overview</h4>
            <p>${data.overview}</p>
            
            <h4>Key Contributions & Business Outcomes</h4>
            <ul class="modal-list">
                ${bulletsHtml}
            </ul>
            
            <h4>Technologies Applied</h4>
            <div class="modal-tech-pills">
                ${techPillsHtml}
            </div>
        </div>
    `;

    // Show modal and disable scrolling on body
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Initialize icons injected in the modal
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

function closeProjectModal() {
    const modal = document.getElementById("projectModal");
    modal.classList.add("hidden");
    // Enable scrolling on body
    document.body.style.overflow = "auto";
}

// Close modal when pressing 'Escape' key
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeProjectModal();
    }
});

// 7. Contact Form — Real Web3Forms Submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("formSubmitBtn");
    const successMsg = document.getElementById("formSuccessMessage");
    const errorMsg = document.getElementById("formErrorMessage");
    const errorText = document.getElementById("formErrorText");

    // Hide any previously shown feedback messages
    successMsg.classList.add("hidden");
    errorMsg.classList.add("hidden");

    // Show loading state on button
    submitBtn.innerHTML = 'Sending... <i data-lucide="loader" style="animation: spin 1s linear infinite;"></i>';
    submitBtn.disabled = true;
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    try {
        const formData = new FormData(form);
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success === true) {
            // Success: reset form, hide it, show success banner
            form.reset();
            form.classList.add("hidden");
            successMsg.classList.remove("hidden");
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
        } else {
            // API returned a failure response
            const message = data.message || "Submission failed. Please try again or email me directly at ramesh980514@gmail.com.";
            errorText.textContent = message;
            errorMsg.classList.remove("hidden");
        }
    } catch (err) {
        // Network or unexpected error
        errorText.textContent = "A network error occurred. Please check your connection and try again, or email ramesh980514@gmail.com directly.";
        errorMsg.classList.remove("hidden");
    } finally {
        // Restore submit button state regardless of outcome
        submitBtn.innerHTML = 'Send Message <i data-lucide="send"></i>';
        submitBtn.disabled = false;
        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    }
}

// 8. Interactive Custom Cursor Trail
function initCustomCursor() {
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    
    if (!cursorDot || !cursorOutline) return;

    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    if (!hasMouse) return;

    // Hide on start to prevent sudden jump/pop
    cursorDot.style.opacity = "0";
    cursorOutline.style.opacity = "0";

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let hasMoved = false;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!hasMoved) {
            cursorDot.style.opacity = "1";
            cursorOutline.style.opacity = "0.5";
            outlineX = mouseX;
            outlineY = mouseY;
            hasMoved = true;
        }

        // Immediate position for the dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth trail using requestAnimationFrame
    function animateOutline() {
        const lerpFactor = 0.15;
        outlineX += (mouseX - outlineX) * lerpFactor;
        outlineY += (mouseY - outlineY) * lerpFactor;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    requestAnimationFrame(animateOutline);

    // Hover animations using event delegation
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest("a, button, .project-card, input, textarea, select")) {
            cursorOutline.classList.add("hovered");
            cursorDot.classList.add("hovered");
        } else {
            cursorOutline.classList.remove("hovered");
            cursorDot.classList.remove("hovered");
        }
    });

    // Hide cursor when leaving the window
    document.addEventListener("mouseleave", () => {
        cursorDot.style.opacity = "0";
        cursorOutline.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        if (hasMoved) {
            cursorDot.style.opacity = "1";
            cursorOutline.style.opacity = cursorOutline.classList.contains("hovered") ? "1" : "0.5";
        }
    });
}

// 10. Dynamic Role Typist Animation
function initTypingAnimation() {
    const typingElement = document.getElementById("typingRole");
    if (!typingElement) return;

    const roles = [
        "Software Dev Engineer",
        "C# / .NET Developer",
        "Cloud & AI Integrator",
        "Problem Solver"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}
