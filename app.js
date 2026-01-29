// Demo data for clubs
const clubs = [
  {
    id: "coding-club",
    name: "Coding & Dev Club",
    category: "technical",
    description:
      "Hands-on coding sessions, hackathons, and project-building meetups.",
    members: 85,
    meetingDay: "Wednesday",
    meetingTime: "5:00 PM"
  },
  {
    id: "ml-club",
    name: "AI & ML Circle",
    category: "technical",
    description:
      "Exploring machine learning, Kaggle challenges, and paper reading.",
    members: 60,
    meetingDay: "Saturday",
    meetingTime: "11:00 AM"
  },
  {
    id: "drama-club",
    name: "Dramatics Society",
    category: "cultural",
    description:
      "Theatre, stage plays, and acting workshops for creative minds.",
    members: 40,
    meetingDay: "Tuesday",
    meetingTime: "4:30 PM"
  },
  {
    id: "music-club",
    name: "Music & Jamming Club",
    category: "cultural",
    description:
      "Band jamming, open mics, and music production experiments.",
    members: 55,
    meetingDay: "Friday",
    meetingTime: "6:00 PM"
  },
  {
    id: "football-club",
    name: "Football Squad",
    category: "sports",
    description:
      "Evening practice, intra-college matches and fitness sessions.",
    members: 35,
    meetingDay: "Monday",
    meetingTime: "5:30 PM"
  },
  {
    id: "social-impact",
    name: "Social Impact Forum",
    category: "social",
    description:
      "Community service, donation drives, and awareness campaigns.",
    members: 45,
    meetingDay: "Sunday",
    meetingTime: "10:00 AM"
  }
];

// Demo events
const events = [
  {
    id: "hacknight",
    title: "Overnight Hackathon: HackNight 1.0",
    clubId: "coding-club",
    date: "2026-02-10",
    mode: "On-campus",
    location: "CSE Lab 3"
  },
  {
    id: "ml-workshop",
    title: "Hands-on ML: Build Your First Classifier",
    clubId: "ml-club",
    date: "2026-02-05",
    mode: "Online",
    location: "Google Meet"
  },
  {
    id: "street-play",
    title: "Street Play for Social Awareness",
    clubId: "drama-club",
    date: "2026-02-03",
    mode: "On-campus",
    location: "Main Gate"
  },
  {
    id: "battle-of-bands",
    title: "Battle of Bands",
    clubId: "music-club",
    date: "2026-03-01",
    mode: "On-campus",
    location: "Auditorium"
  },
  {
    id: "football-league",
    title: "Inter-Department Football League",
    clubId: "football-club",
    date: "2026-02-20",
    mode: "On-campus",
    location: "College Ground"
  },
  {
    id: "blood-donation",
    title: "Blood Donation Camp",
    clubId: "social-impact",
    date: "2026-02-15",
    mode: "On-campus",
    location: "Seminar Hall"
  }
];

// --- State & helpers ---

const joinedClubsKey = "ccc_joined_clubs";

function loadJoinedClubs() {
  try {
    const stored = localStorage.getItem(joinedClubsKey);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveJoinedClubs(list) {
  localStorage.setItem(joinedClubsKey, JSON.stringify(list));
}

// Global state for filters
let currentCategory = "all";
let membershipFilter = "all";
let searchQuery = "";
let joinedClubs = loadJoinedClubs();

// --- DOM elements ---

const clubsContainer = document.getElementById("clubsContainer");
const eventsContainer = document.getElementById("eventsContainer");
const totalClubsCount = document.getElementById("totalClubsCount");
const joinedClubsCount = document.getElementById("joinedClubsCount");
const upcomingEventsCount = document.getElementById("upcomingEventsCount");
const clubsResultInfo = document.getElementById("clubsResultInfo");
const eventsResultInfo = document.getElementById("eventsResultInfo");
const joinedClubsList = document.getElementById("joinedClubsList");
const searchInput = document.getElementById("searchInput");

// --- Rendering functions ---

function renderStats() {
  totalClubsCount.textContent = clubs.length;
  joinedClubsCount.textContent = joinedClubs.length;

  const today = new Date();
  const upcoming = events.filter(e => new Date(e.date) >= today);
  upcomingEventsCount.textContent = upcoming.length;
}

function getClubById(id) {
  return clubs.find(c => c.id === id);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function categoryLabel(cat) {
  switch (cat) {
    case "technical":
      return "Technical";
    case "cultural":
      return "Cultural";
    case "sports":
      return "Sports";
    case "social":
      return "Social Impact";
    default:
      return cat;
  }
}

function renderJoinedClubsSidebar() {
  joinedClubsList.innerHTML = "";

  if (joinedClubs.length === 0) {
    joinedClubsList.innerHTML =
      '<li style="color: #6b7280;">No clubs joined yet.</li>';
    return;
  }

  joinedClubs.forEach(id => {
    const club = getClubById(id);
    if (!club) return;
    const li = document.createElement("li");
    li.textContent = club.name;
    joinedClubsList.appendChild(li);
  });
}

function renderClubs() {
  let filtered = clubs.filter(club => {
    if (currentCategory !== "all" && club.category !== currentCategory) {
      return false;
    }
    const isJoined = joinedClubs.includes(club.id);
    if (membershipFilter === "joined" && !isJoined) return false;
    if (membershipFilter === "notJoined" && isJoined) return false;

    if (searchQuery) {
      const target = (
        club.name +
        " " +
        club.description +
        " " +
        categoryLabel(club.category)
      )
        .toLowerCase()
        .trim();
      if (!target.includes(searchQuery.toLowerCase().trim())) return false;
    }

    return true;
  });

  clubsContainer.innerHTML = "";
  clubsResultInfo.textContent = `${filtered.length} club(s) shown`;

  if (filtered.length === 0) {
    clubsContainer.innerHTML =
      '<p style="color:#9ca3af;font-size:0.85rem;">No clubs match your filters or search.</p>';
    return;
  }

  filtered.forEach(club => {
    const isJoined = joinedClubs.includes(club.id);
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${club.name}</h3>
        <span class="badge ${club.category}">
          ${categoryLabel(club.category)}
        </span>
      </div>
      <div class="card-body">
        <p>${club.description}</p>
      </div>
      <div class="meta-row">
        <span class="meta-pill">
          <span class="meta-dot"></span>${club.members} members
        </span>
        <span class="meta-pill">
          <span class="meta-dot"></span>${club.meetingDay}, ${club.meetingTime}
        </span>
      </div>
    `;

    const btn = document.createElement("button");
    btn.className = "btn" + (isJoined ? " outline-danger" : " primary");
    btn.innerHTML = isJoined ? "Leave club" : "Join club";

    btn.addEventListener("click", () => toggleMembership(club.id));
    card.appendChild(btn);

    clubsContainer.appendChild(card);
  });
}

function renderEvents() {
  const today = new Date();

  let filtered = events.filter(ev => {
    const evClub = getClubById(ev.clubId);
    if (!evClub) return false;

    const isUpcoming = new Date(ev.date) >= today;
    if (!isUpcoming) return false;

    if (currentCategory !== "all" && evClub.category !== currentCategory) {
      return false;
    }

    if (searchQuery) {
      const target = (
        ev.title +
        " " +
        evClub.name +
        " " +
        ev.mode +
        " " +
        ev.location
      )
        .toLowerCase()
        .trim();
      if (!target.includes(searchQuery.toLowerCase().trim())) return false;
    }

    return true;
  });

  eventsContainer.innerHTML = "";
  eventsResultInfo.textContent = `${filtered.length} upcoming event(s)`;

  if (filtered.length === 0) {
    eventsContainer.innerHTML =
      '<p style="color:#9ca3af;font-size:0.85rem;">No upcoming events for the current filters.</p>';
    return;
  }

  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

  filtered.forEach(ev => {
    const evClub = getClubById(ev.clubId);
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${ev.title}</h3>
        <span class="badge">${evClub ? evClub.name : ""}</span>
      </div>
      <div class="card-body">
        <p>${formatDate(ev.date)} · ${ev.mode}</p>
      </div>
      <div class="meta-row">
        <span class="meta-pill">
          <span class="meta-dot"></span>${ev.location}
        </span>
      </div>
    `;

    eventsContainer.appendChild(card);
  });
}

// --- Membership toggle ---

function toggleMembership(clubId) {
  if (joinedClubs.includes(clubId)) {
    joinedClubs = joinedClubs.filter(id => id !== clubId);
  } else {
    joinedClubs.push(clubId);
  }
  saveJoinedClubs(joinedClubs);
  renderStats();
  renderJoinedClubsSidebar();
  renderClubs();
}

// --- Event listeners ---

function setupFilters() {
  const categoryButtons = document.querySelectorAll(".filter-category");
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderClubs();
      renderEvents();
    });
  });

  const membershipButtons = document.querySelectorAll(".membership-filter");
  membershipButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      membershipButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      membershipFilter = btn.dataset.membership;
      renderClubs();
    });
  });

  searchInput.addEventListener("input", e => {
    searchQuery = e.target.value;
    renderClubs();
    renderEvents();
  });
}

// --- Init ---

function init() {
  renderStats();
  renderJoinedClubsSidebar();
  setupFilters();
  renderClubs();
  renderEvents();
}

document.addEventListener("DOMContentLoaded", init);
