import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RecipeService } from '../../recipes/recipe.service';
import { Recipe } from '../../recipes/recipe.model';

@Component({
  selector: 'app-search-recipes-detail',
  templateUrl: './search-recipes-detail.component.html',
  styleUrls: ['./search-recipes-detail.component.css']
})
export class SearchRecipesDetailComponent implements OnChanges{
  @Input() selectedRecipe: Recipe
  addButtonText: string;
  addButtonDisabled: boolean;
  constructor(
    private recipeSrv: RecipeService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const addedToRecipes = this.recipeSrv.getRecipes().find(item => {
      return item.name === this.selectedRecipe?.name;
    })
    if (addedToRecipes) {
      this.addButtonText = "Added to recipes";
      this.addButtonDisabled = true
    } else {
      this.addButtonText = "Add to recipes";
      this.addButtonDisabled = false
    }
    
  }
  saveRecipe(){
    this.recipeSrv.addRecipe(this.selectedRecipe);
    this.addButtonText = "Added to recipes";
    this.addButtonDisabled = true
  }
}
