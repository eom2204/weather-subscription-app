# Weather Subscription API

A Node.js Express API that allows users to subscribe to weather updates for a specific city, receiving hourly or daily emails based on their chosen frequency. The application uses MongoDB for subscription storage, WeatherAPI.com for weather data, and MailHog for email testing. It includes a separate scheduler service for sending weather updates and is fully Dockerized for easy deployment.

---

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/eom2204/weather-subscription-app.git
cd weather-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following:

```env
API_URL='http://localhost:3000'
PORT=3000
MONGO_URI=mongodb://localhost:27017/weather
WEATHER_API_KEY=26724267e3834a9ab09175439251805

SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@weatherapi.app
```


### 4. Run with Docker

1. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

2. **Access services**:
    - API: `http://localhost:3000`
    - Swagger UI: `http://localhost:3000/api-docs`
    - MailHog UI: `http://localhost:8025`
    - MongoDB: `mongodb://localhost:27017/weather`

3. **Stop services**:
   ```bash
   docker-compose down
   ```


## 🧪 What to Test:

### ✅ Subscribe to Weather Updates
- Open [http://localhost:3000](http://localhost:3000) - html-page for subscription
- Input valid:
    - `email`
    - `city`
    - `frequency` (`hourly` or `daily`)
- Press a button 'Subscribe Now'
- You get a message: 'Subscription successful. Confirmation email sent.' 
- If such e-mail is already in DB, you get a message: 'Email already subscribed'

### ✅ Confirm Subscription
- Open MailHog: [http://localhost:8025](http://localhost:8025)
- Locate the confirmation email
- Click to confirm or copy the link: `/api/confirm/:token`

### ✅ Receive Weather Emails
- Wait for the scheduled cron job (or test with minute-based cron)
- Check MailHog for received weather update email for the subscriber's city
- Email includes:
    -  Temperature
    -  Humidity
    -  Conditions
    -  A working **unsubscribe** link

### ✅ Unsubscribe
- Click the unsubscribe link from the email
- The subscription will be deleted from MongoDB



## 🧩 Features

- **Subscription Management**:
  - Subscribe via POST `/api/subscribe` with email, city, and frequency (`hourly` or `daily`).
  - Confirm subscriptions via GET `/api/confirm/:token`.
  - Unsubscribe via GET `/api/unsubscribe/:token`.
- **Weather Updates**:
  - Fetches current weather data (temperature, humidity, conditions) for subscribed cities using WeatherAPI.com.
  - Sends weather update emails to confirmed subscribers based on their frequency:
    - Hourly: Every hour, on the hour.
    - Daily: Every day at 8 AM.
- **API Documentation**:
  - Swagger UI available at `/api-docs` for endpoint details.
- **Separated Services**:
  - `app`: Handles HTTP API requests.
  - `scheduler`: Runs cron jobs to send weather update emails.
- **Database**:
  - MongoDB stores subscriptions with fields: `email`, `city`, `frequency`, `token`, `confirmed`.
  - Initial migration sets up the `subscriptions` collection with a test entry.
- **Email Testing**:
  - Uses MailHog for local email testing (view emails at `http://localhost:8025`).
- **Dockerized Setup**:
  - Includes services: 
    - `app`, 
    - `scheduler`, 
    - `mongo`, 
    - `mailhog`
  - Local files sync with containers via volume mapping.

## 🗂️ Project Structure

```
weather-subscription-api/
├── src/
│   ├── controllers/         # Route handlers
│   │   ├── subscriptionController.ts
│   │   └── weatherController.ts
│   ├── models/             # Mongoose schemas
│   │   └── Subscription.ts
│   ├── routes/            # Express routes
│   │   ├── index.ts
│   │   ├── subscription.ts
│   │   └── weather.ts
│   ├── services/          # Business logic
│   │   ├── emailService.ts
│   │   └── weatherEmailService.ts
│   ├── utils/             # Utilities
│   │   ├── migrate.ts
│   │   └── scheduler.ts
│   ├── index.ts           # Main API entry point
│   └── scheduler.ts       # Scheduler entry point
├── swagger/
│   └── swagger.json       # Swagger API spec
├── .dockerignore          # Docker ignore rules
├── Dockerfile             # Docker build instructions
├── docker-compose.yml     # Docker Compose configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## 🔗 API Endpoints

See `swagger/swagger.json` or `http://localhost:3000/api-docs` for full details. Key endpoints:

- **GET /api/weather?city=<city>**: Get current weather for a city.
- **POST /api/subscribe**: Subscribe to weather updates (requires `email`, `city`, `frequency`).
- **GET /api/confirm/:token**: Confirm a subscription.
- **GET /api/unsubscribe/:token**: Unsubscribe from updates.

## 🕒 Scheduler

The `scheduler` service (`src/scheduler.ts`) runs cron jobs to send weather updates:
- **Hourly**: Every hour (`0 * * * *`) for `frequency: hourly` subscribers.
- **Daily**: At 8 AM (`0 8 * * *`) for `frequency: daily` subscribers.

Updates are sent only to `confirmed: true` subscribers, using WeatherAPI.com data and MailHog for emails.

## 🧱 Development Notes

- **File Syncing**: Local changes to `src/` files sync to Docker containers via the `.:/app` volume. Rebuild (`npm run build`) or restart services for TypeScript changes.
- **TypeScript**: Uses `strict` mode with `noImplicitAny` for type safety.
- **Dependencies**: Managed in `package.json`. Key libraries:
  - `express`: API framework
  - `mongoose`: MongoDB ORM
  - `node-cron`: Scheduler
  - `nodemailer`: Email sending
  - `axios`: WeatherAPI.com requests
  - `swagger-ui-express`: API documentation
- **Performance**: The scheduler processes subscribers sequentially. For large subscriber counts, consider batching or a job queue (e.g., Bull).

## 🧯 Troubleshooting

- **Build Errors**:
  - Run `npm run build` locally to check TypeScript errors.
  - Verify `@types/*` packages in `package.json` (e.g., `@types/node-cron`).
- **No Emails**:
  - Check MailHog UI (`http://localhost:8025`).
  - Ensure `WEATHER_API_KEY` and `EMAIL_FROM` are set.
  - Verify scheduler logs (`docker-compose logs scheduler`) for errors.
- **MongoDB Issues**:
  - Check logs: `docker-compose logs mongo`
  - Verify `MONGO_URI` and database connectivity.
- **File Sync Issues**:
  - Confirm `.dockerignore` excludes `node_modules` and `dist`.
  - Restart services: `docker-compose restart app scheduler`
