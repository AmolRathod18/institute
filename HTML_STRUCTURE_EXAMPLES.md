# 📐 SPACING & ALIGNMENT - PERFECT HTML STRUCTURE EXAMPLES

Use these HTML patterns with the spacing-alignment.css for optimal results across all pages.

---

## 1. STANDARD SECTION WITH CENTERED HEADER

```html
<section class="section-padding">
    <div class="container">
        <!-- Centered header -->
        <div class="section-header">
            <span class="section-eyebrow-tag">Optional Badge</span>
            <h2 class="section-title">Section Title Here</h2>
            <p class="section-subtitle">Optional descriptive text goes here</p>
        </div>
        
        <!-- Content -->
        <div class="row g-4">
            <div class="col-lg-6">
                <!-- Your content -->
            </div>
            <div class="col-lg-6">
                <!-- Your content -->
            </div>
        </div>
    </div>
</section>
```

---

## 2. SECTION WITH LEFT-ALIGNED HEADER

```html
<section class="section-padding">
    <div class="container">
        <!-- Left-aligned header -->
        <div class="section-header text-start">
            <span class="section-eyebrow-tag">Badge</span>
            <h2 class="section-title">Left Aligned Title</h2>
        </div>
        
        <!-- Content -->
        <div class="row g-5 align-items-center">
            <div class="col-lg-6">
                <p class="lead">Your paragraph content here</p>
                <p>Additional paragraph text...</p>
            </div>
            <div class="col-lg-6">
                <img src="image.jpg" alt="Description" class="img-fluid">
            </div>
        </div>
    </div>
</section>
```

---

## 3. HERO/HEADER SECTION

```html
<section class="hero-section">
    <div class="container">
        <div class="hero-content">
            <!-- Centered content in hero -->
            <span class="section-eyebrow-tag">Your Badge</span>
            <h1 class="hero-title">Your Main Title</h1>
            <p class="hero-subtitle">Supporting text here</p>
            
            <div style="margin-top: 2rem;">
                <a href="#" class="btn btn-primary btn-lg">
                    <i class="bi bi-icon"></i> Button Text
                </a>
            </div>
        </div>
    </div>
</section>
```

---

## 4. GRID WITH MULTIPLE ITEMS (3 COLUMNS)

```html
<section class="section-padding bg-light">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Three Column Section</h2>
        </div>
        
        <div class="row g-4">
            <!-- Column 1 -->
            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h4>Card Title</h4>
                        <p>Card content goes here...</p>
                    </div>
                </div>
            </div>
            
            <!-- Column 2 -->
            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h4>Card Title</h4>
                        <p>Card content goes here...</p>
                    </div>
                </div>
            </div>
            
            <!-- Column 3 -->
            <div class="col-lg-4 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h4>Card Title</h4>
                        <p>Card content goes here...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

---

## 5. FEATURE LIST WITH ICONS

```html
<section class="section-padding">
    <div class="container">
        <div class="row g-4">
            <!-- Feature 1 -->
            <div class="col-md-6">
                <div class="feature-item">
                    <div class="feature-icon">
                        <i class="bi bi-icon"></i>
                    </div>
                    <div class="feature-content">
                        <h4>Feature Title</h4>
                        <p>Feature description text goes here...</p>
                    </div>
                </div>
            </div>
            
            <!-- Feature 2 -->
            <div class="col-md-6">
                <div class="feature-item">
                    <div class="feature-icon">
                        <i class="bi bi-icon"></i>
                    </div>
                    <div class="feature-content">
                        <h4>Feature Title</h4>
                        <p>Feature description text goes here...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

---

## 6. IMAGE + TEXT SECTION

```html
<section class="section-padding">
    <div class="container">
        <div class="row g-5 align-items-center">
            <!-- Image Column -->
            <div class="col-lg-6">
                <img src="image.jpg" alt="Image description" class="img-fluid">
            </div>
            
            <!-- Text Column -->
            <div class="col-lg-6">
                <span class="section-eyebrow-tag">Badge</span>
                <h2 class="section-title text-start">Your Title</h2>
                <p class="lead">Lead paragraph text...</p>
                <p>Regular paragraph text...</p>
                
                <ul style="list-style: none; padding: 0;">
                    <li><i class="bi bi-check2-circle"></i> Point one</li>
                    <li><i class="bi bi-check2-circle"></i> Point two</li>
                    <li><i class="bi bi-check2-circle"></i> Point three</li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

---

## 7. FULL-WIDTH SECTION WITH BACKGROUND COLOR

```html
<section class="section-padding bg-light">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Full Width Section</h2>
            <p class="section-subtitle">With background color</p>
        </div>
        
        <div class="row g-4">
            <!-- Your content columns -->
        </div>
    </div>
</section>
```

---

## 8. CALL TO ACTION SECTION

```html
<section class="section-padding" style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: white;">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title" style="color: white;">Ready to Get Started?</h2>
            <p class="section-subtitle" style="color: rgba(255,255,255,0.9);">Call to action description</p>
        </div>
        
        <div class="text-center">
            <a href="#" class="btn btn-light btn-lg me-2">Primary CTA</a>
            <a href="#" class="btn btn-outline-light btn-lg">Secondary CTA</a>
        </div>
    </div>
</section>
```

---

## 9. FORM SECTION

```html
<section class="section-padding">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Contact Form</h2>
        </div>
        
        <div class="row">
            <div class="col-lg-6 mx-auto">
                <form>
                    <div class="mb-3">
                        <label for="name" class="form-label">Your Name</label>
                        <input type="text" class="form-control" id="name" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="message" class="form-label">Message</label>
                        <textarea class="form-control" id="message" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg w-100">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>
```

---

## 10. STATS/NUMBERS SECTION

```html
<section class="section-padding">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Our Achievements</h2>
        </div>
        
        <div class="row g-4 text-center">
            <div class="col-md-3 col-sm-6">
                <div class="stat-box">
                    <div class="stat-icon">
                        <i class="bi bi-icon"></i>
                    </div>
                    <div class="stat-number">500+</div>
                    <p class="stat-label">Projects Completed</p>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6">
                <div class="stat-box">
                    <div class="stat-icon">
                        <i class="bi bi-icon"></i>
                    </div>
                    <div class="stat-number">200+</div>
                    <p class="stat-label">Happy Clients</p>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6">
                <div class="stat-box">
                    <div class="stat-icon">
                        <i class="bi bi-icon"></i>
                    </div>
                    <div class="stat-number">50+</div>
                    <p class="stat-label">Team Members</p>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6">
                <div class="stat-box">
                    <div class="stat-icon">
                        <i class="bi bi-icon"></i>
                    </div>
                    <div class="stat-number">10+</div>
                    <p class="stat-label">Years Experience</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

---

## KEY RULES FOR PERFECT ALIGNMENT

✅ **Always use:**
```html
<section class="section-padding">
    <div class="container">
        <!-- Your content here -->
    </div>
</section>
```

✅ **Use `g-4` or `g-5` for spacing between columns:**
```html
<div class="row g-4">
    <div class="col-lg-6">...</div>
    <div class="col-lg-6">...</div>
</div>
```

✅ **Use `align-items-center` to vertically center content:**
```html
<div class="row g-5 align-items-center">
    <div class="col-lg-6">Image</div>
    <div class="col-lg-6">Text</div>
</div>
```

✅ **Wrap image and text in proper grid:**
```html
<div class="row align-items-center">
    <div class="col-lg-6"><img ...></div>
    <div class="col-lg-6"><p>Text...</p></div>
</div>
```

❌ **Avoid:**
- Direct padding on sections (use .container instead)
- Margin on .container (let it auto-center)
- Inconsistent column gaps (always use g-3, g-4, or g-5)
- Text alignment switches (use text-center or text-start consistently)

---

## RESPONSIVE BREAKPOINTS

```
Desktop:  1024px and up   → Full width, 2rem padding
Tablet:   768px - 1024px  → Medium width, 1.5rem padding  
Mobile:   up to 768px     → Full width, 1rem padding
```

---

**Apply these patterns to all your pages for consistent, professional alignment! ✨**
