# Quiz Application

A Quiz Application built with **NestJS**, **Node.js**, and **SQLite** for interview practice and assessments. It features a multi-role system, where admins manage users and tests, while users attend the tests assigned to them.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Features
- **Admin Role**: 
  - Manage users and questions.
  - Assign and reassign tests.
  - View quiz results.

- **User Role**: 
  - Take assigned tests and submit answers.

- **Role-Based Access Control**: Admin and user roles with defined permissions.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/guhand/quiz-server.git
    ```
2. Navigate to the project directory:
    ```bash
    cd quiz-server
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the development server:
    ```bash
    npm run start:dev
    ```

## Usage
- **Admin**: Manage users, questions, and tests.
- **User**: Take assigned tests and submit answers.

## Technologies Used
- **Node.js**
- **NestJS**
- **SQLite**
- **npm**
