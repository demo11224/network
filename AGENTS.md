# AGENTS.md

## Cursor Cloud specific instructions

### Repository layout (important)

The `master` (base) branch of this repository is an **empty scaffold**. It contains
only:

- `README.md` — describes the repo as `network / 测试项目` ("test project").
- `1.txt` — a placeholder text file.

There is **no application code, no dependency manifest, no build system, and no
tests on `master`.** As a result, on the base branch there is nothing to install,
build, run, or test, and no application to launch.

The actual projects live on individual feature branches, and each one is a
different, self-contained application. Examples observed on `origin`:

- `devin/1775189918-admin-system` — a Java/Spring Boot backend (`backend/pom.xml`,
  `com.admin.*`) admin system.
- `cursor/m-domain-agent-demo-ef6e` — a Vite + React + TypeScript app
  (`package.json`, `vite.config.ts`, Tailwind).
- Other `cursor/*` branches — mostly Markdown notes/knowledge documents.

### How to work here

- If a task targets a specific product, the code is on a feature branch, not on
  `master`. Check out (or branch from) the relevant feature branch and follow that
  branch's own setup files (e.g. its `README`, `package.json` scripts, or
  `pom.xml`). Each branch defines its own toolchain and run/lint/test commands.
- Do not expect a working application on `master`; setup/run/lint/test steps only
  make sense in the context of a specific feature branch's code.

### Toolchain available in the base image

Node 22, npm 10, Python 3.12, and Java (OpenJDK) 21 are preinstalled, which
covers the JS/TS and Java projects that live on the feature branches.
