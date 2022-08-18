import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "./recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs";

@Injectable()
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[] = [];
  recipesChangedSub!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.recipes=this.recipeService.getRecipes();
    this.recipesChangedSub=this.recipeService.recipesChanged
      .subscribe((recipes: Recipe[]) => {
      this.recipes=recipes;
    });
  }

  ngOnDestroy(): void {
    this.recipesChangedSub.unsubscribe();
  }

  onNewRecipe(){
    console.log("Clicked!")
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
