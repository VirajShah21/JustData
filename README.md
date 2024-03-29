# JustData

![Data For All Banner](.README/data-for-all.png)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=VirajShah21_JustData&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=VirajShah21_JustData)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=VirajShah21_JustData&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=VirajShah21_JustData)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=VirajShah21_JustData&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=VirajShah21_JustData)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=VirajShah21_JustData&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=VirajShah21_JustData)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=VirajShah21_JustData&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=VirajShah21_JustData)

- [JustData](#justdata)
  - [What is Just Data?](#what-is-just-data)
  - [Services](#services)
    - [API Ideas](#api-ideas)
  - [Contributing](#contributing)
    - [Build Instructions](#build-instructions)
    - [Scraping Rules](#scraping-rules)
    - [Code Quality](#code-quality)
    - [Design Guidelines](#design-guidelines)

## What is Just Data?

Just Data is a data collection tool which scrapes the web to collect just data. The server provides
a series of API endpoints which perform the scraping activities and caches the results. A client
web application is provided to beautifully display the scraped data.

The web application makes it simple to browse and visualize data from various sources, along with
downloading the data for external use.

In the future, the the web application will also allow users to create an account to use the APIs.
This will allow for third-party applications to access data scraped from Just Data.

The website is currenty hosted at [just-data.herokuapp.com](http://just-data.herokuapp.com/).
Not all releases will be available on the server. Pre-releases will be held until a stable release
is created.

## Services

-   **Just Securities** – A cross-exchange securities information and data visualization application.
    Allows for searching stocks (NYSE/NASDAQ/foreign markets), funds (ETFs/mutual funds/index funds),
    crypto currencies, FOREX, and more.
-   **Just Fugitives** – A fugitives database which allows for finding fugitives by name,
    biography,crimes, and other details. The application uses data pulled directly from the FBIs
    database of wanted fugitives.
-   **Just Search** – A cross-engine search platform. Compiles data from multiple search engines
    and provides a unified search interface.
-   **Just Places** – A search engine for businesses and places.
-   **Just SCOTUS** – A data bank for the Supreme Court of the United States. Currently this only
    includes a list of Supreme Court cases.

### API Ideas

-   Search Engines:
    -   Google SERP
    -   Yahoo Search SERP
    -   DuckDuckGo SERP
-   Magic Search: Open a new tab with the best search engine result.
-   Stack Overflow SERP/Answers :bulb:
-   GitHub Code Search :octopus: :cat:
-   IMDB TV/Movies :movie_camera:
-   Yelp Business Search :office:

## Contributing

### Build Instructions

> To avoid any issues, do not use `npm`, use `yarn` for everything (it's better).

**When actively developing**, you will need to start the application server and API server
separately:

**To serve the client**

```bash
cd app
yarn start
```

**To start the server**

```bash
cd server
yarn start:dev
```

The application server will automatically recompile the TSX/CSS files when changes are made.
The API server, will need to be restarted for changes to take effect.

**To test the production build**, you can need to build the entire project.
Then you only need to start the server, and it will serve the frontend via `/app/build`.

```bash
node build.js
node server/build
```

### Scraping Rules

Scraping websites for valuable information is perfectly legal, but it has its limitations. All web scraping practices must conform to U.S. Federal Law in addition to the rules outlined here:

1. Any data can be scraped if it legal to do so and does not violate any of the following rules.
2. The project **must not** bypass any firewalls or paywalls, with the following exceptions:
    1. The project can bypass a paywall if the paywall is simply an element covering the entire website, and does not block the actual content from loading.
    2. All that is required to load protected content is an API call, or invoking a JavaScript function.
    3. The scraper logs in to the website being scraped to access the protected content.
        1. The login credentials must not be hard-coded, but rather loaded from secrets or environment variables.
        2. The login crednetials must be created legitimately through the vendor site.
    4. The firewall provides simply redirects to another public-facing URL.
3. This project strictly prohibits scraping data from internal business applications, even when using legitimate company credentials.
4. This project **strictly** prohibits scraping data from internal government software, even when using legitimate government credentials. The following exceptions apply:
    1. A U.S. State government has sanctioned data collection from their internal server(s);
    2. The U.S. Federal government has sanctioned data collection from their internal server(s);
    3. The U.S. Federal government (DOD/DOJ) has sanctioned data collection from servers outside of the U.S.;
5. Scraping private data on individuals is strictly prohibited, with the following exceptions:
    1. The data being collected is on public figure;
    2. The data being collected lies in the public domain or public government records;
    3. The data does not contain social security or tax identification numbers;
    4. The data is not attached to a child or minor;
    5. When the data is attached to a currently incarcerated convicted felon, the above rules do not apply;
    6. When the data is attached to a fugitive or terrorist, the above rules do not apply.

### Code Quality

Upon any pull request to the `main` branch, a
[SonarCloud](https://sonarcloud.io/project/overview?id=VirajShah21_JustData) analysis is run to
ensure that all new code is written well and does not significantly increase technical debt.
Sometimes is is okay to increase technical debt if the code changes are deemed worth it.

Generally, when you make a pull request, and the quality gate fails, please go back and fix the
issues with your code. These can be issues from code style to actual bugs or security vulnerabilities.

Additionally, GitHub QL runs security scans on each pull request, and on merges to `main`. No
server-side code should introduce any new security vulnerabilities.

### Design Guidelines

The full design guidelines document can be found [here](.README/design-guidelines.md).

In general, keep it sexy.
