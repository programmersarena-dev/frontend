# ProgrammersArena React Frontend

This is the React frontend for ProgrammersArena, an online contest platform that supports input/output problems and ICPC-like contests. The frontend is built with React and styled using Tailwind CSS.

## Table of Contents

- [Installation](#installation)
- [Building the Project](#building-the-project)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [License](#license)

## Installation

### Prerequisites

- Node.js: Ensure Node.js is installed on your system. You can download it from [here](https://nodejs.org/).

### Clone the Repository

If you haven't already, clone the project repository from GitHub:

```sh
git clone https://github.com/mali-ab/programmers-arena.git
cd programmers-arena/react
```

## Install Node.js Dependencies

Navigate to the react directory and install the necessary dependencies:

```sh
npm install
```

### Building the Project

To build the project for production, run:

```sh
npm run build
```

This will create an optimized production build in the build directory.

### Running the Project

## Start Development Server

To start the development server, run:

```sh
npm run dev
```

This will run the app in development mode. Open http://localhost:3000 to view it in the browser. The page will reload if you make edits.

### Usage

## Access the Application

- Access the React frontend at http://localhost:3000 when running locally.
- The frontend interacts with the Laravel backend to provide features for participating in contests.

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Additional Notes

- **Environment Configuration:** If your React app requires environment variables, make sure to create a `.env` file in the `react` directory and add the necessary configurations.
- **Backend Integration:** Ensure the Laravel backend is running and accessible by the React frontend.

Feel free to adjust paths, repository URLs, and configurations based on your project's specifics.
