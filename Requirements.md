Vira Verse:

Tech Stack & Rules:

React with React Router v6 for navigation.
State management: React hooks + Redux.
Styling: pure CSS stylesheets or CSS modules (no Tailwind, Bootstrap, ShadCN, or any external styling libraries).
Icons: VS Code’s Codicon set for all icons.
Responsive breakpoints: ≤480px (mobile), ≤768px (tablet), ≤1024px (small desktop), >1024px (desktop).
No inline CSS or static HTML content — all dynamic and reusable.
Minimalist, responsive, multi-themed, future-proof UI.

Themes:
Formal Light
Formal Dark
Fun (vibrant pastel palette)

Common Features for All Project Tabs:
	Tile/Card Grid View + List View toggle.
	+ Button to add new entry → opens Modal Form .
	Click tile → opens Detailed View Modal (full details + Update/Delete).
	Advanced Search in each tab: single smart search input (filters across all relevant fields).
	Sort by any field.
	Export to Excel link.
	Bulk Upload: CSV/Excel/JSON import in a predefined format → validate & batch insert.
	Front-end filtering for now (fetch all records on load; ~30 rows max).
	
Overall Structure:
Authentication (login/register) — placeholder screens, to be integrated with supabase authentication.
Header (edge-to-edge):
	Left: Logo (Vira Verse)
	Center: Menu (Portfolio tabs)
	Right: Home, Theme Switcher, Profile Icon
Footer: Copyright + Social Links
Dashboard (Home):
	Displays all the projects as tiles with previews.
	Clicking a tile navigates to that target URL.
Public Projects:
	All projects with private flag as false
Private Projects:
	All projects with private flag as true


Make it suitable for supabase direct integration and authentication
Also keep provision to upload images to cloudinary and store image url in db through supabase. 
Generate table creation and initial data insertion	queries in .sql format and store it in an utilities folder
 
Fields:
Title	Description	Link	github	preview image url	status	category	 year	    featured	private

Initial Data:
Title	Description	Link	github	preview image url	status	category	 year	    featured	private
Life Of Vidhya	A fun app featuring Vidhya's lifecycle photos and comments created as a gift	https://life-of-vidhya.netlify.app	https://github.com/Vignesh-Ram-ViRa/vid_game	https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png	Completed	Fun	2025	TRUE	TRUE
Vira Lobby	An app to record and display my hobbies and interests	https://www.google.com	https://github.com/Vignesh-Ram-ViRa/vira_lobby	https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png	In Progress	Fun	2025	FALSE	FALSE
Vira Ledger	An app to manage my finances	https://www.google.com	https://github.com/Vignesh-Ram-ViRa/vira_ledger	https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png	In Progress	Finance	2025	TRUE	TRUE
The Vira Story	My portfolio app that seconds as my resume	https://www.google.com	https://github.com/Vignesh-Ram-ViRa/vira_portfolio	https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png	Completed	Career	2025	TRUE	FALSE
Vira Library	An app to record all AI tools I come across	https://www.google.com	https://github.com/Vignesh-Ram-ViRa/vira_library	https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png	In Progress	Knowledge	2025	FALSE	FALSE


## supabase
pwd: N@rutoUzumaki130892
project id: uqrlvppsnppobzowlcqw
project name: vira_direct_data
connection url: postgresql://postgres:N@rutoUzumaki130892@db.uqrlvppsnppobzowlcqw.supabase.co:5432/postgres