"""
GeoShield AI Risk Prediction Engine
Uses Random Forest + Gradient Boosting ensemble for landslide risk assessment.
Features: rainfall, soil moisture, slope, terrain, historical data.
"""
import numpy as np
import joblib
import os
import json
from datetime import datetime, timedelta


class LandslideRiskPredictor:
    """
    Ensemble ML model for landslide risk prediction.
    Combines Random Forest and Gradient Boosting for robust predictions.
    """

    def __init__(self):
        self.model_dir = os.path.join(os.path.dirname(__file__), "models")
        os.makedirs(self.model_dir, exist_ok=True)
        self.model = None
        self.scaler = None
        self.feature_names = [
            "rainfall_mm", "soil_moisture", "soil_temperature",
            "ground_displacement", "tilt_angle_x", "tilt_angle_y",
            "pore_water_pressure", "vibration_level",
            "slope_angle", "elevation", "vegetation_cover",
            "rainfall_24h", "rainfall_7d",
            "days_since_last_rain", "cumulative_rainfall_3d"
        ]
        self.risk_thresholds = {
            "low": 25,
            "moderate": 50,
            "high": 75,
            "critical": 90
        }
        self._build_model()

    def _build_model(self):
        """Build and train the ML model with synthetic but realistic data."""
        from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
        from sklearn.preprocessing import StandardScaler
        from sklearn.model_selection import train_test_split

        np.random.seed(42)
        n_samples = 5000

        # Generate realistic synthetic training data
        X = np.zeros((n_samples, len(self.feature_names)))

        # Rainfall (0-200mm)
        X[:, 0] = np.random.exponential(30, n_samples).clip(0, 200)
        # Soil moisture (0-100%)
        X[:, 1] = np.clip(30 + X[:, 0] * 0.3 + np.random.normal(0, 10, n_samples), 0, 100)
        # Soil temperature (15-40°C)
        X[:, 2] = np.random.uniform(15, 40, n_samples)
        # Ground displacement (0-50mm)
        X[:, 3] = np.abs(np.random.normal(2, 5, n_samples)).clip(0, 50)
        # Tilt angles (-5 to 5 degrees)
        X[:, 4] = np.random.normal(0, 1.5, n_samples).clip(-5, 5)
        X[:, 5] = np.random.normal(0, 1.5, n_samples).clip(-5, 5)
        # Pore water pressure (0-100 kPa)
        X[:, 6] = np.clip(X[:, 0] * 0.4 + np.random.normal(0, 10, n_samples), 0, 100)
        # Vibration level (0-100)
        X[:, 7] = np.abs(np.random.normal(5, 10, n_samples)).clip(0, 100)
        # Slope angle (5-60 degrees)
        X[:, 8] = np.random.uniform(5, 60, n_samples)
        # Elevation (100-3000m)
        X[:, 9] = np.random.uniform(100, 3000, n_samples)
        # Vegetation cover (0-100%)
        X[:, 10] = np.random.uniform(10, 95, n_samples)
        # 24h cumulative rainfall
        X[:, 11] = X[:, 0] * 1.5 + np.random.normal(0, 5, n_samples)
        # 7d cumulative rainfall
        X[:, 12] = X[:, 11] * 4 + np.random.normal(0, 20, n_samples)
        # Days since last rain
        X[:, 13] = np.random.exponential(3, n_samples).clip(0, 30)
        # 3d cumulative
        X[:, 14] = X[:, 11] * 2.5 + np.random.normal(0, 10, n_samples)

        # Generate labels based on a realistic scoring formula
        risk_score = (
            X[:, 0] * 0.15 +           # rainfall impact
            X[:, 1] * 0.12 +           # soil moisture
            X[:, 3] * 0.18 +           # ground displacement (strong signal)
            (np.abs(X[:, 4]) + np.abs(X[:, 5])) * 3 +  # tilt
            X[:, 6] * 0.10 +           # pore pressure
            X[:, 8] * 0.20 +           # slope angle (strong signal)
            (100 - X[:, 10]) * 0.08 +  # low vegetation = higher risk
            np.clip(X[:, 12], 0, 500) * 0.05 +  # cumulative rain
            np.random.normal(0, 5, n_samples)    # noise
        )

        # Normalize to 0-100
        risk_score = np.clip((risk_score - risk_score.min()) / (risk_score.max() - risk_score.min()) * 100, 0, 100)

        # Assign classes: 0=low, 1=moderate, 2=high, 3=critical
        y = np.zeros(n_samples, dtype=int)
        y[risk_score >= 25] = 1
        y[risk_score >= 50] = 2
        y[risk_score >= 75] = 3

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # Ensemble model
        rf = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, class_weight='balanced')
        gb = GradientBoostingClassifier(n_estimators=150, max_depth=8, learning_rate=0.1, random_state=42)

        self.model = VotingClassifier(
            estimators=[('rf', rf), ('gb', gb)],
            voting='soft',
            weights=[0.4, 0.6]
        )
        self.model.fit(X_train_scaled, y_train)

        # Evaluate
        train_acc = self.model.score(X_train_scaled, y_train)
        test_acc = self.model.score(X_test_scaled, y_test)

        print(f"[GeoShield AI] Model trained - Train Accuracy: {train_acc:.3f}, Test Accuracy: {test_acc:.3f}")
        return test_acc

    def predict_risk(self, sensor_data: dict, station_data: dict) -> dict:
        """
        Predict landslide risk for a given sensor station.
        Returns risk score, level, probability, and recommendations.
        """
        features = np.array([[
            sensor_data.get("rainfall_mm", 0),
            sensor_data.get("soil_moisture", 30),
            sensor_data.get("soil_temperature", 25),
            sensor_data.get("ground_displacement", 0),
            sensor_data.get("tilt_angle_x", 0),
            sensor_data.get("tilt_angle_y", 0),
            sensor_data.get("pore_water_pressure", 20),
            sensor_data.get("vibration_level", 5),
            station_data.get("slope_angle", 20),
            station_data.get("elevation", 500),
            station_data.get("vegetation_cover", 60),
            sensor_data.get("rainfall_24h", sensor_data.get("rainfall_mm", 0) * 1.5),
            sensor_data.get("rainfall_7d", sensor_data.get("rainfall_mm", 0) * 5),
            sensor_data.get("days_since_last_rain", 1),
            sensor_data.get("cumulative_rainfall_3d", sensor_data.get("rainfall_mm", 0) * 3),
        ]])

        features_scaled = self.scaler.transform(features)

        # Get prediction probabilities
        probabilities = self.model.predict_proba(features_scaled)[0]
        predicted_class = int(np.argmax(probabilities))

        risk_score = float(np.clip(probabilities[1] * 33 + probabilities[2] * 66 + probabilities[3] * 100, 0, 100))
        landslide_probability = float(probabilities[2] + probabilities[3])

        levels = ["low", "moderate", "high", "critical"]
        risk_level = levels[predicted_class]

        # Determine contributing factors
        factors = []
        if sensor_data.get("rainfall_mm", 0) > 50:
            factors.append("Heavy rainfall detected")
        if sensor_data.get("soil_moisture", 0) > 70:
            factors.append("High soil moisture saturation")
        if sensor_data.get("ground_displacement", 0) > 5:
            factors.append("Ground displacement detected")
        tilt = abs(sensor_data.get("tilt_angle_x", 0)) + abs(sensor_data.get("tilt_angle_y", 0))
        if tilt > 2:
            factors.append("Abnormal tilt angle detected")
        if sensor_data.get("pore_water_pressure", 0) > 60:
            factors.append("Elevated pore water pressure")
        if station_data.get("slope_angle", 0) > 35:
            factors.append("Steep slope angle")
        if station_data.get("vegetation_cover", 100) < 30:
            factors.append("Low vegetation cover")

        # Time window prediction
        if risk_level == "critical":
            time_window = max(1, int(24 - landslide_probability * 24))
        elif risk_level == "high":
            time_window = max(2, int(48 - landslide_probability * 36))
        elif risk_level == "moderate":
            time_window = max(6, int(72 - landslide_probability * 48))
        else:
            time_window = 168

        # Generate recommendation
        recommendation = self._get_recommendation(risk_level, factors)

        return {
            "risk_score": round(risk_score, 1),
            "risk_level": risk_level,
            "landslide_probability": round(landslide_probability, 3),
            "contributing_factors": factors,
            "predicted_time_window_hours": time_window,
            "recommendation": recommendation,
            "probabilities": {
                "low": round(float(probabilities[0]), 3),
                "moderate": round(float(probabilities[1]), 3),
                "high": round(float(probabilities[2]), 3),
                "critical": round(float(probabilities[3]), 3),
            }
        }

    def _get_recommendation(self, risk_level: str, factors: list) -> str:
        recommendations = {
            "critical": "IMMEDIATE EVACUATION recommended. Deploy emergency response teams. Activate sirens and SMS alerts for all nearby villages. Close affected roads. Expected event within hours.",
            "high": "Heightened alert status. Pre-position rescue teams. Begin voluntary evacuation of vulnerable populations. Monitor sensor readings every 15 minutes. Close at-risk road sections.",
            "moderate": "Enhanced monitoring. Notify district disaster management authority. Prepare evacuation plans. Check emergency supplies. Monitor rainfall forecasts closely.",
            "low": "Normal operations. Continue routine monitoring. Maintain standard alert readiness. No immediate action required."
        }
        return recommendations.get(risk_level, "Continue monitoring.")


# Singleton instance
_predictor = None


def get_predictor() -> LandslideRiskPredictor:
    global _predictor
    if _predictor is None:
        _predictor = LandslideRiskPredictor()
    return _predictor
