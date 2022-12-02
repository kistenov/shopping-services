import { NgModule } from "@angular/core";
import { FormsModule} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { SeatchRecipesComponent } from "./search-recipes.component";
import { SearchRecipesResultsComponent } from './search-recipes-results/search-recipes-results.component';
import { SearchRecipesDetailComponent } from './search-recipes-detail/search-recipes-detail.component';
import { AuthGuard } from "../auth/auth.guard";
import { RecipesResolverService } from "../recipes/recipes-resolver.service";


@NgModule({
  declarations : [
    SeatchRecipesComponent,
    SearchRecipesResultsComponent,
    SearchRecipesDetailComponent
  ],
  imports: [
    RouterModule.forChild([
      { 
        path: '', 
        component: SeatchRecipesComponent, 
        canActivate: [AuthGuard],
        resolve: [RecipesResolverService]
       },
    ]),
    SharedModule,
    FormsModule
  ]
})
export class SearchRecipesModule {
  
}