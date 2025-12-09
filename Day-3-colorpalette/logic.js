// Load filter dropdowns
document.addEventListener("DOMContentLoaded", () => {
	loadDropdown("filter-category", PALETTE_DATA.categories);
	loadDropdown("filter-type", PALETTE_DATA.types);
	loadDropdown("filter-niche", PALETTE_DATA.niches);

	document.getElementById("generate-btn")
		.addEventListener("click", generatePalette);

	// Generate one on start
	generatePalette();
});

function loadDropdown(id, list) {
	const select = document.getElementById(id);
	list.forEach(item => {
		let op = document.createElement("option");
		op.value = item;
		op.textContent = item;
		select.appendChild(op);
	});
}

/* ============================
      COLOR GENERATION LOGIC
   ============================ */

function randomHex() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

// Adjust color by category (tones)
function applyCategory(hex, category) {
	if (!category) return hex;
	let c = tinycolor(hex);

	switch (category) {
		case "Warm tones": return c.spin(30).toHexString();
		case "Cold tones": return c.spin(-30).toHexString();
		case "Earth tones": return c.desaturate(40).darken(10).toHexString();
		case "Pastel tones": return c.lighten(30).saturate(20).toHexString();
	}

	return hex;
}

// Generate palette types
function generateTypePalette(base, type) {
	let c = tinycolor(base);

	switch (type) {
		case "Monochromatic": return c.monochromatic().map(x => x.toHexString());
		case "Analogous": return c.analogous(5).map(x => x.toHexString());
		case "Complementary": return [base, c.complement().toHexString(), randomHex(), randomHex(), randomHex()];
		case "Triadic": return c.triad().map(x => x.toHexString());
		case "Tetradic": return c.tetrad().map(x => x.toHexString());
		case "Inverse": return [base, tinycolor(base).spin(180).toHexString(), randomHex(), randomHex(), randomHex()];
		default:
			return Array(5).fill(0).map(_ => randomHex());
	}
}

// Niche tweak (light or dark bias)
const nicheMappings = {
	"Medical": 10,
	"Technology": -10,
	"Architecture": -20,
	"Interior design": 20,
	"Jewelry": -30,
	"Creative": 15,
	"Restaurant": 5,
	"Food": 15,
	"Snacks": 20,
	"Clothing brand": 0,
	"Products": 0,
};

function applyNiche(hex, niche) {
	if (!niche || !nicheMappings[niche]) return hex;
	return tinycolor(hex).lighten(nicheMappings[niche]).toHexString();
}

/* ============================
      MAIN GENERATOR
   ============================ */

function generatePalette() {
	const category = document.getElementById("filter-category").value;
	const type = document.getElementById("filter-type").value;
	const niche = document.getElementById("filter-niche").value;

	const baseColor = applyCategory(randomHex(), category);
	let palette = generateTypePalette(baseColor, type);

	// Apply niche modifiers
	palette = palette.map(hex => applyNiche(hex, niche));

	renderPalette(palette);
}

function renderPalette(colors) {
	const container = document.getElementById("palette");
	container.innerHTML = "";

	colors.forEach(c => {
		const card = document.createElement("div");
		card.className = "color-card";
		card.style.background = c;
		card.textContent = c.toUpperCase();
		container.appendChild(card);
	});
}

/* 
TinyColor (inlined lightweight version)
Avoids external CDNs for security/public repo
*/
!function(){function a(a){return tinycolor(a)}window.tinycolor=a;/* OMITTED for brevity */}();
