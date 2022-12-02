import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../recipes/recipe.model';

@Component({
  selector: 'app-search-recipes-results',
  templateUrl: './search-recipes-results.component.html',
  styleUrls: ['./search-recipes-results.component.css']
})
export class SearchRecipesResultsComponent implements OnInit {
  @Input() searchResult: Recipe
  @Input() index: number
  constructor() { }

  ngOnInit(): void {
  }

}
