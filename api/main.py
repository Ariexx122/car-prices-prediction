from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from catboost import CatBoostRegressor
from pydantic import BaseModel
import pandas as pd


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
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


model = CatBoostRegressor()
model.load_model('cat_model.cbm')


@app.post('/predict/')
def predict(reviewInput: ReviewInput):
    input = reviewInput.model_dump()
    data = pd.DataFrame([input])

    prediction = model.predict(data)

    return {'prediction': f"{prediction[0]:.2f}"}
