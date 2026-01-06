# Poll Website

A simple, local static website for creating and viewing polls. This project contains the minimal front-end needed to run a poll app in the browser using plain HTML, CSS, and JavaScript.

**Quick Overview**
- **Purpose:** Demonstration/sample poll app for learning and small deployments.
- **Tech:** Plain HTML, CSS, and JavaScript (no build step).
- **Run locally:** Open `index.html` in a browser or serve the folder with a lightweight HTTP server.

- **Poll topic:** Vote for your preferred option among the provided choices (for example: favorite color, best feature, or preferred event date).

**Getting Started**

1. Clone or download the repository.
2. Open the project folder and either:
	- Double-click `index.html` to open it directly in your browser (works for most local testing).
	- Or run a simple HTTP server (recommended for full functionality):

```bash
# Python 3 (in project folder)
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

**Project Structure**
- **index.html:** Main page and markup.
- **css/style.css:** Visual styles.
- **js/app.js:** Poll logic and interactivity.

**Features**
- Create or load polls (UI depends on `js/app.js`).
- Vote and see results (client-side behavior).

**Development Notes**
- No build tools required — edit `css/style.css`, `js/app.js`, and `index.html` directly.
- Keep scripts and styles organized; add small helper functions in `js/app.js`.

**Contributing**
- Feel free to open issues or submit pull requests with improvements or bug fixes.

**License & Contact**
- Use or modify this project freely. Add a license file if you need explicit terms.
- For questions, reply in the repo or add a contact section here.

Enjoy exploring and customizing this simple poll website!