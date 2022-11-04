import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({providedIn: 'root'})
export class DataStorageSertvice {
  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    private authService:AuthService
  ){}

  storeRecipes () {
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      'https://angular-shopping-ef480-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', 
      recipes)
    .subscribe(response => {
      console.log(response);
    });
  }
  fetchRecipes () {
    return this.http.get<Recipe[]>('https://angular-shopping-ef480-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
    ).pipe(
        map(recipes => {
          // map here is js array method
          return recipes.map( recipe => {
            // here if there are no ingredients in the recipe we set ingredients property to an empty array
            return{...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
          })
        }),
        // tap operator here just does necessary work when you don't need to subscribe in the method
        tap(recipes => {
          this.recipeService.setRecipes(recipes)
        })
      )
  }

} 