# 🚗 Car Price Prediction API

A full-stack machine learning project that predicts used car prices based on user-provided features such as brand, model, mileage, fuel type, and vehicle condition.

👉 **Live Demo:** https://car-prices-prediction.vercel.app/

---

## 📌 Why This Project Matters

Pricing a used car is not trivial. The value depends on multiple interacting factors:

- Vehicle age (depreciation)
- Mileage (usage intensity)
- Brand & model (market perception)
- Fuel type and gearbox
- Condition (damage history)

In real-world platforms (marketplaces, dealerships, insurance tools), automated valuation systems are used to:

- Assist buyers in fair pricing decisions  
- Help sellers avoid underpricing  
- Support dealerships and financial institutions  

This project replicates a **real-world ML system** for price estimation, combining data preprocessing, feature engineering, and model deployment.

---

## 🧠 Machine Learning Overview

### 🔹 Dataset
- Real-world used car listings
- Cleaned and preprocessed to remove noise and inconsistencies

### 🔹 Key Feature Engineering
- Created **vehicle age** from registration year
- Extracted **month_created** for seasonality
- Handled missing values using `"unknown"`
- Reduced high-cardinality features (e.g. model grouping)
- Removed unrealistic values (e.g. extreme power, invalid years)

---

## 📊 Model Performance

| Model              | RMSE (€) | R² Score |
|-------------------|---------|----------|
| Dummy (Baseline)  | ~4811   | -0.13    |
| Linear Regression | ~2659   | 0.65     |
| Random Forest     | **1517** | **0.89** |
| CatBoost          | ~1568   | 0.88     |
| LightGBM          | ~1602   | 0.88     |

### ✅ Final Choice: **CatBoost Regressor**

**Why CatBoost?**
- Handles categorical features natively
- Requires less preprocessing
- Comparable performance to Random Forest
- More production-friendly pipeline

---

## 🏗️ Tech Stack

### Backend
- FastAPI
- CatBoost
- Pydantic

### Frontend
- Vanilla JavaScript
- HTML/CSS (custom UI)

### Deployment
- Docker
- Azure Web App (Container)
- Vercel (Frontend)

---

## 🐳 Docker Setup

### Build image
```bash
docker build -t yourusername/car-price-prediction .
```

### Run locally
```bash
docker run -p 8000:8000 yourusername/car-price-prediction
```

---

## ☁️ Deployment (Azure)

1. Push image to Docker Hub:
```bash
docker tag car-price-prediction yourusername/car-price-prediction:latest
docker push yourusername/car-price-prediction:latest
```

2. Create Azure Web App:
- Select **Docker Container**
- Use image: `yourusername/car-price-prediction:latest`
- Port: `8000`

3. Set environment variable:
```
WEBSITES_PORT=8000
```

---

## 🔌 API Usage

### Endpoint
```
POST /predict/
```

### Example Request
```json
{
  "vehicle_type": "small",
  "gearbox": "manual",
  "power": 75,
  "model": "polo",
  "mileage": 120000,
  "registration_month": 5,
  "fuel_type": "gasoline",
  "brand": "volkswagen",
  "not_repaired": "no",
  "age_at_listing": 10,
  "month_created": 6
}
```

### Example Response
```json
{
  "prediction": "5234.12"
}
```

---

## ⚠️ Challenges & Solutions

### 🔸 High Cardinality (Model, Brand)
- Solved using **Target Encoding**
- Grouped rare categories into `"other"`

### 🔸 Noisy Data
- Removed unrealistic values (e.g. power > 600 HP)
- Filtered invalid registration years

### 🔸 Missing Values
- Replaced with `"unknown"` to preserve information

### 🔸 Deployment Issues
- CORS handling with FastAPI middleware
- Azure port configuration (`WEBSITES_PORT`)
- Ensured API availability via `/health` endpoint

---

## 🚀 Future Improvements

- Add model retraining pipeline
- Improve UI with dynamic model filtering by brand
- Add prediction explanation (feature importance)
- Reduce model size for faster cold starts
- Implement caching for repeated queries

---

## 📂 Project Structure

```
├── api/
│   ├── main.py
│   ├── cat_model.cbm
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── notebooks/
│   └── model_training.ipynb
└── README.md
```

---

## 🧪 Health Check

```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

---

## 💡 Key Takeaways

- Real-world ML is **more about data than models**
- Feature engineering had the biggest impact on performance
- Tree-based models outperform linear models for complex relationships
- Deployment introduces challenges beyond modeling (CORS, ports, containers)

---

## 👨‍💻 Author

Built as part of a data science portfolio project focused on:
- End-to-end ML systems
- Real-world deployment
- Practical business applications
