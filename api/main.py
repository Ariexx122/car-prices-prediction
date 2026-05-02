from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from catboost import CatBoostRegressor
from pydantic import BaseModel

ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        model = CatBoostRegressor()
        model.load_model('cat_model.cbm')
        ml_models["car_price"] = model
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
    yield
    ml_models.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://car-prices-prediction.vercel.app/'],
    allow_headers=['*'],
    allow_methods=['*'],
    allow_credentials=True
)


class ReviewInput(BaseModel):
    vehicle_type: str
    gearbox: str
    power: int
    model: str
    mileage: int
    registration_month: int
    fuel_type: str
    brand: str
    not_repaired: str
    age_at_listing: int
    month_created: int


@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": "car_price" in ml_models}


@app.post("/predict/")
def predict(reviewInput: ReviewInput):
    if "car_price" not in ml_models:
        raise HTTPException(status_code=500, detail="Model is not initialized")

    input_data = [
        reviewInput.vehicle_type,
        reviewInput.gearbox,
        reviewInput.power,
        reviewInput.model,
        reviewInput.mileage,
        reviewInput.registration_month,
        reviewInput.fuel_type,
        reviewInput.brand,
        reviewInput.not_repaired,
        reviewInput.age_at_listing,
        reviewInput.month_created
    ]

    prediction = ml_models["car_price"].predict([input_data])

    return {'prediction': f"{prediction[0]:.2f}"}
