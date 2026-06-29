// JavaScript for Study Transformation Bootcamp Landing Page

// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration matching existing CRM App
const firebaseConfig = {
    apiKey: "AIzaSyCPxbmwCwD5WIBEolgfpDIYi90M4qU-jeg",
    authDomain: "magicmentor-c2199.firebaseapp.com",
    projectId: "magicmentor-c2199",
    storageBucket: "magicmentor-c2199.firebasestorage.app",
    messagingSenderId: "1063334828777",
    appId: "1:1063334828777:web:1b12d6fdf9acb8b26f6e78",
    measurementId: "G-63H81NXYHZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    try { initMobileMenu(); } catch (e) { console.error("initMobileMenu failed:", e); }
    try { initFAQs(); } catch (e) { console.error("initFAQs failed:", e); }
    try { initScrollReveal(); } catch (e) { console.error("initScrollReveal failed:", e); }
    try { initStatsCounter(); } catch (e) { console.error("initStatsCounter failed:", e); }
    try { initCountdownTimer(); } catch (e) { console.error("initCountdownTimer failed:", e); }
    try { initVideoModal(); } catch (e) { console.error("initVideoModal failed:", e); }
    try { initEnrollmentForm(); } catch (e) { console.error("initEnrollmentForm failed:", e); }
    try { initHeroSlideshow(); } catch (e) { console.error("initHeroSlideshow failed:", e); }
});

/* 1. Mobile Menu Sidebar Toggle */
function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const mobileSidebar = document.getElementById("mobileSidebar");
    const sidebarLinks = mobileSidebar.querySelectorAll("a");

    if (menuToggle && mobileSidebar) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            mobileSidebar.classList.toggle("active");
        });

        // Close sidebar when link is clicked
        sidebarLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                mobileSidebar.classList.remove("active");
            });
        });
    }
}

/* 2. FAQs Accordion Toggling */
function initFAQs() {
    const faqItems = document.querySelectorAll(".faq-item");
    
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close all active items
            faqItems.forEach(i => i.classList.remove("active"));
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}

/* 3. Scroll Reveal Animations */
function initScrollReveal() {
    const revealCards = document.querySelectorAll(".reveal-card");
    
    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealCards.forEach(card => {
        revealObserver.observe(card);
    });
}

/* 4. Statistics Count-up Animation */
function initStatsCounter() {
    const counters = document.querySelectorAll(".counter");
    
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute("data-target"), 10);
                let count = 0;
                const speed = 2000 / target; // animate over 2 seconds
                
                const updateCount = () => {
                    if (count < target) {
                        count++;
                        counter.innerText = count;
                        setTimeout(updateCount, speed);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => countObserver.observe(c));
}

/* 5. Countdown Urgency Timer */
function initCountdownTimer() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    
    // Set a rolling 2.5-day target time in localStorage if not set, or if expired
    let targetTime = localStorage.getItem("bootcamp_countdown_target");
    const currentTime = new Date().getTime();
    
    if (!targetTime || parseInt(targetTime, 10) < currentTime) {
        // Set target to: 2 days, 14 hours, 39 minutes, 27 seconds from now
        const offset = (2 * 24 * 3600 + 14 * 3600 + 39 * 60 + 27) * 1000;
        targetTime = currentTime + offset;
        localStorage.setItem("bootcamp_countdown_target", targetTime);
    } else {
        targetTime = parseInt(targetTime, 10);
    }
    
    const updateTimer = () => {
        const now = new Date().getTime();
        const diff = targetTime - now;
        
        if (diff <= 0) {
            // Reset to rolling timer if expired (creates persistent urgency for landing page conversion)
            const offset = (1 * 24 * 3600 + 8 * 3600 + 12 * 60 + 15) * 1000; // 1d 8h 12m
            targetTime = now + offset;
            localStorage.setItem("bootcamp_countdown_target", targetTime);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        daysEl.innerText = String(days).padStart(2, "0");
        hoursEl.innerText = String(hours).padStart(2, "0");
        minutesEl.innerText = String(minutes).padStart(2, "0");
        secondsEl.innerText = String(seconds).padStart(2, "0");
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

/* 6. Watch Video Modal Overlay */
function initVideoModal() {
    const playBtn = document.getElementById("playVideoBtn");
    const closeBtn = document.getElementById("closeVideoBtn");
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("videoIframe");
    const overlay = modal.querySelector(".video-modal-overlay");
    
    // YouTube video placeholder (Mash Magic explanation/study motivation video template)
    const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
    
    if (playBtn && closeBtn && modal) {
        playBtn.addEventListener("click", () => {
            iframe.src = videoUrl;
            modal.classList.add("active");
        });
        
        const closeModal = () => {
            iframe.src = "";
            modal.classList.remove("active");
        };
        
        closeBtn.addEventListener("click", closeModal);
        overlay.addEventListener("click", closeModal);
    }
}

/* 7. Enrollment Form Submission & Firestore Lead Sync */
function initEnrollmentForm() {
    const form = document.getElementById("enrollForm");
    const submitBtn = document.getElementById("submitFormBtn");
    const spinner = document.getElementById("formSpinner");
    
    const successModal = document.getElementById("successModal");
    const successPhone = document.getElementById("successPhone");
    const successLeadId = document.getElementById("successLeadId");
    const closeSuccessBtn = document.getElementById("closeSuccessBtn");
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Get input values
            const parentName = document.getElementById("parentName").value;
            const whatsappNumber = document.getElementById("whatsappNumber").value;
            const emailAddress = document.getElementById("emailAddress").value;
            const studentGrade = document.getElementById("studentGrade").value;
            
            // Simple validation
            if (!parentName || !whatsappNumber || !emailAddress || !studentGrade) {
                alert("Please fill in all fields.");
                return;
            }
            
            // Set loading state
            submitBtn.disabled = true;
            spinner.style.display = "block";
            
            try {
                // Fetch next sequential Lead ID LDxxxx
                const nextId = await getNextLeadId();
                
                // Construct Lead object
                const todayDate = getTodayDisplayDate();
                const currentTime = getCurrentDisplayTime();
                
                const newLead = {
                    id: nextId,
                    date: todayDate,
                    time: currentTime,
                    student: parentName.trim(), // Save parent's name under student field
                    class: studentGrade,
                    subject: "Not Specified",
                    phone: whatsappNumber.trim(),
                    city: "Unknown",
                    job: "Not Specified",
                    notes: `Email: ${emailAddress.trim()}\nSubmission: Study Transformation Bootcamp Landing Page Form`,
                    bda: "Unassigned",
                    status: "New",
                    revenue: 0,
                    admissions: 0,
                    history: [
                        {
                            date: todayDate,
                            time: currentTime,
                            note: "Lead created automatically via Bootcamp Landing Page",
                            status: "New",
                            author: "System"
                        }
                    ],
                    source: "Landing Page",
                    marketingLabel: "BM LD",
                    programId: "prog_1782320905596" // Study Transformation Bootcamp program
                };
                
                // Write lead document to firestore
                await setDoc(doc(db, "bootcamp_leads", nextId), newLead);
                
                // Show success modal
                successPhone.innerText = whatsappNumber;
                successLeadId.innerText = nextId;
                successModal.classList.add("active");
                
                // Reset form
                form.reset();
                
            } catch (error) {
                console.error("Firestore Lead Sync failed: ", error);
                alert("Enrollment failed: " + error.message + ". Please try again or contact support.");
            } finally {
                // Remove loading state
                submitBtn.disabled = false;
                spinner.style.display = "none";
            }
        });
    }
    
    // Close success modal behavior
    if (closeSuccessBtn && successModal) {
        const closeSuccess = () => successModal.classList.remove("active");
        closeSuccessBtn.addEventListener("click", closeSuccess);
        successModal.querySelector(".success-modal-overlay").addEventListener("click", closeSuccess);
    }
}

/* --- Helper Utilities --- */

// Fetch the highest lead ID matching LD prefix and increment it
async function getNextLeadId() {
    let nextId = "LD0001";
    try {
        // Query last 1 document where id matches LD prefix, ordered by ID descending
        const q = query(
            collection(db, "bootcamp_leads"),
            where("id", ">=", "LD"),
            where("id", "<", "LE"),
            orderBy("id", "desc"),
            limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const highestDoc = querySnapshot.docs[0].data();
            const highestId = highestDoc.id;
            
            // Extract numbers from LDxxxx
            const match = highestId.match(/\d+/);
            if (match) {
                const currentNum = parseInt(match[0], 10);
                nextId = "LD" + String(currentNum + 1).padStart(4, "0");
            }
        }
    } catch (err) {
        console.error("Query highest sequential ID failed, generating fallback unique ID:", err);
        // Fallback: LD + last 4 digits of timestamp
        nextId = "LD" + String(Date.now()).slice(-4);
    }
    return nextId;
}

// Get date in format dd/mm/yyyy
function getTodayDisplayDate() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Get time in format hh:mm AM/PM
function getCurrentDisplayTime() {
    const d = new Date();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, '0');
    return `${strHours}:${minutes} ${ampm}`;
}

/* 8. Hero Slideshow Auto Transition */
function initHeroSlideshow() {
    const slides = document.querySelectorAll(".hero-slide-img");
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add("active");
        }, 4000);
    }
}
