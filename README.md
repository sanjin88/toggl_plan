Certainly! Here's the content in Markdown format that you can copy and paste into a `readme.md` file:

```markdown
# Toggl Timeline

## Description

Toggl Timeline is a web application that provides a visual timeline for managing tasks. It supports custom drag-and-drop functionality, task saving in local storage, and fetching tasks from the Toggl Plan API.

## Getting Started

### Prerequisites

Make sure you have [pnpm](https://pnpm.io/) installed.

### Installation

```bash
pnpm install
```

### Starting the Local Server

```bash
pnpm run dev
```

## Features

### Custom Drag and Drop

Toggl Timeline includes a custom drag-and-drop feature, allowing users to easily move and update tasks within the timeline.

### Saving in Local Storage

Tasks positions (start and end date) are saved in the local storage, ensuring that user data persists across sessions. 

### Fetching from API

Tasks are fetched from the Toggl Plan API. The application uses an API key for authorization, which is temporarily hardcoded for demonstration purposes.

## Usage

1. Start the local server using `pnpm run dev`.
2. Open your web browser and navigate to `http://localhost:your_port`
3. Explore the timeline, drag-and-drop tasks, and use the filter options.

## Project Structure

The project follows a standard structure with important directories and files, including:

- `src/components`: Contains Svelte components.
- `src/models`: Includes data models such as `TaskModel`.
- `src/pages`: Holds all main parent route page componentr.
- `src/stores`: Holds Svelte store files.
- `src/types`: Root level reusable types.
- `src/utils`: Includes utility files such as `TimelineGridUtil`.
- `src/pages`: Contains page components like `Timeline` and `NotFound`.