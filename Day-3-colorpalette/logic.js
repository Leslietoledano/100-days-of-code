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
    let c = colorUtil(hex);
    if (!category) return hex;

    switch (category) {
        case "Warm tones": return c.spin(30).hex();
        case "Cold tones": return c.spin(-30).hex();
        case "Earth tones": return c.desaturate(40).darken(10).hex();
        case "Pastel tones": return c.lighten(30).saturate(20).hex();
        default: return hex;
    }
}

// Generate palette types
function generateTypePalette(base, type) {
	let c = colorUtil(base);

	switch (type) {
        case "Monochromatic": return c.monochromatic();
        case "Analogous": return c.analogous();
        case "Complementary": return [base, c.complement().hex(), randomHex(), randomHex(), randomHex()];
        case "Triadic": return c.triad();
        case "Tetradic": return c.tetrad();
        case "Inverse": return [base, c.spin(180).hex(), randomHex(), randomHex(), randomHex()];
        default:
            return Array(5).fill(0).map(() => randomHex());
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
};

function applyNiche(hex, niche) {
	if (!niche || !nicheMappings[niche]) return hex;
	return colorUtil(hex).lighten(nicheMappings[niche]).hex();
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
	
		// COPY ON CLICK
		card.addEventListener("click", async () => {
			try {
				await navigator.clipboard.writeText(c.toUpperCase());
				card.textContent = "Copied!";
				setTimeout(() => (card.textContent = c.toUpperCase()), 800);
			} catch (err) {
				console.error("Copy failed:", err);
			}
		});
	});
}


/*************************************************************
 * MINIMAL COLOR ENGINE (SAFE)
 *************************************************************/

// HEX → HSL
function hexToHsl(hex) {
    hex = hex.replace("#", "");
    let r = parseInt(hex.slice(0, 2), 16) / 255;
    let g = parseInt(hex.slice(2, 4), 16) / 255;
    let b = parseInt(hex.slice(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = 0; s = 0;
    } else {
        let d = max - min;
        s = l > .5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return { h, s, l };
}

// HSL → HEX
function hslToHex(h, s, l) {
    h /= 360;

    function f(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    let r = f(p, q, h + 1 / 3);
    let g = f(p, q, h);
    let b = f(p, q, h - 1 / 3);

    return "#" + [r, g, b]
        .map(x => Math.round(x * 255).toString(16).padStart(2, "0"))
        .join("");
}

/*************************************************************
 * COLOR UTIL FACTORY
 *************************************************************/
function colorUtil(hex) {
    let { h, s, l } = hexToHsl(hex);

    function wrap(newHex) {
        return colorUtil(newHex); // <— enables chaining
    }

    return {
        hex: () => hslToHex(h, s, l),

        spin: deg => {
            let newH = (h + deg + 360) % 360;
            return wrap(hslToHex(newH, s, l));
        },

        lighten: amt => {
            let newL = Math.min(1, l + amt / 100);
            return wrap(hslToHex(h, s, newL));
        },

        darken: amt => {
            let newL = Math.max(0, l - amt / 100);
            return wrap(hslToHex(h, s, newL));
        },

        saturate: amt => {
            let newS = Math.min(1, s + amt / 100);
            return wrap(hslToHex(h, newS, l));
        },

        desaturate: amt => {
            let newS = Math.max(0, s - amt / 100);
            return wrap(hslToHex(h, newS, l));
        },

        complement: () => {
            let newH = (h + 180) % 360;
            return wrap(hslToHex(newH, s, l));
        },

        analogous: () => {
            let step = 30;
            return [
                wrap(hslToHex((h - step + 360) % 360, s, l)).hex(),
                wrap(hslToHex(h, s, l)).hex(),
                wrap(hslToHex((h + step) % 360, s, l)).hex(),
                wrap(hslToHex((h + step * 2) % 360, s, l)).hex(),
                wrap(hslToHex((h - step * 2 + 360) % 360, s, l)).hex()
            ];
        },

        triad: () => [
            wrap(hslToHex(h, s, l)).hex(),
            wrap(hslToHex((h + 120) % 360, s, l)).hex(),
            wrap(hslToHex((h + 240) % 360, s, l)).hex(),
        ],

        tetrad: () => [
            wrap(hslToHex(h, s, l)).hex(),
            wrap(hslToHex((h + 90) % 360, s, l)).hex(),
            wrap(hslToHex((h + 180) % 360, s, l)).hex(),
            wrap(hslToHex((h + 270) % 360, s, l)).hex()
        ],

        monochromatic: () => [
            wrap(hslToHex(h, s, l - 0.2)).hex(),
            wrap(hslToHex(h, s, l - 0.1)).hex(),
            wrap(hslToHex(h, s, l)).hex(),
            wrap(hslToHex(h, s, l + 0.1)).hex(),
            wrap(hslToHex(h, s, l + 0.2)).hex(),
        ]
    };
}
