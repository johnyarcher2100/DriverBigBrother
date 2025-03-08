# 任務主檔

## 目標產品規格書

### 運將大哥 - 叫車服務應用程式

#### 1. Project Overview
This project is about building a ride-hailing app framework called "運將大哥." The system is designed to support random users who need a reliable ride service with an intuitive mobile interface. The main goal is to connect riders and drivers in real time by using a robust backend provided by Supabase – which includes PostgreSQL and PostGIS for handling geolocation data – and a mobile app built with React Native. Essential features include real-time subscription updates, efficient route planning using Google Maps, secure payments tailored for the Taiwan market, and elevated security measures like driver license verification, face recognition, and authentication codes.

The app is being built to address the common pain points of traditional ride-hailing services. It improves the user experience by offering accurate ETA predictions based on live traffic data, clear communication between drivers and passengers using real-time updates, and strong security features to protect users' and drivers' sensitive information. The key objectives for this project are to ensure reliability, responsiveness, and security while providing smooth integration of payment systems and geolocation services.

#### 2. In-Scope vs. Out-of-Scope

**In-Scope:**

* User registration and login with mobile number verification (authentication code based)
* Rider booking process including input of destination and route planning using the Google Maps API
* Real-time driver matching, location updates, and ride status notifications using Supabase subscriptions
* Driver management including status updates (idle, busy) and location tracking
* Comprehensive API endpoints for user management, driver management, ride requests, and messaging
* Secure payment integration supporting Line Pay, StreetPay, and credit cards (specifically for the Taiwan market)
* Enhanced security measures including encryption for sensitive data, TLS/SSL for communications, and additional identity validation (driver license, face recognition)
* Features for route planning enhancements such as alternative routing based on traffic data and recalculated ETA
* Basic ride-sharing features like trip sharing with trusted contacts and an emergency contact button

**Out-of-Scope:**

* Support for multiple external mapping or traffic data providers beyond the Google Maps API
* Detailed brand styling, design guidelines, or custom visual themes (default styles via Tailwind CSS and Shadcn UI are used)
* Microservices architecture implementation for this version (future iterations can explore full microservices)
* Integration with additional third-party real-time notification systems (e.g., Firebase) beyond Supabase subscriptions
* Extensive scalability features for massive deployment (initial focus is on a monolithic architecture with container-friendly deployment)

#### 3. User Flow
When a user first opens the app, they are greeted by a simple and clear screen that prompts them to register or log in. New users complete their registration with necessary details and a mobile number verification process using an authentication code. Once registered, users can sign in and are redirected to the main dashboard that provides clear navigation options, including their current location, destination input, and access to any previous ride history.

After logging in, a passenger inputs their destination, triggering the app to use the Google Maps API for route planning and real-time traffic analysis. The system then uses geolocation data to match the passenger with a nearby driver. Drivers receive real-time notifications about ride requests and update their status and location in the app. Throughout the ride, users can track the driver's progress, view dynamic ETA updates, and share trip details with trusted contacts, ensuring that both ride status and safety are maintained with continuous updates.

#### 4. Core Features

* **Authentication & User Management:**

  * User registration and login via mobile number and authentication code
  * Endpoint support: POST /api/v1/auth/register, POST /api/v1/auth/login, GET /api/v1/users/me, PATCH /api/v1/users/me

* **Driver Management:**

  * Real-time driver location updates and status management (idle/busy)
  * Endpoint support: POST /api/v1/drivers/location, PATCH /api/v1/drivers/status, GET /api/v1/drivers/stats

* **Ride Request & Matching:**

  * Passenger ride requests based on current geolocation and destination input
  * Matching service that finds nearby drivers using real-time subscriptions
  * Endpoint support: POST /api/v1/rides, GET /api/v1/rides/active, GET /api/v1/rides/:id, PATCH /api/v1/rides/:id/status, GET /api/v1/rides/history

* **Real-Time Communication:**

  * Subscription-based notifications for driver location and ride status updates
  * Messaging system for communication between passenger and driver
  * Endpoint support: POST /api/v1/messages, GET /api/v1/messages/:rideId, PATCH /api/v1/messages/:id/read

* **Geolocation & Route Planning:**

  * Integration with Google Maps API for route generation and real-time traffic insights
  * Dynamic recalculation of ETA based on live driver positioning and traffic analysis

* **Payment Integration:**

  * Supports multiple payment methods including Line Pay, StreetPay, and credit cards
  * Automatic billing calculation based on distance, time, and demand
  * Strong payment security and compliance (for Taiwan market)

* **Security Enhancements:**

  * Data encryption for sensitive information and TLS/SSL for secure communications
  * Identity verification methods (driver license validation, face recognition)
  * Features for trip sharing and emergency contact functionality

#### 5. Tech Stack & Tools

* **Frontend:**

  * Mobile App: React Native (chosen for cross-platform support)
  * Starter Kit: React + Supabase using Vite, Tailwind CSS, Typescript, and Shadcn UI for rapid UI development

* **Backend:**

  * Supabase providing backend-as-a-service with PostgreSQL and PostGIS for geolocation support
  * RESTful API design for clear endpoints and consistent data management

* **Mapping & Geolocation:**

  * Google Maps API for route planning, real-time traffic monitoring, and ETA calculations

* **Real-Time Communication:**

  * Supabase subscriptions to handle real-time updates (driver locations, ride status changes, and notifications)

* **Payment Integration:**

  * Integration with local payment systems (Line Pay, StreetPay, credit cards)
  * Automatic billing algorithms built into the backend logic

* **Additional Tools:**

  * ChatGPT (GPT-4 O1 model) for advanced code generation
  * VS Code for code editing and debugging
  * Replit for online IDE and collaborative coding
  * Deepseek and Claude AI for additional code assistance and model support

#### 6. Non-Functional Requirements

* **Performance:**

  * The system should provide real-time updates with minimal latency (aim for near-instant subscriptions)
  * Ride matching and ETA recalculations should be processed quickly to maintain a smooth experience

* **Security:**

  * All sensitive data must be encrypted both in transit (using TLS/SSL) and at rest
  * Payment processes must comply with regional security standards, helping ensure compliance with local financial regulations (e.g., PCI-DSS for credit card processing)

* **Usability & Accessibility:**

  * The user interface should remain simple, clean, and easy-to-navigate
  * Ensure that both drivers and passengers can easily access all application features with minimal confusion

* **Reliability:**

  * Real-time subscriptions and API endpoints must handle sudden network drops or weak network conditions gracefully
  * The system should be robust enough to manage the expected load in the Taiwan market

#### 7. Constraints & Assumptions

* The backend relies heavily on Supabase and PostgreSQL with PostGIS, so its availability and performance are a key dependency.
* The initial version will focus on a monolithic architecture even though future scalability may consider a microservices approach.
* The selected third-party APIs, such as Google Maps, are assumed to be stable and available without regional restrictions for the intended usage.
* The development is centered around React Native for the mobile app, and any further cross-platform enhancement using Flutter is out-of-scope at this stage.
* It is assumed that the target market is Taiwan, meaning payment gateways and currency support will be tailored accordingly.

#### 8. Known Issues & Potential Pitfalls

* **Real-Time Updates:**

  * Relying solely on Supabase subscriptions could lead to performance issues if traffic spikes unexpectedly. It may be necessary to monitor API rate limits and consider fallback options.

* **API Rate Limits & Dependency on Third-Party Services:**

  * The usage of Google Maps API for route planning and traffic data might be subject to rate limits. Optimize API calls and consider caching frequent requests where possible.

* **Security Risks:**

  * Handling sensitive personal and payment data requires rigorous implementation of encryption and secure communication protocols. Ensure thorough code reviews and compliance testing to avoid potential data breaches.

* **Scalability Challenges:**

  * While the current design is monolithic, scaling may become an issue with increased load. Mitigate this by designing endpoints and modules with separation of concerns, so moving to a microservices architecture later is smoother.

* **Network Reliability:**

  * Mobile networks can be unpredictable. Build in robust error handling for weak or unstable connections, especially for real-time driver updates and subscription-based notifications.

This document serves as the comprehensive guide for the AI model to understand and generate all subsequent technical documents. It explains the purpose, user interactions, core features, technology choices, and potential technical challenges in straightforward, everyday language.

### App Flow Document

#### Introduction
This application, known as "運將大哥," is a ride-hailing platform that connects everyday users with nearby drivers. The app is designed to provide a seamless experience using a robust backend powered by Supabase and geospatial features using PostgreSQL and PostGIS. It leverages real-time subscriptions to update ride status and driver locations instantly while integrating Google Maps for route planning, real-time traffic analysis, and accurate ETA calculations. The overall goal is to simplify the process of booking a ride while ensuring safety and convenience for both drivers and riders, using everyday language and clear, user-friendly interfaces.

#### Onboarding and Sign-In/Sign-Up
When a new user opens the application, they are greeted by a clean and inviting landing page that clearly presents the options for registration and login. For first-time users, the sign-up process involves entering basic personal details along with a mobile number verification using an authentication code. The app makes this process simple by guiding the user step by step through the registration form. Existing users can easily sign in using their credentials. Simple options for password recovery are available along with instructions on how to retrieve a lost or forgotten password. The design also considers the necessary security checks with additional validation methods like verification codes to ensure the integrity of user data from the very beginning.

#### Main Dashboard or Home Page
After signing in, the user is directed to the main dashboard which serves as the central hub for all activities within the app. The home page is clean and intuitive, featuring a clear header with navigation options and a sidebar where users can easily access their profile, ride history, and settings. In the center of the page, users see a map integration powered by Google Maps that displays their current location along with available nearby drivers. This dashboard offers a quick glance at notifications, current ride status, and upcoming or historical rides. The intuitive design means that users can quickly move from the dashboard to key functions such as inputting a destination, reviewing ride details, or checking communications between themselves and the drivers.

#### Detailed Feature Flows and Page Transitions
When a rider wants to book a ride, they begin on the dashboard by entering their desired destination in a dedicated field. Upon input, the app connects with Google Maps to generate the best possible route and displays live traffic information. The system then uses the current location and other geolocation data to match the rider with nearby drivers in real time. Once a ride request is initiated, the page transitions to a confirmation screen where the rider can review the route, estimated arrival time, and fare calculation details. This screen clearly shows the ride status, updating from waiting for a driver to accepting, in progress, and finally, completed. If the rider wishes to share their trip, a secure sharing function is available to send details to trusted contacts. In parallel, drivers encounter a similar flow where the app updates their location continuously, displays incoming ride requests, and allows them to toggle their status between available and busy. As drivers accept a ride, the app sends real-time notifications to the rider's device, synchronizing the ride details across both ends. When the ride ends, users are presented with a payment screen that calculates the cost automatically based on distance, time, and demand, and integrates multiple local payment options such as Line Pay, StreetPay, and credit card. Throughout the ride, messages between driver and passenger are exchanged seamlessly through a built-in messaging system, ensuring that both parties are informed and that all page transitions occur smoothly.

#### Settings and Account Management
Users can access the settings section from the main dashboard, where they are able to manage personal information such as name, phone number, and profile picture. Within this section, users can also update their preferences for notifications and visibility. If a payment method needs to be added or updated, the app provides a clear payment configuration area where users follow straightforward instructions to link their preferred payment provider. Security settings are also managed here, letting users review their account's encryption details and other privacy enhancements. After making any changes, users are directed back to the main dashboard without a hitch, ensuring that account management feels connected to the overall app experience.

#### Error States and Alternate Paths
If users input incorrect or invalid data during registration or sign in, the app immediately displays clear and simple error messages explaining the issue and how to correct it. In cases of network or server interruptions, the system presents a friendly fallback page that informs the user of connectivity issues and offers an option to retry the operation. During ride requests, if no drivers are available nearby, the app communicates this smoothly and suggests the rider to try again later. The application also handles cases where real-time updates may be delayed, by notifying users and entering a safe state that preserves data until connectivity is restored. Every error message is designed to be clear and non-technical so that users understand what happened and can easily resume their journey once the problem is resolved.

#### Conclusion and Overall App Journey
From the moment a new user opens the app and encounters a welcoming landing page, through the straightforward registration and sign in process, every step is designed to be simple and direct. Once on the main dashboard, users can quickly request a ride by inputting their destination and obtaining dynamic route information and real-time driver updates. Whether the user is a rider or a driver, the app smoothly transitions between various states from matching, ride progress, to payment completion. The settings allow for easy management of personal data, and clear instructions are provided for any error states. Overall, the journey is intuitive and secure, ensuring that every interaction—from sign-up to ride completion—is integrated in a reliable and user-friendly manner.

## 系統架構圖說

### Technology Stack Document

#### Introduction
This document explains our technology choices for the ride-hailing application known as "運將大哥." Our aim is to build an easy-to-use service connecting passengers and drivers in real time. Underpinned by modern technologies like Supabase with PostgreSQL and PostGIS, the system efficiently handles geolocation needs while offering features like real-time updates, thoughtful route planning with Google Maps, secure payment processing, and enhanced safety measures. This guide walks you through each layer of our technology stack in everyday language.

#### Frontend Technologies
For the user interface, we use a combination of Vite js, Tailwind CSS, and Typescript enhanced by Shadcn UI and React Native. Vite js serves as a fast and lightweight foundation, while Tailwind CSS ensures that our design remains clean and modern. Typescript brings an extra layer of reliability by reducing programming errors through clearer code structure. Our choice of React Native specifically supports cross-platform mobile development, making it possible for the app to work smoothly on both Android and iOS. This setup ensures that end users experience a responsive, visually appealing, and easy-to-navigate interface.

#### Backend Technologies
At the heart of our application is Supabase, which provides a complete backend solution that includes PostgreSQL enhanced with PostGIS. This powerful combination efficiently handles data storage and management while providing rich geolocation functionalities critical for matching passengers with nearby drivers and recalculating routes in real time. Our backend also employs RESTful API endpoints for all core functionalities such as user and driver management, ride requests, messaging, and real-time updates. This clear organization helps ensure that every change—from driver location updates to the booking process—is managed reliably and transparently.

#### Infrastructure and Deployment
Our chosen infrastructure leverages cloud hosting and Supabase for both managing the backend and ensuring reliable, scalable service delivery. The system is designed to be deployed through containerized setups (using Docker) and, if needed, orchestrated with tools like Kubernetes for future expansion. We also incorporate continuous integration and continuous deployment (CI/CD) practices to maintain stable and timely updates to the application. This approach guarantees that our service remains robust, responsive, and easy to update as we continue to roll out improvements.

#### Third-Party Integrations
The framework includes several important third-party integrations that enhance functionality. Google Maps API powers our route planning and real-time traffic analysis, ensuring that both drivers and passengers receive accurate maps, traffic conditions, and estimated time of arrival (ETA) updates. For secure payments, we integrate local systems such as Line Pay, StreetPay, and credit card processing specifically tailored for the Taiwan market. Additionally, Supabase’s real-time subscription features enable instantaneous updates for ride statuses and driver locations, contributing to a seamless and connected experience for all users.

#### Security and Performance Considerations
Security is a primary focus across our technology stack. We ensure that all sensitive data is encrypted both in storage and during transmission using strong encryption methods and TLS/SSL protocols. Our system supports robust identity verification measures such as driver license checks, face recognition logins, and authentication codes to protect user identities. To further secure the application, features like trip sharing with trusted contacts and emergency contact buttons are built in. On the performance side, real-time communication via Supabase subscriptions and careful load testing (including network condition simulations) ensure that the app remains responsive even under high traffic conditions.

#### Conclusion and Overall Tech Stack Summary
To summarize, our technology stack is thoughtfully assembled to meet the unique needs of the ride-hailing app "運將大哥." The frontend relies on modern tools like Vite js, Tailwind CSS, Typescript, Shadcn UI, and React Native, ensuring a smooth and visually appealing user experience. The backend is powered by Supabase with PostgreSQL and PostGIS, providing a reliable foundation for geolocation, data security, and real-time communications. Our infrastructure strategy with advanced deployment practices further guarantees scalability and reliability. Finally, the integration of essential third-party services such as Google Maps API and multiple payment gateways—coupled with rigorous security protocols—makes this stack well-suited to deliver a secure, efficient, and user-friendly ride-hailing experience. This comprehensive approach positions us uniquely in the market, ensuring that every component works together to meet both user needs and business goals.

### Backend Structure Document

#### Introduction
The backend is the backbone for the 運將大哥 ride-hailing app. It supports the real-time connection between passengers and drivers, makes sure that location data is accurate, and that everyone's information is secure. This system relies on Supabase, which integrates PostgreSQL and PostGIS, to handle everything from user data to live geolocation updates. In simple words, the backend is the engine that keeps the entire app running smoothly and safely.

#### Backend Architecture
Our backend is built with a solid, dependable architecture to support the heavy lifting of a ride-hailing service. Using Supabase as the main platform, we rely on PostgreSQL for data management and PostGIS to handle all geolocation-based tasks. The solution is designed in a modular way, meaning that different pieces, such as user management and ride tracking, work independently yet communicate with each other seamlessly. Although the current design is monolithic, it has been structured so that we can later split it into microservices if the need arises. This approach guarantees not only straightforward maintenance but also the ability to scale the system when the number of users and requests increases.

#### Database Management
For data storage, we use PostgreSQL enhanced with PostGIS. PostgreSQL is a trusted SQL database that organizes and stores data in tables, which makes it easy to sort, retrieve, and secure information. PostGIS adds geospatial capabilities to PostgreSQL, enabling us to accurately manage location data such as driver positions and routes. In our system, user profiles, ride information, driver statistics, and real-time location updates are all stored in a structured format. This makes it simple to both fetch live data for real-time updates and securely archive historical ride data for analysis and record-keeping.

#### API Design and Endpoints
The backend APIs are designed following RESTful principles, offering a clean and straightforward way for different parts of the app to communicate with each other. Key endpoints include those for user registration and login, driver location updates, ride creation and status updates, and messaging between passengers and drivers. For example, when a passenger requests a ride, a POST endpoint creates the request, while dedicated endpoints allow for checking active rides or updating ride status. These clearly defined paths mean that when the app requests data, the backend knows exactly where to look and what action to take, ensuring a reliable flow of information throughout the service.

#### Hosting Solutions
Our backend is hosted on Supabase's cloud environment, which ensures that the system is available and responsive at all times. By using a cloud-based platform, we benefit from high reliability, instant scalability, and efficient cost management. The hosting solution is designed to handle sudden surges in usage, making it a practical choice for an app that could see heavy traffic at any time. The cloud setup also means that updates and patches can be applied smoothly, keeping the system modern and secure without major downtime.

#### Infrastructure Components
Several key infrastructure components work together to enhance the performance and user experience of the app. Load balancers distribute incoming traffic evenly to ensure no single server gets overwhelmed, and caching mechanisms keep frequently requested data ready for quick access. In addition, a content delivery network (CDN) is used for serving static resources such as images and scripts, which speeds up load times for users. Meanwhile, Supabase's real-time subscription service is at the core for updating driver locations and ride statuses instantly, making the overall experience feel seamless and responsive.

#### Security Measures
Security is taken very seriously in this system. We have implemented multiple layers of protection to ensure that both user and driver data is safe. Sensitive information is always stored using strong encryption methods, and every communication between the user's device and our servers is secured using TLS/SSL protocols. For user authentication, methods like mobile verification through an authentication code, driver license checks, and even face recognition are integrated to make sure that only authorized people gain access. Additional features such as trip sharing with trusted contacts and emergency contact buttons further enhance the safety of all parties involved. Every design decision aims to protect personal data and ensure that the app complies with relevant security regulations, making the service as trustworthy as possible.

#### Monitoring and Maintenance
To ensure the system remains healthy and effective, we have set up tools and practices for regular monitoring. Real-time dashboards keep track of server performance, user activity, and any unusual patterns, allowing our team to quickly respond to any issues. The system is also subject to regular maintenance cycles, which include updating dependencies, backing up data, and performing load tests to simulate peak traffic scenarios. These routine checks are essential for detecting potential problems early, so that the risk of downtime is minimized and the overall experience remains consistently reliable.

#### Conclusion and Overall Backend Summary
In summary, the backend structure for 運將大哥 is built to be robust, flexible, and secure. By choosing a cloud-based solution with Supabase, PostgreSQL, and PostGIS, we ensure that the system is well-equipped to manage everything from real-time geolocation to secure data storage and billing. The carefully designed RESTful API endpoints facilitate clear and efficient communication between the mobile app and the backend, while the infrastructure components work in harmony to provide a fast and reliable user experience. With comprehensive security measures and a proactive approach to monitoring and maintenance, the backend not only supports today's operational needs but is also poised for future expansion. This thoughtful design plays a key role in making the ride-hailing service as efficient, dependable, and user-friendly as possible.

## 功能模組分解表

### Frontend Guideline Document

#### Introduction
The frontend of our ride-hailing app, "運將大哥," is the face that interacts directly with the user. It plays a crucial role in delivering an experience that is both intuitive and engaging while ensuring that the app remains responsive and secure. This document provides an overview of the design, architecture, and technologies used to develop the user interface, making it simple for anyone to understand even without a technical background.

#### Frontend Architecture
Our frontend is built on a modern stack that includes Vite js, Tailwind CSS, Typescript, and Shadcn UI, while using React Native for cross-platform mobile development. This architecture is designed to be modular, scalable, and maintainable. It leverages the power of Vite js as a fast development environment and uses React Native to deliver a seamless experience on both Android and iOS. The integration with Supabase allows us to tap into real-time subscription features, ensuring that updates such as driver locations and ride status changes are instantly communicated to the user.

#### Design Principles
The user interface is built with clear principles in mind: usability, accessibility, and responsiveness. Every design decision is taken to ensure that the app remains simple to navigate and easy to interact with, regardless of the user's technical expertise. Accessibility is emphasized so that all users, including those who may need assistive technologies, can use the service without difficulty. By focusing on responsiveness, the design adapts to different screen sizes and mobile networks, providing a consistent user experience under various conditions.

#### Styling and Theming
The styling of the app is carried out using Tailwind CSS, which offers a utility-first approach to design. This allows developers to create a consistent and modern look without being overwhelmed by complex CSS structures. Shadcn UI enhances the user interface further by providing pre-designed components that are both aesthetically pleasing and adaptable. While a fixed default theme is used to maintain uniformity, the design allows for easy adjustments in the future should the need for customization arise.

#### Component Structure
The app is built on a component-based architecture, where each element of the interface is a reusable piece of the overall application. Components are organized in a clear directory structure, ensuring that they are easy to locate and maintain. This approach not only speeds up development but also makes it easier to manage and update parts of the application independently. By reusing components across different screens, we maintain design consistency and reduce the likelihood of errors.

#### State Management
Managing the state of the app is essential for a seamless user experience. State is handled through React Native's built-in state management along with the Context API, ensuring that data is shared efficiently across components. As the application relies on real-time updates from Supabase subscriptions, state management plays a pivotal role in updating driver locations, ride statuses, and other critical information without lag or inconsistency. This organized approach helps keep the user interface responsive and accurate at all times.

#### Routing and Navigation
Navigation within the app is clear and straightforward. React Native's navigation libraries are used to manage how users move between different screens. The navigation structure is designed so users can easily transition from logging in to booking a ride, checking the live status of the ride, and accessing payment and history screens. Each navigation action is optimized to ensure a quick rendering of views, reducing waiting time and making the overall experience smooth and intuitive.

#### Performance Optimization
Several strategies are implemented to keep the app fast and responsive. The use of Vite js ensures that development builds are quick, while techniques such as lazy loading and code splitting ensure that users only load what is necessary at a given time. Real-time updates, handled through Supabase subscriptions, are carefully optimized so they do not overwhelm the network, even during peak usage times. These performance measures help deliver a consistently smooth and efficient experience, regardless of the device or network conditions.

#### Testing and Quality Assurance
To ensure a reliable user experience, we employ a range of testing strategies. Unit tests are written for individual components, and integration tests verify that different parts of the app work together seamlessly. End-to-end testing simulates real user interactions, ensuring that the entire ride-hailing process runs as intended. These tests, coupled with performance and load tests, help catch and correct any issues before the app reaches the user, ensuring that quality and stability are maintained throughout its lifecycle.

#### Conclusion and Overall Frontend Summary
This document outlines the essential aspects of the frontend design for the ride-hailing app "運將大哥." The system is built on a modern stack that leverages Vite js, Tailwind CSS, Typescript, Shadcn UI, and React Native, ensuring cross-platform support and a visually appealing interface. By following best practices in design, clear component structure, efficient state management, and rigorous performance optimization, the frontend is well-equipped to deliver a reliable and engaging user experience. These guidelines, together with robust testing and quality assurance measures, make the frontend a key differentiator in delivering a secure, responsive, and easy-to-navigate ride-hailing service.

## 系統架構圖說

### 系統整體架構

```
+----------------------------------+
|          客戶端層             |
|  +-------------+  +----------+  |
|  | 乘客手機 APP |  | 司機 APP |  |
|  | (React Native) | (React Native) |
|  +-------------+  +----------+  |
+----------------------------------+
              |
              | HTTPS
              v
+----------------------------------+
|           服務層              |
|  +---------------------------+  |
|  |    RESTful API 端點     |  |
|  +---------------------------+  |
|  | - 用戶管理 (/api/v1/users)  |
|  | - 驾馨管理 (/api/v1/drivers) |
|  | - 行程管理 (/api/v1/rides)  |
|  | - 訊息管理 (/api/v1/messages)|
|  +---------------------------+  |
+----------------------------------+
              |
              | 內部接口
              v
+----------------------------------+
|          核心服務層           |
|  +------------+  +------------+  |
|  | 用戶服務 |  | 驾馨服務 |  |
|  +------------+  +------------+  |
|  +------------+  +------------+  |
|  | 行程服務 |  | 支付服務 |  |
|  +------------+  +------------+  |
|  +------------+  +------------+  |
|  | 地理位置服務 |  | 即時訊息服務 |  |
|  +------------+  +------------+  |
+----------------------------------+
              |
              | SQL/即時訂閱
              v
+----------------------------------+
|          數據存儲層           |
|  +---------------------------+  |
|  |    Supabase (後端服務)    |  |
|  |  +---------------------+  |  |
|  |  |   PostgreSQL DB   |  |  |
|  |  | (包含 PostGIS 擴展) |  |  |
|  |  +---------------------+  |  |
|  +---------------------------+  |
+----------------------------------+
              |
              | API 調用
              v
+----------------------------------+
|         外部整合層           |
|  +------------+  +------------+  |
|  | Google Maps |  | Line Pay   |  |
|  | API        |  | StreetPay  |  |
|  +------------+  | 信用卡支付  |  |
|                  +------------+  |
+----------------------------------+
```

### 即時通訊流程

```
+-------------+        +------------+     +--------------+
| 乘客手機 APP |        | Supabase   |     | 司機手機 APP  |
+-------------+        | 即時訂閱服務 |     +--------------+
      |                +------------+            |
      |                      |                  |
      | 1. 建立即時訂閱        |                  |
      |--------------------->|                  |
      |                      |                  |
      |                      | 2. 監聽乘客訂閱    |
      |                      |----------------->|
      |                      |                  |
      | 3. 發送叫車要求        |                  |
      |--------------------->|                  |
      |                      |                  |
      |                      | 4. 推送叫車通知    |
      |                      |----------------->|
      |                      |                  |
      |                      | 5. 接受/拒絕行程   |
      |                      |<-----------------|
      |                      |                  |
      | 6. 接收司機回應        |                  |
      |<---------------------|                  |
      |                      |                  |
      |                      | 7. 即時位置更新    |
      |                      |<-----------------|
      |                      |                  |
      | 8. 接收位置更新        |                  |
      |<---------------------|                  |
      |                      |                  |
```

### 數據模型關係

```
+-------------+     +------------+     +--------------+
|   用戶 (Users) |-----| 行程 (Rides) |-----| 驾馨 (Drivers) |
+-------------+     +------------+     +--------------+
      |                   |                  |
      |                   |                  |
      v                   v                  v
+-------------+     +------------+     +--------------+
| 用戶認證令牌  |     | 位置追蹤記錄 |     | 驾馨認證資料   |
| (AuthTokens) |     | (Locations) |     | (DriverVerifications) |
+-------------+     +------------+     +--------------+
                          |                  
                          |                  
                          v                  
                    +------------+           
                    | 交易付款記錄 |           
                    | (Payments)  |           
                    +------------+           
                          |                  
                          |                  
                          v                  
                    +------------+           
                    |  訊息紀錄   |           
                    | (Messages)  |           
                    +------------+           
```

## 功能模組分解表

| 模組名稱 | 功能描述 | 相關 API 端點 | 優先等級 | 相關文檔 |
|------------|------------|-----------------|----------|------------|
| 用戶認證模組 | 處理用戶註冊、登錄和認證 | `/api/v1/auth/*` | 高 | [app_flow.md](引導與註冊/登入) |
| 驾馨管理模組 | 管理驾馨資訊、狀態和位置 | `/api/v1/drivers/*` | 高 | [app_flow.md](詳細功能流程) |
| 行程調度模組 | 處理叫車請求和司機匹配 | `/api/v1/rides/*` | 高 | [app_flow.md](詳細功能流程) |
| 地理位置模組 | 整合 Google Maps 與提供路徑規劃 | `/api/v1/geo/*` | 中 | [app_flow.md](主儀表板) |
| 即時通訊模組 | 提供即時訊息、位置更新和狀態通知 | `/api/v1/messages/*`<br>`/api/v1/notifications/*` | 中 | [app_flow.md](詳細功能流程) |
| 支付處理模組 | 整合多種支付方式和處理交易 | `/api/v1/payments/*` | 中 | [app_flow.md](詳細功能流程) |
| 安全強化模組 | 提供驾馨認證、行程共享和緊急聯絡功能 | `/api/v1/security/*` | 中 | [app_flow.md](詳細功能流程) |
| 用戶界面模組 | 服務客戶端 UI 組件和交互邏輯 | 前端元件 | 中 | [app_flow.md](所有章節) |
| 分析報表模組 | 提供使用統計、路線分析和效能指標 | `/api/v1/analytics/*` | 低 | - |

> 異化的專案需求規格、功能範圈和限制請參考 [project_requirements.md](./project_requirements.md) 文檔。
> 詳細的應用程式用戶旅程與畫面流程請參考 [app_flow.md](./app_flow.md) 文檔。
> 後端架構、技術堆疊與安全措施請參考 [backend_structure.md](./backend_structure.md) 文檔。
> 前端框架、設計原則與性能優化請參考 [frontend_guideline.md](./frontend_guideline.md) 文檔。
> 完整的技術選擇與整合詳情請參考 [technology_stack.md](./technology_stack.md) 文檔。

## 特殊限制條件

### Implementation Plan

#### Phase 1: Environment Setup

1. **Clone Starter Kit Repository**

   * Clone the React + Supabase starter kit from the provided repo:

     * Command: `git clone https://github.com/codeGuide-dev/codeguide-vite-supabase`

   * **Reference:** starterKit (repo_link) and PRD Section 1

2. **Install Dependencies**

   * Navigate into the repository and run `npm install` to install Vite, Tailwind CSS, Typescript, Supabase, and Shadcn UI.
   * **Reference:** starterKit (tech_stack) and PRD Section 1

3. **Initialize Git Branches**

   * Create and configure two Git branches: `main` and `dev`. Ensure branch protection rules are set in GitHub.
   * **Reference:** PRD Section 1.4

4. **Local Environment Validation**

   * Run the development server with `npm run dev` and verify the starter app loads in the browser.
   * **Validation:** Check that the welcome page renders as expected.

#### Phase 2: Frontend Development

*Note: The mobile app is built with React Native as per the requirements. While the starter kit is for React web, a separate mobile project will be set up using React Native.

1. **Initialize React Native Project**

   * Use Expo CLI or React Native CLI to initialize the mobile project. For example, run: `npx expo init rideApp`
   * **Reference:** PRD Section 1 & 5 (Mobile App Overview)

2. **Create Authentication Screens**

   * Create a Login screen at: `/mobile/screens/LoginScreen.tsx` that includes phone number input and authentication code verification.
   * Create a Registration screen at: `/mobile/screens/RegisterScreen.tsx` for new user sign-up.
   * **Reference:** PRD Section 4.1 (Authentication & User Management)

3. **Develop Home/Dashboard Screen**

   * Create `/mobile/screens/HomeScreen.tsx` to allow users to input their destination. Integrate a Google Maps view (using a React Native Maps package) to display the route planning and live traffic data.
   * **Reference:** App Flow (乘客動作與叫車請求階段) & PRD Section 4.2 (Geolocation & Route Planning)

4. **Integrate Real-Time Subscription for Driver Updates**

   * In `/mobile/services/realtime.ts`, implement Supabase subscription code (using the provided snippet as a guide) to listen for driver location updates and ride status changes:

     * Example: // In realtime.ts const driverLocationSubscription = supabase .from('driver_locations') .on('UPDATE', payload => { if (payload.new.driver_id === currentRide.driver_id) { updateDriverMarker(payload.new.current_location); calculateETA(payload.new.current_location, pickupLocation); } }) .subscribe();

   * **Reference:** PRD Section 4.4 (Real-Time Communication) and provided code snippet

5. **UI & Component Styling**

   * Use Tailwind CSS (or a compatible styling library for React Native) and Shadcn UI principles to style your components in `/mobile/screens/`.
   * **Reference:** starterKit (Tailwind CSS & Shadcn UI) & PRD Section 2 (Usability & Accessibility)

6. **Frontend Validation**

   * Run the mobile emulator (or Expo) to verify that UI components render correctly and that network requests (authentication, destination input) are reaching the backend.
   * **Validation:** Check logs and visual confirmation on device/emulator.

#### Phase 3: Backend Development

*The backend relies on Supabase powered by PostgreSQL and PostGIS. All RESTful API endpoints should be implemented via Supabase's functions, database tables, and triggers.

1. **Set Up User Authentication Endpoints**

   * In the Supabase SQL editor or using Supabase Edge Functions, create a function for user registration supporting endpoint: `POST /api/v1/auth/register`.
   * File/SQL script example: Create `/supabase/functions/auth_register.sql`.
   * **Reference:** PRD Section 4.1 (Authentication & User Management)

2. **Implement Login API Endpoint**

   * Create a function to handle `POST /api/v1/auth/login` for user sign-in.
   * File: `/supabase/functions/auth_login.sql` or equivalent serverless function.
   * **Reference:** PRD Section 4.1

3. **Develop User Data Endpoints**

   * Create endpoints `GET /api/v1/users/me` and `PATCH /api/v1/users/me` to retrieve and update user data.
   * **Reference:** PRD Section 4.1

4. **Create Driver Management APIs**

   * Set up a table (if not already present) for drivers with fields for current_location and status.

   * Implement:

     * `POST /api/v1/drivers/location` (to update driver location)
     * `PATCH /api/v1/drivers/status` (to update driver status, e.g., idle or busy)
     * `GET /api/v1/drivers/stats` (to fetch driver statistics)

   * **Reference:** PRD Section 4.2 (Driver Management)

5. **Build Ride Management Endpoints**

   * Create a `rides` table and implement endpoints:

     * `POST /api/v1/rides` (乘客創建行程請求)
     * `GET /api/v1/rides/active`
     * `GET /api/v1/rides/:id`
     * `PATCH /api/v1/rides/:id/status`
     * `GET /api/v1/rides/history`

   * **Reference:** PRD Section 4.3 (Ride Request & Matching)

6. **Establish Matching & Messaging Services**

   * For matching services, set up endpoints:

     * `GET /api/v1/matches/drivers`
     * `POST /api/v1/matches/accept`
     * `POST /api/v1/matches/reject`

   * For messaging, implement:

     * `POST /api/v1/messages`
     * `GET /api/v1/messages/:rideId`
     * `PATCH /api/v1/messages/:id/read`

   * **Reference:** PRD Section 4.4 (Messaging & Real-Time Communication)

7. **Integrate Geolocation & Route Planning Data**

   * Enable PostGIS in your Supabase PostgreSQL instance to support geospatial queries.
   * Verify that the location data can support dynamic queries for nearby drivers (this will be used by the matching service).
   * **Reference:** Core Features (Geolocation Enhancement and Route Planning)

8. **Backend Validation**

   * Use Postman or curl to test each endpoint. For example, test the login with:

     * `curl -X POST http://<your-supabase-project-url>/api/v1/auth/login -d '{"phone":"12345678", "auth_code":"XXXX"}'`

   * Confirm that each endpoint returns a 200 response and the correct data.

#### Phase 4: Integration

1. **Connect Frontend Authentication to Backend**

   * In `/mobile/services/auth.ts`, implement API calls to the backend endpoints (`POST /api/v1/auth/register` and `POST /api/v1/auth/login`) using fetch or axios.
   * **Reference:** PRD Section 4.1 (Authentication & User Management)

2. **Integrate Google Maps API in the Mobile App**

   * In `/mobile/screens/HomeScreen.tsx`, embed a Google Maps component; configure it using your Google Maps API key, and implement route planning using the Directions API.
   * **Reference:** PRD Section 4.2 (Geolocation & Route Planning) and Q&A (使用 google maps)

3. **Enable Supabase Real-Time Subscriptions in the App**

   * From `/mobile/services/realtime.ts`, ensure the subscription for driver location updates and ride status changes is wired to update UI components in real time.
   * **Reference:** PRD Section 4.4 and provided sample subscription code

4. **Frontend-Backend End-to-End Testing**

   * Simulate a ride request from the mobile app and observe if the driver location updates (via subscription) and ride status changes are properly reflected.
   * **Validation:** Check mobile logs and UI feedback when a driver accepts or updates the ride status.

#### Phase 5: Deployment

1. **Deploy Supabase Backend**

   * Ensure all tables, functions, and triggers are fully configured in your Supabase project.
   * Verify production settings (including PostGIS extension) via the Supabase dashboard.
   * **Reference:** PRD Section 7 (Constraints & Assumptions) & Tech Stack (Supabase)

2. **Prepare Mobile App for Production**

   * Build the React Native app (using Expo or React Native CLI) and configure environment variables to point to the production Supabase backend and Google Maps API.
   * **Reference:** PRD Section 6 (Deployment Strategies)

3. **Deploy Mobile App to App Stores**

   * Follow platform-specific guidelines to deploy the app to TestFlight (iOS) and/or Google Play (Android).
   * **Reference:** PRD Section 6 (Deployment)

4. **Deployment Validation**

   * Run end-to-end tests (using tools like Cypress for web endpoints and device testing for mobile) to ensure all features work seamlessly in production.
   * **Validation:** Confirm that live ride requests, real-time updates, and payment integrations function on production.

#### Phase 6: Post-Launch

1. **Monitor and Log in Supabase**

   * Set up monitoring dashboards in Supabase for API performance and error tracking.
   * **Reference:** PRD Section 7 (Non-Functional Requirements: Reliability & Security)

2. **Schedule Daily Database Backups**

   * Configure Supabase's backup tools or set up cron jobs (if self-hosted) to back up PostgreSQL data, ensuring safety of ride and user data.
   * **Reference:** PRD Section 7 (Databases & Security)

3. **Implement Load and Stress Testing**

   * Use tools (e.g., Postman for API load tests, and simulators for mobile network stress tests) to simulate peak loads and poor network conditions.
   * **Reference:** Testing Strategy (負載測試, 地理位置模擬測試, 移動網絡條件測試)

4. **Post-Launch Validation**

   * Simulate high concurrent ride requests and verify that API response times remain within acceptable limits. Confirm that real-time subscriptions maintain low latency.
   * **Validation:** Run Locust or similar load testing tools and document performance metrics.

This plan covers environment setup, frontend and backend development, integration, deployment, and post-launch activities with explicit instructions and file path references based on the supplied project documents. Follow these steps carefully to ensure a robust and secure implementation of the ride-hailing app framework "運將大哥."
