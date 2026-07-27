export type CountryDetailSeed = {
  iso2: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  population?: number;
  capital?: string;
  currency?: string;
  religion?: string;
  economy?: string;
  gdpSummary?: string;
  travel?: string;
  history?: string;
  interestingFacts?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

// Rich content is curated for a subset of well-known countries only.
// Every other seeded country keeps just its base fields (name/slug/iso/region/flag);
// the detail page shows a "content coming soon" notice when these fields are absent.
export const countryDetails: CountryDetailSeed[] = [
  {
    iso2: "US",
    heroImageUrl: "https://picsum.photos/seed/country-us/1600/700",
    heroImageAlt: "Aerial view of a United States city skyline",
    population: 335_000_000,
    capital: "Washington, D.C.",
    currency: "United States Dollar (USD, $)",
    religion: "Protestant (43%), Catholic (20%), Unaffiliated (29%)",
    gdpSummary:
      "$27.4 trillion nominal GDP (2023), the largest economy in the world",
    economy:
      "The United States has the world's largest economy by nominal GDP, driven by services, technology, finance, and manufacturing. New York and Silicon Valley anchor global finance and innovation, while the country remains a major exporter of agricultural goods, aircraft, and machinery.",
    travel:
      "Visa requirements vary by nationality; many travelers can enter visa-free or via ESTA under the Visa Waiver Program. Popular routes include the East and West Coast cities, national parks like Yellowstone and the Grand Canyon, and road trips along Route 66.",
    history:
      "Founded in 1776 after declaring independence from Britain, the U.S. expanded westward through the 19th century, endured a civil war over slavery (1861-1865), and emerged as a global superpower following the World Wars, playing a central role in 20th-century geopolitics.",
    interestingFacts: [
      "The U.S. has no official national language at the federal level.",
      "It is home to more than 60 national parks.",
      "The Interstate Highway System spans over 77,000 kilometers.",
    ],
    seoTitle: "United States Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore the United States: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "GB",
    heroImageUrl: "https://picsum.photos/seed/country-gb/1600/700",
    heroImageAlt: "London skyline with the River Thames",
    population: 68_300_000,
    capital: "London",
    currency: "Pound Sterling (GBP, £)",
    religion: "Christian (46%), No religion (37%), Muslim (6%)",
    gdpSummary:
      "$3.3 trillion nominal GDP (2023), the world's sixth-largest economy",
    economy:
      "The UK economy is services-led, with finance, insurance, and professional services concentrated in London. It also has strong creative industries, higher education exports, and a diversified manufacturing base including aerospace and automotive.",
    travel:
      "Most visitors need a Standard Visitor visa or, for many nationalities, can enter visa-free for short stays under the Electronic Travel Authorisation scheme. Highlights include London's museums, the Scottish Highlands, and historic sites like Stonehenge.",
    history:
      "The United Kingdom formed through the union of England, Scotland, Wales, and Northern Ireland. It built a vast colonial empire from the 17th to 20th centuries and later became a founding member of NATO and, until 2020, the European Union.",
    interestingFacts: [
      "The London Underground, opened in 1863, is the oldest metro system in the world.",
      "The UK consists of four constituent nations with distinct identities.",
      "Big Ben refers to the bell, not the clock tower itself.",
    ],
    seoTitle: "United Kingdom Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore the United Kingdom: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "FR",
    heroImageUrl: "https://picsum.photos/seed/country-fr/1600/700",
    heroImageAlt: "Eiffel Tower in Paris at dusk",
    population: 68_200_000,
    capital: "Paris",
    currency: "Euro (EUR, €)",
    religion: "Christian (47%), No religion (40%), Muslim (5%)",
    gdpSummary:
      "$3.0 trillion nominal GDP (2023), the world's seventh-largest economy",
    economy:
      "France has a diversified economy led by luxury goods, aerospace, automotive manufacturing, and agriculture. It is the most visited country in the world by tourist arrivals and a major nuclear energy exporter.",
    travel:
      "As a Schengen Area member, France allows visa-free entry for many nationalities for short stays. Must-see destinations include Paris, the Loire Valley chateaux, the French Riviera, and the Alps.",
    history:
      "France traces its roots to the Kingdom of the Franks and rose to prominence under monarchs like Louis XIV. The 1789 Revolution reshaped the nation and inspired democratic movements worldwide; it later became a founding member of the European Union.",
    interestingFacts: [
      "France is the world's most visited country by international tourists.",
      "It has 12 time zones, more than any other country, due to its overseas territories.",
      "The baguette was added to UNESCO's Intangible Cultural Heritage list in 2022.",
    ],
    seoTitle: "France Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore France: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "DE",
    heroImageUrl: "https://picsum.photos/seed/country-de/1600/700",
    heroImageAlt: "Brandenburg Gate in Berlin",
    population: 84_500_000,
    capital: "Berlin",
    currency: "Euro (EUR, €)",
    religion: "Christian (52%), No religion (42%), Muslim (5%)",
    gdpSummary:
      "$4.5 trillion nominal GDP (2023), the largest economy in Europe",
    economy:
      "Germany is Europe's industrial powerhouse, renowned for automotive engineering, machinery, and chemical manufacturing. It is one of the world's top exporters and a leading force in the transition to renewable energy.",
    travel:
      "Germany is a Schengen Area member with visa-free access for many nationalities. Popular destinations include Berlin, Munich's Bavarian Alps, the Rhine Valley, and Christmas markets across the country in winter.",
    history:
      "Unified as a nation-state in 1871, Germany's 20th century was marked by two World Wars and post-war division into East and West. Reunification in 1990 followed the fall of the Berlin Wall, and Germany is now a leading voice in the EU.",
    interestingFacts: [
      "Germany has over 1,500 different types of sausage.",
      "It is home to more than 20,000 castles.",
      "The Autobahn has sections with no general speed limit.",
    ],
    seoTitle: "Germany Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Germany: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "IT",
    heroImageUrl: "https://picsum.photos/seed/country-it/1600/700",
    heroImageAlt: "Colosseum in Rome",
    population: 58_900_000,
    capital: "Rome",
    currency: "Euro (EUR, €)",
    religion: "Christian (80%), No religion (18%)",
    gdpSummary:
      "$2.2 trillion nominal GDP (2023), the third-largest economy in the eurozone",
    economy:
      "Italy's economy relies on manufacturing (fashion, automotive, machinery), tourism, and agriculture. It hosts a dense network of small and medium enterprises renowned for design and craftsmanship.",
    travel:
      "As a Schengen member, Italy offers visa-free entry to many nationalities. Top destinations include Rome's ancient ruins, Venice's canals, the Tuscan countryside, and the Amalfi Coast.",
    history:
      "Home to the Roman Empire and the Renaissance, Italy unified as a single kingdom in 1861. It became a republic in 1946 after World War II and is a founding member of the European Union.",
    interestingFacts: [
      "Italy has more UNESCO World Heritage Sites than any other country.",
      "Pizza originated in Naples in the 18th century.",
      "Vatican City, an independent state, is entirely enclosed within Rome.",
    ],
    seoTitle: "Italy Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Italy: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "ES",
    heroImageUrl: "https://picsum.photos/seed/country-es/1600/700",
    heroImageAlt: "Sagrada Familia in Barcelona",
    population: 47_600_000,
    capital: "Madrid",
    currency: "Euro (EUR, €)",
    religion: "Christian (58%), No religion (39%)",
    gdpSummary: "$1.6 trillion nominal GDP (2023)",
    economy:
      "Spain's economy is anchored by tourism, agriculture, automotive manufacturing, and a fast-growing renewable energy sector. It is one of the world's top wine and olive oil producers.",
    travel:
      "A Schengen Area member offering visa-free access for many nationalities. Highlights include Barcelona's Gaudí architecture, Andalusia's Moorish heritage, and the Balearic and Canary Islands.",
    history:
      "Spain unified in the late 15th century and built a vast colonial empire across the Americas. A civil war (1936-1939) led to decades of dictatorship under Franco, followed by a transition to democracy in the late 1970s.",
    interestingFacts: [
      "Spain has the second-highest number of UNESCO World Heritage Sites in Europe.",
      "The Spanish siesta tradition originated from agricultural work schedules.",
      "Flamenco music and dance originated in Andalusia.",
    ],
    seoTitle: "Spain Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Spain: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "JP",
    heroImageUrl: "https://picsum.photos/seed/country-jp/1600/700",
    heroImageAlt: "Mount Fuji with cherry blossoms",
    population: 123_800_000,
    capital: "Tokyo",
    currency: "Japanese Yen (JPY, ¥)",
    religion:
      "Shinto and Buddhist (mixed practice, majority), Other/None (minority)",
    gdpSummary:
      "$4.2 trillion nominal GDP (2023), the third-largest economy in the world",
    economy:
      "Japan is a global leader in automotive manufacturing, electronics, and robotics. Its economy blends advanced technology with a strong export sector, though it faces demographic challenges from an aging population.",
    travel:
      "Many nationalities can enter Japan visa-free for short tourist stays. Popular destinations include Tokyo, Kyoto's temples, Mount Fuji, and Hokkaido's ski resorts.",
    history:
      "Japan's imperial line is among the world's oldest continuous monarchies. After centuries of isolation under the Edo period, it rapidly modernized following the Meiji Restoration of 1868 and rebuilt into an economic powerhouse after World War II.",
    interestingFacts: [
      "Japan has the world's third-largest economy despite its relatively small landmass.",
      "It is home to over 6,800 islands.",
      "Japan's Shinkansen bullet trains have operated since 1964 with no passenger fatalities from derailment or collision.",
    ],
    seoTitle: "Japan Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Japan: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "CN",
    heroImageUrl: "https://picsum.photos/seed/country-cn/1600/700",
    heroImageAlt: "The Great Wall of China",
    population: 1_410_000_000,
    capital: "Beijing",
    currency: "Renminbi / Chinese Yuan (CNY, ¥)",
    religion:
      "Folk religion, Buddhist, and Unaffiliated (majority); Christian and Muslim (minorities)",
    gdpSummary:
      "$17.8 trillion nominal GDP (2023), the world's second-largest economy",
    economy:
      "China is the world's largest manufacturing economy and a leading exporter of electronics, machinery, and textiles. Its economy has shifted toward technology, e-commerce, and renewable energy in recent decades.",
    travel:
      "Most visitors need a visa in advance, though several cities offer visa-free transit for short stays. Highlights include the Great Wall, Beijing's Forbidden City, Shanghai's skyline, and the karst landscapes of Guilin.",
    history:
      "One of the world's oldest continuous civilizations, China was ruled by successive dynasties for millennia before becoming a republic in 1912. The People's Republic of China was established in 1949 and has since become a global economic power.",
    interestingFacts: [
      "The Great Wall of China stretches over 21,000 kilometers including all its branches.",
      "China has the world's largest population of any country besides India.",
      "It uses a single time zone despite spanning five geographical ones.",
    ],
    seoTitle: "China Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore China: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "IN",
    heroImageUrl: "https://picsum.photos/seed/country-in/1600/700",
    heroImageAlt: "Taj Mahal in Agra",
    population: 1_428_000_000,
    capital: "New Delhi",
    currency: "Indian Rupee (INR, ₹)",
    religion: "Hindu (80%), Muslim (14%), Christian (2%), Sikh (2%)",
    gdpSummary:
      "$3.7 trillion nominal GDP (2023), the world's fifth-largest economy",
    economy:
      "India has one of the world's fastest-growing major economies, driven by IT services, pharmaceuticals, textiles, and agriculture. Bengaluru and Hyderabad are major global tech hubs.",
    travel:
      "Most foreign visitors need a visa or e-Visa. Iconic destinations include the Taj Mahal, Kerala's backwaters, Rajasthan's palaces, and the Himalayan foothills.",
    history:
      "Home to the ancient Indus Valley Civilization, India was later shaped by Mughal rule and became a British colony before gaining independence in 1947 under leaders including Mahatma Gandhi. It is now the world's most populous country.",
    interestingFacts: [
      "India is the world's most populous country as of 2023.",
      "It has 22 officially recognized languages.",
      "The Taj Mahal took over 20 years and roughly 20,000 workers to build.",
    ],
    seoTitle: "India Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore India: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "BD",
    heroImageUrl: "https://picsum.photos/seed/country-bd/1600/700",
    heroImageAlt: "Sundarbans mangrove forest in Bangladesh",
    population: 172_900_000,
    capital: "Dhaka",
    currency: "Bangladeshi Taka (BDT, ৳)",
    religion: "Muslim (91%), Hindu (8%)",
    gdpSummary:
      "$446 billion nominal GDP (2023), one of the fastest-growing economies in South Asia",
    economy:
      "Bangladesh's economy is driven by its ready-made garment export industry, remittances from overseas workers, and a growing services sector. Agriculture, especially rice and jute production, remains vital to rural livelihoods.",
    travel:
      "Most visitors require a visa or e-Visa in advance. Highlights include the Sundarbans mangrove forest (home to the Bengal tiger), Cox's Bazar's long beach, and the historic mosque city of Bagerhat.",
    history:
      "Formerly East Pakistan, Bangladesh became independent in 1971 after a war of liberation from Pakistan. It has since grown into one of the most densely populated countries in the world and a major textile exporter.",
    interestingFacts: [
      "Bangladesh has the world's longest natural sea beach at Cox's Bazar.",
      "The Sundarbans is the largest mangrove forest in the world.",
      "Bangladesh is crossed by over 700 rivers.",
    ],
    seoTitle: "Bangladesh Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Bangladesh: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "PK",
    heroImageUrl: "https://picsum.photos/seed/country-pk/1600/700",
    heroImageAlt: "K2 mountain in northern Pakistan",
    population: 240_500_000,
    capital: "Islamabad",
    currency: "Pakistani Rupee (PKR, ₨)",
    religion: "Muslim (96%), Other (4%)",
    gdpSummary: "$338 billion nominal GDP (2023)",
    economy:
      "Pakistan's economy relies on textiles, agriculture, and remittances from its large overseas diaspora. Its northern regions also draw growing interest for mountaineering and adventure tourism.",
    travel:
      "Most visitors need a visa or e-Visa in advance. Attractions include K2 and the Karakoram range, the ancient city of Lahore, and the Mohenjo-daro archaeological site.",
    history:
      "Pakistan was created in 1947 during the partition of British India as a homeland for South Asian Muslims. It has since navigated periods of military rule and democratic transition while developing regionally significant nuclear and technology sectors.",
    interestingFacts: [
      "Pakistan is home to five of the world's fourteen peaks over 8,000 meters.",
      "The Indus Valley Civilization, one of the world's oldest, flourished in present-day Pakistan.",
      "Lahore's Badshahi Mosque was once the largest mosque in the world.",
    ],
    seoTitle: "Pakistan Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Pakistan: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "BR",
    heroImageUrl: "https://picsum.photos/seed/country-br/1600/700",
    heroImageAlt: "Christ the Redeemer statue overlooking Rio de Janeiro",
    population: 216_400_000,
    capital: "Brasília",
    currency: "Brazilian Real (BRL, R$)",
    religion: "Christian (86%), No religion (8%), Other (6%)",
    gdpSummary:
      "$2.2 trillion nominal GDP (2023), the largest economy in Latin America",
    economy:
      "Brazil is a major exporter of soybeans, iron ore, and coffee, and hosts a diversified industrial base including aerospace manufacturing. It has one of the world's largest renewable energy shares thanks to hydropower.",
    travel:
      "Many nationalities can enter visa-free for short stays. Highlights include Rio de Janeiro's beaches and Carnival, the Amazon rainforest, and the Iguaçu Falls.",
    history:
      "Colonized by Portugal from 1500, Brazil gained independence in 1822 and became a republic in 1889. It is now South America's largest nation by both area and population, and a member of the BRICS group of major emerging economies.",
    interestingFacts: [
      "The Amazon rainforest, mostly within Brazil, produces roughly 20% of the world's oxygen.",
      "Brazil is the only Portuguese-speaking country in the Americas.",
      "Rio de Janeiro's Carnival is the largest carnival celebration in the world.",
    ],
    seoTitle: "Brazil Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Brazil: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "CA",
    heroImageUrl: "https://picsum.photos/seed/country-ca/1600/700",
    heroImageAlt: "Banff National Park in the Canadian Rockies",
    population: 40_100_000,
    capital: "Ottawa",
    currency: "Canadian Dollar (CAD, $)",
    religion: "Christian (53%), No religion (35%), Other (12%)",
    gdpSummary: "$2.1 trillion nominal GDP (2023)",
    economy:
      "Canada's economy is resource-rich, with major oil, mining, and forestry sectors alongside strong services, finance, and technology industries centered in Toronto and Vancouver.",
    travel:
      "Many nationalities can enter visa-free or with an Electronic Travel Authorization (eTA). Popular destinations include Banff National Park, Toronto, and the fall foliage of Quebec.",
    history:
      "Originally home to Indigenous peoples for thousands of years, Canada became a self-governing dominion within the British Empire in 1867 and gradually gained full independence, becoming a bilingual, multicultural federation.",
    interestingFacts: [
      "Canada has the longest coastline of any country in the world.",
      "It shares the world's longest international land border with the United States.",
      "Canada has two official languages: English and French.",
    ],
    seoTitle: "Canada Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Canada: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "AU",
    heroImageUrl: "https://picsum.photos/seed/country-au/1600/700",
    heroImageAlt: "Sydney Opera House at sunset",
    population: 26_600_000,
    capital: "Canberra",
    currency: "Australian Dollar (AUD, $)",
    religion: "Christian (44%), No religion (39%), Other (17%)",
    gdpSummary: "$1.7 trillion nominal GDP (2023)",
    economy:
      "Australia's economy is built on mining exports (iron ore, coal, gold), agriculture, and a growing services sector. It is one of the world's top exporters of natural resources to Asian markets.",
    travel:
      "Most visitors need an Electronic Travel Authority (ETA) or visitor visa. Highlights include the Great Barrier Reef, Sydney Opera House, and the Outback's Uluru.",
    history:
      "Home to Aboriginal and Torres Strait Islander peoples for over 65,000 years, Australia became a British colony from 1788 and federated into a single nation in 1901, later becoming a fully independent Commonwealth realm.",
    interestingFacts: [
      "Australia is both a country and a continent.",
      "The Great Barrier Reef is the world's largest coral reef system, visible from space.",
      "More than 80% of Australia's plants and animals are found nowhere else on Earth.",
    ],
    seoTitle: "Australia Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Australia: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "RU",
    heroImageUrl: "https://picsum.photos/seed/country-ru/1600/700",
    heroImageAlt: "Saint Basil's Cathedral in Moscow",
    population: 143_800_000,
    capital: "Moscow",
    currency: "Russian Ruble (RUB, ₽)",
    religion: "Christian (majority, Orthodox), Muslim (minority), Unaffiliated",
    gdpSummary: "$2.0 trillion nominal GDP (2023)",
    economy:
      "Russia's economy is heavily reliant on oil, natural gas, and mineral exports, alongside a substantial defense and heavy industry sector spanning its vast territory across Europe and Asia.",
    travel:
      "Most visitors require a visa arranged in advance. Notable destinations include Moscow's Red Square, Saint Petersburg's palaces, and the Trans-Siberian Railway.",
    history:
      "Russia's roots trace to medieval Kievan Rus' and the Tsardom of Muscovy. It became the center of the Soviet Union in 1922 and, after the USSR's dissolution in 1991, re-emerged as the Russian Federation, the largest country in the world by land area.",
    interestingFacts: [
      "Russia spans 11 time zones, more than any other country.",
      "Lake Baikal in Siberia is the world's deepest freshwater lake.",
      "Russia is larger than Pluto in surface area.",
    ],
    seoTitle: "Russia Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Russia: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "ZA",
    heroImageUrl: "https://picsum.photos/seed/country-za/1600/700",
    heroImageAlt: "Table Mountain in Cape Town",
    population: 60_400_000,
    capital:
      "Pretoria (administrative), Cape Town (legislative), Bloemfontein (judicial)",
    currency: "South African Rand (ZAR, R)",
    religion: "Christian (86%), No religion (5%), Other (9%)",
    gdpSummary:
      "$381 billion nominal GDP (2023), one of the largest economies in Africa",
    economy:
      "South Africa has a diversified economy built on mining (gold, platinum, diamonds), financial services, and manufacturing, and serves as a regional hub for trade across southern Africa.",
    travel:
      "Many nationalities can enter visa-free for short stays. Highlights include Cape Town's Table Mountain, Kruger National Park's wildlife safaris, and the Garden Route.",
    history:
      "South Africa's modern history was shaped by Dutch and British colonization, and later by the apartheid system of racial segregation instituted in 1948. Apartheid ended in 1994 with the country's first democratic elections, led by Nelson Mandela.",
    interestingFacts: [
      "South Africa has three capital cities.",
      "It is home to the Cradle of Humankind, a UNESCO site with some of the oldest hominid fossils found.",
      "South Africa has 12 official languages.",
    ],
    seoTitle: "South Africa Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore South Africa: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "EG",
    heroImageUrl: "https://picsum.photos/seed/country-eg/1600/700",
    heroImageAlt: "The Great Pyramids of Giza",
    population: 112_700_000,
    capital: "Cairo",
    currency: "Egyptian Pound (EGP, £E)",
    religion: "Muslim (90%), Christian (10%)",
    gdpSummary: "$387 billion nominal GDP (2023)",
    economy:
      "Egypt's economy relies on tourism, Suez Canal transit revenues, natural gas production, and agriculture along the Nile Valley, which supports the vast majority of the population.",
    travel:
      "Most visitors need a visa or e-Visa, widely available on arrival for many nationalities. Iconic sites include the Pyramids of Giza, Luxor's Valley of the Kings, and Red Sea diving resorts.",
    history:
      "One of the world's oldest civilizations, ancient Egypt flourished along the Nile for over 3,000 years under the pharaohs. It later came under Greek, Roman, Arab, Ottoman, and British influence before gaining full independence in 1952.",
    interestingFacts: [
      "The Great Pyramid of Giza was the tallest human-made structure for nearly 3,800 years.",
      "The Suez Canal, opened in 1869, is one of the world's most important shipping routes.",
      "Over 90% of Egypt's population lives along the Nile River and its delta.",
    ],
    seoTitle: "Egypt Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Egypt: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "NG",
    heroImageUrl: "https://picsum.photos/seed/country-ng/1600/700",
    heroImageAlt: "Lagos skyline in Nigeria",
    population: 223_800_000,
    capital: "Abuja",
    currency: "Nigerian Naira (NGN, ₦)",
    religion: "Muslim (50%), Christian (48%), Other (2%)",
    gdpSummary:
      "$363 billion nominal GDP (2023), the largest economy in Africa by GDP",
    economy:
      "Nigeria is Africa's largest economy, driven by oil and gas exports, a rapidly growing fintech and tech startup scene centered in Lagos, and a large agricultural sector.",
    travel:
      "Most visitors require a visa in advance. Highlights include Lagos's vibrant arts and music scene, Yankari National Park, and the Osun-Osogbo sacred grove.",
    history:
      "Nigeria became a British protectorate in the early 20th century and gained independence in 1960. It is Africa's most populous country and home to over 250 ethnic groups, contributing to a rich and diverse cultural landscape.",
    interestingFacts: [
      "Nigeria is Africa's most populous country and one of the most populous in the world.",
      "Nollywood, Nigeria's film industry, is one of the largest producers of films globally.",
      "Nigeria is home to over 250 ethnic groups and more than 500 languages.",
    ],
    seoTitle: "Nigeria Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Nigeria: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "MX",
    heroImageUrl: "https://picsum.photos/seed/country-mx/1600/700",
    heroImageAlt: "Chichen Itza pyramid in Mexico",
    population: 128_500_000,
    capital: "Mexico City",
    currency: "Mexican Peso (MXN, $)",
    religion: "Christian (82%), No religion (12%), Other (6%)",
    gdpSummary: "$1.8 trillion nominal GDP (2023)",
    economy:
      "Mexico has one of the largest economies in Latin America, with strong manufacturing (automotive, electronics) tied closely to North American supply chains, alongside tourism and remittances.",
    travel:
      "Many nationalities can enter visa-free for short stays. Highlights include Chichen Itza's Mayan ruins, Mexico City's museums, and the beaches of Cancún and Tulum.",
    history:
      "Home to advanced civilizations including the Maya and Aztec, Mexico was colonized by Spain in the 16th century and gained independence in 1821. It has since developed into one of the world's most populous Spanish-speaking nations.",
    interestingFacts: [
      "Mexico City is built atop the ruins of the Aztec capital, Tenochtitlan.",
      "Mexico has more UNESCO World Heritage Sites than any other country in the Americas.",
      "Chocolate, tomatoes, and corn all originated in Mexico.",
    ],
    seoTitle: "Mexico Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Mexico: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
  {
    iso2: "SA",
    heroImageUrl: "https://picsum.photos/seed/country-sa/1600/700",
    heroImageAlt: "The Kaaba in Mecca, Saudi Arabia",
    population: 36_900_000,
    capital: "Riyadh",
    currency: "Saudi Riyal (SAR, ﷼)",
    religion: "Muslim (93%), Other (7%)",
    gdpSummary:
      "$1.1 trillion nominal GDP (2023), the largest economy in the Middle East",
    economy:
      "Saudi Arabia's economy is centered on oil exports, the world's largest proven reserves, while its Vision 2030 program is driving diversification into tourism, entertainment, and technology.",
    travel:
      "An e-Visa system launched in 2019 opened tourism to many nationalities. Highlights include the holy cities of Mecca and Medina, the ancient Nabatean site of AlUla, and the Red Sea coast.",
    history:
      "The modern Kingdom of Saudi Arabia was founded in 1932, unifying several regions under the House of Saud. It is home to Islam's two holiest cities and has played a central role in global energy markets since the mid-20th century.",
    interestingFacts: [
      "Saudi Arabia holds the world's second-largest proven oil reserves.",
      "AlUla's ancient Nabatean tombs predate Jordan's Petra by centuries in some structures.",
      "Millions of Muslims travel to Mecca each year for the Hajj pilgrimage.",
    ],
    seoTitle: "Saudi Arabia Country Profile — Population, Economy & Travel",
    seoDescription:
      "Explore Saudi Arabia: population, capital, currency, economy, history, travel tips, and the latest news.",
  },
];
