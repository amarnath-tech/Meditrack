// Global variables
let currentUser = null
let currentSection = "home"
const medicines = [
  {
    id: 1,
    name: "Dolo 650",
    pharmacy: "MedPlus Pharmacy",
    price: 25,
    quantity: 50,
    expiry: "2025-06-15",
    distance: "0.5 km",
    status: "available",
  },
  {
    id: 2,
    name: "Paracetamol 500mg",
    pharmacy: "Apollo Pharmacy",
    price: 15,
    quantity: 5,
    expiry: "2024-12-20",
    distance: "1.2 km",
    status: "low-stock",
  },
  {
    id: 3,
    name: "Crocin Advance",
    pharmacy: "Guardian Pharmacy",
    price: 30,
    quantity: 0,
    expiry: "2025-03-10",
    distance: "2.1 km",
    status: "out-of-stock",
  },
]

let inventory = [
  {
    id: 1,
    name: "Dolo 650",
    quantity: 50,
    price: 25,
    expiry: "2025-06-15",
    batch: "DL001",
    status: "available",
  },
  {
    id: 2,
    name: "Paracetamol 500mg",
    quantity: 5,
    price: 15,
    expiry: "2024-12-20",
    batch: "PC002",
    status: "low-stock",
  },
  {
    id: 3,
    name: "Aspirin 75mg",
    quantity: 25,
    price: 20,
    expiry: "2024-08-30",
    batch: "AS003",
    status: "expiring-soon",
  },
]

let alerts = [
  {
    id: 1,
    medicine: "Insulin Pen",
    location: "Within 2km",
    created: "2024-01-15",
  },
  {
    id: 2,
    medicine: "Blood Pressure Monitor",
    location: "Within City",
    created: "2024-01-10",
  },
]

const pharmacies = [
  {
    id: 1,
    name: "MedPlus Pharmacy",
    owner: "Dr. Rajesh Kumar",
    phone: "+91 9876543210",
    address: "Main Street, City Center",
    status: "approved",
    registered: "2024-01-01",
  },
  {
    id: 2,
    name: "HealthCare Pharmacy",
    owner: "Ms. Priya Sharma",
    phone: "+91 9876543211",
    address: "Park Road, Sector 5",
    status: "pending",
    registered: "2024-01-20",
  },
]

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  showSection("home")
  loadInventory()
  loadAlerts()
  loadPharmacies()
  setupEventListeners()
})

// Navigation functions
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show selected section
  document.getElementById(sectionName).classList.add("active")
  currentSection = sectionName

  // Update navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })
}

// Search functions
function searchFromHero() {
  const query = document.getElementById("heroSearch").value
  if (query.trim()) {
    document.getElementById("medicineSearch").value = query
    showSection("search")
    searchMedicine()
  }
}

function searchMedicine() {
  const query = document.getElementById("medicineSearch").value.toLowerCase()
  const locationFilter = document.getElementById("locationFilter").value
  const priceFilter = document.getElementById("priceFilter").value

  let filteredMedicines = medicines.filter((medicine) => medicine.name.toLowerCase().includes(query))

  // Apply filters
  if (priceFilter) {
    filteredMedicines = filteredMedicines.filter((medicine) => {
      switch (priceFilter) {
        case "low":
          return medicine.price < 50
        case "medium":
          return medicine.price >= 50 && medicine.price <= 200
        case "high":
          return medicine.price > 200
        default:
          return true
      }
    })
  }

  displaySearchResults(filteredMedicines)
}

function displaySearchResults(results) {
  const resultsContainer = document.getElementById("searchResults")

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="no-results">No medicines found. Try adjusting your search criteria.</p>'
    return
  }

  resultsContainer.innerHTML = results
    .map(
      (medicine) => `
        <div class="medicine-card">
            <div class="medicine-header">
                <div class="medicine-name">${medicine.name}</div>
                <div class="medicine-price">₹${medicine.price}</div>
            </div>
            <div class="pharmacy-info">
                <div class="pharmacy-name">${medicine.pharmacy}</div>
                <div class="distance">${medicine.distance}</div>
            </div>
            <div class="medicine-details">
                <div class="detail">
                    <i class="fas fa-boxes"></i>
                    <span>Qty: ${medicine.quantity}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-calendar"></i>
                    <span>Exp: ${formatDate(medicine.expiry)}</span>
                </div>
                <div class="status ${medicine.status}">
                    ${getStatusText(medicine.status)}
                </div>
            </div>
            <div class="medicine-actions">
                <button class="btn btn-primary" onclick="reserveMedicine(${medicine.id})" 
                        ${medicine.status === "out-of-stock" ? "disabled" : ""}>
                    ${medicine.status === "out-of-stock" ? "Out of Stock" : "Reserve"}
                </button>
                <button class="btn btn-secondary" onclick="getDirections('${medicine.pharmacy}')">
                    <i class="fas fa-map-marker-alt"></i> Directions
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function scanBarcode() {
  showNotification("Barcode scanner activated. Point camera at barcode.", "success")
  // Simulate barcode scan
  setTimeout(() => {
    document.getElementById("medicineSearch").value = "Dolo 650"
    searchMedicine()
    showNotification("Barcode scanned successfully!", "success")
  }, 2000)
}

function reserveMedicine(medicineId) {
  const medicine = medicines.find((m) => m.id === medicineId)
  if (medicine) {
    showNotification(`${medicine.name} reserved at ${medicine.pharmacy}. Please collect within 2 hours.`, "success")
  }
}

function getDirections(pharmacyName) {
  showNotification(`Opening directions to ${pharmacyName}...`, "success")
  // In real implementation, this would open Google Maps
}

// Alert functions
function loadAlerts() {
  const alertsList = document.getElementById("alertsList")

  if (alerts.length === 0) {
    alertsList.innerHTML =
      '<p class="no-alerts">No active alerts. Add an alert to get notified when medicines are back in stock.</p>'
    return
  }

  alertsList.innerHTML = alerts
    .map(
      (alert) => `
        <div class="alert-item">
            <div>
                <strong>${alert.medicine}</strong>
                <div class="alert-details">
                    <span>${alert.location}</span> • 
                    <span>Created: ${formatDate(alert.created)}</span>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="removeAlert(${alert.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `,
    )
    .join("")
}

function showAlertModal() {
  document.getElementById("alertModal").style.display = "block"
}

function removeAlert(alertId) {
  alerts = alerts.filter((alert) => alert.id !== alertId)
  loadAlerts()
  showNotification("Alert removed successfully!", "success")
}

// Pharmacy functions
function loadInventory() {
  const inventoryBody = document.getElementById("inventoryBody")

  inventoryBody.innerHTML = inventory
    .map(
      (item) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>${formatDate(item.expiry)}</td>
            <td><span class="status ${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <button class="btn btn-primary" onclick="editMedicine(${item.id})">Edit</button>
                <button class="btn btn-secondary" onclick="deleteMedicine(${item.id})">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("")

  loadOrders()
}

function loadOrders() {
  const ordersList = document.getElementById("ordersList")
  const orders = [
    { id: 1, medicine: "Dolo 650", customer: "John Doe", phone: "+91 9876543210", status: "pending" },
    { id: 2, medicine: "Paracetamol", customer: "Jane Smith", phone: "+91 9876543211", status: "ready" },
  ]

  ordersList.innerHTML = orders
    .map(
      (order) => `
        <div class="order-item">
            <div>
                <strong>${order.medicine}</strong>
                <div>Customer: ${order.customer} (${order.phone})</div>
            </div>
            <div>
                <span class="status ${order.status}">${order.status}</span>
                <button class="btn btn-primary">Mark as ${order.status === "pending" ? "Ready" : "Delivered"}</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function showAddMedicineModal() {
  document.getElementById("addMedicineModal").style.display = "block"
}

function editMedicine(medicineId) {
  const medicine = inventory.find((m) => m.id === medicineId)
  if (medicine) {
    // Pre-fill the form with existing data
    document.getElementById("medicineName").value = medicine.name
    document.getElementById("medicineQuantity").value = medicine.quantity
    document.getElementById("medicinePrice").value = medicine.price
    document.getElementById("medicineExpiry").value = medicine.expiry
    document.getElementById("medicineBatch").value = medicine.batch
    showAddMedicineModal()
  }
}

function deleteMedicine(medicineId) {
  if (confirm("Are you sure you want to delete this medicine?")) {
    inventory = inventory.filter((m) => m.id !== medicineId)
    loadInventory()
    showNotification("Medicine deleted successfully!", "success")
  }
}

// Admin functions
function showAdminTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".admin-tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show selected tab
  document.getElementById(tabName + "-tab").classList.add("active")

  // Update tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  event.target.classList.add("active")
}

function loadPharmacies() {
  const pharmaciesGrid = document.getElementById("pharmaciesGrid")

  pharmaciesGrid.innerHTML = pharmacies
    .map(
      (pharmacy) => `
        <div class="pharmacy-card">
            <h4>${pharmacy.name}</h4>
            <p><strong>Owner:</strong> ${pharmacy.owner}</p>
            <p><strong>Phone:</strong> ${pharmacy.phone}</p>
            <p><strong>Address:</strong> ${pharmacy.address}</p>
            <p><strong>Registered:</strong> ${formatDate(pharmacy.registered)}</p>
            <span class="pharmacy-status ${pharmacy.status}">${pharmacy.status}</span>
            <div class="pharmacy-actions">
                ${
                  pharmacy.status === "pending"
                    ? `
                    <button class="btn btn-primary" onclick="approvePharmacy(${pharmacy.id})">Approve</button>
                    <button class="btn btn-secondary" onclick="rejectPharmacy(${pharmacy.id})">Reject</button>
                `
                    : `
                    <button class="btn btn-secondary" onclick="viewPharmacyDetails(${pharmacy.id})">View Details</button>
                `
                }
            </div>
        </div>
    `,
    )
    .join("")
}

function approvePharmacy(pharmacyId) {
  const pharmacy = pharmacies.find((p) => p.id === pharmacyId)
  if (pharmacy) {
    pharmacy.status = "approved"
    loadPharmacies()
    showNotification(`${pharmacy.name} has been approved!`, "success")
  }
}

function rejectPharmacy(pharmacyId) {
  const pharmacy = pharmacies.find((p) => p.id === pharmacyId)
  if (pharmacy) {
    pharmacy.status = "rejected"
    loadPharmacies()
    showNotification(`${pharmacy.name} has been rejected.`, "warning")
  }
}

function viewPharmacyDetails(pharmacyId) {
  const pharmacy = pharmacies.find((p) => p.id === pharmacyId)
  if (pharmacy) {
    alert(
      `Pharmacy Details:\n\nName: ${pharmacy.name}\nOwner: ${pharmacy.owner}\nPhone: ${pharmacy.phone}\nAddress: ${pharmacy.address}\nStatus: ${pharmacy.status}`,
    )
  }
}

// Modal functions
function showLoginModal() {
  document.getElementById("loginModal").style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

function showRegisterModal() {
  closeModal("loginModal")
  showNotification("Registration feature coming soon!", "info")
}

// Form handlers
function setupEventListeners() {
  // Login form
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const userType = document.getElementById("userType").value
    const phone = document.getElementById("phoneNumber").value

    if (phone) {
      currentUser = { type: userType, phone: phone }
      closeModal("loginModal")
      showNotification(`Logged in as ${userType}`, "success")

      // Show relevant section based on user type
      if (userType === "pharmacy") {
        showSection("pharmacy")
      } else if (userType === "admin") {
        showSection("admin")
      }
    }
  })

  // Alert form
  document.getElementById("alertForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const medicine = document.getElementById("alertMedicine").value
    const location = document.getElementById("alertLocation").value

    if (medicine) {
      const newAlert = {
        id: alerts.length + 1,
        medicine: medicine,
        location:
          document.getElementById("alertLocation").options[document.getElementById("alertLocation").selectedIndex].text,
        created: new Date().toISOString().split("T")[0],
      }

      alerts.push(newAlert)
      loadAlerts()
      closeModal("alertModal")
      showNotification("Alert added successfully!", "success")

      // Clear form
      document.getElementById("alertForm").reset()
    }
  })

  // Add medicine form
  document.getElementById("addMedicineForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const name = document.getElementById("medicineName").value
    const quantity = document.getElementById("medicineQuantity").value
    const price = document.getElementById("medicinePrice").value
    const expiry = document.getElementById("medicineExpiry").value
    const batch = document.getElementById("medicineBatch").value

    if (name && quantity && price && expiry && batch) {
      const newMedicine = {
        id: inventory.length + 1,
        name: name,
        quantity: Number.parseInt(quantity),
        price: Number.parseFloat(price),
        expiry: expiry,
        batch: batch,
        status: quantity > 10 ? "available" : "low-stock",
      }

      inventory.push(newMedicine)
      loadInventory()
      closeModal("addMedicineModal")
      showNotification("Medicine added successfully!", "success")

      // Clear form
      document.getElementById("addMedicineForm").reset()
    }
  })

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"
    }
  })
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN")
}

function getStatusText(status) {
  switch (status) {
    case "available":
      return "Available"
    case "low-stock":
      return "Low Stock"
    case "out-of-stock":
      return "Out of Stock"
    case "expiring-soon":
      return "Expiring Soon"
    case "pending":
      return "Pending"
    case "ready":
      return "Ready"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
    default:
      return status
  }
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.getElementById("notifications").appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.remove()
  }, 5000)
}

// Count-up animation function
function animateStatNumber(el) {
  const target = parseInt(el.dataset.target, 10);
  let count = 0;
  const duration = 1200; // ms
  const step = Math.ceil(target / (duration / 16));
  function update() {
    count += step;
    if (count >= target) {
      el.textContent = target.toLocaleString() + "+";
    } else {
      el.textContent = count.toLocaleString() + "+";
      requestAnimationFrame(update);
    }
  }
  if (!el.dataset.animated) {
    el.dataset.animated = "true";
    el.textContent = "0+";
    update();
  }
}

// Stats scroll-in effect using Intersection Observer
function revealStatsOnScroll() {
  const stats = document.querySelectorAll('.stat');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate the number when visible
          const h3 = entry.target.querySelector('h3');
          if (h3) animateStatNumber(h3);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    stats.forEach(stat => {
      // Store the original number as data-target
      const h3 = stat.querySelector('h3');
      if (h3 && !h3.dataset.target) {
        h3.dataset.target = h3.textContent.replace(/\D/g, '');
      }
      observer.observe(stat);
    });
  } else {
    // Fallback for old browsers
    stats.forEach(stat => {
      stat.classList.add('visible');
      const h3 = stat.querySelector('h3');
      if (h3) animateStatNumber(h3);
    });
  }
}
document.addEventListener("DOMContentLoaded", revealStatsOnScroll);

// Simulate real-time updates
setInterval(() => {
  // Simulate stock updates
  if (Math.random() > 0.95) {
    const randomMedicine = medicines[Math.floor(Math.random() * medicines.length)]
    if (randomMedicine.status === "out-of-stock" && Math.random() > 0.5) {
      randomMedicine.status = "available"
      randomMedicine.quantity = Math.floor(Math.random() * 20) + 1

      // Check if user has alert for this medicine
      const userAlert = alerts.find((alert) => alert.medicine.toLowerCase().includes(randomMedicine.name.toLowerCase()))

      if (userAlert) {
        showNotification(`${randomMedicine.name} is now available at ${randomMedicine.pharmacy}!`, "success")
      }
    }
  }
}, 10000) // Check every 10 seconds

// Mobile menu toggle
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".nav-menu").classList.toggle("active")
})
