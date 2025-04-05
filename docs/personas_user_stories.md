# Personas & User Stories
## 👩‍💼 Persona 1: Health-Conscious Customer
**Name:** Sarah  
**Age:** 28  
**Occupation:** Marketing Manager  
**Goals:**  
- Find affordable, healthy meals without cooking  
- Filter meals by dietary restrictions  
**Frustrations:**  
- Limited healthy takeout options  
- Unclear meal ingredients  

### User Stories
1. **Browse Meal Plans**  
   *"As Sarah, I want to see available meal plans so I can choose what fits my diet."*  
   - **Acceptance Criteria:**  
     - [ ] Meal cards display name, type, and price  
     - [ ] Page loads without errors  

2. **Filter by Dietary Type**  
   *"As Sarah, I want to filter by vegetarian/vegan options so I can avoid foods I don't eat."*  
   - **Acceptance Criteria:**  
     - [ ] Filter buttons for Veg/Non-Veg/Vegan  
     - [ ] Only matching meals display when filtered  

---

## 👨‍🍳 Persona 2: Home Chef
**Name:** Raj  
**Age:** 40  
**Occupation:** Part-time chef  
**Goals:**  
- Earn income by selling homemade meals  
- Manage orders efficiently  
**Frustrations:**  
- No platform to reach local customers  

### User Stories
1. **Add Meal Plans**  
   *"As Raj, I want to add new meal plans so customers can order them."*  
   - **Acceptance Criteria:**  
     - [ ] Admin form for name, type, price  
     - [ ] New meals appear in listings  

2. **View Orders**  
   *"As Raj, I want to see pending orders so I can prepare meals on time."*  
   - **Acceptance Criteria:**  
     - [ ] Dashboard shows customer orders  
     - [ ] Orders sort by delivery date  

---

## Technical Stories
1. **Backend Setup**  
   *"As a developer, I need Django models for meal plans so we can store data."*  
   - **Acceptance Criteria:**  
     - [ ] `DietPlan` model created  
     - [ ] Admin panel configured  

2. **Frontend Scaffolding**  
   *"As a developer, I need React components to display meals so users can browse."*  
   - **Acceptance Criteria:**  
     - [ ] Basic meal listing page  
     - [ ] Responsive design  