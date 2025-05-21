StaticPress Turbo — Phase 0 Deliverables

Brief, no-fluff spec + repo scaffold so we can push the first commit today.

⸻

1 · Project Spec (v0.1)

Section What / Why
Goal One-command workflow that crawls a Salient/WPBakery site ➜ rewrites/optimises assets ➜ ships an Astro or Next.js bundle to Cloudflare Pages.OSS core (MIT); “Pro” binary + WP plugin behind license ($149/site) plus enterprise SLA.
CLI Entry (spt binary) spt init, spt crawl, spt build, spt deploy, spt doctor, spt upgrade. All flags support --site <url> + `–stack <astro
Crawler Puppeteer-based, honours robots.txt + sitemap.xml, prerenders with JS enabled, stores HTML in /tmp/cache.
Static generator  Astro path → templates in /templates/astro, runs astro build. Next path → /templates/next, runs next build with output: "export".
Asset pipeline Rewrites absolute → relative, inlines critical CSS, purges Salient/WPBakery leftovers, pipes images through sharp (lazy-loads + modern formats).
Forms Detect <form> elements → swap action to Netlify Functions stub, ship /functions/submit.js with honeypot + reCAPTCHA hooks.
Deploy Generates wrangler.toml + GitHub Actions deploy.yml, pushes to origin → Cloudflare Pages.
WordPress plugin Adds wp staticpress-turbo export WP-CLI command, exposes REST /spt/license, injects build status widget in admin for Pro users, fires hook do_action( 'spt_after_export' ).
License / Telemetry Simple JWT signed at build; phoning home optional in OSS; hard-fail in Pro if invalid.
Config file staticpress.config.{js,json} (root of WP site) – site URL, exclude patterns, image max widths, CF account ID, etc.
Tech stack Node ≥ 20, TypeScript everywhere, pnpm workspaces + TurboRepo, Jest, Prettier, ESLint, Husky + lint-staged, Conventional Commits, semantic-release.
Non-goals (v1) WP admin React UI (punted to v2), multi-tenant licence server, localisation, static search.

⸻

2 · Repo Scaffold (monorepo)

staticpress-turbo/
├── packages/
│ ├── cli/ # Node CLI
│ │ ├── bin/spt.js # chmod +x
│ │ ├── src/
│ │ │ ├── index.ts
│ │ │ ├── commands/
│ │ │ │ ├── init.ts
│ │ │ │ ├── crawl.ts
│ │ │ │ ├── build.ts
│ │ │ │ ├── deploy.ts
│ │ │ │ └── doctor.ts
│ │ │ ├── crawler/
│ │ │ ├── generator/
│ │ │ ├── optimizer/
│ │ │ ├── deployer/
│ │ │ └── utils/
│ │ ├── test/
│ │ └── package.json
│ └── wp-plugin/
│ ├── staticpress-turbo.php # Plugin header + loader
│ ├── includes/
│ │ ├── cli-command.php
│ │ ├── rest.php
│ │ ├── license.php
│ │ └── admin-widget.php
│ ├── assets/
│ ├── languages/
│ └── readme.txt
├── templates/ # Astro / Next starter skeletons
│ ├── astro/
│ └── next/
├── scripts/
│ ├── release.js # semantic-release
│ └── ci-checks.sh
├── .github/
│ └── workflows/
│ ├── ci.yml # lint + test
│ └── release.yml # publish packages
├── docs/
│ ├── spec.md # this spec lives here
│ └── roadmap.md
├── .editorconfig
├── .eslintrc.cjs
├── .prettierrc
├── turbo.json # TurboRepo pipeline
├── package.json # root – pnpm workspaces
├── LICENSE # MIT
└── README.md

Key starter files

<details><summary>packages/cli/bin/spt.js (11 lines)</summary>

#!/usr/bin/env node
require('tsx').register();
require('../dist/index.js');

</details>

<details><summary>packages/wp-plugin/staticpress-turbo.php (20 lines)</summary>

<?php
/**
 * Plugin Name: StaticPress Turbo
 * Description: Companion plugin for StaticPress Turbo CLI.
 * Version: 0.1.0
 * Author: StaticPress Turbo
 * License: GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once __DIR__ . '/includes/cli-command.php';
require_once __DIR__ . '/includes/rest.php';
require_once __DIR__ . '/includes/license.php';
require_once __DIR__ . '/includes/admin-widget.php';

</details>


(Full stubs in repo; each stays <30 LOC to keep onboarding snappy.)

⸻

3 · Bootstrap Commands

# 1. create workspace
mkdir staticpress-turbo && cd $_
pnpm init -y
pnpm add -D typescript ts-node tsx jest @types/jest eslint prettier pnpm turbo semantic-release husky lint-staged

# 2. scaffold dirs
mkdir -p packages/cli/{bin,src/{commands,crawler,generator,optimizer,deployer,utils},test} \
         packages/wp-plugin/includes \
         templates/{astro,next} docs scripts .github/workflows

# 3. initialise git + hooks
git init
npx husky install
echo 'npm run lint' > .husky/pre-commit
git add . && git commit -m "chore: initial scaffold"

# 4. first CI run (lint + test)
pnpm turbo run lint test


⸻

4 · Next Steps (this week)
	1.	Fill docs/spec.md — paste the table above, expand crawler + generator edge-cases.
	2.	Finish bin/spt.js + src/index.ts — wire commander / yargs, log fancy banner.
	3.	Implement spt init — generate staticpress.config.js, clone chosen template, commit.
	4.	Write WP-CLI sub-command (wp staticpress-turbo export) — just echo "hello" for now.
	5.	Push to GitHub, switch repo to private, enable Actions.
	6.	Open two issues: “Crawler MVP” and “Asset optimiser MVP” with clear AC.

Total ≈ 3 hrs.

⸻

☑️ Today’s checklist (3-hour block)
	1.	git clone new repo & run bootstrap commands.
	2.	Drop the spec table into docs/spec.md.
	3.	Commit + push; make sure CI passes.
	4.	Draft the basic spt init command (hard-code Astro for now).
	5.	Create the stub WP plugin file and confirm it activates in a local WP install.
