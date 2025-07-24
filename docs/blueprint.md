# **App Name**: BetValuator Edge

## Core Features:

- Data Aggregation: Integrate a 'Data Explorer Tool' that scrapes sports data from URLs like FBref.com, specified by the user.
- Predictive Analysis: Enable 'Quantitative Modeling Tool' using a Poisson-xG hybrid model to calculate probabilities for Football match outcomes based on scraped data.
- Investment Strategy: Provide 'Portfolio Management Tool' to deliver betting recommendations based on bankroll size and user-selected staking strategy.
- Qualitative Insights: Implement a 'Fundamental Analysis Tool' for qualitative assessment of matches using factors like form and H2H records.  Then the tool should use probabilities derived from odds the user provides.
- Interactive Dashboards: Display scraped data, model predictions, and betting recommendations in a clear format, utilizing data tables and charts within the /analyze route.
- Personalized Settings: The app stores user preferences regarding favorite teams, typical wager size, and tolerance for risk (used when choosing investment strategies).

## Style Guidelines:

- Primary color: HSL(210, 67%, 46%) - RGB(26, 115, 232) - A vibrant blue to convey trust and analytical precision.
- Background color: HSL(210, 20%, 95%) - RGB(242, 246, 249) - A light, desaturated background to ensure readability and reduce visual fatigue.
- Accent color: HSL(180, 55%, 50%) - RGB(76, 191, 191) - A bright turquoise for highlighting key data points and interactive elements.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text.
- Employ a set of minimalist, line-based icons to represent sports, data metrics, and betting strategies.
- Use a modular grid layout to organize the data and analysis tools, ensuring responsiveness across devices.