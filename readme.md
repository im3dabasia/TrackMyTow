# Vehicle Tracking App

Welcome to the Tracking Tow App repository! We appreciate your interest in contributing. Please follow the guidelines below to make meaningful contributions to our project.

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Setting Up the Project](#setting-up-the-project)
-   [Contributing](#contributing)
    -   [Creating a Feature Branch](#creating-a-feature-branch)
    -   [Making Changes](#making-changes)
    -   [Pushing Changes and Creating a Pull Request](#pushing-changes-and-creating-a-pull-request)
-   [Environment Variables](#environment-variables)
    -   [.env File](#env-file)
    -   [MongoDB and MQTT URIs](#mongodb-and-mqtt-uris)

## Getting Started

### Prerequisites

Before you start contributing, make sure you have the following installed on your machine:

-   Node.js
-   npm (Node Package Manager)

### Setting Up the Project

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/im3dabasia/TrackMyTow.git
    cd TrackMyTow
    ```

2. Install project dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

Now you're ready to contribute to the project!

## Contributing

### Creating a Feature Branch

1. Create a new branch for your feature:

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. Make your changes in the appropriate files.

### Making Changes

Ensure that your changes adhere to the coding standards and guidelines of the project.

### Pushing Changes and Creating a Pull Request

1. Commit your changes:

    ```bash
    git add .
    git commit -m "Add your meaningful commit message"
    ```

2. Push your branch to the repository:

    ```bash
    git push origin feature/your-feature-name
    ```

3. Go to the repository on GitHub and create a new Pull Request (PR).

4. Provide a clear and concise title and description for your PR.

5. Wait for feedback or approval from project maintainers.

6. Once approved, your changes will be merged into the main branch.

## Environment Variables

### .env File

Create a `.env` file in the root of the project and add the following:

    ```env
    PORT=3000
    ```

### MongoDB and MQTT URIs

Contact the project administrator to obtain the MongoDB and MQTT URIs. Add them to your `.env` file:

    ```env
    MONGO_URI=mongodb://your-mongo-uri
    MQTT_URI=mqtt://your-mqtt-uri
    ```

These URIs are necessary for the proper functioning of the application.

Thank you for contributing to our Tracking Tow App!
