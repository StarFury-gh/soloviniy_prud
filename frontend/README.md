# Running dev mode:

```sh
npm i && npm run dev
```

## Warning:

To use: "Identify plant pages" u must to provide `API_URL` to src/constants.ts and run AI backend service.

# Catalog tree:

src
├── App.css
├── App.tsx
├── components
│   ├── common
│   │   ├── Button
│   │   │   ├── Button.module.css
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── Footer
│   │   │   ├── Footer.module.css
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   ├── Header
│   │   │   ├── Header.module.css
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   ├── Input
│   │   │   ├── index.ts
│   │   │   ├── Input.module.css
│   │   │   └── Input.tsx
│   │   └── Spinner
│   │   ├── index.ts
│   │   ├── Spinner.module.css
│   │   └── Spinner.tsx
│   ├── EventCard
│   │   ├── EventCard.module.css
│   │   ├── EventCard.tsx
│   │   └── index.ts
│   ├── GaleryPublication
│   │   ├── GaleryPublication.module.css
│   │   ├── GaleryPublication.tsx
│   │   └── index.ts
│   ├── IdentifyPlantForm
│   │   ├── IdentifyPlantForm.module.css
│   │   ├── IdentifyPlantForm.tsx
│   │   └── index.ts
│   ├── LoginForm
│   │   ├── index.ts
│   │   ├── LoginForm.module.css
│   │   └── LoginForm.tsx
│   ├── PlantPrediction
│   │   ├── index.ts
│   │   ├── PlantPrediction.module.css
│   │   └── PlantPrediction.tsx
│   ├── profile
│   │   ├── AddToGaleryForm
│   │   │   ├── AddToGaleryForm.module.css
│   │   │   ├── AddToGaleryForm.tsx
│   │   │   └── index.ts
│   │   ├── admin
│   │   │   ├── AdminEventCard
│   │   │   │   ├── AdminEventCard.module.css
│   │   │   │   ├── AdminEventCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── AdminEventsList
│   │   │   │   ├── AdminEventsList.module.css
│   │   │   │   ├── AdminEventsList.tsx
│   │   │   │   └── index.ts
│   │   │   ├── CreateEventForm
│   │   │   │   ├── CreateEventForm.module.css
│   │   │   │   ├── CreateEventForm.tsx
│   │   │   │   └── index.ts
│   │   │   ├── CreateStoryTagForm
│   │   │   │   ├── CreateStoryTagForm.module.css
│   │   │   │   ├── CreateStoryTagForm.tsx
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── PhotoRequest
│   │   │   │   ├── index.ts
│   │   │   │   ├── PhotoRequest.module.css
│   │   │   │   └── PhotoRequest.tsx
│   │   │   ├── PhotoRequestsList
│   │   │   │   ├── index.ts
│   │   │   │   ├── PhotoRequestsList.module.css
│   │   │   │   └── PhotoRequestsList.tsx
│   │   │   ├── RegisteredPlantCard
│   │   │   │   ├── index.ts
│   │   │   │   ├── RegisteredPlantCard.module.css
│   │   │   │   └── RegisteredPlantCard.tsx
│   │   │   ├── RegisteredPlantsList
│   │   │   │   ├── index.ts
│   │   │   │   ├── RegisteredPlantsList.module.css
│   │   │   │   └── RegisteredPlantsList.tsx
│   │   │   ├── StoriesRequestsList
│   │   │   │   ├── index.ts
│   │   │   │   ├── StoriesRequestsList.module.css
│   │   │   │   └── StoriesRequestsList.tsx
│   │   │   └── StoryRequest
│   │   │   ├── index.ts
│   │   │   ├── StoryRequest.module.css
│   │   │   └── StoryRequest.tsx
│   │   ├── CreatePostForm
│   │   │   ├── CreatePostForm.module.css
│   │   │   ├── CreatePostForm.tsx
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   └── IssueReporter
│   │   ├── index.ts
│   │   ├── IssueReporter.module.css
│   │   └── IssueReporter.tsx
│   ├── RegisterForm
│   │   ├── index.ts
│   │   ├── RegisterForm.module.css
│   │   └── RegisterForm.tsx
│   └── StoryCard
│   ├── index.ts
│   ├── StoryCard.module.css
│   └── StoryCard.tsx
├── constants.ts
├── hooks
│   ├── index.ts
│   ├── useAuth
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── useAuth.ts
│   ├── useEvents
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── useEvents.ts
│   ├── useGalery
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── useGalery.ts
│   ├── usePhotoRequests
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── usePhotoRequests.ts
│   ├── useStories
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── useStories.ts
│   ├── useStoriesRequests
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── useStoriesRequests.ts
│   └── useStoryTags
│   ├── index.ts
│   ├── types.ts
│   └── useStoryTags.ts
├── icons
│   └── index.ts
├── index.css
├── main.tsx
└── pages
├── DevelopmentPage
│   ├── DevelopmentPage.module.css
│   ├── DevelopmentPage.tsx
│   └── index.ts
├── EventsPage
│   ├── EventsPage.module.css
│   ├── EventsPage.tsx
│   └── index.ts
├── GaleryPage
│   ├── GaleryPage.module.css
│   ├── GaleryPage.tsx
│   └── index.ts
├── IdentifyPage
│   ├── IdentifyPage.module.css
│   ├── IdentifyPage.tsx
│   └── index.ts
├── index.ts
├── MainPage
│   ├── index.ts
│   ├── MainPage.module.css
│   ├── MainPage.tsx
│   └── sections
│   ├── AboutSection
│   │   ├── AboutSection.module.css
│   │   ├── AboutSection.tsx
│   │   └── index.ts
│   ├── CtaSection
│   │   ├── CtaSection.module.css
│   │   ├── CtaSection.tsx
│   │   └── index.ts
│   ├── HeroSection
│   │   ├── HeroSection.module.css
│   │   ├── HeroSection.tsx
│   │   └── index.ts
│   ├── index.ts
│   ├── SeasonsSection
│   │   ├── index.ts
│   │   ├── SeasonsSection.module.css
│   │   └── SeasonsSection.tsx
│   └── StatsSection
│   ├── index.ts
│   ├── StatsSection.module.css
│   └── StatsSection.tsx
├── StoriesPage
│   ├── index.ts
│   ├── StoriesPage.module.css
│   └── StoriesPage.tsx
└── UserProfile
├── index.ts
├── UserProfile.module.css
└── UserProfile.tsx

53 directories, 144 files
