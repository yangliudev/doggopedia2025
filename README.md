# Doggopedia 2025

This is a comprehensive dog breed encyclopedia app built with [Expo](https://expo.dev) that provides detailed information on various dog breeds.

## App Screenshots

<div align="center">
  <img src="./assets/Google%20Play%20Store/home_screen.png" alt="Home Screen" width="200"/>
  <img src="./assets/Google%20Play%20Store/discover.png" alt="Discover" width="200"/>
  <img src="./assets/Google%20Play%20Store/dog_information.png" alt="Dog Information" width="200"/>
  <img src="./assets/Google%20Play%20Store/favorites.png" alt="Favorites" width="200"/>
</div>

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Features

- **Comprehensive Breed Information**: Detailed profiles for numerous dog breeds
- **Discover Mode**: Explore and discover new dog breeds
- **Favorites**: Save your favorite breeds for quick access
- **Beautiful UI**: Clean and intuitive user interface with dark/light mode support
- **Smooth Animations**: Responsive and fluid user experience

## Technology Stack

This app is built using:

- [Expo](https://expo.dev) with React Native
- TypeScript for type safety
- Expo Router for file-based navigation
- Custom UI components and animations
- MediaWiki API for fetching detailed dog breed information

## Data Collection Process

The app's comprehensive dog breed database was created through a two-step process:

1. **Initial Breed List**: A complete list of dog breeds was scraped from Wikipedia's ["List of dog breeds"](https://en.wikipedia.org/wiki/List_of_dog_breeds) page. The scraped data is stored in `api/cleanedData.json` and includes over 400 recognized dog breeds.

2. **Detailed Breed Information**: The app uses the [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page) to dynamically fetch an image and details about each dog breed.

This approach ensures that the app always displays the most up-to-date and accurate information directly from Wikipedia's extensive knowledge base.

## Join the community

Join our community of dog lovers and app developers:

- [Report an Issue](https://github.com/yangliudev/doggopedia2025/issues): Help us improve the app by reporting bugs or suggesting features.
- [Follow for Updates](https://github.com/yangliudev): Stay informed about updates and new features.
