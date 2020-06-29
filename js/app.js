class Spoonacular {
  constructor() {
    this.API_KEY = "59a44800aa82400a9ab95006a97df5b5";
    this.recipeUrl = "";
    this.url = "https://api.spoonacular.com/recipes/";
    this.headers = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  async getRecipes(ingredients) {
    const params = ingredients.join(",+");
    const finalUrl = `${this.url}findByIngredients?ingredients=${params}&number=5&ranking=2&ignorePantry=true&apiKey=${this.API_KEY}`;

    const recipesFetch = await fetch(finalUrl, this.headers);
    const recipes = await recipesFetch.json();

    return { recipes };
  }

  async getSingleRecipe(recipeId) {
    const recipeUrl = `${this.url}${recipeId}/analyzedInstructions?apiKey=${this.API_KEY}`;

    const singleRecipeFetch = await fetch(recipeUrl, this.headers);
    const singleRecipe = await singleRecipeFetch.json();

    return { singleRecipe };
  }
}

class Ui {
  displayRecipes(recipes) {
    document.getElementById("spoonacular-recipes").innerHTML = "";
    recipes.forEach(recipe => {
      const {
        id,
        image,
        likes,
        missedIngredientCount,
        title,
        usedIngredientCount,
      } = recipe;

      let usedIngredients = "";
      const usedIngredientsArray = recipe.usedIngredients;

      usedIngredientsArray.forEach(used => {
        usedIngredients += `, ${used.name}`;
      });

      let missingIngredients = "";
      const missedIngredientsArray = recipe.missedIngredients;

      missedIngredientsArray.forEach(miss => {
        missingIngredients += `, ${miss.name}`;
      });

      this.showRecipe(
        id,
        image,
        likes,
        missedIngredientCount,
        title,
        usedIngredientCount,
        missingIngredients.substring(1),
        usedIngredients.substring(1)
      );
    });
  }

  displaySingleRecipe(recipe) {
    document.getElementById("spoonacular-recipes").innerHTML = "";
    const parent = document.getElementById("spoonacular-recipes");
    const singleRecipe = recipe[0].steps;
    // let test = 'test';
    // div.innerHTML = test;
    const div = document.createElement("div");
    div.innerHTML += `<ol class="list">`;

    singleRecipe.forEach(step => {
      div.innerHTML += `<li class="item">
      <h2 class="headline">Step ${step.number} </h2>
      <span>
       ${step.step} 
      </span>
    </li>`;
    });

    div.innerHTML += `
</ol>`;
    parent.appendChild(div);
  }

  showRecipe(
    id,
    image,
    likes,
    missedIngredientCount,
    title,
    usedIngredientCount,
    missingIngredients,
    usedIngredients
  ) {
    const div = document.createElement("div");
    const parent = document.getElementById("spoonacular-recipes");

    div.classList.add("row", "single-user", "my-3");
    div.innerHTML = `<div class="col-sm-6 col-md-4 user-photo my-2">
                <img src="${image}" class="img-fluid" alt="" />
              </div>
              <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
                <h6>name : <span>${title}</span></h6>
                <h6>likes : <a href="#" class="badge badge-primary">${likes}</a></h6>
                <h6>
                  Missing ingredients(${missedIngredientCount}) :
                  <a href="#" class="badge badge-warning"
                    >${missingIngredients}</a
                  >
                </h6>
                <h6>
                  Used ingredients(${usedIngredientCount}) :
                  <span class="badge badge-success"
                    >${usedIngredients} </span
                  >
                </h6>
                <a href='#' class='recipe-link' data-id='${id}'>Show recipe</a>
              </div>`;
    parent.appendChild(div);
  }
}

(() => {
  const spoonacular = new Spoonacular();
  const ui = new Ui();

  // Get recipes
  const submitForm = document.getElementById("searchForm");

  submitForm.addEventListener("submit", event => {
    event.preventDefault();

    const ingredients = [];
    const ingredientsInput =
      submitForm.firstElementChild.firstElementChild.childNodes;
    ingredientsInput.forEach(ingredient => {
      if (ingredient.title) {
        ingredients.push(ingredient.title);
      }
    });
    if (ingredients.length === 0) {
      swal("Error!", "Please enter ingredients", "error");
    } else {
      spoonacular.getRecipes(ingredients).then(data => {
        ui.displayRecipes(data.recipes);
      });
    }
  });

  // Show single recipe

  const recipeList = document.getElementById("spoonacular-recipes");
  recipeList.addEventListener("click", event => {
    event.preventDefault();
    const recipeId = event.target.dataset.id;
    if (recipeId) {
      spoonacular.getSingleRecipe(recipeId).then(recipe => {
        ui.displaySingleRecipe(recipe.singleRecipe);
      });
    }
  });
})();
