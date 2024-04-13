import Storage from "./Storage.js";

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.querySelector("#limit").value = this._calorieLimit;
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._renderUi();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._renderUi();
  }

  removeMeal(id) {
    this._removeItem(id, this._meals);
  }

  removeWorkout(id) {
    this._removeItem(id, this._workouts);
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._renderUi();
  }

  setLimit(limit) {
    this._calorieLimit = limit;
    Storage.setCalorieLimit(limit);
    this._displayCaloriesLimit();
    this._renderUi();
  }

  loadMealsAndWorkouts() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  _displayCaloriesTotal() {
    const totalCaloriesElement = document.querySelector("#calories-total");
    totalCaloriesElement.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const totalCalorieLimitElement = document.querySelector("#calories-limit");
    totalCalorieLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedElement =
      document.querySelector("#calories-consumed");
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    caloriesConsumedElement.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedElement = document.querySelector("#calories-burned");
    const Burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );

    caloriesBurnedElement.innerHTML = Burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingElement = document.querySelector(
      "#calories-remaining"
    );
    const caloriesProgressElement = document.querySelector("#calorie-progress");
    const remaining = this._calorieLimit - this._totalCalories;

    caloriesRemainingElement.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      caloriesProgressElement.classList.remove("bg-success");
      caloriesProgressElement.classList.add("bg-danger");
    } else {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        "bg-light"
      );
      caloriesProgressElement.classList.remove("bg-danger");
      caloriesProgressElement.classList.add("bg-success");
    }
  }

  _displayCaloriesProgress() {
    const caloriesProgressElement = document.querySelector("#calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const progress = Math.min(percentage, 100);

    caloriesProgressElement.style.width = `${progress}%`;
  }

  _displayNewMeal(meal) {
    console.log(meal);
    const mealsElement = document.querySelector("#meal-items");
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("card", "my-2");
    mealDiv.setAttribute("data-id", meal.id);
    mealDiv.innerHTML = `
        <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                      <h4 class="mx-1">${meal.name}</h4>
                      <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                      >
                        ${meal.calories}
                      </div>
                      <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>`;
    mealsElement.appendChild(mealDiv);
  }

  _displayNewWorkout(workout) {
    console.log(workout);
    const mworkoutElement = document.querySelector("#workout-items");
    const workoutDiv = document.createElement("div");
    workoutDiv.classList.add("card", "my-2");
    workoutDiv.setAttribute("data-id", workout.id);
    workoutDiv.innerHTML = `
        <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                      <h4 class="mx-1">${workout.name}</h4>
                      <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                      >
                        ${workout.calories}
                      </div>
                      <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>`;
    mworkoutElement.appendChild(workoutDiv);
  }

  _removeItem(id, itemsArray) {
    const index = itemsArray.findIndex((item) => item.id === id);
    if (index !== -1) {
      const item = itemsArray[index];
      if (itemsArray === this._meals) {
        this._totalCalories -= item.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.removeMeal(id);
      } else if (itemsArray === this._workouts) {
        this._totalCalories += item.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.removeWorkout(id);
      }
      itemsArray.splice(index, 1);
      this._renderUi();
    }
  }

  _renderUi() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

export default CalorieTracker;
