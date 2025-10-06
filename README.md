# Asteroid DB - NASA Space Apps Challenge 2023

This project was created for the [NASA Space Apps Challenge 2023](https://www.spaceappschallenge.org/), specifically for the "Meteor Madness" challenge.

**Live Demo:** [https://asteroid-db-2nk6.vercel.app/](https://asteroid-db-2nk6.vercel.app/)

## Project Description

This project is a data processing pipeline that takes a catalog of near-Earth asteroids from NASA's JPL (Jet Propulsion Laboratory), processes the data, and generates a clean JSON file that can be used to feed a web-based visualization dashboard. The pipeline also generates a 2D plot to visualize the orbital distribution of the asteroids.

The main components of the project are:

*   **Data Loading:** Loads the asteroid catalog from a local CSV file (`jpl_catalog.csv`).
*   **Data Processing:** Cleans and prepares the data, converting columns to numeric types and handling missing values.
*   **Data Filtering:** Selects the 5,000 most "interesting" asteroids based on whether they have a name, are potentially hazardous, their diameter, and their minimum orbit intersection distance (MOID).
*   **JSON Export:** Exports the processed data to a JSON file (`catalogo_asteroides_web.json`) for the web application.
*   **Visualization:** Generates a 2D scatter plot (`orbital_distribution.png`) showing the relationship between the semi-major axis and the orbital inclination of the asteroids.

## How to Run the Data Pipeline

1.  **Prerequisites:**
    *   Python 3
    *   `pandas` and `matplotlib` libraries. You can install them using pip:
        ```bash
        pip install pandas matplotlib
        ```

2.  **Download the data:**
    *   Make sure you have the `jpl_catalog.csv` file in the root directory of the project. This file contains the raw data from the JPL Small-Body Database.

3.  **Run the main script:**
    *   Execute the `main.py` script to start the data processing pipeline:
        ```bash
        python3 main.py
        ```

    *   This will generate two files:
        *   `catalogo_asteroides_web.json`: The JSON file for the web application.
        *   `orbital_distribution.png`: The visualization of the asteroid orbital distribution.

## Project Structure

```
.
├── asteroid-dashboard-react/ # (Optional) React frontend for the web app
├── modules/
│   ├── analyzer.py           # Data cleaning and preparation
│   ├── data_loader.py        # Loads data from the CSV file
│   └── visualizer.py         # Generates the 2D plot
├── main.py                   # Main script to run the pipeline
├── jpl_catalog.csv           # Raw data file (not included in this repo)
└── README.md                 # This file
```