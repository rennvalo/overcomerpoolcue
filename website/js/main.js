
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      document.body.classList.toggle('mobile-nav-active');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Testimonial slider functionality
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  
  if (testimonials.length > 0 && dots.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        
        // Remove active class from all testimonials and dots
        testimonials.forEach(testimonial => {
          testimonial.classList.remove('active');
        });
        
        dots.forEach(dot => {
          dot.classList.remove('active');
        });
        
        // Add active class to current testimonial and dot
        testimonials[index].classList.add('active');
        this.classList.add('active');
      });
    });

    // Auto-rotate testimonials
    let currentTestimonial = 0;
    const rotateTestimonials = () => {
      testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
      });
      
      dots.forEach(dot => {
        dot.classList.remove('active');
      });
      
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      testimonials[currentTestimonial].classList.add('active');
      dots[currentTestimonial].classList.add('active');
    };

    setInterval(rotateTestimonials, 5000);
  }

  // Notification system
  window.showNotification = function(message) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.querySelector('p').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  };
  
  const closeNotificationBtn = document.querySelector('.close-notification');
  if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener('click', function() {
      document.getElementById('notification').classList.remove('show');
    });
  }
});
