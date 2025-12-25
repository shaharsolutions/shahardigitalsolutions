// --- Scroll Animations (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // --- Accordion Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                const btn = i.querySelector('.accordion-header');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // If it wasn't active before, open it
            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Scroll Down Arrow Logic ---
    const scrollArrow = document.querySelector('.scroll-down-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
             // Scroll to the next section (Audience Section)
             const nextSection = document.getElementById('audience');
             if (nextSection) {
                 nextSection.scrollIntoView({ behavior: 'smooth' });
             } else {
                 window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
             }
        });
    }

    // --- Form Submission Logic ---
    const form = document.querySelector('#leadForm');
    const submitBtn = document.querySelector('#submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const formMessage = document.querySelector('#formMessage');

    // IMPORTANT: Replace this URL with your deployed Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwomNjxgyHEifJXYvsL__ABN8oOP7AOeHCQDTaFxVkdLeuHVMtCbgpSyISd01FGsjai/exec'; 

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Basic Validation
        const fullName = form.fullName.value.trim();
        const phone = form.phone.value.trim();
        
        if (!fullName || !phone) {
            showMessage('נא למלא שם וטלפון תקינים', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        formMessage.textContent = '';

        // Prepare data
        // We use FormData to easily handle the fields
        const formData = new FormData(form);
        
        // If sending to Google Apps Script, it's often easier to send JSON or use standard form-data
        // Because of CORS, typical fetch calls to GAS can be tricky if not handled right.
        // We will use 'no-cors' mode or JSONP approaches, but the standard now is simply POST.
        // The script returns a redirect usually, or text.
        
        // NOTE: Standard GAS 'doPost' handling:
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // This is often needed for simple submissions to GAS without complex auth/headers causing preflight issues
            body: formData
        })
        .then(response => {
            // Because of 'no-cors', we get an opaque response. We can't really check .ok or .json().
            // We assume success if no network error occurred.
            // For a robust production app, you might want a proxy or specific headers, 
            // but 'no-cors' is the standard simple way for landing pages.
            
            showMessage('תודה! הפרטים נשלחו בהצלחה. נחזור אליך בהקדם.', 'success');
            form.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            showMessage('אופס! משהו השתבש. אנא נסה שנית או צור קשר בטלפון.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        });
    });

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        
        // Clear success message after a few seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
});
