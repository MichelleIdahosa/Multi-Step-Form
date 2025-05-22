//Used constant (const) to grabs all key elements i interacted with
const form = document.getElementById('multiStepForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const nextBtns = document.querySelectorAll('.next-btn');
const backBtns = document.querySelectorAll('.back-btn');
const stepIndicators = document.querySelectorAll('.sidebar .step');
const billingToggle = document.getElementById('billingToggle');
const planBoxes = document.querySelectorAll('.plan-box');
const addonBoxes = document.querySelectorAll('.addon-box');
const summaryPlan = document.querySelector('.summary-plan strong');
const summaryPlanPrice = document.querySelector('.summary-plan span');
const summaryAddons = document.querySelector('.summary-addons');
const totalAmount = document.querySelector('.total strong');

//Start the form at step 0 (Your Info) and set the default billing mode to `'Monthly'
let currentStep = 0;
let billingMode = 'monthly'; // or 'yearly'

// This shows only the current step and highlights the matching step number in the sidebar using the .active class.
function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === currentStep);
    stepIndicators[index]?.classList.toggle('active', index === currentStep);
  });
}

// Allow the user to navigate forward and backward through the form
nextBtns.forEach(button => {
  button.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStep();

      if (currentStep === 3) {
        updateSummary();
      }
    }
  });
});

backBtns.forEach(button => {
  button.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });
});

// Submit final confirmation- When the user hits Confirm, it prevents the page from reloading and shows the final Thank You step
form.addEventListener('submit', e => {
  e.preventDefault();
  currentStep++;
  updateStep();
});

// Highlight selected plan-  When a user clicks a plan, it: a. Visually highlights the selected box, b.Checks the associated radio input
planBoxes.forEach(box => {
  box.addEventListener('click', () => {
    planBoxes.forEach(b => b.classList.remove('selected'));
    box.classList.add('selected');
    box.querySelector('input[type="radio"]').checked = true;
  });
});

// Highlight selected addons- Each add-on box is highlighted only if its checkbox is selected.
addonBoxes.forEach(box => {
  const checkbox = box.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    box.classList.toggle('selected', checkbox.checked);
  });
});

// Toggle billing mode-If the toggle is ON, it sets billing to yearly, and updates prices in the UI accordingly.
billingToggle.addEventListener('change', () => {
  billingMode = billingToggle.checked ? 'yearly' : 'monthly';

  // Update plan labels
  planBoxes.forEach(box => {
    const planName = box.querySelector('strong').textContent;
    const priceText = box.querySelector('p');
    if (billingMode === 'yearly') {
      if (planName === 'Arcade') priceText.textContent = '$90/yr';
      if (planName === 'Advanced') priceText.textContent = '$120/yr';
      if (planName === 'Pro') priceText.textContent = '$150/yr';
    } else {
      if (planName === 'Arcade') priceText.textContent = '$9/mo';
      if (planName === 'Advanced') priceText.textContent = '$12/mo';
      if (planName === 'Pro') priceText.textContent = '$15/mo';
    }
  });

  // Also update addon prices
  addonBoxes.forEach(box => {
    const label = box.querySelector('span');
    const addon = box.querySelector('strong').textContent;

    if (billingMode === 'yearly') {
      if (addon === 'Online service') label.textContent = '+$10/yr';
      if (addon === 'Larger storage') label.textContent = '+$20/yr';
      if (addon === 'Customizable Profile') label.textContent = '+$20/yr';
    } else {
      if (addon === 'Online service') label.textContent = '+$1/mo';
      if (addon === 'Larger storage') label.textContent = '+$2/mo';
      if (addon === 'Customizable Profile') label.textContent = '+$2/mo';
    }
  });
});

// Update summary step -This builds your summary section dynamically based on the user’s selected plan and add-ons. It also calculates the total price
function updateSummary() {
  const selectedPlan = document.querySelector('.plan-box.selected');
  const planName = selectedPlan.querySelector('strong').textContent;
  const planPrice = selectedPlan.querySelector('p').textContent;

  summaryPlan.textContent = `${planName} (${billingMode === 'yearly' ? 'Yearly' : 'Monthly'})`;
  summaryPlanPrice.textContent = planPrice;

  // Add-ons
  summaryAddons.innerHTML = ''; // Clear old entries
  const selectedAddons = document.querySelectorAll('.addon-box input:checked');
  let total = parseFloat(planPrice.replace(/[^0-9.]/g, ''));

  selectedAddons.forEach(addon => {
    const addonText = addon.parentElement.querySelector('strong').textContent;
    const addonPrice = addon.parentElement.querySelector('span').textContent;

    summaryAddons.innerHTML += `
      <div class="addon-line">
        <p>${addonText}</p>
        <span>${addonPrice}</span>
      </div>
    `;

    total += parseFloat(addonPrice.replace(/[^0-9.]/g, ''));
  });

  totalAmount.textContent = `$${total}/${billingMode === 'yearly' ? 'yr' : 'mo'}`;
}

// Initialize first step
updateStep();
