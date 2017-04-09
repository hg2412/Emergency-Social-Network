# Survivable Social Network on a Chip        Team SA-8 TeamName:SA-8

_The vision of the system is creating a social network in which people_

_can communicate with others and share status in emergencies like_

_earthquake, via mobile phone._

## Technical Constraints
- **Hardware** : App server runs on a Beaglebone Black with wireless dongle and powered by a rechargeable battery. Clients connect to the app server via their mobile phone browsers. Memory and performance limited by hardware.
- **Client Side Software** : no native app, only web stack (HTML5, CSS, JS) on mobile browser (initially only Chrome will be supported)

## High-Level Functional Requirements

- Join community: User log in
- Chat publicly: User chat in public wall
- Share Status: User share self’s status
- Chat Privately: User chat to another user privately
- Post Announcement: User post announcement
- Search Information: User search information

## Top 3 Non-Functional Requirements

- Testability
- Extensibility
- Maintainability

## Architectural Decisions with Rationale

- Client-Server as main architectural style
- Serverside JS (node.js) for low footprint and reasonable performance (event-based, non-blocking asynchronous I/O, easily configurable pipe-and-filter for processing incoming requests via middleware)
- Lightweight MVC on the server side via the **express** framework
- RESTful API for core functionality to reduce coupling between UI and back-end
- Event-based fast dynamic updates via web-sockets
- Lightweight no-sql database  for quick search

## Design Decisions with Rationale

- Encapsulate data and behavior in models for easy testing and better modularization

## Responsibilities of Main Components

- **socket.io:** dynamic updates from server to client, clients&#39; views are automatically updated when new messages are post or when new new users login
- **Bootstrap** : responsive design, clean, scalable UI layout
- **EJS** : template to render UI views
- **MongoDB** : light-weight DB, a No-SQL db
- **Express:** oganize and modularize server-side code
- **React JS:** a Javascript library for building user interfaces
- **Ajax:  ** asynchronous javascript, can update portions of a page based upon user events
- **Node.js:** As an asynchronous event driven JavaScript runtime, Node is designed to build scalable network applications
- **Restful API:** an application program interface that uses http requests to GET, PUT, POST and DELETE data.


## Code Organization View
![Aaron Swartz](https://raw.githubusercontent.com/edian/pics/master/classdiagram.png)

## Deployment View
![Aaron Swartz](https://raw.githubusercontent.com/edian/pics/master/Deployment%20View.png)
