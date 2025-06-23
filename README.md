# 🌤️ Weather App

A responsive and interactive Weather App built using **TypeScript**, **JavaScript**, and **CSS**, integrated with the [WeatherAPI](https://www.weatherapi.com/) to fetch real-time weather data. This app allows users to get weather updates based on their current location or by searching for any city worldwide.

## 🚀 Features

- 🌍 **Location-Based Weather:** Automatically detects your current location (with permission) and displays the weather.
- 🔍 **Search by City:** Manually search for weather in any city using the search input.
- ❤️ **Favorites:** Save your favorite cities for quick access.
- 🕓 **Recent Searches:** Automatically stores and displays your recent weather searches.
- 📱 **Responsive Design:** Works smoothly on desktops, tablets, and mobile devices.

## 🛠️ Technologies Used

- **TypeScript** – Type-safe development
- **JavaScript (ES6+)** – Core logic
- **CSS** – Styling and layout
- **WeatherAPI** – Weather data source

## 🔑 API Integration

This app uses [WeatherAPI](https://www.weatherapi.com/) for weather data. You need to sign up and obtain a free API key.

### 📌 Get Your API Key

1. Go to [https://www.weatherapi.com/](https://www.weatherapi.com/)
2. Create a free account.
3. Copy your API key from the dashboard.

### 🔧 Setup Your API Key

Replace the placeholder `YOUR_API_KEY_HERE` in the code with your actual key:

```ts
const API_KEY = "YOUR_API_KEY_HERE";
```

> ⚠️ Never expose your API key in public repositories without proper environment variable setup or server-side proxying.

```

## ✅ How It Works

1. When the app is opened, it prompts the user for location access.
2. If access is granted, the app fetches the current weather of the user’s location using latitude and longitude.
3. Users can also search for any city using the search bar.
4. Each search is stored in **recent searches** (up to a certain limit).
5. Users can "favorite" cities for easy future access.

## 📸 Screenshots

> _(Include your screenshots here, if available)_  
> ![App Screenshot](assets/screenshots/weather-app.png)

## 📦 Installation & Usage

### Clone the Repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### Open in Browser

If you’re using `index.html`, simply open it in your browser.

### TypeScript Build (Optional)

If you're working with TypeScript:

```bash
tsc main.ts
```

## 📌 Best Practices

- Use environment variables or `.env` files with bundlers like Webpack/Vite for API key safety in production.
- Validate city inputs to avoid unnecessary API calls.
- Clear recent searches and favorites when needed.

## 🙌 Author

**Tolera Fayisa**  
🔗 [LinkedIn](https://www.linkedin.com/in/tolera-fayisa-590387344/)  
📧 [tolefayiss@gmail.com](mailto:tolefayiss@gmail.com)

---

> Feel free to fork, contribute, or suggest features. Happy coding! 💻🌦️
