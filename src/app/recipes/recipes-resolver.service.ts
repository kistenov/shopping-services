import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { DataStorageSertvice } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
// resolver is a service that runs before angular loads the specific route that we apply resolver to
// resolver needs to be added into routing as a parameter for the "resolve" property of the route
@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{
  constructor(
    private dataStorage: DataStorageSertvice,
    private recipeService: RecipeService
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check if we have recipes locally if we have load them if not fetch them from the server
    const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0) {
      return this.dataStorage.fetchRecipes();
    } else {
      return recipes;
    }
  }
}