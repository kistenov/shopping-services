import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Recipe } from "../recipes/recipe.model";

@Component({
  selector: "app-search-recipes",
  templateUrl: "./search-recipes.component.html",
  styleUrls: ["./search-recipes.component.css"],
})
export class SeatchRecipesComponent {
  searchResults: Recipe[];
  searchEmpty = false;
  isLoading = false;
  error: string = null;
  recipeDetail: Recipe;

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;

    this.http
      .get<any[]>(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${form.value.search}&app_id=${environment.edamamAPIid}&app_key=${environment.edamamAPIkey}`
      )
      .pipe(
        map((res) => {
          console.log(res);

          return (this.searchResults = res["hits"].map((hit: any) => ({
            name: `${
              hit.recipe.label.charAt(0) +
              hit.recipe.label.toLowerCase().slice(1)
            } by ${hit.recipe.source}`,
            description: `${
              hit.recipe.label
            } is a meal from ${hit.recipe.cuisineType.join(
              ", "
            )} cuisine. It's a ${
              hit.recipe.dishType
            } type of meal that is a healthy option for ${hit.recipe.dietLabels
              .join(", ")
              .toLowerCase()} diet.`,
            imagePath: hit.recipe.image,
            ingredients: hit.recipe.ingredients.flatMap((ingr) => {
              // flatMap iterates over array like a map but has ability to skip elements with some sort of condition like here
              if (!ingr.quantity) {
                // this element will be skipped
                return [];
              }
              return {
                name: `${
                  ingr.food.charAt(0).toUpperCase() + ingr.food.slice(1)
                }, ${ingr.measure === "<unit>" ? "item" : ingr.measure}s`,
                amount: ingr.quantity,
              };
            }),
          })));
        })
      )
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.searchEmpty = !this.searchResults.length ? true : false;
        },
        (error) => {
          console.log(error);
          this.error = error.statusText;
        }
      );
  }

  onOpenDetail(index: number) {
    this.recipeDetail = this.searchResults[index];
  }

  onHandleError() {
    this.error = null;
  }
}
