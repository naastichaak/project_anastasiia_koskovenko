const navMenu = document.getElementById("navMenu");
const hamburger = document.getElementById("hamburger");
const shortlistCount = document.getElementById("shortlistCount");
const shortlistKey = "sora-shortlist";

function getShortlist() {
  return JSON.parse(localStorage.getItem(shortlistKey) || "[]");
}

function saveShortlist(items) {
  localStorage.setItem(shortlistKey, JSON.stringify(items));
}

function updateShortlistUI() {
  const items = getShortlist();

  if (shortlistCount) {
    shortlistCount.textContent = items.length;
  }

  document.querySelectorAll("[data-shortlist]").forEach((button) => {
    const itemName = button.dataset.shortlist;
    const saved = items.includes(itemName);
    button.textContent = saved ? "Saved to shortlist" : "Add to shortlist";
    button.classList.toggle("saved", saved);
  });
}

function toggleMenu(forceClose = false) {
  if (!navMenu || !hamburger) {
    return;
  }

  const shouldOpen = forceClose ? false : !navMenu.classList.contains("open");
  navMenu.classList.toggle("open", shouldOpen);
  hamburger.setAttribute("aria-expanded", String(shouldOpen));
}

if (hamburger) {
  hamburger.addEventListener("click", () => toggleMenu());
}

document.addEventListener("click", (event) => {
  if (!navMenu || !hamburger || window.innerWidth > 768) {
    return;
  }

  const clickedInsideMenu = navMenu.contains(event.target) || hamburger.contains(event.target);
  if (!clickedInsideMenu) {
    toggleMenu(true);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleMenu(true);
  }
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      toggleMenu(true);
    }
  });
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".fade-in").forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));
}

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".collection-card").forEach((card) => {
      const matches = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("hidden-card", !matches);
    });
  });
});

document.querySelectorAll("[data-shortlist]").forEach((button) => {
  button.addEventListener("click", () => {
    const itemName = button.dataset.shortlist;
    const items = getShortlist();
    const exists = items.includes(itemName);
    const nextItems = exists ? items.filter((item) => item !== itemName) : [...items, itemName];

    saveShortlist(nextItems);
    updateShortlistUI();
  });
});

document.getElementById("shortlistButton")?.addEventListener("click", () => {
  const items = getShortlist();
  const message = items.length
    ? `Your shortlist: ${items.join(", ")}`
    : "Your shortlist is empty. Add furniture items from the collections section.";

  alert(message);
});

const estimateForm = document.getElementById("estimateForm");
const storageLevel = document.getElementById("storageLevel");
const storageLevelValue = document.getElementById("storageLevelValue");

function updateEstimate() {
  const roomValue = Number(document.getElementById("roomType")?.value || 0);
  const materialValue = Number(document.getElementById("materialType")?.value || 1);
  const storageValue = Number(storageLevel?.value || 3);
  const timelineValue = Number(document.getElementById("timeline")?.value || 1);

  const price = Math.round(roomValue * materialValue * timelineValue + storageValue * 90);
  const estimatedWeeks = timelineValue > 1 ? "3-5 weeks" : "4-6 weeks";
  const roomName = document.getElementById("roomType")?.selectedOptions[0]?.textContent || "room";
  const materialName = document.getElementById("materialType")?.selectedOptions[0]?.textContent || "finish";

  document.getElementById("estimatePrice").textContent = price;
  document.getElementById("estimateTimeline").textContent = `Approximate completion time: ${estimatedWeeks}`;
  document.getElementById("estimateRecommendation").textContent =
    `A ${roomName.toLowerCase()} project with ${materialName.toLowerCase()} and storage level ${storageValue}/5 is a practical match for your current request.`;
}

if (storageLevel && storageLevelValue) {
  storageLevel.addEventListener("input", () => {
    storageLevelValue.textContent = storageLevel.value;
    updateEstimate();
  });
}

estimateForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  updateEstimate();
});

estimateForm?.querySelectorAll("select").forEach((select) => {
  select.addEventListener("change", updateEstimate);
});

document.getElementById("scrollLeft")?.addEventListener("click", () => {
  document.getElementById("projectsSlider")?.scrollBy({ left: -280, behavior: "smooth" });
});

document.getElementById("scrollRight")?.addEventListener("click", () => {
  document.getElementById("projectsSlider")?.scrollBy({ left: 280, behavior: "smooth" });
});

const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = Array.from(contactForm.querySelectorAll("input, select, textarea"));
  const status = document.getElementById("formStatus");
  const invalidField = fields.find((field) => !field.value.trim());
  const email = document.getElementById("emailAddress");

  if (invalidField) {
    status.textContent = "Please complete all form fields before submitting.";
    status.classList.add("error");
    invalidField.focus();
    return;
  }

  if (email && !email.value.includes("@")) {
    status.textContent = "Please enter a valid email address.";
    status.classList.add("error");
    email.focus();
    return;
  }

  const formData = Object.fromEntries(new FormData(contactForm).entries());
  localStorage.setItem("sora-last-request", JSON.stringify(formData));

  status.textContent = `Thank you, ${formData.fullName}. Your ${formData.projectType.toLowerCase()} request has been saved.`;
  status.classList.remove("error");
  status.classList.add("success");
  contactForm.reset();
});

updateShortlistUI();
updateEstimate();
